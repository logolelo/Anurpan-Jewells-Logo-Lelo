import { useQuery } from '@tanstack/react-query';
import { fetchProducts, fetchProductByHandle, type ShopifyProduct } from '@/lib/shopify';

export function useProducts(query?: string, first = 50) {
  return useQuery<ShopifyProduct[]>({
    queryKey: ['products', query, first],
    queryFn: () => fetchProducts(first, query),
  });
}

export function useProductByHandle(handle: string) {
  return useQuery({
    queryKey: ['product', handle],
    queryFn: () => fetchProductByHandle(handle),
    enabled: !!handle,
  });
}
