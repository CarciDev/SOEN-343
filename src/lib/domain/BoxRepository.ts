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

    const savedBox = await prisma.box.upsert({
      where: { id: box.id },
      update: dataFields,
      create: dataFields,
    });

    box.id = savedBox.id;
    box.createdAt = savedBox.createdAt;
    box.updatedAt = savedBox.updatedAt;
  }

  static async findById(id: number): Promise<Box | null> {
    const dbResult = await prisma.box.findFirst({ where: { id: id } });
    if (dbResult) {
      return new Box(dbResult);
    }
    return null;
  }
}
