import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export function PromoBanner() {
  return (
    <section className="py-10 lg:py-16">
      <div className="container mx-auto px-4">
        <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-primary to-maroon-light min-h-[250px] lg:min-h-[350px] flex items-center">
          <div className="relative z-10 p-8 lg:p-16 max-w-lg">
            <p className="text-secondary font-medium text-sm tracking-widest uppercase mb-2">Curated Collection</p>
            <h2 className="font-display text-3xl lg:text-4xl font-bold text-primary-foreground mb-4 leading-tight">
              Festive Edition
            </h2>
            <p className="text-primary-foreground/80 mb-6 font-body">
              Celebrate every occasion with our specially curated festive jewellery. From traditional to contemporary, find pieces that make you shine.
            </p>
            <Link to="/products?collection=Festive+Edition">
              <Button size="lg" className="rounded-full bg-secondary hover:bg-secondary/90 text-secondary-foreground font-semibold px-8">
                Explore Now
              </Button>
            </Link>
          </div>
          {/* Decorative */}
          <div className="absolute right-0 top-0 w-1/2 h-full opacity-10">
            <div className="w-full h-full" style={{ background: 'radial-gradient(circle at 70% 50%, hsl(var(--gold)) 0%, transparent 70%)' }} />
          </div>
        </div>
      </div>
    </section>
  );
}
