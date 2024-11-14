import { prisma } from "$lib/db/client";
import { Box } from "./Box";

export class BoxRepository {
  static async save(box: Box) {
    const dataFields = {
      heightCm: box.heightCm,
      widthCm: box.widthCm,
      depthCm: box.depthCm,
      weightG: box.weightG,
    };

    const savedBox = box.id
      ? await prisma.box.upsert({
          where: { id: box.id },
          update: dataFields,
          create: { ...dataFields }, // Ensure create has all necessary fields
        })
      : await prisma.box.create({
          data: dataFields, // Create a new box without an id
        });

    box.id = savedBox.id;
    box.createdAt = savedBox.createdAt;
    box.updatedAt = savedBox.updatedAt;
    return box;
  }
}
