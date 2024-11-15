import { TrackingStatus, TransactionType, UserRole } from "@prisma/client";
import { prisma } from "../src/lib/db/client.ts";
import bcrypt from "bcrypt";

///// TEST / PREVIEW SEED /////

async function seedAll() {
  await prisma.user.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      email: "admin@svelteship.test",
      name: "Joe Admin",
      comment: "Created from the Prisma seed file",
      passwordHash: bcrypt.hashSync("admin123", 12),
      role: UserRole.ADMIN,
    },
  });

  const customer = await prisma.user.upsert({
    where: { id: 2 },
    update: {},
    create: {
      id: 2,
      email: "customer@svelteship.test",
      name: "First Customer",
      comment: "Created from the Prisma seed file",
      passwordHash: bcrypt.hashSync("first123", 12),
      role: UserRole.CUSTOMER,
    },
  });

  const box = await prisma.box.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      heightCm: 50,
      widthCm: 40,
      depthCm: 30,
      weightG: 1000,
    },
  });

  const concordia = await prisma.earthLocation.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      address1: "1455 boul de Maisonneuve O",
      city: "Montreal",
      administartiveArea: "QC",
      postalCode: "H3G 1M8",
      countryCode: "CA",
      lat: 45.49727,
      lng: -73.57893,
    },
  });

  const loyola = await prisma.earthLocation.upsert({
    where: { id: 2 },
    update: {},
    create: {
      id: 2,
      address1: "7141 rue Sherbrooke O",
      city: "Montreal",
      administartiveArea: "QC",
      postalCode: "H4B 1R6",
      countryCode: "CA",
      lat: 45.45837,
      lng: -73.63861,
    },
  });

  const quote = await prisma.quotation.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      originId: concordia.id,
      destinationId: loyola.id,
      amountQuotedCents: 2000,
      boxId: box.id,
    },
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const quote2 = await prisma.quotation.upsert({
    where: { id: 2 },
    update: {},
    create: {
      id: 2,
      originId: concordia.id,
      destinationId: loyola.id,
      amountQuotedCents: 2000,
      boxId: box.id,
    },
  });
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const quote3 = await prisma.quotation.upsert({
    where: { id: 3 },
    update: {},
    create: {
      id: 3,
      originId: concordia.id,
      destinationId: loyola.id,
      amountQuotedCents: 2000,
      boxId: box.id,
    },
  });

  const shipment = await prisma.shipmentTransaction.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      trackingNumber: "111111111111",
      quotationId: quote.id,
      transactionType: TransactionType.MANUAL,
      transactionDetail: "Seeded",
      shipperId: customer.id,
    },
  });

  await prisma.trackingEvent.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      type: TrackingStatus.PICKED_UP_AT_ORIGIN,
      locationId: concordia.id,
      shipmentTransactionId: shipment.id,
    },
  });
}

async function main() {
  // const {
  //   values: { environment },
  // } = parseArgs({ options: { environment: { type: "string" } } });

  // switch (environment) {
  //   case "production":
  //   case "develop":
  //   case "development":
  //     await seedAll();
  //     break;
  //   case "preview":
  //     await seedAll();
  //     break;
  //   default:
  //     console.log(
  //       `Invalid environment "${environment}". Please provide a valid environment.`,
  //     );
  //     break;
  // }
  seedAll();
}

main();
