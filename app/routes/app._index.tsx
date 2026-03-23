import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useActionData, useLoaderData, useSubmit } from "@remix-run/react";
import {
  Page,
  Layout,
  Card,
  Text,
  BlockStack,
  InlineStack,
  TextField,
  Select,
  Button,
  Banner,
  Badge,
  Box,
  Divider,
  Checkbox,
} from "@shopify/polaris";
import { useState, useCallback } from "react";
import { authenticate } from "../shopify.server";
import prisma from "../db.server";
import { generateFeedToken } from "../utils/token.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { session, admin } = await authenticate.admin(request);
  const shop = session.shop;

  // FeedSettings yoksa olustur
  let feedSettings = await prisma.feedSettings.findUnique({
    where: { shop },
  });

  if (!feedSettings) {
    feedSettings = await prisma.feedSettings.create({
      data: {
        shop,
        feedToken: generateFeedToken(),
      },
    });
  }

  // Urun sayisini al
  const countResponse = await admin.graphql(`#graphql
    query {
      productsCount(query: "status:active") {
        count
      }
    }
  `);
  const countData = await countResponse.json();
  const productCount = countData.data?.productsCount?.count ?? 0;

  const appUrl = process.env.SHOPIFY_APP_URL || "";

  return json({
    shop,
    feedSettings: {
      feedToken: feedSettings.feedToken,
      googleEnabled: feedSettings.googleEnabled,
      facebookEnabled: feedSettings.facebookEnabled,
      title: feedSettings.title,
      description: feedSettings.description,
      currency: feedSettings.currency,
      productType: feedSettings.productType,
    },
    productCount,
    appUrl,
  });
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const { session } = await authenticate.admin(request);
  const shop = session.shop;
  const formData = await request.formData();
  const intent = formData.get("intent");

  if (intent === "save") {
    await prisma.feedSettings.update({
      where: { shop },
      data: {
        title: String(formData.get("title") || "My Store Feed"),
        description: String(formData.get("description") || ""),
        currency: String(formData.get("currency") || "TRY"),
        productType: String(formData.get("productType") || "new"),
        googleEnabled: formData.get("googleEnabled") === "true",
        facebookEnabled: formData.get("facebookEnabled") === "true",
      },
    });
    return json({ success: true, message: "Ayarlar kaydedildi" });
  }

  if (intent === "regenerateToken") {
    const newToken = generateFeedToken();
    await prisma.feedSettings.update({
      where: { shop },
      data: { feedToken: newToken },
    });
    return json({
      success: true,
      message:
        "Feed token yenilendi. Yeni URL'leri platformlara tekrar eklemeniz gerekiyor.",
      newToken,
    });
  }

  return json({ success: false, message: "Bilinmeyen islem" });
};

export default function FeedDashboard() {
  const { shop, feedSettings, productCount, appUrl } =
    useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const submit = useSubmit();

  const [title, setTitle] = useState(feedSettings.title);
  const [description, setDescription] = useState(feedSettings.description);
  const [currency, setCurrency] = useState(feedSettings.currency);
  const [productType, setProductType] = useState(feedSettings.productType);
  const [googleEnabled, setGoogleEnabled] = useState(
    feedSettings.googleEnabled,
  );
  const [facebookEnabled, setFacebookEnabled] = useState(
    feedSettings.facebookEnabled,
  );
  const [copied, setCopied] = useState<string | null>(null);

  const token =
    (actionData as { newToken?: string })?.newToken ?? feedSettings.feedToken;

  const googleFeedUrl = `${appUrl}/api/feed/google.xml?shop=${shop}&token=${token}`;
  const facebookFeedUrl = `${appUrl}/api/feed/facebook.xml?shop=${shop}&token=${token}`;

  const handleCopy = useCallback((url: string, type: string) => {
    navigator.clipboard.writeText(url);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  }, []);

  const handleSave = useCallback(() => {
    const formData = new FormData();
    formData.set("intent", "save");
    formData.set("title", title);
    formData.set("description", description);
    formData.set("currency", currency);
    formData.set("productType", productType);
    formData.set("googleEnabled", String(googleEnabled));
    formData.set("facebookEnabled", String(facebookEnabled));
    submit(formData, { method: "post" });
  }, [
    title,
    description,
    currency,
    productType,
    googleEnabled,
    facebookEnabled,
    submit,
  ]);

  const handleRegenerateToken = useCallback(() => {
    const formData = new FormData();
    formData.set("intent", "regenerateToken");
    submit(formData, { method: "post" });
  }, [submit]);

  const currencyOptions = [
    { label: "TRY - Turk Lirasi", value: "TRY" },
    { label: "USD - ABD Dolari", value: "USD" },
    { label: "EUR - Euro", value: "EUR" },
    { label: "GBP - Ingiliz Sterlini", value: "GBP" },
  ];

  const conditionOptions = [
    { label: "Yeni", value: "new" },
    { label: "Kullanilmis", value: "used" },
    { label: "Yenilenmis", value: "refurbished" },
  ];

  return (
    <Page title="ShoFeed - Feed Yonetimi">
      <BlockStack gap="500">
        {actionData?.message && (
          <Banner
            title={actionData.message}
            tone={actionData.success ? "success" : "critical"}
            onDismiss={() => {}}
          />
        )}

        {/* Ozet Bilgiler */}
        <Layout>
          <Layout.Section variant="oneThird">
            <Card>
              <BlockStack gap="200">
                <Text as="h3" variant="headingSm">
                  Aktif Urunler
                </Text>
                <Text as="p" variant="headingLg">
                  {productCount}
                </Text>
              </BlockStack>
            </Card>
          </Layout.Section>
          <Layout.Section variant="oneThird">
            <Card>
              <BlockStack gap="200">
                <Text as="h3" variant="headingSm">
                  Google Feed
                </Text>
                <Badge tone={googleEnabled ? "success" : "critical"}>
                  {googleEnabled ? "Aktif" : "Pasif"}
                </Badge>
              </BlockStack>
            </Card>
          </Layout.Section>
          <Layout.Section variant="oneThird">
            <Card>
              <BlockStack gap="200">
                <Text as="h3" variant="headingSm">
                  Facebook Feed
                </Text>
                <Badge tone={facebookEnabled ? "success" : "critical"}>
                  {facebookEnabled ? "Aktif" : "Pasif"}
                </Badge>
              </BlockStack>
            </Card>
          </Layout.Section>
        </Layout>

        {/* Feed URL'leri */}
        <Layout>
          <Layout.Section>
            <Card>
              <BlockStack gap="400">
                <Text as="h2" variant="headingMd">
                  Feed URL'leri
                </Text>
                <Text as="p" variant="bodySm" tone="subdued">
                  Bu URL'leri Google Merchant Center ve Facebook Commerce
                  Manager'a ekleyin
                </Text>

                <Divider />

                <BlockStack gap="200">
                  <Text as="h3" variant="headingSm">
                    Google Shopping Feed
                  </Text>
                  <InlineStack gap="200" blockAlign="center" wrap={false}>
                    <Box width="100%">
                      <TextField
                        label=""
                        value={googleFeedUrl}
                        readOnly
                        autoComplete="off"
                        disabled={!googleEnabled}
                      />
                    </Box>
                    <Button
                      onClick={() => handleCopy(googleFeedUrl, "google")}
                      disabled={!googleEnabled}
                    >
                      {copied === "google" ? "Kopyalandi!" : "Kopyala"}
                    </Button>
                  </InlineStack>
                </BlockStack>

                <Divider />

                <BlockStack gap="200">
                  <Text as="h3" variant="headingSm">
                    Facebook / Meta Catalog Feed
                  </Text>
                  <InlineStack gap="200" blockAlign="center" wrap={false}>
                    <Box width="100%">
                      <TextField
                        label=""
                        value={facebookFeedUrl}
                        readOnly
                        autoComplete="off"
                        disabled={!facebookEnabled}
                      />
                    </Box>
                    <Button
                      onClick={() => handleCopy(facebookFeedUrl, "facebook")}
                      disabled={!facebookEnabled}
                    >
                      {copied === "facebook" ? "Kopyalandi!" : "Kopyala"}
                    </Button>
                  </InlineStack>
                </BlockStack>

                <Divider />

                <InlineStack align="end">
                  <Button
                    variant="plain"
                    tone="critical"
                    onClick={handleRegenerateToken}
                  >
                    Token Yenile
                  </Button>
                </InlineStack>
              </BlockStack>
            </Card>
          </Layout.Section>
        </Layout>

        {/* Ayarlar */}
        <Layout>
          <Layout.Section>
            <Card>
              <BlockStack gap="400">
                <Text as="h2" variant="headingMd">
                  Feed Ayarlari
                </Text>

                <TextField
                  label="Feed Basligi"
                  value={title}
                  onChange={setTitle}
                  autoComplete="off"
                  helpText="Google ve Facebook'ta gorunecek feed adi"
                />

                <TextField
                  label="Feed Aciklamasi"
                  value={description}
                  onChange={setDescription}
                  autoComplete="off"
                  multiline={3}
                />

                <InlineStack gap="400">
                  <Box width="50%">
                    <Select
                      label="Para Birimi"
                      options={currencyOptions}
                      value={currency}
                      onChange={setCurrency}
                    />
                  </Box>
                  <Box width="50%">
                    <Select
                      label="Urun Durumu"
                      options={conditionOptions}
                      value={productType}
                      onChange={setProductType}
                    />
                  </Box>
                </InlineStack>

                <Divider />

                <Checkbox
                  label="Google Shopping Feed Aktif"
                  checked={googleEnabled}
                  onChange={setGoogleEnabled}
                />

                <Checkbox
                  label="Facebook / Meta Catalog Feed Aktif"
                  checked={facebookEnabled}
                  onChange={setFacebookEnabled}
                />

                <Divider />

                <InlineStack align="end">
                  <Button variant="primary" onClick={handleSave}>
                    Kaydet
                  </Button>
                </InlineStack>
              </BlockStack>
            </Card>
          </Layout.Section>
        </Layout>

        <Layout>
          <Layout.Section>
            <Box paddingBlockEnd="400">
              <Text as="p" variant="bodySm" tone="subdued">
                Magaza: {shop}
              </Text>
            </Box>
          </Layout.Section>
        </Layout>
      </BlockStack>
    </Page>
  );
}
