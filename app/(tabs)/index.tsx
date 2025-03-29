import { useEffect, useRef, useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Platform } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import { Crosshair } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import * as TaskManager from 'expo-task-manager';
import { centerOnUser } from '@/Services/getCurrentLocation';
import requestForegroundPermission from '@/Services/ForegroundPermission';
import { requestBackgroundPermission } from '@/Services/backgroundPermission';
import { getinitialLocation } from '@/Services/initialLocation';


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

TaskManager.defineTask(LOCATION_TASK_NAME, async ({ data, error }) => {
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

export default function MapScreen() {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const mapRef = useRef<MapView>(null);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      try {
       
        requestForegroundPermission()
        requestBackgroundPermission(LOCATION_TASK_NAME, LOCATION_TRACKING_OPTIONS)

        // Get initial location
         const initialLocation = await getinitialLocation()
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

  centerOnUser(location, mapRef);
 

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Loading location...</Text>
      </View>
    );
  }

  if (errorMsg) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{errorMsg}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {location && (
        <>
          <MapView
            ref={mapRef}
            style={styles.map}
            showsUserLocation
            showsMyLocationButton={false}
            initialRegion={{
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
              latitudeDelta: 0.005,
              longitudeDelta: 0.005,
            }}>
            <Marker
              coordinate={{
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
              }}
              title="You are here"
              description={`Accuracy: ±${Math.round(location.coords.accuracy || 0)}m`}
            />
          </MapView>
          
          <View style={styles.overlay}>
            <TouchableOpacity
              style={styles.centerButton}
              onPress={centerOnUser}>
              <Crosshair color="#007AFF" size={24} />
            </TouchableOpacity>
          </View>
          <View style={styles.accuracyContainer}>
              <Text style={styles.accuracyText}>
                Accuracy: ±{Math.round(location.coords.accuracy || 0)}m
              </Text>
            </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
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
  text: {
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