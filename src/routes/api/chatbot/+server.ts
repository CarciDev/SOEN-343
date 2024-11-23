import OpenAIApi from "openai";
import Configuration from "openai";
import type { RequestHandler } from "@sveltejs/kit";
import { validateAndRefreshSession } from "$lib/server/session";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY ? process.env.OPENAI_API_KEY : "apikey",
});
//@ts-expect-error configuration typing missing.
const openai = new OpenAIApi(configuration);

export const POST: RequestHandler = async ({ request, cookies }) => {
  try {
    const sessionToken = cookies.get("session"); // Get the session token from cookies
    if (!sessionToken) {
      return new Response(null, {
        status: 302,
        headers: {
          Location: "/auth/login",
        },
      });
    }
    const session = validateAndRefreshSession(sessionToken);

    if (!session.success) {
      return new Response(null, {
        status: 302,
        headers: {
          Location: "/auth/login",
        },
      });
    }

    const { message } = await request.json();
    console.log(message);
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: message }],
      max_tokens: 2048,
      n: 1,
      temperature: 0.7,
    });

    const botResponse = response.choices[0]?.message?.content?.trim();
    return new Response(
      JSON.stringify({ response: botResponse || "No response available" }),
      {
        headers: { "Content-Type": "application/json" },
        status: 200,
      },
    );
  } catch (error) {
    console.error("Error in OpenAI API request:", error);
    return new Response(
      JSON.stringify({
        response: "Sorry, there was an error processing your request.",
        //@ts-expect-error error typing missing.
        error: error.message || "Unknown error",
      }),
      {
        headers: { "Content-Type": "application/json" },
        status: 500,
      },
    );
  }
};
