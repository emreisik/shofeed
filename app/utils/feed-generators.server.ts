// XML feed generator'ları - Google Shopping ve Facebook Catalog

interface ProductVariant {
  id: string;
  title: string;
  price: string;
  compareAtPrice: string | null;
  sku: string | null;
  barcode: string | null;
  availableForSale: boolean;
  inventoryQuantity: number | null;
}

interface ProductImage {
  url: string;
  altText: string | null;
}

export interface FeedProduct {
  id: string;
  title: string;
  handle: string;
  description: string;
  vendor: string;
  productType: string;
  tags: string[];
  status: string;
  images: ProductImage[];
  variants: ProductVariant[];
}

interface FeedOptions {
  shopDomain: string;
  title: string;
  description: string;
  currency: string;
  productCondition: string;
}

function escapeXml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "").trim();
}

function getAvailability(variant: ProductVariant): string {
  if (!variant.availableForSale) return "out of stock";
  if (variant.inventoryQuantity !== null && variant.inventoryQuantity <= 0) {
    return "out of stock";
  }
  return "in stock";
}

function buildItemXml(
  product: FeedProduct,
  variant: ProductVariant,
  options: FeedOptions,
  format: "google" | "facebook",
): string {
  const variantId = variant.id.replace("gid://shopify/ProductVariant/", "");
  const productUrl = `https://${options.shopDomain}/products/${product.handle}`;
  const imageUrl = product.images[0]?.url ?? "";
  const description = stripHtml(product.description).slice(0, 5000);
  const availability = getAvailability(variant);
  const price = `${variant.price} ${options.currency}`;
  const salePrice =
    variant.compareAtPrice &&
    parseFloat(variant.compareAtPrice) > parseFloat(variant.price)
      ? `${variant.price} ${options.currency}`
      : null;
  const regularPrice =
    variant.compareAtPrice &&
    parseFloat(variant.compareAtPrice) > parseFloat(variant.price)
      ? `${variant.compareAtPrice} ${options.currency}`
      : price;

  const variantSuffix =
    product.variants.length > 1 ? ` - ${variant.title}` : "";

  const lines: string[] = [
    `    <item>`,
    `      <g:id>${escapeXml(variantId)}</g:id>`,
    `      <g:title>${escapeXml(product.title + variantSuffix)}</g:title>`,
    `      <g:description>${escapeXml(description || product.title)}</g:description>`,
    `      <g:link>${escapeXml(productUrl)}</g:link>`,
    `      <g:image_link>${escapeXml(imageUrl)}</g:image_link>`,
  ];

  // Ek resimler (max 10)
  product.images.slice(1, 11).forEach((img) => {
    lines.push(
      `      <g:additional_image_link>${escapeXml(img.url)}</g:additional_image_link>`,
    );
  });

  if (format === "google") {
    lines.push(`      <g:price>${escapeXml(regularPrice)}</g:price>`);
    if (salePrice) {
      lines.push(`      <g:sale_price>${escapeXml(salePrice)}</g:sale_price>`);
    }
  } else {
    lines.push(`      <g:price>${escapeXml(price)}</g:price>`);
  }

  lines.push(`      <g:availability>${availability}</g:availability>`);
  lines.push(
    `      <g:condition>${escapeXml(options.productCondition)}</g:condition>`,
  );

  if (product.vendor) {
    lines.push(`      <g:brand>${escapeXml(product.vendor)}</g:brand>`);
  }

  if (variant.barcode) {
    lines.push(`      <g:gtin>${escapeXml(variant.barcode)}</g:gtin>`);
  }

  if (variant.sku) {
    lines.push(`      <g:mpn>${escapeXml(variant.sku)}</g:mpn>`);
  }

  if (product.productType) {
    lines.push(
      `      <g:product_type>${escapeXml(product.productType)}</g:product_type>`,
    );
  }

  // Facebook-specific fields
  if (format === "facebook") {
    lines.push(
      `      <g:inventory>${variant.inventoryQuantity ?? 0}</g:inventory>`,
    );
  }

  // Google-specific: identifier_exists
  if (format === "google" && !variant.barcode && !variant.sku) {
    lines.push(`      <g:identifier_exists>false</g:identifier_exists>`);
  }

  lines.push(`    </item>`);
  return lines.join("\n");
}

export function generateGoogleFeed(
  products: FeedProduct[],
  options: FeedOptions,
): string {
  const items = products.flatMap((product) =>
    product.variants.map((variant) =>
      buildItemXml(product, variant, options, "google"),
    ),
  );

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
  <channel>
    <title>${escapeXml(options.title)}</title>
    <link>https://${escapeXml(options.shopDomain)}</link>
    <description>${escapeXml(options.description || options.title)}</description>
${items.join("\n")}
  </channel>
</rss>`;
}

export function generateFacebookFeed(
  products: FeedProduct[],
  options: FeedOptions,
): string {
  const items = products.flatMap((product) =>
    product.variants.map((variant) =>
      buildItemXml(product, variant, options, "facebook"),
    ),
  );

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
  <channel>
    <title>${escapeXml(options.title)}</title>
    <link>https://${escapeXml(options.shopDomain)}</link>
    <description>${escapeXml(options.description || options.title)}</description>
${items.join("\n")}
  </channel>
</rss>`;
}
