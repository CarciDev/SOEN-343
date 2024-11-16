// Disabling this until needed.

// import { json, type RequestHandler } from "@sveltejs/kit";
// import { PrismaClient } from "@prisma/client";

// const prisma = new PrismaClient();

// export const POST: RequestHandler = async ({ request, locals }) => {
//   try {
//     const formData = await request.formData();
//     const rating = Number(formData.get("rating"));
//     const deliveryRating = Number(formData.get("deliveryRating"));
//     const wasDeliveryOnTime = formData.get("wasDeliveryOnTime") === "true";
//     const userId = locals.user?.id;

//     if (!userId) {
//       return json({ error: "User not authenticated" }, { status: 401 });
//     }

//     const user = await prisma.user.findUnique({ where: { id: userId } });
//     if (!user) {
//       return json({ error: "User not found" }, { status: 400 });
//     }

//     const review = await prisma.shipmentTransaction.create({
//       data: {
//         rating,
//         deliveryRating,
//         wasDeliveryOnTime,
//         comment: formData.get("comment")?.toString() || "",
//         userId,
//       },
//     });

//     return json(review);
//   } catch (error) {
//     console.error(error);
//     return json({ error: "Failed to create review" }, { status: 500 });
//   }
// };
