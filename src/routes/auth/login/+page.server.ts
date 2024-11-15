import bcrypt from "bcrypt";
import { prisma } from "$lib/db/client";
import { fail, redirect } from "@sveltejs/kit";
import { createSession } from "$lib/server/session";
import { z } from "zod";
import type { Actions } from "./$types";

const UserLoginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export const actions = {
  default: async ({ cookies, request, url }) => {
    const form = await request.formData();
    const data = Object.fromEntries(form);

    const result = UserLoginSchema.safeParse(data);
    if (!result.success) {
      switch (result.error.issues[0].path[0]) {
        case "email":
          return fail(400, {
            email: data.email,
            error: "Invalid Email",
            errorMessage: "Invalid email. Please try again.",
          });
        case "password":
          return fail(400, {
            email: data.email,
            error: "Invalid Password",
            errorMessage: "Invalid password. Please try again.",
          });
        default:
          return fail(400, {
            email: data.email,
            error: result.error.issues[0].path[0],
            errorMessage: result.error.issues[0].message,
          });
      }
    }

    const { email, password: passwordRaw } = result.data;

    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (
      !user ||
      user.disabled ||
      !(await bcrypt.compare(passwordRaw, user.passwordHash))
    ) {
      return fail(400, {
        email,
        error: "Incorrect Credentials",
        errorMessage: "Incorrect email or password. Please try again.",
      });
    }

    cookies.set(
      "SvelteShip-Session",
      createSession({
        sub: String(user.id),
        name: user.name,
        email: user.email,
        role: user.role,
      }),
      { path: "/" },
    );
    cookies.set("userId", String(user.id), { path: "/" });
    //make it easier to access userID without decode

    // Prevent open redirect, only allow destinations starting with /
    if ((url.searchParams.get("destination") || "").indexOf("/") == 0) {
      return redirect(302, url.searchParams.get("destination") || "/");
    } else {
      return redirect(302, "/");
    }
  },
} satisfies Actions;
