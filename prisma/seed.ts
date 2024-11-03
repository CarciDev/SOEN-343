import {} from "@prisma/client";
import { parseArgs } from "node:util";

///// TEST / PREVIEW SEED /////

async function seedAll() {}

async function main() {
  const {
    values: { environment },
  } = parseArgs({ options: { environment: { type: "string" } } });

  switch (environment) {
    case "production":
    case "develop":
      await seedAll();
      break;
    case "preview":
      await seedAll();
      break;
    default:
      console.log(
        `Invalid environment "${environment}". Please provide a valid environment.`,
      );
      break;
  }
}

main();
