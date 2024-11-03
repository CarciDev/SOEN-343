import bcrypt from "bcrypt";
import type { UserRole } from "./UserRole";

export class User {
  id?: number;
  createdAt?: Date;
  updatedAt?: Date;
  email: string;
  name: string;
  comment?: string;
  role: UserRole;
  passwordHash: string;
  disabled: boolean;

  constructor(params: {
    id?: number;
    createdAt?: Date;
    updatedAt?: Date;
    email: string;
    name: string;
    comment?: string;
    role: UserRole;
    passwordHash: string;
    disabled: boolean;
  }) {
    this.id = params.id;
    this.createdAt = params.createdAt;
    this.updatedAt = params.updatedAt;
    this.email = params.email;
    this.name = params.name;
    this.comment = params.comment;
    this.role = params.role;
    this.passwordHash = params.passwordHash;
    this.disabled = params.disabled;
  }

  async checkPassword(input: string) {
    await bcrypt.compare(input, this.passwordHash);
  }

  static async getPasswordHash(input: string) {
    await bcrypt.hash(input, 12);
  }
}
