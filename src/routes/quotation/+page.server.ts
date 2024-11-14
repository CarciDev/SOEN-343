import { PrismaClient } from "@prisma/client";
import { fail, type Actions } from "@sveltejs/kit";
import { BoxRepository } from "$lib/domain/BoxRepository";
import { EarthLocationRepository } from "$lib/domain/EarthLocationRepository";
import { QuotationRepository } from "$lib/domain/QuotationRepository";
import { _calculatePrice } from "../api/pricing/+server";
import { geocodingService } from "$lib/config/GeocodingConfig";

const prisma = new PrismaClient();

export const actions = {
  createQuotation: async ({ request, locals }) => {
    const formData = await request.formData();

    try {
      let depthCm = parseFloat(formData.get("depth") as string);
      depthCm = Math.ceil(depthCm);
      let widthCm = parseFloat(formData.get("width") as string);
      widthCm = Math.ceil(widthCm);
      let heightCm = parseFloat(formData.get("height") as string);
      heightCm = Math.ceil(heightCm);
      let weightG = parseFloat(formData.get("weight") as string);
      weightG = Math.ceil(weightG);
      // Create the box
      const box = await BoxRepository.save({
          depthCm,
          widthCm,
          heightCm,
          weightG,
      });

      //validate origin address
      const originGeocoding = await geocodingService.geocode(
        formData.get("originAddress1") as string,
        formData.get("originCity") as string,
        formData.get("originCountry") as string,
        formData.get("originPostal") as string,
      );
      console.log("Origin geocoding:", originGeocoding);

      if (!originGeocoding.valid) {
        return fail(400, {
          success: false,
          message: "Invalid origin address",
        });
      }

      const originLat = originGeocoding.lat!;
      const originLng = originGeocoding.lng!;

      //validate destination address
      const destGeocoding = await geocodingService.geocode(
        formData.get("destAddress1") as string,
        formData.get("destCity") as string,
        formData.get("destCountry") as string,
        formData.get("destPostal") as string,
      );

      if (!destGeocoding.valid) {
        return fail(400, {
          success: false,
          message: "Invalid destination address",
        });
      }

      const destLat = destGeocoding.lat!;
      const destLng = destGeocoding.lng!;

      console.log("Destination geocoding:", destGeocoding); 
      
      const origin = await EarthLocationRepository.save({
        address1: formData.get("originAddress1") as string,
        city: formData.get("originCity") as string,
        countryCode: formData.get("originCountry") as string,
        postalCode: formData.get("originPostal") as string,
        lat: originLat,
        lng: originLng,
      });
      
      const destination = await EarthLocationRepository.save({
        address1: formData.get("destAddress1") as string,
        city: formData.get("destCity") as string,
        countryCode: formData.get("destCountry") as string,
        postalCode: formData.get("destPostal") as string,
        lat: destLat,
        lng: destLng,
      });

      const shippingCost = await _calculatePrice(
        { lat: originLat, lng: originLng },
        { lat: destLat, lng: destLng },
        {
          depth: depthCm,
          width: widthCm,
          height: heightCm,
          weight: weightG,
        },
        formData.get("originCountry") as string,
        formData.get("destCountry") as string,
      );

      const quotation = await QuotationRepository.save({
        // id: undefined,
        originId: origin.id!,
        destinationId: destination.id!,
        amountQuotedCents: shippingCost,
        boxId: box.id!,
      });

      // Fetch the complete quotation with related data
      const completeQuotation = await prisma.quotation.findUnique({
        where: { id: quotation.id },
        include: {
          origin: true,
          destination: true,
          box: true,
        },
      });

      return {
        success: true,
        quotation: completeQuotation,
      };
    }
    catch (error) {
      console.error("Error creating quotation:", error);
      return fail(500, {
        success: false,
        message: "Error creating quotation",
      });
    }
  }
} as Actions;