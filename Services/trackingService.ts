import * as TaskManager from 'expo-task-manager';
import * as Location from 'expo-location';

// Constant for location task name
export const LOCATION_TASK_NAME = 'background-location-task';

/**
 * Define background location task
 * 
 * @param callback Optional callback to handle location data
 */
export const defineLocationTask = (
  callback?: (locations: Location.LocationObject[]) => void
): void => {
  TaskManager.defineTask(LOCATION_TASK_NAME, async ({ data, error }) => {
    if (error) {
      console.error('Background location task error:', error);
      return;
    }
    
    if (data) {
      const { locations } = data as { locations: Location.LocationObject[] };
      
      // Log location data
      console.log('Location in background', locations);
      
      // Call callback if provided
      if (callback && locations) {
        callback(locations);
      }
    }
  });
};

/**
 * Start background location tracking
 * 
 * @param options Location tracking options
 */
export const startBackgroundTracking = async (
  options = {} as Location.LocationTaskOptions
): Promise<void> => {
  try {
    const hasStarted = await Location.hasStartedLocationUpdatesAsync(LOCATION_TASK_NAME);
    
    if (!hasStarted) {
      await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, options);
      console.log('Background location tracking started');
    } else {
      console.log('Background tracking was already active');
    }
  } catch (error) {
    console.error('Failed to start background tracking:', error);
    throw error;
  }
};

/**
 * Stop background location tracking
 */
export const stopBackgroundTracking = async (): Promise<void> => {
  try {
    const hasStartedTracking = await Location.hasStartedLocationUpdatesAsync(LOCATION_TASK_NAME);
    
    if (hasStartedTracking) {
      await Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME);
      console.log('Background location tracking stopped');
    }
  } catch (error) {
    console.error('Failed to stop background tracking:', error);
    throw error;
  }
}; 