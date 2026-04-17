import { useMutation, useQueryClient } from '@tanstack/react-query'
import circleService from '../../services/circleService'

/**
 * Create Circle Mutation Hook
 */
export const useCreateCircle = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: circleService.createCircle,
    onSuccess: () => {
      // Invalidate circles list to refetch
      queryClient.invalidateQueries(['circles'])
    },
  })
}

/**
 * Update Circle Mutation Hook
 */
export const useUpdateCircle = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ circleId, updateData }) =>
      circleService.updateCircle(circleId, updateData),
    onSuccess: (data, variables) => {
      // Invalidate specific circle and circles list
      queryClient.invalidateQueries(['circle', variables.circleId])
      queryClient.invalidateQueries(['circles'])
    },
  })
}

/**
 * Delete Circle Mutation Hook
 */
export const useDeleteCircle = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: circleService.deleteCircle,
    onSuccess: () => {
      // Invalidate circles list
      queryClient.invalidateQueries(['circles'])
    },
  })
}

/**
 * Leave Circle Mutation Hook
 */
export const useLeaveCircle = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: circleService.leaveCircle,
    onSuccess: () => {
      // Invalidate circles list
      queryClient.invalidateQueries(['circles'])
    },
  })
}

/**
 * Invite to Circle Mutation Hook
 */
export const useInviteToCircle = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ circleId, userIds }) =>
      circleService.inviteToCircle(circleId, userIds),
    onSuccess: (data, variables) => {
      // Invalidate circle members
      queryClient.invalidateQueries(['circle', variables.circleId, 'members'])
    },
  })
}

/**
 * Respond to Invitation Mutation Hook
 */
export const useRespondToInvitation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ circleId, response }) =>
      circleService.respondToInvitation(circleId, response),
    onSuccess: () => {
      // Invalidate circles list
      queryClient.invalidateQueries(['circles'])
    },
  })
}

/**
 * Remove Member Mutation Hook
 */
export const useRemoveMember = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ circleId, userId }) =>
      circleService.removeMember(circleId, userId),
    onSuccess: (data, variables) => {
      // Invalidate circle members
      queryClient.invalidateQueries(['circle', variables.circleId, 'members'])
    },
  })
}

/**
 * Update Member Role Mutation Hook
 */
export const useUpdateMemberRole = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ circleId, userId, role }) =>
      circleService.updateMemberRole(circleId, userId, role),
    onSuccess: (data, variables) => {
      // Invalidate circle members
      queryClient.invalidateQueries(['circle', variables.circleId, 'members'])
    },
  })
}

/**
 * Share Item to Circle Mutation Hook
 */
export const useShareItemToCircle = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ circleId, wantlystItemId, message }) =>
      circleService.shareItemToCircle(circleId, wantlystItemId, message),
    onSuccess: (data, variables) => {
      // Invalidate circle items
      queryClient.invalidateQueries(['circle', variables.circleId, 'items'])
    },
  })
}

/**
 * Create Poll Mutation Hook
 */
export const useCreatePoll = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ circleId, pollData }) =>
      circleService.createPoll(circleId, pollData),
    onSuccess: (data, variables) => {
      // Invalidate circle polls
      queryClient.invalidateQueries(['circle', variables.circleId, 'polls'])
    },
  })
}

/**
 * Vote on Poll Mutation Hook
 */
export const useVoteOnPoll = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ pollId, optionIndex }) =>
      circleService.voteOnPoll(pollId, optionIndex),
    onSuccess: (data, variables) => {
      // Invalidate poll
      queryClient.invalidateQueries(['poll', variables.pollId])
    },
  })
}

/**
 * Send Message Mutation Hook
 */
export const useSendMessage = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ circleId, messageData }) =>
      circleService.sendMessage(circleId, messageData),
    onSuccess: (data, variables) => {
      // Invalidate circle messages
      queryClient.invalidateQueries(['circle', variables.circleId, 'messages'])
    },
  })
}

export default {
  useCreateCircle,
  useUpdateCircle,
  useDeleteCircle,
  useLeaveCircle,
  useInviteToCircle,
  useRespondToInvitation,
  useRemoveMember,
  useUpdateMemberRole,
  useShareItemToCircle,
  useCreatePoll,
  useVoteOnPoll,
  useSendMessage,
}
