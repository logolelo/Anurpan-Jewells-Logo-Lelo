import { Link } from 'react-router-dom';
import { ShoppingCart, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCartStore } from '@/stores/cartStore';
import { useQueryClient } from '@tanstack/react-query';
import { fetchProductByHandle } from '@/lib/shopify';
import { toast } from 'sonner';
import type { ShopifyProduct } from '@/lib/shopify';

interface ProductCardProps {
  product: ShopifyProduct;
  source?: string;
}

export function ProductCard({ product, source }: ProductCardProps) {
  const addItem = useCartStore(state => state.addItem);
  const isCartLoading = useCartStore(state => state.isLoading);
  const queryClient = useQueryClient();
  const { node } = product;

  const prefetchProduct = () => {
    queryClient.prefetchQuery({
      queryKey: ['product', node.handle],
      queryFn: () => fetchProductByHandle(node.handle),
      staleTime: 1000 * 60 * 5, // 5 minutes
    });
  };

  const variant = node.variants.edges[0]?.node;
  const image = node.images.edges[0]?.node;
  const price = parseFloat(node.priceRange.minVariantPrice.amount);
  const compareAt = node.compareAtPriceRange?.minVariantPrice?.amount
    ? parseFloat(node.compareAtPriceRange.minVariantPrice.amount)
    : null;
  const hasDiscount = !!(compareAt && compareAt > price && compareAt > 0);
  const discountPercent = hasDiscount ? Math.round((1 - price / compareAt) * 100) : 0;

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!variant) return;
    await addItem({
      product,
      variantId: variant.id,
      variantTitle: variant.title,
      price: variant.price,
      quantity: 1,
      selectedOptions: variant.selectedOptions || [],
      quantityAvailable: variant.quantityAvailable ?? null,
    });
    toast.success('Added to cart', { description: node.title, position: 'top-center' });
  };

  return (
    <Link
      to={`/product/${encodeURIComponent(node.handle)}`}
      state={{ from: source }}
      className="group block"
      onMouseEnter={prefetchProduct}
    >
      <div className="relative rounded-xl overflow-hidden bg-muted aspect-square">
        {image ? (
          <img
            src={image.url}
            alt={image.altText || node.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground">No image</div>
        )}
        {hasDiscount && (
          <span className="absolute top-3 left-3 bg-secondary text-secondary-foreground text-xs font-semibold px-2 py-1 rounded-full">
            -{discountPercent}%
          </span>
        )}
        <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Button
            size="icon"
            className="rounded-full bg-primary hover:bg-primary/90 shadow-lg h-10 w-10"
            onClick={handleAddToCart}
            disabled={isCartLoading || !variant?.availableForSale}
          >
            {isCartLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShoppingCart className="h-4 w-4" />}
          </Button>
        </div>
      </div>
      <div className="mt-3 px-1">
        <h3 className="text-sm font-medium text-foreground truncate">{node.title}</h3>
        <div className="flex items-center gap-2 mt-1">
          <span className="font-semibold text-foreground">₹{price.toFixed(0)}</span>
          {hasDiscount && (
            <span className="text-sm text-muted-foreground line-through">₹{compareAt.toFixed(0)}</span>
          )}
        </div>
      </div>
    </Link>
  );
}
