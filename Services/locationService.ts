import * as Location from 'expo-location';
import { Platform } from 'react-native';

// Location tracking options
export const LOCATION_TRACKING_OPTIONS = {
  accuracy: Location.Accuracy.BestForNavigation,
  distanceInterval: 10, // Minimum distance (in meters) between location updates
  deferredUpdatesInterval: 1000, // Minimum time (in milliseconds) between location updates
  foregroundService: {
    notificationTitle: 'Location Tracking',
    notificationBody: 'Tracking your location in background',
  },
};

// Request location permissions
export const requestLocationPermissions = async (
  locationTaskName: string
): Promise<{
  foregroundGranted: boolean;
  backgroundGranted: boolean;
  errorMsg: string | null;
}> => {
  let result = {
    foregroundGranted: false,
    backgroundGranted: false,
    errorMsg: null as string | null
  };

  try {
    // Request foreground permission
    const { status: foregroundStatus } = 
      await Location.requestForegroundPermissionsAsync();
    
    if (foregroundStatus !== 'granted') {
      result.errorMsg = 'Permission to access location was denied';
      return result;
    }
    
    result.foregroundGranted = true;

    // Request background permission if on mobile
    if (Platform.OS === 'android' || Platform.OS === 'ios') {
      const { status: backgroundStatus } = 
        await Location.requestBackgroundPermissionsAsync();
      
      if (backgroundStatus === 'granted') {
        result.backgroundGranted = true;
        await Location.startLocationUpdatesAsync(locationTaskName, 
          LOCATION_TRACKING_OPTIONS);
      }
    }

    return result;
  } catch (error) {
    result.errorMsg = 'Error requesting location permissions';
    console.error(error);
    return result;
  }
};

// Get current location
export const getCurrentLocation = async (): Promise<Location.LocationObject> => {
  const location = await Location.getCurrentPositionAsync({
    accuracy: Location.Accuracy.BestForNavigation,
  });
  return location;
};

// Watch location updates
export const watchLocationUpdates = async (
  onLocationUpdate: (location: Location.LocationObject) => void
): Promise<Location.LocationSubscription> => {
  const subscription = await Location.watchPositionAsync(
    LOCATION_TRACKING_OPTIONS,
    onLocationUpdate
  );
  return subscription;
};

// Stop location updates
export const stopLocationUpdates = async (locationTaskName: string): Promise<void> => {
  try {
    const hasStarted = await Location.hasStartedLocationUpdatesAsync(locationTaskName);
    if (hasStarted) {
      await Location.stopLocationUpdatesAsync(locationTaskName);
    }
  } catch (error) {
    console.error('Error stopping location updates:', error);
  }
}; 