import type { LoaderFunctionArgs } from "@remix-run/node";

// Public privacy policy page - returns raw HTML (no auth required)
export const loader = async ({ request }: LoaderFunctionArgs) => {
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>ShoFeed - Privacy Policy</title>
  <style>
    body {
      max-width: 800px;
      margin: 0 auto;
      padding: 40px 20px;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      line-height: 1.7;
      color: #1a1a1a;
    }
    h1 { font-size: 28px; margin-bottom: 8px; }
    h2 { font-size: 20px; margin-bottom: 8px; }
    section { margin-bottom: 28px; }
    ul { padding-left: 24px; }
    .date { color: #666; margin-bottom: 32px; }
    a { color: #2c6ecb; }
    footer {
      margin-top: 40px;
      padding-top: 20px;
      border-top: 1px solid #e0e0e0;
      color: #666;
      font-size: 14px;
    }
  </style>
</head>
<body>
  <h1>Privacy Policy</h1>
  <p class="date">Last updated: March 23, 2026</p>

  <section>
    <h2>1. Introduction</h2>
    <p>ShoFeed ("we", "our", or "the App") is a Shopify application that generates XML product feeds for Google Shopping and Facebook/Meta Catalog. This privacy policy explains how we collect, use, and protect information when you use our application.</p>
  </section>

  <section>
    <h2>2. Information We Collect</h2>
    <p>When you install and use ShoFeed, we access the following data:</p>
    <ul>
      <li><strong>Store information:</strong> Your Shopify store domain name (e.g., your-store.myshopify.com)</li>
      <li><strong>Product data:</strong> Product titles, descriptions, images, prices, variants, SKUs, barcodes, inventory quantities, and availability status (read-only access)</li>
      <li><strong>Feed settings:</strong> Your feed configuration preferences such as feed title, description, currency, and product condition</li>
    </ul>
    <p><strong>We do NOT collect:</strong></p>
    <ul>
      <li>Customer personal information</li>
      <li>Order or transaction data</li>
      <li>Payment information</li>
      <li>Analytics or tracking data</li>
    </ul>
  </section>

  <section>
    <h2>3. How We Use Your Information</h2>
    <p>We use the collected information solely to:</p>
    <ul>
      <li>Generate XML product feeds for Google Shopping and Facebook/Meta Catalog</li>
      <li>Display your feed management dashboard within Shopify admin</li>
      <li>Provide secure, token-based access to your product feeds for external platforms</li>
    </ul>
  </section>

  <section>
    <h2>4. Data Storage and Security</h2>
    <ul>
      <li>Feed settings and authentication sessions are stored in a secure database</li>
      <li>Product data is fetched in real-time from Shopify and is not permanently stored</li>
      <li>Feed URLs are protected with unique, randomly generated tokens</li>
      <li>All data transmission uses HTTPS/TLS encryption</li>
    </ul>
  </section>

  <section>
    <h2>5. Data Sharing</h2>
    <p>We do not sell, trade, or share your data with third parties. Your product feed URLs are only accessible to those who have the unique feed token, which you control and can regenerate at any time.</p>
  </section>

  <section>
    <h2>6. Data Retention and Deletion</h2>
    <ul>
      <li>Your feed settings are retained as long as the app is installed</li>
      <li>When you uninstall the app, all session data is immediately deleted</li>
      <li>Within 48 hours of uninstallation, all remaining store data (including feed settings) is permanently deleted</li>
      <li>You can request data deletion at any time by contacting us</li>
    </ul>
  </section>

  <section>
    <h2>7. GDPR Compliance</h2>
    <p>We comply with GDPR and Shopify's data protection requirements. We respond to all mandatory data requests including:</p>
    <ul>
      <li>Customer data access requests</li>
      <li>Customer data deletion requests</li>
      <li>Shop data erasure requests</li>
    </ul>
  </section>

  <section>
    <h2>8. Your Rights</h2>
    <p>You have the right to:</p>
    <ul>
      <li>Access the data we store about your shop</li>
      <li>Request correction of inaccurate data</li>
      <li>Request deletion of your data</li>
      <li>Withdraw consent by uninstalling the app at any time</li>
    </ul>
  </section>

  <section>
    <h2>9. Changes to This Policy</h2>
    <p>We may update this privacy policy from time to time. Any changes will be reflected on this page with an updated revision date.</p>
  </section>

  <section>
    <h2>10. Contact</h2>
    <p>If you have any questions about this privacy policy or your data, please contact us at: <a href="mailto:support@shofeed.app">support@shofeed.app</a></p>
  </section>

  <footer>
    <p>&copy; ${new Date().getFullYear()} ShoFeed. All rights reserved.</p>
  </footer>
</body>
</html>`;

  return new Response(html, {
    status: 200,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
    },
  });
};
