import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { messageService } from "../../services/messageService";
import { queryKeys } from "../../config/queryKeys";

export const useMessages = (options = {}) => {
  return useQuery({
    queryKey: queryKeys.messages.list,  // contain keys that is used to refetch the data, to keep it stored in the cache, used to invalidate the data
    queryFn: () => messageService.getMessages(),
    ...options,
  });
};






export const useInfiniteMessages = (options = {}) => {
  return useInfiniteQuery({
    queryKey: queryKeys.messages.list,
    initialPageParam: 1,
    queryFn: ({ pageParam }) =>
      messageService.getMessages({
        page: pageParam,
        limit: 10,
      }),
    getNextPageParam: (lastPage, _allPages, lastPageParam) => {
      const nextPage =
        lastPage?.nextPage ??
        lastPage?.pagination?.nextPage ??
        (lastPage?.hasNextPage ? lastPageParam + 1 : undefined);
      if (typeof nextPage !== "undefined" && nextPage !== null) {
        return nextPage;
      }
      const lastList =
        lastPage?.results ??
        lastPage?.data ??
        lastPage?.messages ??
        lastPage?.items ??
        [];
      return Array.isArray(lastList) && lastList.length > 0
        ? lastPageParam + 1
        : undefined;
    },
    ...options,
  });
};
