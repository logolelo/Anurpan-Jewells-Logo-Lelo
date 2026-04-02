

# Anurpan — Jewellery E-Commerce Store

## Brand & Design
- **Color theme**: Primary `#4C020F` (deep magenta/maroon) with complementary gold `#D4AF37` accents
- **Style**: Modern, elegant, lush — rounded edges on all images/buttons/cards, smooth transitions
- **Typography**: Elegant serif for headings (Playfair Display), clean sans-serif for body
- **Fully responsive**: Mobile, tablet, laptop, desktop breakpoints

## Pages & Features

### 1. Home Page
- **Navigation bar**: Logo "Anurpan" on left, mega menu with two main categories (Silver 925 & Imitation) each containing subcategories (Earrings, Rings, Necklace, Chains, Pendant, Mangalsutra, Bracelets, Nose Pin, Charms), Curated Collections dropdown (Everyday Essentials, Office Wear, Festive Edition, Party Wear, Wedding Essentials, Gifting), search bar, cart icon with badge
- **Hero banner**: Auto-sliding carousel supporting up to 5 image/video slides with CTA buttons
- **Categories section**: Clickable circular/rounded category buttons linking to filtered product pages
- **Best Sellers**: Horizontally scrollable product cards with "View More" button
- **Promotional banner**: Full-width rounded image with collection/product CTA button
- **New Arrivals**: Horizontally scrollable product cards with "View More" button
- **Features strip**: Auto-sliding marquee with: Exclusive Designs, Pair with Indian or Western, 100% Payment Secure, Free Shipping, 7 Days Return Policy, Happy Customers
- **Footer**: Brand info, quick links, social media, contact

### 2. Product Listing Pages
- Category-based filtering (Silver 925 / Imitation + subcategories)
- Collection-based pages for curated collections
- Grid layout with product cards showing image, name, price, discount badge

### 3. Product Detail Page (`/product/[handle]`)
- Image gallery with multiple variation images (scrollable thumbnails)
- Product title, category/type tags, discount tag
- Stock availability indicator
- Price display with original/discounted pricing
- Quantity selector
- Tabbed description (Product Details, Refund Policy, Delivery Info)
- "Similar Products" scrollable section with View More

### 4. Cart & Checkout
- Slide-out cart drawer with quantity controls
- Real Shopify Storefront API checkout (opens in new tab)
- Cart sync on page visibility changes

### 5. Technical Setup
- Shopify Storefront API integration for real products
- Zustand cart state management with localStorage persistence
- SEO: semantic HTML, meta tags, Open Graph, structured data
- All products loaded from Shopify API (no mock data)

