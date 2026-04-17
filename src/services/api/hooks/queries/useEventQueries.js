import { useQuery } from '@tanstack/react-query';
import { eventService } from '../../services/eventService';
import { queryKeys } from '../../config/queryKeys';

/**
 * Get all events
 * @param {Object} params - Query parameters
 * @param {Object} options - React Query options
 * @returns {Object} Query result with events
 */
export const useEvents = (params = {}, options = {}) => {
  return useQuery({
    queryKey: [...queryKeys.events.all, params],
    queryFn: () => eventService.getEvents(params),
    ...options,
  });
};

/**
 * Get single event by ID
 * @param {string} eventId - Event ID
 * @param {Object} options - React Query options
 * @returns {Object} Query result with event details
 */
export const useEvent = (eventId, options = {}) => {
  return useQuery({
    queryKey: queryKeys.events.byId(eventId),
    queryFn: () => eventService.getEventById(eventId),
    enabled: !!eventId,
    ...options,
  });
};

/**
 * Get upcoming events
 * @param {Object} options - React Query options
 * @returns {Object} Query result with upcoming events
 */
export const useUpcomingEvents = (options = {}) => {
  return useQuery({
    queryKey: queryKeys.events.upcoming,
    queryFn: () => eventService.getEvents({ upcoming: true }),
    ...options,
  });
};
