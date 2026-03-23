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
  <meta name="description" content="Generate Google Shopping and Facebook Catalog XML feeds from your Shopify products in seconds." />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
  <style>
    :root {
      --bg: #09090b;
      --surface: #18181b;
      --surface-hover: #1f1f23;
      --border: #27272a;
      --border-light: #3f3f46;
      --text: #fafafa;
      --text-muted: #a1a1aa;
      --text-dim: #71717a;
      --accent: #818cf8;
      --accent-bright: #a5b4fc;
      --accent-glow: rgba(129, 140, 248, 0.15);
      --green: #34d399;
      --blue: #60a5fa;
      --orange: #fb923c;
    }
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html { scroll-behavior: smooth; }
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      background: var(--bg);
      color: var(--text);
      -webkit-font-smoothing: antialiased;
      overflow-x: hidden;
    }

    /* Glow background */
    .glow-bg {
      position: fixed;
      top: -40%;
      left: 50%;
      transform: translateX(-50%);
      width: 800px;
      height: 600px;
      background: radial-gradient(ellipse, rgba(129,140,248,0.08) 0%, transparent 70%);
      pointer-events: none;
      z-index: 0;
    }

    /* Nav */
    nav {
      position: sticky;
      top: 0;
      z-index: 100;
      backdrop-filter: blur(16px);
      background: rgba(9,9,11,0.8);
      border-bottom: 1px solid var(--border);
    }
    .nav-inner {
      display: flex;
      align-items: center;
      justify-content: space-between;
      max-width: 1100px;
      margin: 0 auto;
      padding: 16px 24px;
    }
    .logo {
      font-size: 20px;
      font-weight: 700;
      color: var(--text);
      text-decoration: none;
      letter-spacing: -0.02em;
    }
    .logo span { color: var(--accent); }
    .nav-links { display: flex; gap: 32px; align-items: center; }
    .nav-links a {
      color: var(--text-muted);
      text-decoration: none;
      font-size: 13px;
      font-weight: 500;
      letter-spacing: 0.01em;
      transition: color 0.2s;
    }
    .nav-links a:hover { color: var(--text); }
    .nav-cta {
      background: var(--accent) !important;
      color: var(--bg) !important;
      padding: 8px 18px;
      border-radius: 8px;
      font-weight: 600 !important;
      font-size: 13px !important;
      transition: all 0.2s !important;
    }
    .nav-cta:hover { opacity: 0.9; transform: translateY(-1px); }

    /* Hero */
    .hero {
      position: relative;
      z-index: 1;
      text-align: center;
      padding: 100px 24px 80px;
      max-width: 820px;
      margin: 0 auto;
    }
    .pill {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      background: var(--accent-glow);
      border: 1px solid rgba(129,140,248,0.2);
      color: var(--accent-bright);
      padding: 7px 18px;
      border-radius: 100px;
      font-size: 12px;
      font-weight: 600;
      letter-spacing: 0.03em;
      text-transform: uppercase;
      margin-bottom: 32px;
    }
    .pill-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: var(--green);
      animation: pulse 2s infinite;
    }
    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.4; }
    }
    .hero h1 {
      font-size: 56px;
      font-weight: 800;
      line-height: 1.08;
      letter-spacing: -0.035em;
      margin-bottom: 24px;
    }
    .hero h1 .gradient {
      background: linear-gradient(135deg, var(--accent) 0%, #c084fc 50%, var(--accent-bright) 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    .hero-sub {
      font-size: 17px;
      color: var(--text-muted);
      line-height: 1.7;
      max-width: 520px;
      margin: 0 auto 44px;
      font-weight: 400;
    }
    .hero-actions { display: flex; gap: 14px; justify-content: center; flex-wrap: wrap; }
    .btn {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 14px 28px;
      border-radius: 12px;
      font-size: 14px;
      font-weight: 600;
      text-decoration: none;
      transition: all 0.25s;
      border: none;
      cursor: pointer;
      font-family: inherit;
    }
    .btn-glow {
      background: var(--accent);
      color: white;
      box-shadow: 0 0 20px rgba(129,140,248,0.3), inset 0 1px 0 rgba(255,255,255,0.1);
    }
    .btn-glow:hover { transform: translateY(-2px); box-shadow: 0 0 30px rgba(129,140,248,0.5), inset 0 1px 0 rgba(255,255,255,0.1); }
    .btn-ghost {
      background: transparent;
      color: var(--text-muted);
      border: 1px solid var(--border);
    }
    .btn-ghost:hover { border-color: var(--border-light); color: var(--text); background: var(--surface); }
    .btn-arrow { transition: transform 0.2s; }
    .btn:hover .btn-arrow { transform: translateX(3px); }

    /* Trusted by */
    .social-proof {
      text-align: center;
      padding: 40px 24px;
      position: relative;
      z-index: 1;
    }
    .social-proof p {
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      color: var(--text-dim);
      font-weight: 500;
    }
    .platforms {
      display: flex;
      gap: 40px;
      justify-content: center;
      align-items: center;
      margin-top: 20px;
      opacity: 0.4;
    }
    .platforms span {
      font-size: 15px;
      font-weight: 600;
      color: var(--text-muted);
      letter-spacing: -0.01em;
    }

    /* Bento grid */
    .bento {
      max-width: 1100px;
      margin: 0 auto;
      padding: 40px 24px 100px;
      position: relative;
      z-index: 1;
    }
    .bento-label {
      text-align: center;
      margin-bottom: 48px;
    }
    .bento-label h2 {
      font-size: 36px;
      font-weight: 800;
      letter-spacing: -0.03em;
      margin-bottom: 12px;
    }
    .bento-label p { color: var(--text-muted); font-size: 16px; }
    .bento-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      grid-template-rows: auto auto;
      gap: 16px;
    }
    .bento-card {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 16px;
      padding: 32px;
      transition: all 0.3s;
      position: relative;
      overflow: hidden;
    }
    .bento-card:hover {
      border-color: var(--border-light);
      background: var(--surface-hover);
    }
    .bento-card.wide { grid-column: span 2; }
    .bento-card .icon {
      width: 44px;
      height: 44px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
      margin-bottom: 20px;
    }
    .bento-card h3 {
      font-size: 16px;
      font-weight: 600;
      margin-bottom: 8px;
      letter-spacing: -0.01em;
    }
    .bento-card p {
      font-size: 14px;
      color: var(--text-muted);
      line-height: 1.6;
    }
    .icon-purple { background: rgba(129,140,248,0.12); }
    .icon-green { background: rgba(52,211,153,0.12); }
    .icon-blue { background: rgba(96,165,250,0.12); }
    .icon-orange { background: rgba(251,146,60,0.12); }
    .icon-pink { background: rgba(244,114,182,0.12); }

    /* Code preview */
    .code-preview {
      margin-top: 20px;
      background: var(--bg);
      border: 1px solid var(--border);
      border-radius: 10px;
      padding: 16px;
      font-family: 'SF Mono', 'Fira Code', monospace;
      font-size: 11px;
      color: var(--text-dim);
      overflow-x: auto;
      line-height: 1.6;
    }
    .code-preview .tag { color: var(--accent); }
    .code-preview .attr { color: var(--orange); }
    .code-preview .val { color: var(--green); }

    /* Steps */
    .steps-section {
      border-top: 1px solid var(--border);
      padding: 100px 24px;
      position: relative;
      z-index: 1;
    }
    .steps-inner {
      max-width: 900px;
      margin: 0 auto;
    }
    .steps-header {
      text-align: center;
      margin-bottom: 64px;
    }
    .steps-header h2 {
      font-size: 36px;
      font-weight: 800;
      letter-spacing: -0.03em;
      margin-bottom: 12px;
    }
    .steps-header p { color: var(--text-muted); font-size: 16px; }
    .steps-list {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 32px;
    }
    .step-item {
      text-align: center;
      position: relative;
    }
    .step-num {
      width: 48px;
      height: 48px;
      border-radius: 14px;
      background: var(--surface);
      border: 1px solid var(--border);
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-size: 18px;
      font-weight: 700;
      color: var(--accent);
      margin-bottom: 20px;
    }
    .step-item h3 {
      font-size: 15px;
      font-weight: 600;
      margin-bottom: 8px;
    }
    .step-item p {
      font-size: 13px;
      color: var(--text-muted);
      line-height: 1.6;
    }
    .step-connector {
      position: absolute;
      top: 24px;
      right: -16px;
      width: 32px;
      height: 1px;
      background: var(--border);
    }

    /* CTA */
    .final-cta {
      border-top: 1px solid var(--border);
      text-align: center;
      padding: 100px 24px;
      position: relative;
      z-index: 1;
    }
    .final-cta h2 {
      font-size: 40px;
      font-weight: 800;
      letter-spacing: -0.03em;
      margin-bottom: 16px;
    }
    .final-cta h2 .gradient {
      background: linear-gradient(135deg, var(--accent) 0%, #c084fc 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    .final-cta > p {
      color: var(--text-muted);
      font-size: 16px;
      margin-bottom: 40px;
    }
    .install-form {
      display: flex;
      gap: 10px;
      max-width: 440px;
      margin: 0 auto;
    }
    .install-form input {
      flex: 1;
      padding: 14px 18px;
      border: 1px solid var(--border);
      border-radius: 12px;
      background: var(--surface);
      color: var(--text);
      font-size: 14px;
      font-family: inherit;
      outline: none;
      transition: border-color 0.2s;
    }
    .install-form input::placeholder { color: var(--text-dim); }
    .install-form input:focus { border-color: var(--accent); }
    .install-form button {
      padding: 14px 28px;
      background: var(--accent);
      color: white;
      border: none;
      border-radius: 12px;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      font-family: inherit;
      transition: all 0.2s;
      white-space: nowrap;
    }
    .install-form button:hover { opacity: 0.9; transform: translateY(-1px); }
    .form-note {
      margin-top: 14px;
      font-size: 12px;
      color: var(--text-dim);
    }

    /* Footer */
    footer {
      border-top: 1px solid var(--border);
      padding: 32px 24px;
      position: relative;
      z-index: 1;
    }
    .footer-inner {
      max-width: 1100px;
      margin: 0 auto;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .footer-left { font-size: 12px; color: var(--text-dim); }
    .footer-links { display: flex; gap: 24px; }
    .footer-links a {
      font-size: 12px;
      color: var(--text-dim);
      text-decoration: none;
      transition: color 0.2s;
    }
    .footer-links a:hover { color: var(--text-muted); }

    /* Responsive */
    @media (max-width: 768px) {
      .hero { padding: 60px 20px 40px; }
      .hero h1 { font-size: 36px; }
      .bento-grid { grid-template-columns: 1fr; }
      .bento-card.wide { grid-column: span 1; }
      .steps-list { grid-template-columns: 1fr; gap: 24px; }
      .step-connector { display: none; }
      .install-form { flex-direction: column; }
      .nav-links { gap: 16px; }
      .footer-inner { flex-direction: column; gap: 16px; }
      .final-cta h2 { font-size: 28px; }
      .platforms { gap: 24px; }
    }
  </style>
</head>
<body>

  <div class="glow-bg"></div>

  <nav>
    <div class="nav-inner">
      <a href="/" class="logo">sho<span>feed</span></a>
      <div class="nav-links">
        <a href="#features">Features</a>
        <a href="#how-it-works">How It Works</a>
        <a href="/privacy-policy">Privacy</a>
        <a href="#get-started" class="nav-cta">Get Started</a>
      </div>
    </div>
  </nav>

  <section class="hero">
    <div class="pill"><span class="pill-dot"></span> Now available on Shopify</div>
    <h1>Your products.<br /><span class="gradient">Every platform.</span></h1>
    <p class="hero-sub">Generate optimized XML product feeds for Google Shopping and Facebook Catalog. One install, zero maintenance.</p>
    <div class="hero-actions">
      <a href="#get-started" class="btn btn-glow">Start Free <span class="btn-arrow">&rarr;</span></a>
      <a href="#features" class="btn btn-ghost">See Features</a>
    </div>
  </section>

  <section class="social-proof">
    <p>Works with</p>
    <div class="platforms">
      <span>Google Shopping</span>
      <span>&bull;</span>
      <span>Facebook Catalog</span>
      <span>&bull;</span>
      <span>Instagram Shopping</span>
      <span>&bull;</span>
      <span>Meta Commerce</span>
    </div>
  </section>

  <section class="bento" id="features">
    <div class="bento-label">
      <h2>Built for merchants</h2>
      <p>Everything you need, nothing you don't</p>
    </div>
    <div class="bento-grid">

      <div class="bento-card wide">
        <div class="icon icon-purple">
          <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" style="color:var(--accent)"><path d="M4 6h16M4 12h16M4 18h7"/></svg>
        </div>
        <h3>Google Shopping Feed</h3>
        <p>RSS 2.0 compliant XML with all required g: namespace attributes. Prices, availability, images, variants, GTINs, and more.</p>
        <div class="code-preview">
          <span class="tag">&lt;item&gt;</span><br/>
          &nbsp;&nbsp;<span class="tag">&lt;g:id&gt;</span><span class="val">12345</span><span class="tag">&lt;/g:id&gt;</span><br/>
          &nbsp;&nbsp;<span class="tag">&lt;g:title&gt;</span><span class="val">Premium T-Shirt - Black / L</span><span class="tag">&lt;/g:title&gt;</span><br/>
          &nbsp;&nbsp;<span class="tag">&lt;g:price&gt;</span><span class="val">29.99 USD</span><span class="tag">&lt;/g:price&gt;</span><br/>
          &nbsp;&nbsp;<span class="tag">&lt;g:availability&gt;</span><span class="val">in stock</span><span class="tag">&lt;/g:availability&gt;</span><br/>
          <span class="tag">&lt;/item&gt;</span>
        </div>
      </div>

      <div class="bento-card">
        <div class="icon icon-blue">
          <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" style="color:var(--blue)"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
        </div>
        <h3>Facebook &amp; Meta</h3>
        <p>Compatible with Facebook Commerce Manager, Instagram Shopping, and Meta Catalog with inventory data.</p>
      </div>

      <div class="bento-card">
        <div class="icon icon-green">
          <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" style="color:var(--green)"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
        </div>
        <h3>Real-Time Data</h3>
        <p>Feeds pull directly from your live Shopify store. Always fresh, always accurate. No cron jobs needed.</p>
      </div>

      <div class="bento-card">
        <div class="icon icon-orange">
          <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" style="color:var(--orange)"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
        </div>
        <h3>Token Security</h3>
        <p>Unique token per store. Regenerate anytime. Only authorized platforms can access your feed data.</p>
      </div>

      <div class="bento-card wide">
        <div class="icon icon-pink">
          <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" style="color:#f472b6"><path d="M12 20V10M18 20V4M6 20v-4"/></svg>
        </div>
        <h3>Dashboard Inside Shopify</h3>
        <p>Manage everything from your Shopify admin. Toggle feeds, configure currency, set product conditions, and copy feed URLs with one click. No external dashboards.</p>
      </div>

    </div>
  </section>

  <section class="steps-section" id="how-it-works">
    <div class="steps-inner">
      <div class="steps-header">
        <h2>Three steps. That's it.</h2>
        <p>Get your feeds running in under a minute</p>
      </div>
      <div class="steps-list">
        <div class="step-item">
          <div class="step-num">1</div>
          <div class="step-connector"></div>
          <h3>Install</h3>
          <p>Add ShoFeed to your Shopify store. One click, no configuration needed.</p>
        </div>
        <div class="step-item">
          <div class="step-num">2</div>
          <div class="step-connector"></div>
          <h3>Configure</h3>
          <p>Set your currency, product condition, and choose which feeds to enable.</p>
        </div>
        <div class="step-item">
          <div class="step-num">3</div>
          <h3>Connect</h3>
          <p>Copy your feed URL and paste it into Google Merchant Center or Facebook.</p>
        </div>
      </div>
    </div>
  </section>

  <section class="final-cta" id="get-started">
    <h2>Ready to <span class="gradient">go live?</span></h2>
    <p>Enter your Shopify store domain to install ShoFeed</p>
    <form class="install-form" method="post" action="/auth/login">
      <input type="text" name="shop" placeholder="your-store.myshopify.com" required />
      <button type="submit">Install Free</button>
    </form>
    <p class="form-note">Free to use. No credit card required.</p>
  </section>

  <footer>
    <div class="footer-inner">
      <span class="footer-left">&copy; ${new Date().getFullYear()} ShoFeed</span>
      <div class="footer-links">
        <a href="/privacy-policy">Privacy Policy</a>
        <a href="mailto:support@shofeed.app">Contact</a>
      </div>
    </div>
  </footer>

</body>
</html>`;

  return new Response(html, {
    status: 200,
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
};
