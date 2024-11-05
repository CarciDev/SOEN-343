import { PrismaClient } from "@prisma/client";
import { fail, type Actions } from "@sveltejs/kit";
import type { ServerLoad } from "@sveltejs/kit";
import type { QuotationWithRelations } from "$lib/types";
import { geocodingService } from "$lib/config/GeocodingConfig";

const prisma = new PrismaClient();

export const actions = {
  createQuotation: async ({ request, locals }) => {
    const formData = await request.formData();

    try {
      // Validate origin address first
      const originResult = await geocodingService.geocode(
        formData.get("originAddress1") as string,
        formData.get("originCity") as string,
        formData.get("originCountry") as string,
        formData.get("originPostal") as string,
      );

      if (!originResult.valid) {
        return fail(400, {
          success: false,
          field: "origin",
          message: originResult.error || "Invalid origin address",
        });
      }

      // Validate destination address
      const destResult = await geocodingService.geocode(
        formData.get("destAddress1") as string,
        formData.get("destCity") as string,
        formData.get("destCountry") as string,
        formData.get("destPostal") as string,
      );

      if (!destResult.valid) {
        return fail(400, {
          success: false,
          field: "destination",
          message: destResult.error || "Invalid destination address",
        });
      }

      // Only proceed if both addresses are valid
      if (originResult.valid && destResult.valid) {
        const box = await prisma.box.create({
          data: {
            depthCm: parseFloat(formData.get("depth") as string),
            widthCm: parseFloat(formData.get("width") as string),
            heightCm: parseFloat(formData.get("height") as string),
            weightG: parseFloat(formData.get("weight") as string),
          },
        });

        const origin = await prisma.earthLocation.create({
          data: {
            address1: formData.get("originAddress1") as string,
            city: formData.get("originCity") as string,
            countryCode: formData.get("originCountry") as string,
            postalCode: formData.get("originPostal") as string,
            lat: originResult.lat,
            lng: originResult.lng,
          },
        });

        const destination = await prisma.earthLocation.create({
          data: {
            address1: formData.get("destAddress1") as string,
            city: formData.get("destCity") as string,
            countryCode: formData.get("destCountry") as string,
            postalCode: formData.get("destPostal") as string,
            lat: destResult.lat,
            lng: destResult.lng,
          },
        });

        const shippingCost = await calculateShippingCost(
          { lat: originResult.lat, lng: originResult.lng },
          { lat: destResult.lat, lng: destResult.lng },
          {
            length: parseFloat(formData.get("length") as string),
            width: parseFloat(formData.get("width") as string),
            height: parseFloat(formData.get("height") as string),
            weight: parseFloat(formData.get("weight") as string),
          },
        );

        const quotation = await prisma.quotation.create({
          data: {
            originId: origin.id,
            destinationId: destination.id,
            boxId: box.id,
            amountQuotedCents: shippingCost,
          },
          include: {
            origin: true,
            destination: true,
            box: true,
            shipmentTransaction: true,
          },
        });

        return {
          success: true,
          quotation,
        };
      }

      // Should never reach here due to earlier validation
      return fail(400, {
        success: false,
        message: "Address validation failed",
      });
    } catch (error) {
      console.error("Error creating quotation:", error);
      return fail(500, {
        success: false,
        message: "Failed to create quotation",
      });
    }
  },
} satisfies Actions;

async function calculateShippingCost(
  originCoords: { lat: number; lng: number },
  destCoords: { lat: number; lng: number },
  dimensions: { length: number; width: number; height: number; weight: number },
) {
  // In a real application, you would calculate this based on distance, weight, and dimensions
  // For this example, we'll use a simple calculation
  const baseRate = 1000; // $10.00 base rate
  const volumeMultiplier = 0.01;
  const weightMultiplier = 100;

  const volume = dimensions.length * dimensions.width * dimensions.height;
  const volumeCost = volume * volumeMultiplier;
  const weightCost = dimensions.weight * weightMultiplier;

  return Math.round(baseRate + volumeCost + weightCost);
}

export const load = (async () => {
  try {
    const quotations = await prisma.quotation.findMany({
      include: {
        origin: true,
        destination: true,
        box: true,
        shipmentTransaction: true,
      },
    });
    return {
      quotations: quotations as QuotationWithRelations[],
    };
  } catch (error) {
    console.error("Error loading quotations:", error);
    return {
      quotations: [] as QuotationWithRelations[],
    };
  }
}) satisfies ServerLoad;
