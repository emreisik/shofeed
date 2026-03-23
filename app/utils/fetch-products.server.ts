// Shopify Admin GraphQL API ile ürünleri çekme

import type { FeedProduct } from "./feed-generators.server";

const PRODUCTS_QUERY = `#graphql
  query GetProducts($cursor: String) {
    products(first: 250, after: $cursor, query: "status:active") {
      edges {
        node {
          id
          title
          handle
          descriptionHtml
          vendor
          productType
          tags
          status
          images(first: 11) {
            edges {
              node {
                url
                altText
              }
            }
          }
          variants(first: 100) {
            edges {
              node {
                id
                title
                price
                compareAtPrice
                sku
                barcode
                availableForSale
                inventoryQuantity
              }
            }
          }
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

interface GraphQLAdmin {
  graphql: (
    query: string,
    options?: { variables: Record<string, unknown> },
  ) => Promise<Response>;
}

export async function fetchAllProducts(
  admin: GraphQLAdmin,
): Promise<FeedProduct[]> {
  const allProducts: FeedProduct[] = [];
  let cursor: string | null = null;
  let hasNextPage = true;

  while (hasNextPage) {
    const response = await admin.graphql(PRODUCTS_QUERY, {
      variables: { cursor },
    });

    const json = await response.json();
    const data = json.data;

    if (!data?.products) break;

    const products = data.products.edges.map(
      (edge: { node: Record<string, unknown> }) => {
        const node = edge.node as Record<string, unknown>;
        return {
          id: node.id as string,
          title: node.title as string,
          handle: node.handle as string,
          description: (node.descriptionHtml as string) || "",
          vendor: (node.vendor as string) || "",
          productType: (node.productType as string) || "",
          tags: (node.tags as string[]) || [],
          status: node.status as string,
          images: (
            (
              node.images as {
                edges: Array<{ node: { url: string; altText: string | null } }>;
              }
            ).edges || []
          ).map((e: { node: { url: string; altText: string | null } }) => ({
            url: e.node.url,
            altText: e.node.altText,
          })),
          variants: (
            (
              node.variants as {
                edges: Array<{ node: Record<string, unknown> }>;
              }
            ).edges || []
          ).map((e: { node: Record<string, unknown> }) => ({
            id: e.node.id as string,
            title: e.node.title as string,
            price: e.node.price as string,
            compareAtPrice: e.node.compareAtPrice as string | null,
            sku: e.node.sku as string | null,
            barcode: e.node.barcode as string | null,
            availableForSale: e.node.availableForSale as boolean,
            inventoryQuantity: e.node.inventoryQuantity as number | null,
          })),
        };
      },
    );

    allProducts.push(...products);

    hasNextPage = data.products.pageInfo.hasNextPage;
    cursor = data.products.pageInfo.endCursor;
  }

  return allProducts;
}
