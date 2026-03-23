import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { authenticate } from "../shopify.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { session } = await authenticate.admin(request);
  return json({ shop: session.shop });
};

export default function FeedDashboard() {
  const { shop } = useLoaderData<typeof loader>();

  return (
    <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
      <h1>ShoFeed Calisiyor!</h1>
      <p>Magaza: {shop}</p>
    </div>
  );
}
