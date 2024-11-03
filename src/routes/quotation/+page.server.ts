import { PrismaClient } from "@prisma/client";
import { fail, type Actions } from "@sveltejs/kit";
import type { ServerLoad } from "@sveltejs/kit";
import type { QuotationWithRelations } from "$lib/types";

const prisma = new PrismaClient();

async function getCoordinates(
  address: string,
  city: string,
  country: string,
  postalCode: string,
) {
  // In a real application, you would use a geocoding service like Google Maps, Mapbox, etc.
  // For this example, we'll return dummy coordinates
  return {
    lat: Math.random() * 180 - 90, // Random latitude between -90 and 90
    lng: Math.random() * 360 - 180, // Random longitude between -180 and 180
  };
}

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

export const actions = {
  createQuotation: async ({ request, locals }) => {
    const formData = await request.formData();
    const userId = locals.user?.id;

    // Check if userId is undefined
    if (!userId) {
      return fail(400, { message: "User is not authenticated" });
    }

    try {
      // Proceed with the quotation creation process as before
      const originCoords = await getCoordinates(
        formData.get("originAddress1") as string,
        formData.get("originCity") as string,
        formData.get("originCountry") as string,
        formData.get("originPostal") as string,
      );

      const destCoords = await getCoordinates(
        formData.get("destAddress1") as string,
        formData.get("destCity") as string,
        formData.get("destCountry") as string,
        formData.get("destPostal") as string,
      );

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
          lat: originCoords.lat,
          lng: originCoords.lng,
        },
      });

      const destination = await prisma.earthLocation.create({
        data: {
          address1: formData.get("destAddress1") as string,
          city: formData.get("destCity") as string,
          countryCode: formData.get("destCountry") as string,
          postalCode: formData.get("destPostal") as string,
          lat: destCoords.lat,
          lng: destCoords.lng,
        },
      });

      const shippingCost = await calculateShippingCost(
        originCoords,
        destCoords,
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
          userId: userId, // userId is guaranteed to be a number here
        },
        include: {
          origin: true,
          destination: true,
          box: true,
          shipmentTransaction: true,
        },
      });

      return { success: true, quotation };
    } catch (error) {
      console.error("Error creating quotation:", error);
      return fail(500, { message: "Failed to create quotation" });
    }
  },
} satisfies Actions;
