import { useMutation, useQueryClient } from '@tanstack/react-query'
import axiosInstance from '../../client/axiosInstance'
import EndPoints from '../../../EndPoints'

// Like item
export const useLikeItem = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ itemId }) => {
      const response = await axiosInstance.post(
        `/item/${itemId}/like`,
        {}
      )
      return response.data
    },
    onSuccess: (data, variables) => {
      // Invalidate queries to refetch
      queryClient.invalidateQueries(['item', variables.itemId])
      queryClient.invalidateQueries(['discovery'])
    },
  })
}

// Unlike item
export const useUnlikeItem = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ itemId }) => {
      const response = await axiosInstance.delete(
        `/item/${itemId}/like`
      )
      return response.data
    },
    onSuccess: (data, variables) => {
      // Invalidate queries to refetch
      queryClient.invalidateQueries(['item', variables.itemId])
      queryClient.invalidateQueries(['discovery'])
    },
  })
}

// Save item to list
export const useSaveItemToList = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ listId, itemData }) => {
      const response = await axiosInstance.post(
        `/list/${listId}/items`,
        itemData
      )
      return response.data
    },
    onSuccess: (data, variables) => {
      // Invalidate list items query
      queryClient.invalidateQueries(['listItems', variables.listId])
      queryClient.invalidateQueries(['wantlysts'])
    },
  })
}

// Mark item as purchased
export const useMarkItemPurchased = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ itemId, purchasedPrice }) => {
      const response = await axiosInstance.post(
        `/item/${itemId}/purchase`,
        purchasedPrice ? { purchasedPrice } : {}
      )
      return response.data
    },
    onSuccess: (data, variables) => {
      // Invalidate queries to refetch updated item
      queryClient.invalidateQueries(['item', variables.itemId])
      queryClient.invalidateQueries(['listItems'])
      queryClient.invalidateQueries(['discovery'])
    },
  })
}

// Move item to another list
export const useMoveItem = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ itemId, targetListId }) => {
      const response = await axiosInstance.post(
        `/item/${itemId}/move`,
        { targetListId }
      )
      return response.data
    },
    onSuccess: (data, variables) => {
      // Invalidate all relevant queries
      queryClient.invalidateQueries(['item', variables.itemId])
      queryClient.invalidateQueries(['listItems'])
      queryClient.invalidateQueries(['wantlysts'])
      queryClient.invalidateQueries(['events'])
    },
  })
}

// Delete item
export const useDeleteItem = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ itemId }) => {
      const response = await axiosInstance.delete(`/item/${itemId}`)
      return response.data
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries(['item', variables.itemId])
      queryClient.invalidateQueries(['listItems'])
      queryClient.invalidateQueries(['discovery'])
      queryClient.invalidateQueries(['wantlysts'])
      queryClient.invalidateQueries(['events'])
    },
  })
}
