import type { RequestHandler } from "@sveltejs/kit";
import { validateAndRefreshSession } from "$lib/server/session";

export const GET: RequestHandler = async ({ cookies }) => {
  const sessionToken = cookies.get("session");
  if (!sessionToken) {
    return new Response(JSON.stringify({ loggedIn: false }), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    });
  }

  const session = validateAndRefreshSession(sessionToken);
  if (!session.success) {
    return new Response(JSON.stringify({ loggedIn: false }), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    });
  }

  return new Response(JSON.stringify({ loggedIn: true }), {
    headers: { "Content-Type": "application/json" },
    status: 200,
  });
};
