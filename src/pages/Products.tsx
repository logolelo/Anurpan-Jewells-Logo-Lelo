import { useSearchParams, Link } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { ProductCard } from '@/components/ProductCard';
import { useProducts } from '@/hooks/useProducts';
import { Loader2 } from 'lucide-react';
import { CATEGORIES, type MainCategory } from '@/lib/constants';

const Products = () => {
  const [searchParams] = useSearchParams();
  const category = searchParams.get('category');
  const sub = searchParams.get('sub');
  const collection = searchParams.get('collection');
  const q = searchParams.get('q');

  // Build a Shopify search query from filters
  let shopifyQuery = '';
  if (q) shopifyQuery = q;
  else if (category && sub) shopifyQuery = `product_type:${sub} tag:${category}`;
  else if (category) shopifyQuery = `tag:${category}`;
  else if (sub) shopifyQuery = `product_type:${sub}`;
  else if (collection) shopifyQuery = `tag:${collection}`;

  const { data: products, isLoading } = useProducts(shopifyQuery || undefined);

  const title = collection || (category && sub ? `${category} — ${sub}` : category || sub || (q ? `Search: "${q}"` : 'All Products'));

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8 lg:py-12">
          {/* Breadcrumb */}
          <nav className="text-sm text-muted-foreground mb-6">
            <Link to="/" className="hover:text-primary transition-colors">Home</Link>
            <span className="mx-2">/</span>
            <span className="text-foreground">{title}</span>
          </nav>

          <h1 className="font-display text-3xl lg:text-4xl font-bold text-foreground mb-8">{title}</h1>

          {/* Subcategory filters if a main category is selected */}
          {category && (
            <div className="flex flex-wrap gap-2 mb-8">
              <Link to={`/products?category=${encodeURIComponent(category)}`}>
                <span className={`inline-block px-4 py-1.5 rounded-full text-sm border transition-all ${!sub ? 'bg-primary text-primary-foreground border-primary' : 'border-border text-foreground hover:border-primary'}`}>
                  All
                </span>
              </Link>
              {CATEGORIES[category as MainCategory]?.map((s) => (
                <Link key={s} to={`/products?category=${encodeURIComponent(category)}&sub=${encodeURIComponent(s)}`}>
                  <span className={`inline-block px-4 py-1.5 rounded-full text-sm border transition-all ${sub === s ? 'bg-primary text-primary-foreground border-primary' : 'border-border text-foreground hover:border-primary'}`}>
                    {s}
                  </span>
                </Link>
              ))}
            </div>
          )}

          {isLoading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : products && products.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
              {products.map((product) => (
                <ProductCard key={product.node.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <h2 className="font-display text-xl font-semibold text-foreground mb-2">No products found</h2>
              <p className="text-muted-foreground">Try adjusting your filters or check back later.</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Products;
