import type { Load } from "@sveltejs/kit";
import { validateAndRefreshSession } from "$lib/server/session";

export const load: Load = async ({ cookies }) => {
  const sessionToken = cookies.get("session");

  if (!sessionToken) {
    return {
      status: 302,
      redirect: "/auth/login",
    };
  }

  const session = validateAndRefreshSession(sessionToken);

  if (!session.success) {
    return {
      status: 302,
      redirect: "/auth/login",
    };
  }

  return {
    props: {
      user: session.user,
    },
  };
};
