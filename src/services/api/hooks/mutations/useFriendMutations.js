import { useMutation, useQueryClient } from '@tanstack/react-query';
import { friendService } from '../../services/friendService';
import { queryKeys } from '../../config/queryKeys';

/**
 * Send friend request
 * @returns {Object} Mutation object
 * 
 * Usage:
 * const { mutate: sendRequest } = useSendFriendRequest();
 * sendRequest({ receiverId: 'user123' }, {
 *   onSuccess: () => console.log('Request sent!')
 * });
 */
export const useSendFriendRequest = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: friendService.sendRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.friends.requests });
    },
  });
};

/**
 * Cancel friend request
 * @returns {Object} Mutation object
 */
export const useCancelFriendRequest = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: friendService.cancelRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.friends.requests });
    },
  });
};

/**
 * Accept friend request
 * @returns {Object} Mutation object
 */
export const useAcceptFriendRequest = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: friendService.acceptRequest,
    onSuccess: () => {
      // Refetch both friends list and requests
      queryClient.invalidateQueries({ queryKey: queryKeys.friends.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.friends.requests });
    },
  });
};

/**
 * Decline friend request
 * @returns {Object} Mutation object
 */
export const useDeclineFriendRequest = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: friendService.declineRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.friends.requests });
    },
  });
};

/**
 * Delete/Remove friend
 * @returns {Object} Mutation object
 */
export const useDeleteFriend = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: friendService.deleteFriend,
    onSuccess: (_, friendId) => {
      // Remove friend from cache
      queryClient.removeQueries({ queryKey: queryKeys.friends.byId(friendId) });
      // Refetch friends list
      queryClient.invalidateQueries({ queryKey: queryKeys.friends.all });
    },
  });
};
