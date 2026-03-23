import type { ActionFunctionArgs } from "@remix-run/node";
import { authenticate } from "../shopify.server";

// GDPR mandatory webhook: customers/redact
export const action = async ({ request }: ActionFunctionArgs) => {
  try {
    const { shop, topic } = await authenticate.webhook(request);
    console.log(`Received ${topic} webhook for ${shop}`);
    return new Response(null, { status: 200 });
  } catch (error) {
    console.error("Webhook auth failed:", error);
    return new Response("Unauthorized", { status: 401 });
  }
};
