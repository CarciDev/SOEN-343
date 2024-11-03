export class EarthLocation {
  id?: number;
  createdAt?: Date;
  updatedAt?: Date;
  address1?: string;
  address2?: string;
  city?: string;
  administrativeArea?: string;
  postalCode?: string;
  countryCode?: string;
  lat: number;
  lng: number;

  constructor(params: {
    id?: number;
    createdAt?: Date;
    updatedAt?: Date;
    address1?: string;
    address2?: string;
    city?: string;
    administrativeArea?: string;
    postalCode?: string;
    countryCode?: string;
    lat: number;
    lng: number;
  }) {
    this.id = params.id;
    this.createdAt = params.createdAt;
    this.updatedAt = params.updatedAt;
    this.address1 = params.address1;
    this.address2 = params.address2;
    this.city = params.city;
    this.administrativeArea = params.administrativeArea;
    this.postalCode = params.postalCode;
    this.countryCode = params.countryCode;
    this.lat = params.lat;
    this.lng = params.lng;
  }
}
