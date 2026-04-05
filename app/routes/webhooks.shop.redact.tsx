import type { ActionFunctionArgs } from "@remix-run/node";
import { authenticate } from "../shopify.server";
import db from "../db.server";

// GDPR mandatory webhook: shop/redact
export const action = async ({ request }: ActionFunctionArgs) => {
  const { shop, topic } = await authenticate.webhook(request);
  console.log(`Received ${topic} webhook for ${shop}`);

  await db.feedSettings.deleteMany({ where: { shop } });
  await db.session.deleteMany({ where: { shop } });

  return new Response(null, { status: 200 });
};
