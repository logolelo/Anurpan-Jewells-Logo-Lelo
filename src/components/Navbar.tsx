import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Menu, X, ChevronDown, User, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet';
import { CartDrawer } from '@/components/CartDrawer';
import { CATEGORIES, COLLECTIONS, type MainCategory } from '@/lib/constants';
import { isAuthenticated, getIdTokenClaims, logout } from '@/lib/auth';

export function Navbar() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [megaMenuOpen, setMegaMenuOpen] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = searchQuery.trim();
    if (q) {
      navigate(`/products?q=${encodeURIComponent(q)}`);
      setSearchOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 border-b border-border">
      {/* Top bar */}
      <div className="bg-primary text-primary-foreground text-center py-1.5 text-xs font-body tracking-wide">
        Free Shipping on Orders Above ₹999 | 7 Days Easy Returns
      </div>

      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Mobile menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80 overflow-y-auto">
              <SheetTitle className="font-display text-xl text-primary">Anurpan</SheetTitle>
              <nav className="mt-6 space-y-4">
                {isAuthenticated() ? (
                  <>
                    <Link to="/account" className="flex items-center gap-2 py-2 text-sm font-medium text-primary">
                      <User className="h-5 w-5" />
                      {(getIdTokenClaims()?.["name"] as string) || (getIdTokenClaims()?.["email"] as string) || "Account"}
                    </Link>
                    <button onClick={() => logout("/")} className="flex items-center gap-2 py-2 text-sm font-medium text-primary w-full">
                      <LogOut className="h-5 w-5" />
                      Sign out
                    </button>
                  </>
                ) : (
                  <Link to="/login" className="flex items-center gap-2 py-2 text-sm font-medium text-primary">
                    <User className="h-5 w-5" />
                    Sign in / Sign up
                  </Link>
                )}
                {(Object.keys(CATEGORIES) as MainCategory[]).map((cat) => (
                  <div key={cat}>
                    <p className="font-display font-semibold text-primary mb-2">{cat}</p>
                    <div className="pl-4 space-y-1">
                      {CATEGORIES[cat].map((sub) => (
                        <Link key={sub} to={`/products?category=${encodeURIComponent(cat)}&sub=${encodeURIComponent(sub)}`} className="block py-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
                          {sub}
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
                <div>
                  <p className="font-display font-semibold text-primary mb-2">Collections</p>
                  <div className="pl-4 space-y-1">
                    {COLLECTIONS.map((col) => (
                      <Link key={col} to={`/products?collection=${encodeURIComponent(col)}`} className="block py-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
                        {col}
                      </Link>
                    ))}
                  </div>
                </div>
              </nav>
            </SheetContent>
          </Sheet>

          {/* Logo */}
          <Link to="/" className="inline-flex items-center">
            <img src="/logo.svg" alt="Anurpan" className="h-8 lg:h-10 w-auto" />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {(Object.keys(CATEGORIES) as MainCategory[]).map((cat) => (
              <div
                key={cat}
                className="relative"
                onMouseEnter={() => setMegaMenuOpen(cat)}
                onMouseLeave={() => setMegaMenuOpen(null)}
              >
                <button className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-foreground hover:text-primary transition-colors">
                  {cat} <ChevronDown className="h-3 w-3" />
                </button>
                {megaMenuOpen === cat && (
                  <div className="absolute top-full left-0 bg-card rounded-lg shadow-xl border border-border p-4 min-w-[280px] animate-in fade-in-0 slide-in-from-top-2 duration-200">
                    <div className="grid grid-cols-2 gap-x-6 gap-y-1">
                      {CATEGORIES[cat].map((sub) => (
                        <Link key={sub} to={`/products?category=${encodeURIComponent(cat)}&sub=${encodeURIComponent(sub)}`} className="py-1.5 text-sm text-muted-foreground hover:text-primary transition-colors whitespace-nowrap">
                          {sub}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
            <div
              className="relative"
              onMouseEnter={() => setMegaMenuOpen('collections')}
              onMouseLeave={() => setMegaMenuOpen(null)}
            >
              <button className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-foreground hover:text-primary transition-colors">
                Collections <ChevronDown className="h-3 w-3" />
              </button>
              {megaMenuOpen === 'collections' && (
                <div className="absolute top-full left-0 bg-card rounded-lg shadow-xl border border-border p-6 min-w-[220px] animate-in fade-in-0 slide-in-from-top-2 duration-200">
                  {COLLECTIONS.map((col) => (
                    <Link key={col} to={`/products?collection=${encodeURIComponent(col)}`} className="block py-1.5 text-sm text-muted-foreground hover:text-primary transition-colors">
                      {col}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-2">
            {searchOpen ? (
              <form onSubmit={handleSearch} className="flex items-center gap-2">
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search jewellery..."
                  className="w-40 lg:w-64 h-9 text-sm"
                  autoFocus
                />
                <Button type="submit" size="sm" className="h-9">Go</Button>
                <Button variant="ghost" size="icon" onClick={() => setSearchOpen(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </form>
            ) : (
              <Button variant="ghost" size="icon" onClick={() => setSearchOpen(true)}>
                <Search className="h-5 w-5" />
              </Button>
            )}
            {isAuthenticated() ? (
              <>
                <Link to="/account">
                  <Button variant="ghost" size="icon" title={(getIdTokenClaims()?.["name"] as string) || (getIdTokenClaims()?.["email"] as string) || "Account"}>
                    <User className="h-5 w-5" />
                  </Button>
                </Link>
                <Button variant="ghost" size="icon" onClick={() => logout("/")} title="Sign out">
                  <LogOut className="h-5 w-5" />
                </Button>
              </>
            ) : (
              <Link to="/login">
                <Button variant="ghost" size="icon" title="Sign in / Sign up">
                  <User className="h-5 w-5" />
                </Button>
              </Link>
            )}
            <CartDrawer />
          </div>
        </div>
      </div>
    </header>
  );
}
