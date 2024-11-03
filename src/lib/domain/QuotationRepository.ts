import { prisma } from "$lib/db/client";
import { Quotation } from "./Quotation";

export class QuotationRepository {
  static async save(quotation: Quotation) {
    const dataFields = {
      originId: quotation.originId,
      destinationId: quotation.destinationId,
      amountQuotedCents: quotation.amountQuotedCents,
      boxId: quotation.boxId,
    };

    const savedQuote = await prisma.quotation.upsert({
      where: { id: quotation.id },
      update: dataFields,
      create: dataFields,
    });

    quotation.id = savedQuote.id;
    quotation.createdAt = savedQuote.createdAt;
    quotation.updatedAt = savedQuote.updatedAt;
  }

  static async findById(id: number): Promise<Quotation | null> {
    const dbResult = await prisma.quotation.findUnique({ where: { id: id } });
    if (dbResult) {
      return new Quotation(dbResult);
    }
    return null;
  }
}
