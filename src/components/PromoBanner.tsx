import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useCallback, useEffect } from 'react';

const CURATED_COLLECTIONS = [
  {
    title: 'Festive Edition',
    subtitle: 'Curated Collection',
    description: 'Celebrate every occasion with our specially curated festive jewellery. From traditional to contemporary, find pieces that make you shine.',
    ctaText: 'Explore Now',
    ctaLink: '/products?collection=Festive+Edition',
    gradient: 'from-primary to-maroon-light',
    decorativeColor: 'hsl(var(--gold))'
  },
  {
    title: 'Wedding Essentials',
    subtitle: 'Curated Collection',
    description: 'Make your special day sparkle with our curated bridal collection. Handpicked designs for the modern bride and her family.',
    ctaText: 'View Collection',
    ctaLink: '/products?collection=Wedding+Essentials',
    gradient: 'from-gold-dark to-primary/80',
    decorativeColor: 'hsl(var(--maroon-light))'
  },
  {
    title: 'Everyday Essentials',
    subtitle: 'Curated Collection',
    description: 'Timeless and versatile pieces designed for your daily life. Effortless elegance that transitions perfectly from morning to night.',
    ctaText: 'Shop Daily',
    ctaLink: '/products?collection=Everyday+Essentials',
    gradient: 'from-primary to-maroon-light',
    decorativeColor: 'hsl(var(--gold))'
  },
  {
    title: 'Office Wear',
    subtitle: 'Curated Collection',
    description: 'Sophisticated and minimal designs for your daily office wear. Perfect for adding a touch of elegance to your professional look.',
    ctaText: 'Shop Now',
    ctaLink: '/products?collection=Office+Wear',
    gradient: 'from-gold-dark to-primary/80',
    decorativeColor: 'hsl(var(--maroon-light))'
  },
  {
    title: 'Party Wear',
    subtitle: 'Curated Collection',
    description: 'Bold, statement pieces that command attention. Sparkle through the night with our exquisite party-ready collection.',
    ctaText: 'Explore Party',
    ctaLink: '/products?collection=Party+Wear',
    gradient: 'from-primary to-maroon-light',
    decorativeColor: 'hsl(var(--gold))'
  },
  {
    title: 'Gifting',
    subtitle: 'Curated Collection',
    description: 'Find the perfect gift for your loved ones. Explore our collection of timeless pieces that they will cherish forever.',
    ctaText: 'Shop Gifts',
    ctaLink: '/products?collection=Gifting',
    gradient: 'from-gold-dark to-primary/80',
    decorativeColor: 'hsl(var(--maroon-light))'
  }
];

export function PromoBanner() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    align: 'start',
    containScroll: 'trimSnaps',
    dragFree: true
  });

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;

    const onWheel = (e: WheelEvent) => {
      // Handle both vertical and horizontal scroll (Shift+Scroll is usually horizontal)
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY) || e.shiftKey) {
        if (e.deltaX > 0 || e.deltaY > 0) {
          emblaApi.scrollNext();
        } else {
          emblaApi.scrollPrev();
        }
        e.preventDefault();
      }
    };

    const emblaNode = emblaApi.rootNode();
    emblaNode.addEventListener('wheel', onWheel, { passive: false });

    return () => {
      emblaNode.removeEventListener('wheel', onWheel);
    };
  }, [emblaApi]);

  return (
    <section className="py-10 lg:py-16">
      <div className="container mx-auto px-4">
        <div className="flex items-end justify-between mb-6 lg:mb-8">
          <div>
            <h2 className="font-display text-3xl lg:text-4xl font-bold text-foreground">Curated Collections</h2>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="icon" 
              className="rounded-full h-10 w-10 border-border hover:bg-muted"
              onClick={scrollPrev}
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button 
              variant="outline" 
              size="icon" 
              className="rounded-full h-10 w-10 border-border hover:bg-muted"
              onClick={scrollNext}
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex gap-4 lg:gap-6">
            {CURATED_COLLECTIONS.map((item, index) => (
              <div 
                key={index} 
                className="flex-[0_0_100%] sm:flex-[0_0_80%] lg:flex-[0_0_50%] min-w-0"
              >
                <div className={`relative rounded-3xl overflow-hidden bg-gradient-to-r ${item.gradient} min-h-[250px] lg:min-h-[350px] flex items-center group hover:shadow-xl transition-all duration-500`}>
                  <div className="relative z-10 p-8 lg:p-12 max-w-lg">
                    <p className="text-secondary font-medium text-xs lg:text-sm tracking-widest uppercase mb-2 opacity-90">{item.subtitle}</p>
                    <h3 className="font-display text-2xl lg:text-4xl font-bold text-primary-foreground mb-4 leading-tight group-hover:translate-x-1 transition-transform duration-500">
                      {item.title}
                    </h3>
                    <p className="text-primary-foreground/80 mb-6 font-body text-sm lg:text-base line-clamp-2 lg:line-clamp-none">
                      {item.description}
                    </p>
                    <Link to={item.ctaLink}>
                      <Button size="lg" className="rounded-full bg-secondary hover:bg-secondary/90 text-secondary-foreground font-semibold px-8 text-sm lg:text-base">
                        {item.ctaText}
                      </Button>
                    </Link>
                  </div>
                  {/* Decorative */}
                  <div className="absolute right-0 top-0 w-1/2 h-full opacity-10 group-hover:opacity-20 transition-opacity duration-500">
                    <div 
                      className="w-full h-full" 
                      style={{ background: `radial-gradient(circle at 70% 50%, ${item.decorativeColor} 0%, transparent 70%)` }} 
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
