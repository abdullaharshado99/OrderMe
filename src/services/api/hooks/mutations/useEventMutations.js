import { useMutation, useQueryClient } from '@tanstack/react-query';
import { eventService } from '../../services/eventService';
import { queryKeys } from '../../config/queryKeys';

/**
 * Create event
 * @returns {Object} Mutation object
 */
export const useCreateEvent = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: eventService.createEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.events.all });
    },
  });
};

/**
 * Update event
 * @returns {Object} Mutation object
 */
export const useUpdateEvent = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ eventId, updateData }) => 
      eventService.updateEvent(eventId, updateData),
    onSuccess: (updatedEvent, { eventId }) => {
      queryClient.setQueryData(queryKeys.events.byId(eventId), updatedEvent);
      queryClient.invalidateQueries({ queryKey: queryKeys.events.all });
    },
  });
};

/**
 * Delete event
 * @returns {Object} Mutation object
 */
export const useDeleteEvent = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: eventService.deleteEvent,
    onSuccess: (_, eventId) => {
      queryClient.removeQueries({ queryKey: queryKeys.events.byId(eventId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.events.all });
    },
  });
};
