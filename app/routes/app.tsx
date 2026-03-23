import type { HeadersFunction, LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, Outlet, useLoaderData, useRouteError } from "@remix-run/react";
import { boundary } from "@shopify/shopify-app-remix/server";
import { AppProvider } from "@shopify/shopify-app-remix/react";
import { NavMenu } from "@shopify/app-bridge-react";
import polarisStyles from "@shopify/polaris/build/esm/styles.css?url";

import { authenticate } from "../shopify.server";

export const links = () => [{ rel: "stylesheet", href: polarisStyles }];

export const loader = async ({ request }: LoaderFunctionArgs) => {
  try {
    await authenticate.admin(request);
  } catch (error) {
    // Re-throw auth redirects (Response)
    if (error instanceof Response) {
      throw error;
    }
    console.error("AUTH ERROR:", error);
    return json({
      apiKey: process.env.SHOPIFY_API_KEY || "",
      error: String(error),
    });
  }

  return json({
    apiKey: process.env.SHOPIFY_API_KEY || "",
    error: null,
  });
};

export default function App() {
  const { apiKey, error } = useLoaderData<typeof loader>();

  if (error) {
    return (
      <div style={{ padding: "40px", fontFamily: "sans-serif", color: "red" }}>
        <h1>Auth Error</h1>
        <pre>{error}</pre>
        <p>SHOPIFY_API_KEY: {apiKey ? "SET" : "MISSING"}</p>
      </div>
    );
  }

  return (
    <AppProvider isEmbeddedApp apiKey={apiKey}>
      <NavMenu>
        <Link to="/app" rel="home">
          Feed Management
        </Link>
      </NavMenu>
      <Outlet />
    </AppProvider>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();
  console.error("BOUNDARY ERROR:", error);

  return (
    <div style={{ padding: "40px", fontFamily: "sans-serif", color: "red" }}>
      <h1>Application Error</h1>
      <pre>
        {error instanceof Error ? error.message : JSON.stringify(error)}
      </pre>
      <p>Stack: {error instanceof Error ? error.stack : "N/A"}</p>
    </div>
  );
}

export const headers: HeadersFunction = (headersArgs) => {
  return boundary.headers(headersArgs);
};
