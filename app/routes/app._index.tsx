import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Page, Card, BlockStack, Text } from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
import { authenticate } from "../shopify.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { session } = await authenticate.admin(request);
  return json({ shop: session.shop });
};

export default function FeedDashboard() {
  const { shop } = useLoaderData<typeof loader>();

  return (
    <Page>
      <TitleBar title="ShoFeed" />
      <BlockStack gap="500">
        <Card>
          <BlockStack gap="200">
            <Text as="h2" variant="headingMd">
              ShoFeed Calisiyor!
            </Text>
            <Text as="p" variant="bodyMd">
              Magaza: {shop}
            </Text>
          </BlockStack>
        </Card>
      </BlockStack>
    </Page>
  );
}
