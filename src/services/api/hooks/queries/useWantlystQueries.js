import { useQuery, useInfiniteQuery } from '@tanstack/react-query'
import { wantlystService } from '../../services/wantlystService'
import { queryKeys } from '../../config/queryKeys'

/**
 * Get all wantlysts
 * @param {Object} params - Query parameters
 * @param {Object} options - React Query options
 * @returns {Object} Query result with wantlysts
 */
export const useWantlysts = (params = {}, options = {}) => {
  return useQuery({
    queryKey: [...queryKeys.wantlyst.all, params],
    queryFn: () => wantlystService.getWantlysts(params),
    staleTime: 10 * 60 * 1000, // 10 minutes - reduced API calls
    ...options,
  })
}

/**
 * Get wantlysts with infinite scroll/pagination
 * @param {Object} params - Query parameters
 * @param {Object} options - React Query options
 * @returns {Object} Infinite query result
 */
export const useInfiniteWantlysts = (params = {}, options = {}) => {
  return useInfiniteQuery({
    queryKey: [...queryKeys.wantlyst.all, params],
    queryFn: ({ pageParam = 1 }) =>
      wantlystService.getWantlysts({ ...params, page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const hasMore =
        lastPage?.pagination?.currentPage < lastPage?.pagination?.totalPages
      return hasMore ? lastPage.pagination.currentPage + 1 : undefined
    },
    ...options,
  })
}

/**
 * Get single wantlyst by ID
 * @param {string} wantlystId - Wantlyst ID
 * @param {Object} options - React Query options
 * @returns {Object} Query result with wantlyst details
 */
export const useWantlyst = (wantlystId, options = {}) => {
  return useQuery({
    queryKey: queryKeys.wantlyst.byId(wantlystId),
    queryFn: () => wantlystService.getWantlystById(wantlystId),
    enabled: !!wantlystId,
    ...options,
  })
}

/**
 * Get wantlysts by user ID
 * @param {string} userId - User ID
 * @param {Object} options - React Query options
 * @returns {Object} Query result with user's wantlysts
 */
export const useUserWantlysts = (userId, options = {}) => {
  return useQuery({
    queryKey: queryKeys.wantlyst.byUser(userId),
    queryFn: () => wantlystService.getWantlysts({ userId }),
    enabled: !!userId,
    ...options,
  })
}

/**
 * Get items in a wantlyst with infinite scroll/pagination
 * @param {string} wantlystId - Wantlyst ID
 * @param {Object} params - Query parameters (limit, etc.)
 * @param {Object} options - React Query options
 * @returns {Object} Infinite query result with wantlyst items
 */
export const useInfiniteWantlystItems = (wantlystId, params = {}, options = {}) => {
  return useInfiniteQuery({
    queryKey: [...queryKeys.wantlyst.items(wantlystId), params],
    queryFn: ({ pageParam = 1 }) =>
      wantlystService.getWantlystItems(wantlystId, { ...params, page: pageParam, limit: params.limit || 20 }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const hasMore =
        lastPage?.data?.pagination?.currentPage < lastPage?.data?.pagination?.totalPages
      return hasMore ? lastPage.data.pagination.currentPage + 1 : undefined
    },
    enabled: !!wantlystId,
    staleTime: 10 * 60 * 1000, // 10 minutes - reduced API calls
    ...options,
  })
}
