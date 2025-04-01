import React, { createContext, useContext, useState, ReactNode, useRef, useEffect } from "react"
import * as Location from 'expo-location'
import { useRouter } from 'expo-router'
import MapView from 'react-native-maps'
import * as TaskManager from 'expo-task-manager'
import { Platform } from 'react-native'





const LOCATION_TASK_NAME = 'background-location-task';

const LOCATION_TRACKING_OPTIONS = {
  accuracy: Location.Accuracy.BestForNavigation,
  distanceInterval: 10, // Minimum distance (in meters) between location updates
  deferredUpdatesInterval: 1000, // Minimum time (in milliseconds) between location updates
  foregroundService: {
    notificationTitle: 'Location Tracking',
    notificationBody: 'Tracking your location in background',
  },
};

TaskManager.defineTask(LOCATION_TASK_NAME, async ({ data, error }: any) => {
  if (error) {
    console.error(error);
    return;
  }
  if (data) {
    const { locations } = data as { locations: Location.LocationObject[] };
    // Handle background location updates
    console.log('Location in background', locations);
  }
});

interface LocationContextType {
  location: Location.LocationObject | null;
  errorMsg: string | null;
  isLoading: boolean;
  centerOnUser: () => void;
  mapRef: React.RefObject<MapView>;
}

const LocationContext = createContext<LocationContextType | null>(null);



interface LocationProviderProps {
  children: ReactNode;
}

export const useLocation = (): LocationContextType => {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
};

export function LocationProvider({ children }: LocationProviderProps): JSX.Element {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const mapRef = useRef<MapView>(null);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      try {
        const { status: foregroundStatus } = 
          await Location.requestForegroundPermissionsAsync();
        
        if (foregroundStatus !== 'granted') {
          setErrorMsg('Permission to access location was denied');
          setIsLoading(false);
          return;
        }

        if (Platform.OS === 'android' || Platform.OS === 'ios') {
          const { status: backgroundStatus } = 
            await Location.requestBackgroundPermissionsAsync();
          
          if (backgroundStatus === 'granted') {
            await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, 
              LOCATION_TRACKING_OPTIONS);
          }
        }

        // Get initial location
        const initialLocation = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.BestForNavigation,
        });
        setLocation(initialLocation);

        // Start watching position
        const locationSubscription = await Location.watchPositionAsync(
          LOCATION_TRACKING_OPTIONS,
          (newLocation) => {
            setLocation(newLocation);
          }
        );

        return () => {
          locationSubscription.remove();
          Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME);
        };
      } catch (err) {
        setErrorMsg('Error fetching location');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const centerOnUser = () => {
    if (location && mapRef.current) {
      mapRef.current.animateToRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      }, 1000);
    }
  };

  const value: LocationContextType = {
    location,
    errorMsg,
    isLoading,
    centerOnUser,
    mapRef
  };

  return (
    <LocationContext.Provider value={value}>
      {children}
    </LocationContext.Provider>
  );
}