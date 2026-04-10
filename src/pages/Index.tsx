import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { HeroCarousel } from '@/components/HeroCarousel';
import { CategoriesSection } from '@/components/CategoriesSection';
import { ProductRow } from '@/components/ProductRow';
import { PromoBanner } from '@/components/PromoBanner';
import { FeaturesMarquee } from '@/components/FeaturesMarquee';
import { useProducts } from '@/hooks/useProducts';
import { Loader2 } from 'lucide-react';

const Index = () => {
  const { data: products, isLoading } = useProducts();

  const hasTag = (p: any, tag: string) =>
    (p?.node?.tags || []).some((t: string) => t?.toLowerCase() === tag.toLowerCase());

  const bestSellers =
    products?.filter((p) => hasTag(p, 'Best Sellers')).slice(0, 10) || [];
  const newArrivals =
    products?.filter((p) => hasTag(p, 'New Arrivals')).slice(0, 10) || [];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1">
        <HeroCarousel />
        <CategoriesSection />

        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : products && products.length > 0 ? (
          <>
            <ProductRow title="Best Sellers" products={bestSellers} viewMoreLink="/products" />
            <PromoBanner />
            <ProductRow title="New Arrivals" products={newArrivals} viewMoreLink="/products" />
          </>
        ) : (
          <section className="py-20 text-center">
            <div className="container mx-auto px-4">
              <h2 className="font-display text-2xl font-bold text-foreground mb-4">No Products Yet</h2>
              <p className="text-muted-foreground max-w-md mx-auto">
                Products will appear here once they're added to the store. Tell us what products you'd like to sell!
              </p>
            </div>
          </section>
        )}

        <FeaturesMarquee />
      </main>

      <Footer />
    </div>
  );
};

export default Index;
