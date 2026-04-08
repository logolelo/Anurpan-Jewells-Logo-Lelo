import { Link } from 'react-router-dom';
import { CATEGORIES, COLLECTIONS, type MainCategory } from '@/lib/constants';

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <div>
            <h3 className="font-display text-2xl font-bold text-secondary mb-4">Anurpan</h3>
            <p className="text-sm text-primary-foreground/80 leading-relaxed">
              Discover exquisite jewellery crafted with love. From timeless silver pieces to stunning imitation designs, find your perfect adornment.
            </p>
          </div>

          {/* Shop */}
          <div>
            <h4 className="font-display font-semibold text-secondary mb-4">Shop</h4>
            <ul className="space-y-2">
              {(Object.keys(CATEGORIES) as MainCategory[]).map((cat) => (
                <li key={cat}>
                  <Link to={`/products?category=${encodeURIComponent(cat)}`} className="text-sm text-primary-foreground/70 hover:text-secondary transition-colors">
                    {cat}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Collections */}
          <div>
            <h4 className="font-display font-semibold text-secondary mb-4">Collections</h4>
            <ul className="space-y-2">
              {COLLECTIONS.map((col) => (
                <li key={col}>
                  <Link to={`/products?collection=${encodeURIComponent(col)}`} className="text-sm text-primary-foreground/70 hover:text-secondary transition-colors">
                    {col}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display font-semibold text-secondary mb-4">Contact</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/70">
              <li>Email: hello@anurpan.com</li>
              <li>Phone: +91 98765 43210</li>
              <li className="pt-2">
                <div className="flex gap-4">
                  <a href="#" className="hover:text-secondary transition-colors">Instagram</a>
                  <a href="#" className="hover:text-secondary transition-colors">Facebook</a>
                  <a href="#" className="hover:text-secondary transition-colors">Pinterest</a>
                </div>
              </li>
            </ul>
          </div>
          
          {/* Information */}
          <div className="md:col-span-2 lg:col-span-1">
            <h4 className="font-display font-semibold text-secondary mb-4">Information</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/about-us" className="text-sm text-primary-foreground/70 hover:text-secondary transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-sm text-primary-foreground/70 hover:text-secondary transition-colors">
                  Terms and Conditions
                </Link>
              </li>
              <li>
                <Link to="/refund-policy" className="text-sm text-primary-foreground/70 hover:text-secondary transition-colors">
                  Refund Policy
                </Link>
              </li>
              <li>
                <Link to="/privacy-policy" className="text-sm text-primary-foreground/70 hover:text-secondary transition-colors">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 mt-10 pt-6 text-center text-xs text-primary-foreground/50">
          © {new Date().getFullYear()} Anurpan. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
