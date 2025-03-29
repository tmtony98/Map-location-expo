import { RefObject } from 'react';
import MapView from 'react-native-maps';
import * as Location from 'expo-location';

/**
 * Type for location data
 */
export type LocationData = Location.LocationObject;

/**
 * Centers the map on the user's current location
 * 
 * @param location User's current location
 * @param mapRef Reference to the MapView component
 */
export const centerOnUser = (
  location: LocationData | null, 
  mapRef: RefObject<MapView>
): void => {
  if (location && mapRef.current) {
    mapRef.current.animateToRegion({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      latitudeDelta: 0.005,
      longitudeDelta: 0.005,
    }, 1000);
  }
};

/**
 * Creates a region object for map initialization
 * 
 * @param location User's current location
 * @param delta Optional zoom level delta
 * @returns Region object for MapView
 */
export const createMapRegion = (
  location: LocationData, 
  delta: number = 0.005
) => {
  return {
    latitude: location.coords.latitude,
    longitude: location.coords.longitude,
    latitudeDelta: delta,
    longitudeDelta: delta,
  };
};

/**
 * Get current location and center map
 * 
 * @param mapRef Reference to the MapView component
 * @returns The current location
 */
export const getCurrentLocationAndCenter = async (
  mapRef: RefObject<MapView>
): Promise<LocationData> => {
  try {
    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.BestForNavigation,
    });
    
    if (mapRef.current) {
      centerOnUser(location, mapRef);
    }
    
    return location;
  } catch (error) {
    console.error('Error getting current location:', error);
    throw error;
  }
};