import { useInfiniteQuery } from '@tanstack/react-query'
import axiosInstance from '../../client/axiosInstance'
import { EndPoints } from '../../../EndPoints'

export const useItemComments = (itemId, options = {}) => {
  return useInfiniteQuery({
    queryKey: ['itemComments', itemId],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await axiosInstance.get(
        EndPoints.getItemComments(itemId),
        {
          params: {
            page: pageParam,
            limit: 15,
          },
        }
      )
      return response.data
    },
    getNextPageParam: (lastPage) => {
      const pagination = lastPage?.data?.pagination
      if (pagination?.hasNextPage) {
        return pagination.currentPage + 1
      }
      return undefined
    },
    enabled: !!itemId,
    ...options,
  })
}
