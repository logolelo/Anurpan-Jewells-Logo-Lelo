import { useState } from 'react';
import { Link } from 'react-router-dom';
import { CATEGORIES, type MainCategory } from '@/lib/constants';
import { useProducts } from '@/hooks/useProducts';
import { Loader2, Sparkles } from 'lucide-react';
import { ProductRow } from '@/components/ProductRow';

export function CategoriesSection() {
  const [selectedCategory, setSelectedCategory] = useState<MainCategory>('Silver 925');
  const [selectedSub, setSelectedSub] = useState<string | null>(null);
  const subcategories = CATEGORIES[selectedCategory];
  const shopifyQuery =
    selectedCategory && selectedSub
      ? `product_type:${selectedSub} tag:${selectedCategory}`
      : undefined;
  const { data: previewProducts = [], isLoading: isPreviewLoading } = useProducts(shopifyQuery, 12);

  return (
    <section className="py-10 lg:py-16">
      <div className="container mx-auto px-4">
        <h2 className="font-display text-2xl lg:text-3xl font-bold text-center text-foreground mb-8">Shop by Category</h2>
        <div className="flex justify-center gap-3 mb-8">
          {(Object.keys(CATEGORIES) as MainCategory[]).map((cat) => {
            const active = cat === selectedCategory;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`inline-flex items-center justify-center gap-2 whitespace-nowrap px-6 py-2 rounded-full text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
                  active
                    ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                    : 'border border-input bg-background text-foreground hover:bg-accent hover:text-accent-foreground'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
        <div className="-mx-4">
          <div className="flex flex-nowrap gap-2 lg:gap-3 overflow-x-auto scrollbar-hide px-4 snap-x snap-mandatory lg:justify-center">
            {subcategories.map((sub) => {
              const active = selectedSub === sub;
              return (
                <button
                  key={sub}
                  onClick={() => setSelectedSub(sub)}
                  className={`shrink-0 snap-start inline-flex items-center justify-center gap-2 whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
                    active
                      ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                      : 'border border-input bg-background text-foreground hover:bg-accent hover:text-accent-foreground'
                  }`}
                >
                  {sub}
                </button>
              );
            })}
          </div>
        </div>
        {selectedSub && (
          <div className="mt-10">
            {isPreviewLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            ) : previewProducts.length > 0 ? (
              <ProductRow
                title={`${selectedCategory} — ${selectedSub}`}
                products={previewProducts.slice(0, 12)}
                viewMoreLink={`/products?category=${encodeURIComponent(selectedCategory)}&sub=${encodeURIComponent(selectedSub)}`}
              />
            ) : (
              <div className="py-6">
                <div className="flex items-end justify-between mb-4">
                  <h3 className="font-display text-xl lg:text-2xl font-bold text-foreground">
                    {selectedCategory} — {selectedSub}
                  </h3>
                  <Link
                    to={`/products?category=${encodeURIComponent(selectedCategory)}&sub=${encodeURIComponent(selectedSub)}`}
                    className="text-primary font-medium"
                  >
                    View More →
                  </Link>
                </div>
                <div className="min-h-[320px] lg:min-h-[380px] flex items-center justify-center">
                  <div className="text-center">
                    <Sparkles className="mx-auto h-6 w-6 text-secondary mb-2" />
                    <p className="text-sm text-muted-foreground">
                      No items found for <span className="font-semibold">{selectedCategory} — {selectedSub}</span>. Try another type.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
