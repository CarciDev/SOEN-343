import type {
  Quotation,
  EarthLocation,
  ShipmentTransaction,
  Box,
} from "@prisma/client";

export type QuotationWithRelations = Quotation & {
  origin: EarthLocation;
  destination: EarthLocation;
  box: Box;
  shipmentTransaction: ShipmentTransaction | null;
};

export interface PageServerLoad {
  (context: { locals: { user: { name: string } | null } }): Promise<{
    props: { user: { name: string } | null };
  }>;
}

export interface PageData {
  quotations: QuotationWithRelations[];
}
