import { Facebook, Instagram, Youtube } from 'lucide-react';
import { Link } from 'react-router-dom';
import { CATEGORIES, COLLECTIONS, type MainCategory } from '@/lib/constants';

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground border-t border-primary-foreground/10">
      <div className="container mx-auto px-4 py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-y-12 gap-x-8 lg:gap-12">
          {/* Brand & Support */}
          <div className="space-y-8 lg:col-span-1">
            <div className="text-left">
              <h4 className="text-xs lg:text-sm font-semibold text-secondary uppercase tracking-widest mb-5">Anurpan Jewellery</h4>
              <p className="text-sm lg:text-base text-primary-foreground/60 leading-relaxed max-w-md">
                At Anurpan Jewellery, we believe jewellery is more than an accessory — it is a reflection of confidence, individuality, and timeless elegance.{' '}
                <Link to="/about-us" className="inline-block text-xs font-semibold text-secondary hover:underline decoration-secondary/50 underline-offset-4 transition-all whitespace-nowrap">
                  View More →
                </Link>
              </p>
            </div>
            
            <div className="space-y-3 text-left">
              <h4 className="text-xs lg:text-sm font-semibold text-secondary uppercase tracking-widest">Contact Us</h4>
              <ul className="space-y-2 text-sm lg:text-base text-primary-foreground/60">
                <li>Email: anurpanjewellery@gmail.com</li>
                <li>Phone: +91 9152520710 / 7039096583</li>
                <li>Shop No. 12, Shri Samrat Co. Op. Hou. So. Ltd., Mahatma Phule Marg, Naupada, Thane, India, 400602</li>
              </ul>
            </div>
          </div>

          {/* Quick Links Group */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-10 lg:gap-8">
            <div className="text-left">
              <h4 className="text-xs lg:text-sm font-semibold text-secondary uppercase tracking-widest mb-5">Shop</h4>
              <ul className="space-y-3">
                {(Object.keys(CATEGORIES) as MainCategory[]).map((cat) => (
                  <li key={cat}>
                    <Link to={`/products?category=${encodeURIComponent(cat)}`} className="text-sm lg:text-base text-primary-foreground/60 hover:text-secondary transition-colors">
                      {cat}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="text-left">
              <h4 className="text-xs lg:text-sm font-semibold text-secondary uppercase tracking-widest mb-5">Collections</h4>
              <ul className="space-y-3">
                {COLLECTIONS.slice(0, 5).map((col) => (
                  <li key={col}>
                    <Link to={`/products?collection=${encodeURIComponent(col)}`} className="text-sm lg:text-base text-primary-foreground/60 hover:text-secondary transition-colors">
                      {col}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Legal & Social */}
          <div className="flex flex-col justify-between lg:col-span-1 gap-12 lg:gap-10">
            <div className="text-left flex-1">
              <h4 className="text-xs lg:text-sm font-semibold text-secondary uppercase tracking-widest mb-5">Policies & Info</h4>
              <ul className="grid grid-cols-1 gap-3">
                <li>
                  <Link to="/about-us" className="text-sm lg:text-base text-primary-foreground/60 hover:text-secondary transition-colors">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="text-sm lg:text-base text-primary-foreground/60 hover:text-secondary transition-colors">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link to="/terms" className="text-sm lg:text-base text-primary-foreground/60 hover:text-secondary transition-colors">
                    Terms and Conditions
                  </Link>
                </li>
                <li>
                  <Link to="/refund-policy" className="text-sm lg:text-base text-primary-foreground/60 hover:text-secondary transition-colors">
                    Refund & Cancellation Policy
                  </Link>
                </li>
                <li>
                  <Link to="/privacy-policy" className="text-sm lg:text-base text-primary-foreground/60 hover:text-secondary transition-colors">
                    Privacy Policy
                  </Link>
                </li>
              </ul>
            </div>
            
            <div className="text-left pt-8 lg:pt-0 border-t border-primary-foreground/10 lg:border-none">
              <h4 className="text-xs lg:text-sm font-semibold text-secondary uppercase tracking-widest mb-4">Follow Us</h4>
              <div className="flex justify-start gap-6">
                <a
                  href="https://www.instagram.com/anurpan_jewellery/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="text-primary-foreground/60 hover:text-secondary transition-colors"
                >
                  <Instagram className="h-5 w-5" />
                </a>
                <a
                  href="https://www.facebook.com/people/Anurpan-Jewellery/61595469001630/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="text-primary-foreground/60 hover:text-secondary transition-colors"
                >
                  <Facebook className="h-5 w-5" />
                </a>
                <a
                  href="https://www.youtube.com/@Anurpanjewellery"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="YouTube"
                  className="text-primary-foreground/60 hover:text-secondary transition-colors"
                >
                  <Youtube className="h-5 w-5" />
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-primary-foreground/10 mt-16 pt-8 text-left lg:text-center">
          <p className="text-[10px] text-primary-foreground/40 uppercase tracking-[0.2em] font-medium">
            © {new Date().getFullYear()} Anurpan Jewellery. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
