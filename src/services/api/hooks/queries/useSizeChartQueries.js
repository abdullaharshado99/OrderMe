import { useQuery } from '@tanstack/react-query';
import { sizeChartService } from '../../services/sizeChartService';
import { queryKeys } from '../../config/queryKeys';

/**
 * Get clothing size chart
 * @param {string} region - Region code (US, UK, EU, etc.)
 * @param {Object} options - React Query options
 * @returns {Object} Query result with clothing sizes
 */
export const useClothingSizeChart = (region = 'US', options = {}) => {
  return useQuery({
    queryKey: queryKeys.sizeChart.clothing(region),
    queryFn: () => sizeChartService.getClothingSizes(region),
    staleTime: Infinity, // Size charts rarely change
    ...options,
  });
};

/**
 * Get shoe size chart
 * @param {string} region - Region code (US, UK, EU, etc.)
 * @param {Object} options - React Query options
 * @returns {Object} Query result with shoe sizes
 */
export const useShoeSizeChart = (region = 'US', options = {}) => {
  return useQuery({
    queryKey: queryKeys.sizeChart.shoes(region),
    queryFn: () => sizeChartService.getShoeSizes(region),
    staleTime: Infinity,
    ...options,
  });
};

/**
 * Get waist size chart
 * @param {string} region - Region code
 * @param {Object} options - React Query options
 * @returns {Object} Query result with waist sizes
 */
export const useWaistSizeChart = (region = 'US', options = {}) => {
  return useQuery({
    queryKey: queryKeys.sizeChart.waist(region),
    queryFn: () => sizeChartService.getWaistSizes(region),
    staleTime: Infinity,
    ...options,
  });
};

/**
 * Get jewelry size chart
 * @param {string} type - Jewelry type (ring, bracelet, necklace, earring)
 * @param {Object} options - React Query options
 * @returns {Object} Query result with jewelry sizes
 */
export const useJewelrySizeChart = (type, options = {}) => {
  return useQuery({
    queryKey: queryKeys.sizeChart.jewelry[type] || [...queryKeys.sizeChart.all, type],
    queryFn: () => sizeChartService.getJewelrySizes(type),
    enabled: !!type,
    staleTime: Infinity,
    ...options,
  });
};
