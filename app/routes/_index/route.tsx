import type { LoaderFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);

  if (url.searchParams.get("shop")) {
    throw redirect(`/app?${url.searchParams.toString()}`);
  }

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>ShoFeed - Product Feed Generator for Shopify</title>
  <meta name="description" content="Generate Google Shopping and Facebook Catalog XML feeds from your Shopify products. Easy setup, automatic sync." />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      color: #1a1a2e;
      background: #fafafa;
      -webkit-font-smoothing: antialiased;
    }

    /* Nav */
    nav {
      display: flex;
      align-items: center;
      justify-content: space-between;
      max-width: 1100px;
      margin: 0 auto;
      padding: 20px 24px;
    }
    .logo {
      font-size: 22px;
      font-weight: 700;
      color: #1a1a2e;
      text-decoration: none;
    }
    .logo span { color: #5c6ac4; }
    .nav-links { display: flex; gap: 24px; align-items: center; }
    .nav-links a {
      color: #555;
      text-decoration: none;
      font-size: 14px;
      font-weight: 500;
      transition: color 0.2s;
    }
    .nav-links a:hover { color: #1a1a2e; }

    /* Hero */
    .hero {
      text-align: center;
      padding: 80px 24px 60px;
      max-width: 800px;
      margin: 0 auto;
    }
    .badge {
      display: inline-block;
      background: #eef0ff;
      color: #5c6ac4;
      padding: 6px 16px;
      border-radius: 20px;
      font-size: 13px;
      font-weight: 600;
      margin-bottom: 24px;
    }
    .hero h1 {
      font-size: 48px;
      font-weight: 700;
      line-height: 1.15;
      margin-bottom: 20px;
      letter-spacing: -0.02em;
    }
    .hero h1 .highlight {
      background: linear-gradient(135deg, #5c6ac4, #7c3aed);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    .hero p {
      font-size: 18px;
      color: #666;
      line-height: 1.6;
      max-width: 560px;
      margin: 0 auto 36px;
    }
    .cta-group { display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; }
    .btn {
      display: inline-flex;
      align-items: center;
      padding: 14px 28px;
      border-radius: 10px;
      font-size: 15px;
      font-weight: 600;
      text-decoration: none;
      transition: all 0.2s;
    }
    .btn-primary {
      background: #5c6ac4;
      color: white;
      border: none;
    }
    .btn-primary:hover { background: #4959bd; transform: translateY(-1px); box-shadow: 0 4px 12px rgba(92,106,196,0.3); }
    .btn-secondary {
      background: white;
      color: #1a1a2e;
      border: 1px solid #e0e0e0;
    }
    .btn-secondary:hover { border-color: #5c6ac4; color: #5c6ac4; }

    /* Features */
    .features {
      max-width: 1100px;
      margin: 0 auto;
      padding: 60px 24px 80px;
    }
    .features-header {
      text-align: center;
      margin-bottom: 48px;
    }
    .features-header h2 {
      font-size: 32px;
      font-weight: 700;
      margin-bottom: 12px;
    }
    .features-header p { color: #666; font-size: 16px; }
    .features-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 24px;
    }
    .feature-card {
      background: white;
      border: 1px solid #eee;
      border-radius: 14px;
      padding: 32px 28px;
      transition: all 0.2s;
    }
    .feature-card:hover { border-color: #d0d5ff; box-shadow: 0 4px 20px rgba(92,106,196,0.08); }
    .feature-icon {
      width: 48px;
      height: 48px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 24px;
      margin-bottom: 20px;
    }
    .icon-google { background: #fef3e2; }
    .icon-facebook { background: #e8f0fe; }
    .icon-sync { background: #e6f9f0; }
    .icon-secure { background: #fce8ee; }
    .icon-dashboard { background: #f3e8ff; }
    .icon-fast { background: #fff8e1; }
    .feature-card h3 {
      font-size: 17px;
      font-weight: 600;
      margin-bottom: 8px;
    }
    .feature-card p {
      font-size: 14px;
      color: #666;
      line-height: 1.6;
    }

    /* How it works */
    .how-it-works {
      background: white;
      border-top: 1px solid #eee;
      border-bottom: 1px solid #eee;
      padding: 80px 24px;
    }
    .how-it-works-inner {
      max-width: 800px;
      margin: 0 auto;
      text-align: center;
    }
    .how-it-works h2 {
      font-size: 32px;
      font-weight: 700;
      margin-bottom: 48px;
    }
    .steps {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 40px;
      text-align: center;
    }
    .step-number {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: #5c6ac4;
      color: white;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-size: 16px;
      font-weight: 700;
      margin-bottom: 16px;
    }
    .steps h3 {
      font-size: 16px;
      font-weight: 600;
      margin-bottom: 8px;
    }
    .steps p {
      font-size: 14px;
      color: #666;
      line-height: 1.5;
    }

    /* CTA section */
    .cta-section {
      text-align: center;
      padding: 80px 24px;
      max-width: 600px;
      margin: 0 auto;
    }
    .cta-section h2 {
      font-size: 28px;
      font-weight: 700;
      margin-bottom: 16px;
    }
    .cta-section p {
      color: #666;
      margin-bottom: 32px;
      font-size: 16px;
    }

    /* Login form */
    .login-form {
      display: flex;
      gap: 10px;
      justify-content: center;
      max-width: 460px;
      margin: 0 auto;
    }
    .login-form input {
      flex: 1;
      padding: 12px 16px;
      border: 1px solid #ddd;
      border-radius: 10px;
      font-size: 14px;
      font-family: inherit;
      outline: none;
      transition: border-color 0.2s;
    }
    .login-form input:focus { border-color: #5c6ac4; }
    .login-form button {
      padding: 12px 24px;
      background: #5c6ac4;
      color: white;
      border: none;
      border-radius: 10px;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      font-family: inherit;
      transition: background 0.2s;
    }
    .login-form button:hover { background: #4959bd; }

    /* Footer */
    footer {
      border-top: 1px solid #eee;
      padding: 32px 24px;
      text-align: center;
      color: #999;
      font-size: 13px;
    }
    footer a { color: #666; text-decoration: none; }
    footer a:hover { color: #5c6ac4; }
    .footer-links { display: flex; gap: 24px; justify-content: center; margin-bottom: 12px; }

    /* Responsive */
    @media (max-width: 768px) {
      .hero h1 { font-size: 32px; }
      .features-grid { grid-template-columns: 1fr; }
      .steps { grid-template-columns: 1fr; gap: 24px; }
      .login-form { flex-direction: column; }
      .nav-links { gap: 16px; }
    }
  </style>
</head>
<body>

  <nav>
    <a href="/" class="logo">Sho<span>Feed</span></a>
    <div class="nav-links">
      <a href="#features">Features</a>
      <a href="#how-it-works">How It Works</a>
      <a href="/privacy-policy">Privacy</a>
    </div>
  </nav>

  <section class="hero">
    <div class="badge">Shopify App</div>
    <h1>Product Feeds<br />Made <span class="highlight">Simple</span></h1>
    <p>Generate optimized XML product feeds for Google Shopping and Facebook Catalog directly from your Shopify store. Set up in seconds.</p>
    <div class="cta-group">
      <a href="#get-started" class="btn btn-primary">Get Started Free</a>
      <a href="#features" class="btn btn-secondary">Learn More</a>
    </div>
  </section>

  <section class="features" id="features">
    <div class="features-header">
      <h2>Everything You Need</h2>
      <p>Powerful feed generation with zero complexity</p>
    </div>
    <div class="features-grid">
      <div class="feature-card">
        <div class="feature-icon icon-google">&#x1f6d2;</div>
        <h3>Google Shopping Feed</h3>
        <p>Generate RSS 2.0 compliant XML feeds optimized for Google Merchant Center with all required attributes.</p>
      </div>
      <div class="feature-card">
        <div class="feature-icon icon-facebook">&#x1f4f1;</div>
        <h3>Facebook Catalog</h3>
        <p>Create product feeds compatible with Facebook Commerce Manager and Instagram Shopping.</p>
      </div>
      <div class="feature-card">
        <div class="feature-icon icon-sync">&#x1f504;</div>
        <h3>Real-Time Sync</h3>
        <p>Feeds are generated on-demand from your live Shopify data. No stale products, no manual updates.</p>
      </div>
      <div class="feature-card">
        <div class="feature-icon icon-secure">&#x1f512;</div>
        <h3>Secure Token Access</h3>
        <p>Each feed URL is protected with a unique token. Regenerate anytime for full control over access.</p>
      </div>
      <div class="feature-card">
        <div class="feature-icon icon-dashboard">&#x2699;&#xfe0f;</div>
        <h3>Easy Dashboard</h3>
        <p>Manage feed settings, toggle feeds on/off, and copy URLs right from your Shopify admin panel.</p>
      </div>
      <div class="feature-card">
        <div class="feature-icon icon-fast">&#x26a1;</div>
        <h3>Variant Support</h3>
        <p>All product variants included with proper pricing, SKU, barcode, and availability data.</p>
      </div>
    </div>
  </section>

  <section class="how-it-works" id="how-it-works">
    <div class="how-it-works-inner">
      <h2>How It Works</h2>
      <div class="steps">
        <div>
          <div class="step-number">1</div>
          <h3>Install the App</h3>
          <p>Add ShoFeed to your Shopify store with one click. No coding required.</p>
        </div>
        <div>
          <div class="step-number">2</div>
          <h3>Configure Settings</h3>
          <p>Set your currency, product condition, and toggle Google or Facebook feeds.</p>
        </div>
        <div>
          <div class="step-number">3</div>
          <h3>Copy Feed URL</h3>
          <p>Paste your feed URL into Google Merchant Center or Facebook Commerce Manager.</p>
        </div>
      </div>
    </div>
  </section>

  <section class="cta-section" id="get-started">
    <h2>Ready to Start?</h2>
    <p>Enter your Shopify store domain to get started</p>
    <form class="login-form" method="post" action="/auth/login">
      <input type="text" name="shop" placeholder="your-store.myshopify.com" required />
      <button type="submit">Install</button>
    </form>
  </section>

  <footer>
    <div class="footer-links">
      <a href="/privacy-policy">Privacy Policy</a>
      <a href="mailto:support@shofeed.app">Contact</a>
    </div>
    <p>&copy; ${new Date().getFullYear()} ShoFeed. All rights reserved.</p>
  </footer>

</body>
</html>`;

  return new Response(html, {
    status: 200,
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
};
