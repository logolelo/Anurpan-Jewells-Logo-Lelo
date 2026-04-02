# Shopify Headless Store — Setup Guide

This project is a **reusable headless Shopify storefront theme**. Connect it to any Shopify store by setting the environment variables below.

---

## Required Environment Variables

Create a `.env` file (or set these in your hosting platform like Vercel/Netlify):

### 1. Storefront API (Products, Cart, Checkout)

| Variable | Example | Where to find |
|---|---|---|
| `VITE_SHOPIFY_STORE_DOMAIN` | `your-store.myshopify.com` | Shopify Admin → Settings → Domains |
| `VITE_SHOPIFY_STOREFRONT_TOKEN` | `abc123def456...` | Shopify Admin → Settings → Apps → Develop apps → Storefront API |
| `VITE_SHOPIFY_API_VERSION` | `2025-07` | Optional, defaults to `2025-07` |

**How to get Storefront API token:**
1. Go to Shopify Admin → Settings → Apps and sales channels → Develop apps
2. Click "Create an app" → Name it anything
3. Configure Storefront API scopes: enable `unauthenticated_read_product_listings`, `unauthenticated_write_checkouts`, `unauthenticated_read_checkouts`
4. Install the app → Copy the **Storefront API access token** (public token, safe for frontend)

### 2. Customer Account API (Login, Orders, Addresses)

| Variable | Example | Where to find |
|---|---|---|
| `VITE_CUSTOMER_AUTH_CLIENT_ID` | `67c47783-b6e6-...` | Shopify Admin → Settings → Customer accounts → Customer Account API |
| `VITE_CUSTOMER_AUTH_AUTH_URL` | `https://shopify.com/authentication/<SHOP_ID>/oauth/authorize` | Same page, "Authorization endpoint" |
| `VITE_CUSTOMER_AUTH_TOKEN_URL` | `https://shopify.com/authentication/<SHOP_ID>/oauth/token` | Same page, "Token endpoint" |
| `VITE_CUSTOMER_AUTH_LOGOUT_URL` | `https://shopify.com/authentication/<SHOP_ID>/logout` | Same page, "Logout endpoint" |
| `VITE_CUSTOMER_AUTH_REDIRECT_URI` | `https://your-domain.com/auth/callback` | Your deployed site URL + `/auth/callback` |
| `VITE_CUSTOMER_AUTH_SCOPES` | `openid email customer-account-api:full` | Optional, defaults to `openid email customer-account-api:full` |

**How to get Customer Account API credentials:**
1. Go to Shopify Admin → Settings → Customer accounts
2. Enable "Customer Account API" (new customer accounts)
3. Copy the **Client ID** and the three **endpoints** (authorize, token, logout)
4. Under **Callback URI(s)**, add your deployed domain + `/auth/callback`
5. Under **JavaScript origin(s)**, add your deployed domain (no trailing slash)

### 3. Server-side Token Exchange (Vercel)

The `api/token.js` serverless function handles the OAuth token exchange. It reads:

| Variable | Where to set |
|---|---|
| `VITE_CUSTOMER_AUTH_TOKEN_URL` | Vercel Environment Variables (same value as above) |

### 4. Reviews (Lovable Cloud / Supabase)

Reviews are stored in Supabase. The following are auto-configured by Lovable Cloud:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`

If self-hosting, set these to your own Supabase project credentials.

---

## Shopify Store Requirements

Your Shopify store needs:

1. **Storefront API access** — Create a custom app with Storefront API permissions
2. **Customer Account API enabled** — Settings → Customer accounts → enable new customer accounts
3. **Required Customer Account API permissions:**
   - `customer_read_customers`
   - `customer_read_orders`
   - `customer_read_draft_orders`

---

## Callback URIs to Configure in Shopify

Add **all domains** where the app will run:

**Callback URI(s):**
```
https://your-domain.com/auth/callback
```

**JavaScript origin(s):**
```
https://your-domain.com
```

If using Lovable preview, also add:
```
https://preview--your-project.lovable.app/auth/callback
https://your-project-id.lovableproject.com/auth/callback
```

---

## Example `.env` File

```env
VITE_SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
VITE_SHOPIFY_STOREFRONT_TOKEN=your_storefront_public_token
VITE_SHOPIFY_API_VERSION=2025-07

VITE_CUSTOMER_AUTH_CLIENT_ID=your-client-id
VITE_CUSTOMER_AUTH_AUTH_URL=https://shopify.com/authentication/YOUR_SHOP_ID/oauth/authorize
VITE_CUSTOMER_AUTH_TOKEN_URL=https://shopify.com/authentication/YOUR_SHOP_ID/oauth/token
VITE_CUSTOMER_AUTH_LOGOUT_URL=https://shopify.com/authentication/YOUR_SHOP_ID/logout
VITE_CUSTOMER_AUTH_REDIRECT_URI=https://your-domain.com/auth/callback
```

---

## Customization

- **Categories & Collections**: Edit `src/lib/constants.ts` to match your store's product types
- **Branding**: Update colors in `src/index.css` and `tailwind.config.ts`
- **Hero Carousel**: Edit `src/components/HeroCarousel.tsx`
- **Footer**: Edit `src/components/Footer.tsx`
