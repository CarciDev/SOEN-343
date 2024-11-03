import { prisma } from "$lib/db/client";
import { User } from "./User";

export class UserRepository {
  static async save(user: User) {
    const dataFields = {
      email: user.email,
      name: user.name,
      comment: user.comment,
      role: user.role,
      passwordHash: user.passwordHash,
      disabled: user.disabled,
    };

    const savedUser = await prisma.user.upsert({
      where: { id: user.id },
      update: dataFields,
      create: dataFields,
    });

    user.id = savedUser.id;
    user.createdAt = savedUser.createdAt;
    user.updatedAt = savedUser.updatedAt;
  }

  static async findById(id: number): Promise<User | null> {
    const dbResult = await prisma.user.findUnique({ where: { id: id } });
    if (dbResult)
      return new User({
        id: dbResult.id,
        createdAt: dbResult.createdAt,
        updatedAt: dbResult.updatedAt,
        email: dbResult.email,
        name: dbResult.name,
        comment: dbResult.comment ? dbResult.comment : undefined,
        role: dbResult.role,
        passwordHash: dbResult.passwordHash,
        disabled: dbResult.disabled,
      });
    return null;
  }

  static async findByEmail(email: string): Promise<User | null> {
    // Piggy back off object creation above
    const dbResult = await prisma.user.findUnique({
      select: { id: true },
      where: { email: email },
    });
    if (dbResult) return this.findById(dbResult.id);
    return null;
  }
}
