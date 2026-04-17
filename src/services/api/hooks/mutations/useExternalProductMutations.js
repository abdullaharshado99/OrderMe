import { useMutation, useQueryClient } from '@tanstack/react-query';
import { externalProductService } from '../../services/externalProductService';
import { queryKeys } from '../../config/queryKeys';

/**
 * Scrape external product from URL
 * @returns {Object} Mutation object
 * 
 * Usage:
 * const { mutate: scrapeProduct, isPending, data } = useScrapeProduct();
 * scrapeProduct({ url: 'https://example.com/product' }, {
 *   onSuccess: (productData) => { ... }
 * });
 */
export const useScrapeProduct = () => {
  return useMutation({
    mutationFn: externalProductService.scrapeProduct,
    // Don't cache scraped data - always fetch fresh
    retry: false,
  });
};

/**
 * Store external product to wantlyst
 * @returns {Object} Mutation object
 */
export const useStoreExternalProduct = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: externalProductService.storeProduct,
    onSuccess: () => {
      // Invalidate wantlysts and external products
      queryClient.invalidateQueries({ queryKey: queryKeys.wantlyst.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.externalProduct.all });
    },
  });
};
