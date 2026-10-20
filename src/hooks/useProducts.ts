import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { fetchAllProducts, fetchProducts, fetchProductByHandle, type ShopifyProduct } from '@/lib/shopify';

export function useProducts(query?: string, first = 50) {
  return useQuery<ShopifyProduct[]>({
    queryKey: ['products', query, first],
    queryFn: () => fetchProducts(first, query),
    staleTime: 1000 * 60 * 5, // 5 minutes
    placeholderData: keepPreviousData,
  });
}

export function useProductByHandle(handle: string) {
  return useQuery({
    queryKey: ['product', handle],
    queryFn: () => fetchProductByHandle(handle),
    enabled: !!handle,
  });
}

export function useAllProducts() {
  return useQuery<ShopifyProduct[]>({
    queryKey: ['products-all'],
    queryFn: () => fetchAllProducts(),
    staleTime: 1000 * 60 * 5, // 5 minutes
    placeholderData: keepPreviousData,
  });
}
