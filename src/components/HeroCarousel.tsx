import { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Slide {
  id: number;
  title: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
  bgGradient: string;
  imageUrl?: string;
  imageUrlDesktop?: string;
  imageUrlMobile?: string;
}

const SLIDES: Slide[] = [
  {
    id: 1,
    title: 'Timeless Elegance',
    subtitle: 'Discover our handpicked collection of stunning Silver 925 jewellery',
    ctaText: 'Shop Silver 925',
    ctaLink: '/products?category=Silver+925',
    bgGradient: 'from-primary/70 to-maroon-light/60',
    imageUrl: '/black-vixen-necklace-wearing-model-dine-in-hero-banner-image-desktop 2.jpg',
    imageUrlDesktop: '/black-vixen-necklace-wearing-model-dine-in-hero-banner-image-desktop 2.jpg',
    imageUrlMobile: '/black-vixen-necklace-wearing-model-dine-in-hero-banner-image-mobile_3.jpg',
  },
  {
    id: 2,
    title: 'Style Without Limits',
    subtitle: 'Explore trendsetting imitation pieces for every occasion',
    ctaText: 'Shop Imitation',
    ctaLink: '/products?category=Imitation',
    bgGradient: 'from-secondary/80 to-gold-dark/70',
  },
  {
    id: 3,
    title: 'Wedding Essentials',
    subtitle: 'Make your special day sparkle with our curated bridal collection',
    ctaText: 'View Collection',
    ctaLink: '/products?collection=Wedding+Essentials',
    bgGradient: 'from-primary/85 to-secondary/60',
  },
];

export function HeroCarousel() {
  const [current, setCurrent] = useState(0);

  const next = useCallback(() => setCurrent((c) => (c + 1) % SLIDES.length), []);
  const prev = useCallback(() => setCurrent((c) => (c - 1 + SLIDES.length) % SLIDES.length), []);

  useEffect(() => {
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next]);

  return (
    <section className="relative overflow-hidden">
      <div className="relative h-[450px] sm:h-[550px] lg:h-[750px]">
        {SLIDES.map((slide, i) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-all duration-700 ease-in-out ${
              i === current ? 'opacity-100 translate-x-0' : i < current ? 'opacity-0 -translate-x-full' : 'opacity-0 translate-x-full'
            }`}
          >
            <div className="w-full h-full relative">
              {(slide.imageUrlDesktop || slide.imageUrlMobile || slide.imageUrl) && (
                <picture className="absolute inset-0 w-full h-full">
                  {slide.imageUrlDesktop && <source media="(min-width: 1024px)" srcSet={slide.imageUrlDesktop} />}
                  {slide.imageUrlMobile && <source media="(max-width: 1023px)" srcSet={slide.imageUrlMobile} />}
                  <img
                    src={slide.imageUrlDesktop || slide.imageUrlMobile || slide.imageUrl!}
                    alt={slide.title}
                    className="absolute inset-0 w-full h-full object-cover object-center"
                  />
                </picture>
              )}
              {slide.id !== 1 && <div className={`absolute inset-0 bg-gradient-to-br ${slide.bgGradient}`} />}
              {slide.id !== 1 && (
                <div className="relative z-10 flex items-center h-full">
                  <div className="container mx-auto px-4">
                    <div className="max-w-xl">
                      <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-primary-foreground mb-4 leading-tight">
                        {slide.title}
                      </h1>
                      <p className="text-lg sm:text-xl text-primary-foreground/90 mb-8 font-body leading-relaxed">
                        {slide.subtitle}
                      </p>
                      <a href={slide.ctaLink}>
                        <Button size="lg" className="rounded-full bg-secondary hover:bg-secondary/90 text-secondary-foreground font-semibold px-8 text-base">
                          {slide.ctaText}
                        </Button>
                      </a>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Controls */}
      <Button variant="ghost" size="icon" className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-background/30 hover:bg-background/50 text-primary-foreground h-10 w-10" onClick={prev}>
        <ChevronLeft className="h-5 w-5" />
      </Button>
      <Button variant="ghost" size="icon" className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-background/30 hover:bg-background/50 text-primary-foreground h-10 w-10" onClick={next}>
        <ChevronRight className="h-5 w-5" />
      </Button>

      {/* Dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            className={`w-2.5 h-2.5 rounded-full transition-all ${i === current ? 'bg-secondary w-8' : 'bg-primary-foreground/50'}`}
            onClick={() => setCurrent(i)}
          />
        ))}
      </div>
    </section>
  );
}
