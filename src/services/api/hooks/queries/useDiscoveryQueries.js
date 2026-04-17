import { useQuery, useInfiniteQuery } from '@tanstack/react-query'
import { discoveryService } from '../../services/discoveryService'
import { queryKeys } from '../../config/queryKeys'

/**
 * Get discovery products
 * @param {Object} params - Query parameters (search, filters, etc.)
 * @param {Object} options - React Query options
 * @returns {Object} Query result with discovery products
 */
export const useDiscoveryProducts = (params = {}, options = {}) => {
  return useQuery({
    queryKey: [...queryKeys.discovery.all, params],
    queryFn: () => discoveryService.getDiscoveryProducts(params),
    staleTime: 10 * 60 * 1000, // 10 minutes - reduced API calls
    ...options,
  })
}

/**
 * Get discovery products with infinite scroll/pagination
 * @param {Object} params - Query parameters (search, filters, etc.)
 * @param {Object} options - React Query options
 * @returns {Object} Infinite query result
 */
export const useInfiniteDiscoveryProducts = (params = {}, options = {}) => {
  console.log('[useInfiniteDiscoveryProducts] Hook called with params:', JSON.stringify(params))
  return useInfiniteQuery({
    queryKey: [...queryKeys.discovery.all, params],
    queryFn: async ({ pageParam = 1 }) => {
      console.log('[useInfiniteDiscoveryProducts] Fetching page:', pageParam, 'with params:', JSON.stringify(params))
      const response = await discoveryService.getDiscoveryProducts({ ...params, page: pageParam })
      console.log('[useInfiniteDiscoveryProducts] Response received:', response?.data?.items?.length, 'items')
      // Return the full response with data and pagination at root level for React Query
      return response?.data || response
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const pagination = lastPage?.pagination
      const hasMore = pagination?.currentPage < pagination?.totalPages
      return hasMore ? pagination.currentPage + 1 : undefined
    },
    getPreviousPageParam: (firstPage) => {
      const pagination = firstPage?.pagination
      return pagination?.hasPrevPage ? pagination.currentPage - 1 : undefined
    },
    staleTime: 10 * 60 * 1000, // 10 minutes - reduced API calls
    ...options,
  })
}
