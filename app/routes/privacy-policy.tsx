import type { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
  return [{ title: "ShoFeed - Privacy Policy" }];
};

export default function PrivacyPolicy() {
  return (
    <div
      style={{
        maxWidth: "800px",
        margin: "0 auto",
        padding: "40px 20px",
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        lineHeight: 1.7,
        color: "#1a1a1a",
      }}
    >
      <h1 style={{ fontSize: "28px", marginBottom: "8px" }}>Privacy Policy</h1>
      <p style={{ color: "#666", marginBottom: "32px" }}>
        Last updated: March 23, 2026
      </p>

      <section style={{ marginBottom: "28px" }}>
        <h2 style={{ fontSize: "20px", marginBottom: "8px" }}>
          1. Introduction
        </h2>
        <p>
          ShoFeed (&quot;we&quot;, &quot;our&quot;, or &quot;the App&quot;) is a
          Shopify application that generates XML product feeds for Google
          Shopping and Facebook/Meta Catalog. This privacy policy explains how
          we collect, use, and protect information when you use our application.
        </p>
      </section>

      <section style={{ marginBottom: "28px" }}>
        <h2 style={{ fontSize: "20px", marginBottom: "8px" }}>
          2. Information We Collect
        </h2>
        <p>When you install and use ShoFeed, we access the following data:</p>
        <ul style={{ paddingLeft: "24px" }}>
          <li>
            <strong>Store information:</strong> Your Shopify store domain name
            (e.g., your-store.myshopify.com)
          </li>
          <li>
            <strong>Product data:</strong> Product titles, descriptions, images,
            prices, variants, SKUs, barcodes, inventory quantities, and
            availability status (read-only access)
          </li>
          <li>
            <strong>Feed settings:</strong> Your feed configuration preferences
            such as feed title, description, currency, and product condition
          </li>
        </ul>
        <p style={{ marginTop: "12px" }}>
          <strong>We do NOT collect:</strong>
        </p>
        <ul style={{ paddingLeft: "24px" }}>
          <li>Customer personal information</li>
          <li>Order or transaction data</li>
          <li>Payment information</li>
          <li>Analytics or tracking data</li>
        </ul>
      </section>

      <section style={{ marginBottom: "28px" }}>
        <h2 style={{ fontSize: "20px", marginBottom: "8px" }}>
          3. How We Use Your Information
        </h2>
        <p>We use the collected information solely to:</p>
        <ul style={{ paddingLeft: "24px" }}>
          <li>
            Generate XML product feeds for Google Shopping and Facebook/Meta
            Catalog
          </li>
          <li>Display your feed management dashboard within Shopify admin</li>
          <li>
            Provide secure, token-based access to your product feeds for
            external platforms
          </li>
        </ul>
      </section>

      <section style={{ marginBottom: "28px" }}>
        <h2 style={{ fontSize: "20px", marginBottom: "8px" }}>
          4. Data Storage and Security
        </h2>
        <ul style={{ paddingLeft: "24px" }}>
          <li>
            Feed settings and authentication sessions are stored in a secure
            database
          </li>
          <li>
            Product data is fetched in real-time from Shopify and is not
            permanently stored
          </li>
          <li>
            Feed URLs are protected with unique, randomly generated tokens
          </li>
          <li>All data transmission uses HTTPS/TLS encryption</li>
        </ul>
      </section>

      <section style={{ marginBottom: "28px" }}>
        <h2 style={{ fontSize: "20px", marginBottom: "8px" }}>
          5. Data Sharing
        </h2>
        <p>
          We do not sell, trade, or share your data with third parties. Your
          product feed URLs are only accessible to those who have the unique
          feed token, which you control and can regenerate at any time.
        </p>
      </section>

      <section style={{ marginBottom: "28px" }}>
        <h2 style={{ fontSize: "20px", marginBottom: "8px" }}>
          6. Data Retention and Deletion
        </h2>
        <ul style={{ paddingLeft: "24px" }}>
          <li>
            Your feed settings are retained as long as the app is installed
          </li>
          <li>
            When you uninstall the app, all session data is immediately deleted
          </li>
          <li>
            Within 48 hours of uninstallation, all remaining store data
            (including feed settings) is permanently deleted
          </li>
          <li>You can request data deletion at any time by contacting us</li>
        </ul>
      </section>

      <section style={{ marginBottom: "28px" }}>
        <h2 style={{ fontSize: "20px", marginBottom: "8px" }}>
          7. GDPR Compliance
        </h2>
        <p>
          We comply with GDPR and Shopify&apos;s data protection requirements.
          We respond to all mandatory data requests including:
        </p>
        <ul style={{ paddingLeft: "24px" }}>
          <li>Customer data access requests</li>
          <li>Customer data deletion requests</li>
          <li>Shop data erasure requests</li>
        </ul>
      </section>

      <section style={{ marginBottom: "28px" }}>
        <h2 style={{ fontSize: "20px", marginBottom: "8px" }}>
          8. Your Rights
        </h2>
        <p>You have the right to:</p>
        <ul style={{ paddingLeft: "24px" }}>
          <li>Access the data we store about your shop</li>
          <li>Request correction of inaccurate data</li>
          <li>Request deletion of your data</li>
          <li>Withdraw consent by uninstalling the app at any time</li>
        </ul>
      </section>

      <section style={{ marginBottom: "28px" }}>
        <h2 style={{ fontSize: "20px", marginBottom: "8px" }}>
          9. Changes to This Policy
        </h2>
        <p>
          We may update this privacy policy from time to time. Any changes will
          be reflected on this page with an updated revision date.
        </p>
      </section>

      <section style={{ marginBottom: "28px" }}>
        <h2 style={{ fontSize: "20px", marginBottom: "8px" }}>10. Contact</h2>
        <p>
          If you have any questions about this privacy policy or your data,
          please contact us at:{" "}
          <a href="mailto:support@shofeed.app" style={{ color: "#2c6ecb" }}>
            support@shofeed.app
          </a>
        </p>
      </section>

      <footer
        style={{
          marginTop: "40px",
          paddingTop: "20px",
          borderTop: "1px solid #e0e0e0",
          color: "#666",
          fontSize: "14px",
        }}
      >
        <p>&copy; {new Date().getFullYear()} ShoFeed. All rights reserved.</p>
      </footer>
    </div>
  );
}
