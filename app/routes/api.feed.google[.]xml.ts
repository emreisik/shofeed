// Google Shopping XML Feed - Public endpoint
// URL: /api/feed/google.xml?shop=xxx.myshopify.com&token=yyy

import type { LoaderFunctionArgs } from "@remix-run/node";
import prisma from "../db.server";
import { unauthenticated } from "../shopify.server";
import { fetchAllProducts } from "../utils/fetch-products.server";
import { generateGoogleFeed } from "../utils/feed-generators.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const shop = url.searchParams.get("shop");
  const token = url.searchParams.get("token");

  if (!shop || !token) {
    return new Response("Missing required parameters: shop and token", {
      status: 400,
    });
  }

  const feedSettings = await prisma.feedSettings.findUnique({
    where: { shop },
  });

  if (!feedSettings || feedSettings.feedToken !== token) {
    return new Response("Invalid token", { status: 403 });
  }

  if (!feedSettings.googleEnabled) {
    return new Response("Google feed is disabled", { status: 404 });
  }

  try {
    const { admin } = await unauthenticated.admin(shop);
    const products = await fetchAllProducts(admin);

    const xml = generateGoogleFeed(products, {
      shopDomain: shop,
      title: feedSettings.title,
      description: feedSettings.description,
      currency: feedSettings.currency,
      productCondition: feedSettings.productType,
    });

    return new Response(xml, {
      status: 200,
      headers: {
        "Content-Type": "application/xml; charset=utf-8",
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch (error) {
    console.error("Google feed generation error:", error);
    return new Response("Failed to generate feed", { status: 500 });
  }
};
