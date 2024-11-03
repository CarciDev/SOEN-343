import { prisma } from "$lib/db/client";
import { EarthLocation } from "./EarthLocation";

export class EarthLocationRepository {
  static async save(earthLocation: EarthLocation) {
    const dataFields = {
      address1: earthLocation.address1,
      address2: earthLocation.address2,
      city: earthLocation.city,
      administrativeArea: earthLocation.administrativeArea,
      postalCode: earthLocation.postalCode,
      countryCode: earthLocation.countryCode,
      lat: earthLocation.lat,
      lng: earthLocation.lng,
    };

    const savedLocation = await prisma.earthLocation.upsert({
      where: { id: earthLocation.id },
      update: dataFields,
      create: dataFields,
    });

    earthLocation.id = savedLocation.id;
    earthLocation.createdAt = savedLocation.createdAt;
    earthLocation.updatedAt = savedLocation.updatedAt;
  }

  static async findById(id: number): Promise<EarthLocation | null> {
    const dbResult = await prisma.earthLocation.findUnique({
      where: { id: id },
    });
    if (dbResult) {
      return new EarthLocation({
        id: dbResult.id,
        createdAt: dbResult.createdAt,
        updatedAt: dbResult.updatedAt,
        address1: dbResult.address1 ? dbResult.address1 : undefined,
        address2: dbResult.address2 ? dbResult.address2 : undefined,
        city: dbResult.city ? dbResult.city : undefined,
        administrativeArea: dbResult.administartiveArea
          ? dbResult.administartiveArea
          : undefined,
        postalCode: dbResult.postalCode ? dbResult.postalCode : undefined,
        countryCode: dbResult.countryCode ? dbResult.countryCode : undefined,
        lat: dbResult.lat,
        lng: dbResult.lng,
      });
    }
    return null;
  }
}
