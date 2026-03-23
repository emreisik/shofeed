import type { ActionFunctionArgs } from "@remix-run/node";
import { authenticate } from "../shopify.server";

// GDPR mandatory webhook: customers/data_request
// Shopify sends this when a customer requests their data.
// Since this app only reads product data (no customer data stored),
// we acknowledge the request with a 200 response.
export const action = async ({ request }: ActionFunctionArgs) => {
  const { shop, topic } = await authenticate.webhook(request);
  console.log(`Received ${topic} webhook for ${shop}`);

  return new Response();
};
