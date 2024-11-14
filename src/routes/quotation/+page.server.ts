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
      const depthCm = Math.ceil(parseFloat(formData.get("depth") as string) || 0);
      const widthCm = Math.ceil(parseFloat(formData.get("width") as string) || 0);
      const heightCm = Math.ceil(parseFloat(formData.get("height") as string) || 0);
      const weightG = Math.ceil(parseFloat(formData.get("weight") as string) || 0);

      if (!depthCm || !widthCm || !heightCm || !weightG) {
        return fail(400, { success: false, message: "Invalid package dimensions" });
      }

      // Create the box
      const box = await BoxRepository.save({
        depthCm,
        widthCm,
        heightCm,
        weightG,
      });

      // Retrieve and validate origin and destination addresses
      const originAddress1 = formData.get("originAddress1") as string | null;
      const originCity = formData.get("originCity") as string | null;
      const originCountry = formData.get("originCountry") as string | null;
      const originPostal = formData.get("originPostal") as string | null;

      const destAddress1 = formData.get("destAddress1") as string | null;
      const destCity = formData.get("destCity") as string | null;
      const destCountry = formData.get("destCountry") as string | null;
      const destPostal = formData.get("destPostal") as string | null;

      // Ensure all address fields are provided
      if (!originAddress1 || !originCity || !originCountry || !originPostal) {
        return fail(400, { success: false, message: "Error: One or many invalid origin address fields (Missing API Details)" });
      }
      if (!destAddress1 || !destCity || !destCountry || !destPostal) {
        return fail(400, { success: false, message: "Error: One or many invalid destination address fields (Missing API Details)" });
      }

      // Validate origin address using geocoding service
      const originGeocoding = await geocodingService.geocode(
        originAddress1,
        originCity,
        originCountry,
        originPostal
      );

      if (!originGeocoding.valid) {
        return fail(400, { success: false, message: "Error: invalid origin address field (Missing API Details)" });
      }

      const originLat = originGeocoding.lat!;
      const originLng = originGeocoding.lng!;

      // Validate destination address
      const destGeocoding = await geocodingService.geocode(
        destAddress1,
        destCity,
        destCountry,
        destPostal
      );

      if (!destGeocoding.valid) {
        return fail(400, { success: false, message: "Error: invalid destination address field (Missing API Details)" });
      }

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
        destCountry
      );

      // Save the quotation
      const quotation = await QuotationRepository.save({
        originId: origin.id!,
        destinationId: destination.id!,
        amountQuotedCents: shippingCost,
        boxId: box.id!,
        etaDays: 2, // Example ETA
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

      return { success: true, quotation: completeQuotation };
    } catch (error) {
      console.error("Error creating quotation:", error);
      return fail(500, { success: false, message: "Error creating quotation (MIssing Google Maps API Details)" });
    }
  },
} as Actions;
