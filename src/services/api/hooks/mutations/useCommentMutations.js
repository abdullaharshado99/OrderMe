import { useMutation, useQueryClient } from '@tanstack/react-query'
import axiosInstance from '../../client/axiosInstance'
import { EndPoints } from '../../../EndPoints'

// Add comment or reply
export const useAddComment = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ itemId, comment, parentCommentId }) => {
      const response = await axiosInstance.post(
        EndPoints.addComment(itemId),
        {
          comment,
          parentCommentId,
        }
      )
      return response.data
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries(['itemComments', variables.itemId])
      queryClient.invalidateQueries(['item', variables.itemId])
    },
  })
}

// Like comment
export const useLikeComment = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ itemId, commentId }) => {
      const response = await axiosInstance.post(
        EndPoints.likeComment(itemId, commentId),
        {}
      )
      return response.data
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries(['itemComments', variables.itemId])
    },
  })
}

// Unlike comment
export const useUnlikeComment = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ itemId, commentId }) => {
      const response = await axiosInstance.delete(
        EndPoints.likeComment(itemId, commentId)
      )
      return response.data
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries(['itemComments', variables.itemId])
    },
  })
}
