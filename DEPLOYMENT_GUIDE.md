# 🚀 Headless Shopify Deployment Guide: Anurpan Jewellery

This guide outlines the steps to connect your custom frontend to a new Shopify store, host it on **Vercel**, and manage your domain through **Hostinger**.

---

## 1. Shopify Backend Configuration
You need to authorize your frontend to fetch products from your new Shopify store.

### Create a Storefront App
1. Go to **Shopify Admin** > **Settings** > **Apps and sales channels**.
2. Click **Develop apps** > **Create an app**. Name it "Anurpan Headless".
3. Click **Configure Storefront API scopes**.
4. **Select ALL "Read" scopes** (Products, Collections, etc.).
5. Click **Install app** and copy the **Storefront API access token**.

### Configure Checkout Domain (Optional but Recommended)
To keep the branding consistent during checkout:
1. Go to **Settings** > **Domains** > **Connect existing domain**.
2. Add `checkout.anurpanjewellery.com`.
3. In **Hostinger**, add a CNAME record:
   - **Type**: `CNAME` | **Name**: `checkout` | **Value**: `shops.myshopify.com`

---

## 2. Vercel Hosting Setup
Vercel will build and host your React/Vite application.

### Step 1: Connect Repository
1. Log in to [Vercel](https://vercel.com) and click **Add New** > **Project**.
2. Import your GitHub repository.

### Step 2: Environment Variables
Add these variables in **Project Settings** > **Environment Variables**:
- `VITE_SHOPIFY_STORE_DOMAIN`: `your-new-store.myshopify.com`
- `VITE_SHOPIFY_STOREFRONT_TOKEN`: `[Your Storefront Access Token]`
- `VITE_SHOPIFY_API_VERSION`: `2025-07`

### Step 3: Deployment
1. Set **Build Command** to `npm run build`.
2. Set **Output Directory** to `dist`.
3. Click **Deploy**.

---

## 3. Hostinger DNS Settings
Point your domain `anurpanjewellery.com` to Vercel.

| Type | Name | Value | TTL |
| :--- | :--- | :--- | :--- |
| **A** | `@` | `76.76.21.21` | Default |
| **CNAME** | `www` | `cname.vercel-dns.com` | Default |

*Note: DNS propagation can take up to 24 hours but usually happens in minutes.*

---

## 4. Post-Checkout Redirect (The "Continue Shopping" Fix)
Since the frontend is on Vercel, the "Continue Shopping" button in Shopify might lead back to an empty Shopify theme.

1. In Shopify Admin, go to **Online Store** > **Themes** > **Edit Code**.
2. Open `layout/theme.liquid`.
3. Add this snippet inside the `<head>` section:

```html
<script>
  // Redirect visitors from the Shopify store back to your headless site
  if (window.location.pathname === '/') {
    window.location.href = 'https://www.anurpanjewellery.com';
  }
</script>
```

---

## 5. Local Development & Hostinger Build
Update your local `.env` file and prepare the build for Hostinger.

### Environment Setup
Use these variables in your root `.env` file:
```env
VITE_SHOPIFY_STORE_DOMAIN=8ufyb9-zv.myshopify.com
VITE_SHOPIFY_STOREFRONT_TOKEN=f970a97aa77456090ed1fe820aa0bed9
VITE_SHOPIFY_API_VERSION=2025-07

VITE_CUSTOMER_AUTH_CLIENT_ID=f4f93ef5-ce8a-426c-8f8d-557a15ac8fc0
VITE_CUSTOMER_AUTH_AUTH_URL=https://shopify.com/authentication/96798048623/oauth/authorize
VITE_CUSTOMER_AUTH_TOKEN_URL=https://shopify.com/authentication/96798048623/oauth/token
VITE_CUSTOMER_AUTH_LOGOUT_URL=https://shopify.com/authentication/96798048623/logout
VITE_CUSTOMER_AUTH_REDIRECT_URI=https://www.anurpanjewellery.com/auth/callback
```

### Build and Upload
1. Run `npm run build`.
2. Go to **Hostinger File Manager** > `public_html`.
3. Upload the **contents** of the local `dist/` folder (including the `.htaccess` file) into `public_html`.

---

**Generated on:** 2026-04-15  
**Domain:** [www.anurpanjewellery.com](https://www.anurpanjewellery.com)
