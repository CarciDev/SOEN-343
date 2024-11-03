import { json, type RequestHandler } from "@sveltejs/kit";
import { PrismaClient } from "@prisma/client";
<<<<<<< Updated upstream
import { parse } from "cookie";

const prisma = new PrismaClient();

export const POST: RequestHandler = async ({ request }) => {
  try {
=======
import { writeFileSync } from "fs";
import { join } from "path";

const prisma = new PrismaClient();

export const POST: RequestHandler = async ({ request, locals }) => {
  try {
    const user = locals.user;
    if (!user) {
      return json({ error: "User not authenticated" }, { status: 401 });
    }

>>>>>>> Stashed changes
    const formData = await request.formData();

    // Required fields validation with proper typing
    const rating = Number(formData.get("rating"));
    const deliveryRating = Number(formData.get("deliveryRating"));
    const wasDeliveryOnTime = formData.get("wasDeliveryOnTime") === "true";

<<<<<<< Updated upstream
    // Fetch user ID from cookies
    const cookies = request.headers.get("cookie");
    const parsedCookies = parse(cookies || "");
    const userIdStr = parsedCookies["userId"];
    // Convert userId to number
    const userId = Number(userIdStr);
    console.log("userId", userId);

=======
>>>>>>> Stashed changes
    // Validate required fields
    if (isNaN(rating) || rating < 1 || rating > 5) {
      return json(
        { error: "Invalid rating: must be between 1 and 5" },
        { status: 400 },
      );
    }

    if (isNaN(deliveryRating) || deliveryRating < 1 || deliveryRating > 5) {
      return json(
        { error: "Invalid delivery rating: must be between 1 and 5" },
        { status: 400 },
      );
    }

<<<<<<< Updated upstream
    if (isNaN(userId)) {
      return json({ error: "Invalid user ID" }, { status: 400 });
    }

    // Optional comment field
    const comment = formData.get("comment")?.toString() || "";

    // Create the review with the schema-matching fields
=======
    // Optional comment field
    const comment = formData.get("comment")?.toString() || "";

    // Create the review with the schema-matching fields, using the user ID from locals
>>>>>>> Stashed changes
    const review = await prisma.review.create({
      data: {
        rating,
        deliveryRating,
        wasDeliveryOnTime,
        comment,
<<<<<<< Updated upstream
        userId,
=======
        userId: user.id, // Use user ID from event.locals
>>>>>>> Stashed changes
      },
    });

    // Handle optional image uploads
    const imagePromises: Promise<any>[] = [];
    let imageIndex = 0;

    for (const [key, value] of formData.entries()) {
      if (key.startsWith("image") && value instanceof File) {
        const file = value;

        // Validate file type
        if (!file.type.startsWith("image/")) {
          continue;
        }

        // Generate unique filename
        const filename = `${Date.now()}-${imageIndex}-${file.name}`;
        const filepath = join(process.cwd(), "static", "uploads", filename);

        // Convert file to buffer and save
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        writeFileSync(filepath, buffer);

        // Create image record
        imagePromises.push(
          prisma.image.create({
            data: {
              url: `/uploads/${filename}`,
              reviewId: review.id,
            },
          }),
        );
        imageIndex++;
      }
    }

    // Process images if any exist
    if (imagePromises.length > 0) {
      await Promise.all(imagePromises);
    }

    // Fetch complete review with images
    const completeReview = await prisma.review.findUnique({
      where: { id: review.id },
      include: { images: true },
    });

    return json(completeReview);
  } catch (error) {
    console.error("Error creating review:", error);

    if (error instanceof Error) {
      return json({ error: error.message }, { status: 500 });
    }

    return json({ error: "Failed to create review" }, { status: 500 });
  }
};
