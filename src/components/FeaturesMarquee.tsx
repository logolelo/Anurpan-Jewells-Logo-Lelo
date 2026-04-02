import { FEATURES_MARQUEE } from '@/lib/constants';

export function FeaturesMarquee() {
  return (
    <div className="bg-secondary/10 border-y border-border py-3 overflow-hidden">
      <div className="animate-marquee flex whitespace-nowrap">
        {[...FEATURES_MARQUEE, ...FEATURES_MARQUEE].map((feature, i) => (
          <span key={i} className="mx-8 text-sm font-medium text-secondary-foreground/80 font-body">
            {feature}
          </span>
        ))}
      </div>
    </div>
  );
}
