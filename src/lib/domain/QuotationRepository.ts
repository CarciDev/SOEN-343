import { prisma } from "$lib/db/client";
import { Quotation } from "./Quotation";

export class QuotationRepository {
  static async save(quotation: Quotation) {
    // Ensure amountQuotedCents is a valid number
    if (isNaN(quotation.amountQuotedCents)) {
      throw new Error("Invalid shipping cost: amountQuotedCents is NaN");
    }

    const dataFields = {
      originId: quotation.originId,
      destinationId: quotation.destinationId,
      amountQuotedCents: quotation.amountQuotedCents,
      boxId: quotation.boxId,
    };

    let savedQuote;

    // Use `create` if `quotation.id` is undefined; otherwise, use `upsert`
    if (quotation.id) {
      savedQuote = await prisma.quotation.upsert({
        where: { id: quotation.id },
        update: dataFields,
        create: dataFields,
      });
    } else {
      savedQuote = await prisma.quotation.create({ data: dataFields });
    }

    // Update the Quotation object with database details
    quotation.id = savedQuote.id;
    quotation.createdAt = savedQuote.createdAt;
    quotation.updatedAt = savedQuote.updatedAt;
    return quotation;
  }

  static async findById(id: number): Promise<Quotation | null> {
    const dbResult = await prisma.quotation.findUnique({ where: { id } });
    if (dbResult) {
      return new Quotation(dbResult);
    }
    return null;
  }
}
