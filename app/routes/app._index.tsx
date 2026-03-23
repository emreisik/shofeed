import { useCallback, useState } from "react";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useActionData, useLoaderData, useSubmit } from "@remix-run/react";
import {
  Page,
  Layout,
  Card,
  BlockStack,
  Text,
  TextField,
  Select,
  Button,
  Banner,
  Box,
  InlineStack,
  Badge,
  Divider,
  Checkbox,
} from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
import { authenticate } from "../shopify.server";
import prisma from "../db.server";
import { randomBytes } from "crypto";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { session } = await authenticate.admin(request);
  const shop = session.shop;

  let feedSettings = await prisma.feedSettings.findUnique({
    where: { shop },
  });

  // İlk kurulumda otomatik oluştur
  if (!feedSettings) {
    feedSettings = await prisma.feedSettings.create({
      data: {
        shop,
        feedToken: randomBytes(24).toString("hex"),
        title: shop.replace(".myshopify.com", "") + " Feed",
      },
    });
  }

  const appUrl = process.env.SHOPIFY_APP_URL || "";
  const googleFeedUrl = `${appUrl}/api/feed/google.xml?shop=${shop}&token=${feedSettings.feedToken}`;
  const facebookFeedUrl = `${appUrl}/api/feed/facebook.xml?shop=${shop}&token=${feedSettings.feedToken}`;

  return json({
    feedSettings,
    googleFeedUrl,
    facebookFeedUrl,
    shop,
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
        title: formData.get("title") as string,
        description: formData.get("description") as string,
        currency: formData.get("currency") as string,
        productType: formData.get("productType") as string,
        googleEnabled: formData.get("googleEnabled") === "true",
        facebookEnabled: formData.get("facebookEnabled") === "true",
      },
    });

    return json({ success: true, message: "Ayarlar kaydedildi" });
  }

  if (intent === "regenerateToken") {
    await prisma.feedSettings.update({
      where: { shop },
      data: {
        feedToken: randomBytes(24).toString("hex"),
      },
    });

    return json({
      success: true,
      message: "Feed token yenilendi. Yeni URL'leri kullaniniz.",
    });
  }

  return json({ success: false, message: "Gecersiz islem" });
};

export default function FeedDashboard() {
  const { feedSettings, googleFeedUrl, facebookFeedUrl } =
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
  const [copiedGoogle, setCopiedGoogle] = useState(false);
  const [copiedFacebook, setCopiedFacebook] = useState(false);

  const handleSave = useCallback(() => {
    const formData = new FormData();
    formData.set("intent", "save");
    formData.set("title", title);
    formData.set("description", description);
    formData.set("currency", currency);
    formData.set("productType", productType);
    formData.set("googleEnabled", String(googleEnabled));
    formData.set("facebookEnabled", String(facebookEnabled));
    submit(formData, { method: "POST" });
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
    submit(formData, { method: "POST" });
  }, [submit]);

  const copyToClipboard = useCallback(
    async (text: string, type: "google" | "facebook") => {
      await navigator.clipboard.writeText(text);
      if (type === "google") {
        setCopiedGoogle(true);
        setTimeout(() => setCopiedGoogle(false), 2000);
      } else {
        setCopiedFacebook(true);
        setTimeout(() => setCopiedFacebook(false), 2000);
      }
    },
    [],
  );

  const currencyOptions = [
    { label: "TRY - Turk Lirasi", value: "TRY" },
    { label: "USD - ABD Dolari", value: "USD" },
    { label: "EUR - Euro", value: "EUR" },
    { label: "GBP - Ingiliz Sterlini", value: "GBP" },
  ];

  const conditionOptions = [
    { label: "Yeni", value: "new" },
    { label: "Yenilenmis", value: "refurbished" },
    { label: "Kullanilmis", value: "used" },
  ];

  return (
    <Page>
      <TitleBar title="ShoFeed - XML Feed Yonetimi" />
      <BlockStack gap="500">
        {actionData?.message && (
          <Banner
            tone={actionData.success ? "success" : "critical"}
            onDismiss={() => {}}
          >
            {actionData.message}
          </Banner>
        )}

        {/* Feed URL'leri */}
        <Layout>
          <Layout.Section>
            <Card>
              <BlockStack gap="400">
                <Text as="h2" variant="headingLg">
                  Feed URL'leri
                </Text>
                <Text as="p" variant="bodyMd" tone="subdued">
                  Bu URL'leri Google Merchant Center ve Facebook Commerce
                  Manager panellerine ekleyin.
                </Text>

                <Divider />

                {/* Google Feed */}
                <BlockStack gap="200">
                  <InlineStack align="space-between" blockAlign="center">
                    <InlineStack gap="200" blockAlign="center">
                      <Text as="h3" variant="headingMd">
                        Google Shopping Feed
                      </Text>
                      <Badge tone={googleEnabled ? "success" : undefined}>
                        {googleEnabled ? "Aktif" : "Pasif"}
                      </Badge>
                    </InlineStack>
                  </InlineStack>
                  <Box
                    padding="300"
                    background="bg-surface-secondary"
                    borderRadius="200"
                    borderWidth="025"
                    borderColor="border"
                  >
                    <InlineStack align="space-between" blockAlign="center">
                      <Box maxWidth="80%">
                        <Text as="p" variant="bodySm" breakWord>
                          {googleFeedUrl}
                        </Text>
                      </Box>
                      <Button
                        size="slim"
                        onClick={() => copyToClipboard(googleFeedUrl, "google")}
                      >
                        {copiedGoogle ? "Kopyalandi!" : "Kopyala"}
                      </Button>
                    </InlineStack>
                  </Box>
                </BlockStack>

                <Divider />

                {/* Facebook Feed */}
                <BlockStack gap="200">
                  <InlineStack align="space-between" blockAlign="center">
                    <InlineStack gap="200" blockAlign="center">
                      <Text as="h3" variant="headingMd">
                        Facebook / Meta Catalog Feed
                      </Text>
                      <Badge tone={facebookEnabled ? "success" : undefined}>
                        {facebookEnabled ? "Aktif" : "Pasif"}
                      </Badge>
                    </InlineStack>
                  </InlineStack>
                  <Box
                    padding="300"
                    background="bg-surface-secondary"
                    borderRadius="200"
                    borderWidth="025"
                    borderColor="border"
                  >
                    <InlineStack align="space-between" blockAlign="center">
                      <Box maxWidth="80%">
                        <Text as="p" variant="bodySm" breakWord>
                          {facebookFeedUrl}
                        </Text>
                      </Box>
                      <Button
                        size="slim"
                        onClick={() =>
                          copyToClipboard(facebookFeedUrl, "facebook")
                        }
                      >
                        {copiedFacebook ? "Kopyalandi!" : "Kopyala"}
                      </Button>
                    </InlineStack>
                  </Box>
                </BlockStack>

                <Divider />

                <Button
                  tone="critical"
                  variant="plain"
                  onClick={handleRegenerateToken}
                >
                  Feed Token'i Yenile
                </Button>
                <Text as="p" variant="bodySm" tone="subdued">
                  Token yenilendiginde mevcut URL'ler gecersiz olur. Yeni
                  URL'leri platformlara tekrar eklemeniz gerekir.
                </Text>
              </BlockStack>
            </Card>
          </Layout.Section>

          {/* Feed Ayarlari */}
          <Layout.Section variant="oneThird">
            <Card>
              <BlockStack gap="400">
                <Text as="h2" variant="headingLg">
                  Feed Ayarlari
                </Text>

                <TextField
                  label="Feed Basligi"
                  value={title}
                  onChange={setTitle}
                  autoComplete="off"
                />

                <TextField
                  label="Feed Aciklamasi"
                  value={description}
                  onChange={setDescription}
                  multiline={3}
                  autoComplete="off"
                />

                <Select
                  label="Para Birimi"
                  options={currencyOptions}
                  value={currency}
                  onChange={setCurrency}
                />

                <Select
                  label="Urun Durumu"
                  options={conditionOptions}
                  value={productType}
                  onChange={setProductType}
                />

                <Divider />

                <Checkbox
                  label="Google Shopping Feed Aktif"
                  checked={googleEnabled}
                  onChange={setGoogleEnabled}
                />

                <Checkbox
                  label="Facebook Catalog Feed Aktif"
                  checked={facebookEnabled}
                  onChange={setFacebookEnabled}
                />

                <Button variant="primary" onClick={handleSave}>
                  Ayarlari Kaydet
                </Button>
              </BlockStack>
            </Card>
          </Layout.Section>
        </Layout>
      </BlockStack>
    </Page>
  );
}
