export interface EarthLocation {
  id: string;
  address1: string;
  city: string;
  countryCode: string;
  postalCode: string;
  lat: number;
  lng: number;
}

export interface Box {
  id: string;
  widthCm: number;
  heightCm: number;
  depthCm: number;
  weightG: number;
}

export interface Quotation {
  id: string;
  amountQuotedCents: number;
  origin: EarthLocation;
  destination: EarthLocation;
  box: Box;
  createdAt?: Date;
}

export interface PageData {
  lastQuotation: Quotation | null;
}
