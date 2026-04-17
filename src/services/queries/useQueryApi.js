import axios from 'axios'
import { useQuery, keepPreviousData, useInfiniteQuery } from '@tanstack/react-query'
import { API_BASE_URL } from '../../config/constants'
const SERVER_URL = API_BASE_URL

const useQueryApi = (
  queryKey,
  urlWithOutBase,
  userToken,
  customConfig = {},
  enabled = true,
  keepPrevious = false,
  queryParams = {},
  useInfiniteQueryFlag = false,
) => {

  const defaultConfig = {
    method: 'get',
    baseURL: SERVER_URL,
    params: queryParams,
    headers: {
      'Content-Type': 'application/json',
      Authorization: userToken ? `Bearer ${userToken}` : '',
    },
  }
  const config = {
    ...defaultConfig,
    ...customConfig,
  }

  const queryFn = async ({ pageParam }) => {
    try {
      config.params.page = pageParam
      const response = await axios.request({
        url: urlWithOutBase,
        ...config,
      })
      return response.data
    } catch (error) {
      console.log('error in', error)

      const message = error?.response?.data?.message
      throw new Error(
        message || error.message || 'Something went wrong try again later.',
      )
    }
  }

  if (useInfiniteQueryFlag) {
    return useInfiniteQuery({
      queryKey,
      queryFn,
      enabled,
      initialPageParam: 1,
      getNextPageParam: (lastPage, allPages, lastPageParam) => {
        const lastPageReachedFlag =
          lastPage?.pagination?.totalPages ===
          lastPage?.pagination?.currentPage
        if (lastPageReachedFlag) {
          return undefined
        }
        return lastPageParam + 1
      },
    })
  }

  return useQuery({
    queryKey,
    queryFn,
    enabled,
    keepPreviousData: keepPrevious,
    placeholderData: keepPrevious ? keepPreviousData : null,
  })
}

export default useQueryApi
