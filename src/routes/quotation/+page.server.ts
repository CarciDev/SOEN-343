import { PrismaClient } from "@prisma/client";
import { fail, type Actions } from "@sveltejs/kit";
import { BoxRepository } from "$lib/domain/BoxRepository";
import { EarthLocationRepository } from "$lib/domain/EarthLocationRepository";
import { QuotationRepository } from "$lib/domain/QuotationRepository";
import { _calculatePrice } from "../api/pricing/+server";
import { geocodingService } from "$lib/config/GeocodingConfig";

// Initialize Prisma Client
const prisma = new PrismaClient();

export const actions = {
  createQuotation: async ({ request }) => {
    const formData = await request.formData();

    try {
      // Retrieve and validate form data
      const depthCm = Math.ceil(
        parseFloat(formData.get("depth") as string) || 0,
      );
      const widthCm = Math.ceil(
        parseFloat(formData.get("width") as string) || 0,
      );
      const heightCm = Math.ceil(
        parseFloat(formData.get("height") as string) || 0,
      );
      const weightG = Math.ceil(
        parseFloat(formData.get("weight") as string) || 0,
      );

      if (!depthCm || !widthCm || !heightCm || !weightG) {
        return fail(400, {
          success: false,
          message: "Invalid package dimensions",
        });
      }

      // Create the box
      const box = await BoxRepository.save({
        depthCm,
        widthCm,
        heightCm,
        weightG,
      });

      // 6107 Retrieve and validate origin and destination addresses
      const originAddress1 = formData.get("originAddress1") as string | "";
      const originCity = formData.get("originCity") as string | "";
      const originCountry = formData.get("originCountry") as string | "";
      const originPostal = formData.get("originPostal") as string | "";

      const destAddress1 = formData.get("destAddress1") as string | "";
      const destCity = formData.get("destCity") as string | "";
      const destCountry = formData.get("destCountry") as string | "";
      const destPostal = formData.get("destPostal") as string | "";

      console.log("originAddress1 " + originAddress1);
      console.log("originCity " + originCity);
      console.log("originCountry " + originCountry);
      console.log("originPostal " + originPostal);
      console.log("destAddress1 " + destAddress1);
      console.log("destCity " + destCity);
      console.log("destCountry " + destCountry);
      console.log("destPostal " + destPostal);

      // Ensure all address fields are provided
      if (!originAddress1 || !originCity || !originCountry || !originPostal) {
        return fail(400, {
          success: false,
          message:
            "Error: One or many invalid origin address fields (Missing API Details)",
        });
      }
      if (!destAddress1 || !destCity || !destCountry || !destPostal) {
        return fail(400, {
          success: false,
          message:
            "Error: One or many invalid destination address fields (Missing API Details)",
        });
      }

      const originGeocoding = await geocodingService.geocode(
        originAddress1,
        originCity,
        originCountry,
      );

      const originLat = originGeocoding.lat!;
      const originLng = originGeocoding.lng!;

      const destGeocoding = await geocodingService.geocode(
        destAddress1,
        destCity,
        destCountry,
      );

      const destLat = destGeocoding.lat!;
      const destLng = destGeocoding.lng!;

      // Save origin and destination locations
      const origin = await EarthLocationRepository.save({
        address1: originAddress1,
        city: originCity,
        countryCode: originCountry,
        postalCode: originPostal,
        lat: originLat,
        lng: originLng,
      });

      const destination = await EarthLocationRepository.save({
        address1: destAddress1,
        city: destCity,
        countryCode: destCountry,
        postalCode: destPostal,
        lat: destLat,
        lng: destLng,
      });

      // Calculate shipping cost
      const shippingCost = await _calculatePrice(
        { lat: originLat, lng: originLng },
        { lat: destLat, lng: destLng },
        { depth: depthCm, width: widthCm, height: heightCm, weight: weightG },
        originCountry,
        destCountry,
      );

      // Save the quotation
      const quotation = await QuotationRepository.save({
        originId: origin.id!,
        destinationId: destination.id!,
        amountQuotedCents: shippingCost,
        boxId: box.id!,
        etaDays: 2, // Example ETA
      });

      // Query for the complete quotation with related data
      const completeQuotation = await prisma.quotation.findUnique({
        where: { id: quotation.id },
        include: {
          origin: true,
          destination: true,
          box: true,
        },
      });

      return { success: true, quotation: completeQuotation };
    } catch (error) {
      console.error("Error creating quotation:", error);
      return fail(500, {
        success: false,
        message: "Error creating quotation (Missing Google Maps API Details)",
      });
    }
  },
} as Actions;
