import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { ProductRow } from '@/components/ProductRow';
import { useProductByHandle, useProducts } from '@/hooks/useProducts';
import { useCartStore } from '@/stores/cartStore';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ShoppingCart, Minus, Plus, Loader2, Check } from 'lucide-react';
import { toast } from 'sonner';

const ProductDetail = () => {
  const { handle } = useParams<{ handle: string }>();
  const { data: product, isLoading, error } = useProductByHandle(handle || '');
  const { data: allProducts } = useProducts();
  const addItem = useCartStore(state => state.addItem);
  const cartLoading = useCartStore(state => state.isLoading);

  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
        <Footer />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="font-display text-2xl font-bold mb-2">Product Not Found</h1>
            <Link to="/products" className="text-primary hover:underline">Browse all products</Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const images = product.images.edges;
  const variants = product.variants.edges;
  const selectedVariant = variants[selectedVariantIndex]?.node;
  const price = selectedVariant ? parseFloat(selectedVariant.price.amount) : 0;
  const compareAt = selectedVariant?.compareAtPrice ? parseFloat(selectedVariant.compareAtPrice.amount) : null;
  const hasDiscount = compareAt && compareAt > price;

  const similarProducts = allProducts?.filter(p => p.node.handle !== product.handle).slice(0, 10) || [];

  const handleAddToCart = async () => {
    if (!selectedVariant) return;

    await addItem({
      product: { node: product },
      variantId: selectedVariant.id,
      variantTitle: selectedVariant.title,
      price: selectedVariant.price,
      quantity,
      selectedOptions: selectedVariant.selectedOptions || [],
    });
    toast.success('Added to cart', { description: `${product.title} × ${quantity}`, position: 'top-center' });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8 lg:py-12">
          {/* Breadcrumb */}
          <nav className="text-sm text-muted-foreground mb-6">
            <Link to="/" className="hover:text-primary">Home</Link>
            <span className="mx-2">/</span>
            <Link to="/products" className="hover:text-primary">Products</Link>
            <span className="mx-2">/</span>
            <span className="text-foreground">{product.title}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Images */}
            <div>
              <div className="aspect-square rounded-2xl overflow-hidden bg-muted mb-4">
                {images[selectedImageIndex]?.node ? (
                  <img
                    src={images[selectedImageIndex].node.url}
                    alt={images[selectedImageIndex].node.altText || product.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground">No image</div>
                )}
              </div>
              {images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto scrollbar-hide">
                  {images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedImageIndex(i)}
                      className={`flex-shrink-0 w-16 h-16 lg:w-20 lg:h-20 rounded-lg overflow-hidden border-2 transition-all ${i === selectedImageIndex ? 'border-primary' : 'border-border hover:border-primary/50'}`}
                    >
                      <img src={img.node.url} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Info */}
            <div>
              {product.productType && (
                <span className="inline-block px-3 py-1 text-xs rounded-full bg-secondary/15 text-secondary font-medium mb-3">
                  {product.productType}
                </span>
              )}
              <h1 className="font-display text-3xl lg:text-4xl font-bold text-foreground mb-4">{product.title}</h1>

              {/* Price */}
              <div className="flex items-baseline gap-3 mb-6">
                <span className="text-3xl font-bold text-foreground">₹{price.toFixed(0)}</span>
                {hasDiscount && (
                  <>
                    <span className="text-xl text-muted-foreground line-through">₹{compareAt.toFixed(0)}</span>
                    <span className="text-sm font-semibold text-secondary">-{Math.round((1 - price / compareAt) * 100)}% OFF</span>
                  </>
                )}
              </div>

              {/* Availability */}
              <div className="flex items-center gap-2 mb-6">
                {selectedVariant?.availableForSale ? (
                  <><Check className="h-4 w-4 text-green-600" /><span className="text-sm text-green-600 font-medium">In Stock</span></>
                ) : (
                  <span className="text-sm text-destructive font-medium">Out of Stock</span>
                )}
              </div>

              {/* Variants */}
              {product.options.filter(o => o.name !== 'Title' || o.values[0] !== 'Default Title').map((option) => (
                <div key={option.name} className="mb-6">
                  <p className="text-sm font-medium text-foreground mb-2">{option.name}</p>
                  <div className="flex flex-wrap gap-2">
                    {option.values.map((value) => {
                      const variantIdx = variants.findIndex(v =>
                        v.node.selectedOptions.some(o => o.name === option.name && o.value === value)
                      );
                      const isSelected = variantIdx === selectedVariantIndex;
                      return (
                        <button
                          key={value}
                          onClick={() => { setSelectedVariantIndex(variantIdx >= 0 ? variantIdx : 0); }}
                          className={`px-4 py-2 rounded-lg text-sm border-2 transition-all ${isSelected ? 'border-primary bg-primary text-primary-foreground' : 'border-border hover:border-primary'}`}
                        >
                          {value}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}

              {/* Quantity */}
              <div className="mb-8">
                <p className="text-sm font-medium text-foreground mb-3">Quantity</p>
                <div className="flex items-center gap-4 bg-muted/30 w-fit p-1.5 rounded-xl border border-border">
                  <Button variant="outline" size="icon" className="rounded-lg h-9 w-9" onClick={() => setQuantity(Math.max(1, quantity - 1))} disabled={quantity <= 1}>
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-10 text-center font-semibold text-lg">{quantity}</span>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="rounded-lg h-9 w-9" 
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Add to Cart */}
              <Button
                onClick={handleAddToCart}
                disabled={cartLoading || !selectedVariant?.availableForSale}
                size="lg"
                className="w-full rounded-xl bg-primary hover:bg-primary/90 text-lg font-semibold py-6"
              >
                {cartLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <><ShoppingCart className="h-5 w-5 mr-2" />Add to Cart — ₹{(price * quantity).toFixed(0)}</>}
              </Button>

              {/* Tabs */}
              <Tabs defaultValue="details" className="mt-8">
                <TabsList className="w-full">
                  <TabsTrigger value="details" className="flex-1">Product Details</TabsTrigger>
                  <TabsTrigger value="refund" className="flex-1">Refund Policy</TabsTrigger>
                  <TabsTrigger value="delivery" className="flex-1">Delivery Info</TabsTrigger>
                </TabsList>
                <TabsContent value="details" className="mt-4">
                  <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                    {product.description || 'No description available.'}
                  </p>
                </TabsContent>
                <TabsContent value="refund" className="mt-4">
                  <p className="text-muted-foreground leading-relaxed">
                    We offer a 7-day return policy on all products. Items must be returned in their original condition with tags attached. Refunds are processed within 5-7 business days.
                  </p>
                </TabsContent>
                <TabsContent value="delivery" className="mt-4">
                  <p className="text-muted-foreground leading-relaxed">
                    Free shipping on orders above ₹999. Standard delivery takes 5-7 business days. Express delivery available at checkout for select locations.
                  </p>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>

        {/* Similar Products */}
        {similarProducts.length > 0 && (
          <ProductRow title="Similar Products" products={similarProducts} viewMoreLink="/products" />
        )}
      </main>
      <Footer />
    </div>
  );
};

export default ProductDetail;
