import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ProductCard } from '@/components/ProductCard';
import type { ShopifyProduct } from '@/lib/shopify';

interface ProductRowProps {
  title: string;
  products: ShopifyProduct[];
  viewMoreLink?: string;
}

export function ProductRow({ title, products, viewMoreLink }: ProductRowProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const amount = 300;
    scrollRef.current.scrollBy({ left: direction === 'left' ? -amount : amount, behavior: 'smooth' });
  };

  if (products.length === 0) return null;

  return (
    <section className="py-10 lg:py-16">
      <div className="container mx-auto px-4">
        <div className="flex items-end justify-between mb-6 lg:mb-8">
          <h2 className="font-display text-2xl lg:text-3xl font-bold text-foreground">{title}</h2>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" className="rounded-full h-9 w-9 hidden md:flex" onClick={() => scroll('left')}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" className="rounded-full h-9 w-9 hidden md:flex" onClick={() => scroll('right')}>
              <ChevronRight className="h-4 w-4" />
            </Button>
            {viewMoreLink && (
              <Link to={viewMoreLink}>
                <Button variant="link" className="text-primary font-medium">View More →</Button>
              </Link>
            )}
          </div>
        </div>
        <div ref={scrollRef} className="flex gap-4 lg:gap-6 overflow-x-auto scrollbar-hide pb-4 snap-x snap-mandatory">
          {products.map((product) => (
            <div key={product.node.id} className="flex-shrink-0 w-[200px] lg:w-[260px] snap-start">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
