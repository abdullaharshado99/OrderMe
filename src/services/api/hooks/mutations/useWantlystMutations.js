import { useMutation, useQueryClient } from '@tanstack/react-query'
import { wantlystService } from '../../services/wantlystService'
import { queryKeys } from '../../config/queryKeys'

/**
 * Create wantlyst
 * @returns {Object} Mutation object
 * 
 * Usage:
 * const { mutate: createWantlyst, isPending } = useCreateWantlyst();
 * createWantlyst({ name, description }, {
 *   onSuccess: (newWantlyst) => { ... }
 * });
 */
export const useCreateWantlyst = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: wantlystService.createWantlyst,
    onSuccess: () => {
      // Refetch wantlysts list to include new one
      queryClient.invalidateQueries({ queryKey: queryKeys.wantlyst.all })
    },
  })
}

/**
 * Update wantlyst
 * @returns {Object} Mutation object
 */
export const useUpdateWantlyst = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ wantlystId, updateData }) =>
      wantlystService.updateWantlyst(wantlystId, updateData),
    onSuccess: (updatedWantlyst, { wantlystId }) => {
      // Update specific wantlyst in cache
      queryClient.setQueryData(
        queryKeys.wantlyst.byId(wantlystId),
        updatedWantlyst
      )
      // Invalidate list to show updated data
      queryClient.invalidateQueries({ queryKey: queryKeys.wantlyst.all })
    },
  })
}

/**
 * Delete wantlyst
 * @returns {Object} Mutation object
 */
export const useDeleteWantlyst = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: wantlystService.deleteWantlyst,
    onSuccess: (_, wantlystId) => {
      // Remove from cache
      queryClient.removeQueries({ queryKey: queryKeys.wantlyst.byId(wantlystId) })
      // Refetch list
      queryClient.invalidateQueries({ queryKey: queryKeys.wantlyst.all })
    },
  })
}

/**
 * Add item to wantlyst
 * @returns {Object} Mutation object
 */
export const useAddItemToWantlyst = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ wantlystId, itemData }) =>
      wantlystService.addItem(wantlystId, itemData),
    onSuccess: (updatedWantlyst, { wantlystId }) => {
      queryClient.setQueryData(
        queryKeys.wantlyst.byId(wantlystId),
        updatedWantlyst
      )
      queryClient.invalidateQueries({ queryKey: queryKeys.wantlyst.all })
    },
  })
}

/**
 * Remove item from wantlyst
 * @returns {Object} Mutation object
 */
export const useRemoveItemFromWantlyst = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (itemId) =>
      wantlystService.removeItem(itemId),
    onSuccess: () => {
      // Invalidate all wantlyst queries to refetch updated data
      queryClient.invalidateQueries({ queryKey: queryKeys.wantlyst.all })
    },
  })
}
