import { PrismaClient } from "@prisma/client";
import { fail, type Actions } from "@sveltejs/kit";
import { geocodingService } from "$lib/config/GeocodingConfig";
import { BoxRepository } from "$lib/domain/BoxRepository";
import { EarthLocationRepository } from "$lib/domain/EarthLocationRepository";
import { QuotationRepository } from "$lib/domain/QuotationRepository";
import { _calculatePrice } from "../api/pricing/+server";

const prisma = new PrismaClient();

export async function load({ url }: { url: URL }) {
  const quotationId = url.searchParams.get("quotationId");

  let retrievedQuotation = null;
  let errorMessage = null;

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

    if (!retrievedQuotation) {
      errorMessage = "Quotation not found. Please check the ID and try again.";
    }
  }

  return { retrievedQuotation, errorMessage };
}
