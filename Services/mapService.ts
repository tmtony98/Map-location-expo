import { StyleSheet } from 'react-native';
import * as Location from 'expo-location';

/**
 * Map styles for consistent styling across the app
 */
export const mapStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  map: {
    flex: 1,
  },
  overlay: {
    position: 'absolute',
    right: 16,
    bottom: 100,
    width: 50
  },
  centerButton: {
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  accuracyContainer: {
    position: 'absolute',
    right: 16,
    bottom: 50,
    width: 90,
    backgroundColor: 'rgba(255, 255, 255, 1)',
    padding: 8,
    borderRadius: 8,
    marginTop: 8,
  },
  accuracyText: {
    fontSize: 12,
    color: '#666',
  },
  loadingText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
});

/**
 * Formats location accuracy for display
 * 
 * @param location The location object
 * @returns Formatted accuracy string
 */
export const formatAccuracy = (location: Location.LocationObject): string => {
  return `Accuracy: ±${Math.round(location.coords.accuracy || 0)}m`;
};

/**
 * Creates map marker props from a location
 * 
 * @param location The location object
 * @param title Optional marker title
 * @returns Object with marker props
 */
export const createMarkerProps = (
  location: Location.LocationObject,
  title: string = 'You are here'
) => {
  return {
    coordinate: {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    },
    title,
    description: formatAccuracy(location),
  };
}; 