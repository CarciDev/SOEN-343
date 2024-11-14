import { QuotationRepository } from "$lib/domain/QuotationRepository";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ url }) => {
  // Extract the quotationId from the URL parameters
  const quotationIdParam = url.searchParams.get("quotationId");
  let quotationData = null;

  if (quotationIdParam) {
    const quotationId = parseInt(quotationIdParam, 10);

    if (!isNaN(quotationId)) {
      // Fetch the quotation data using the repository
      const quotation = await QuotationRepository.findById(quotationId);

      // Convert it to POJO
      if (quotation) {
        quotationData = {
          id: quotation.id,
          createdAt: quotation.createdAt,
          updatedAt: quotation.updatedAt,
          originId: quotation.originId,
          destinationId: quotation.destinationId,
          amountQuotedCents: quotation.amountQuotedCents,
          etaDays: quotation.etaDays,
          boxId: quotation.boxId,
        };
      }
    }
  }

  return {
    quotationData,
  };
};
