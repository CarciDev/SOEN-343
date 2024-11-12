import { PrismaClient, type Quotation } from "@prisma/client";
import { fail, type Actions } from "@sveltejs/kit";
import type { ServerLoad } from "@sveltejs/kit";
import { geocodingService } from "$lib/config/GeocodingConfig";
import { BoxRepository } from "$lib/domain/BoxRepository";
import { EarthLocationRepository } from "$lib/domain/EarthLocationRepository";
import { QuotationRepository } from "$lib/domain/QuotationRepository";
import { _calculatePrice } from "../api/pricing/+server";

const prisma = new PrismaClient();

export async function load({ url }) {
  const quotationId = url.searchParams.get("quotationId");

  let retrievedQuotation;
  if (quotationId !== null && quotationId !== "") {
    retrievedQuotation = await prisma.quotation.findUnique({
      where: { id: parseInt(quotationId, 10) },
      include: {
        origin: true,
        destination: true,
        box: true,
        shipmentTransaction: true,
      },
    });
  }
  return { retrievedQuotation };
}

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
        // Replace this with BoxRepository.save(box: Box)
        const box = await prisma.box.create({
          data: {
            depthCm: parseFloat(formData.get("depth") as string),
            widthCm: parseFloat(formData.get("width") as string),
            heightCm: parseFloat(formData.get("height") as string),
            weightG: parseFloat(formData.get("weight") as string),
          },
        });

        // Replace this with EarthLocationRepository.save(earthLocation: EarthLocation)
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

        // Replace this with EarthLocationRepository.save(earthLocation: EarthLocation)
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

        const shippingCost = await _calculatePrice(
          { lat: originResult.lat, lng: originResult.lng },
          { lat: destResult.lat, lng: destResult.lng },
          {
            depth: parseFloat(formData.get("length") as string),
            width: parseFloat(formData.get("width") as string),
            height: parseFloat(formData.get("height") as string),
            weight: parseFloat(formData.get("weight") as string),
          },
          originResult.countryCode as string,
          destResult.countryCode as string,
        );

        // Replace this with QuotationRepository.save(quotation: Quotation)
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

  getQuotation: async ({ request }) => {
    const formData = await request.formData();
    const id = formData.get("quotationId") as string;

    try {
      const quotation = await QuotationRepository.findById(parseInt(id, 10));

      if (!quotation) {
        return fail(404, {
          success: false,
          message: "Quotation not found",
        });
      }

      return {
        quotation: quotation // returns k-v format
      };
    } catch (error) {
      console.error("Error retrieving quotation:", error);
      return fail(500, {
        success: false,
        message: "Failed to retrieve quotation",
      });
    }
  },
} satisfies Actions;