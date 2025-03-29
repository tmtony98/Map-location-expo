import { useEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { Crosshair } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import React from 'react';

// Import services
import { LOCATION_TASK_NAME, defineLocationTask } from '@/Services/trackingService';
import { requestLocationPermissions, getCurrentLocation, watchLocationUpdates, stopLocationUpdates } from '@/Services/locationService';
import { centerOnUser, createMapRegion, LocationData } from '@/Services/getCurrentLocation';
import { mapStyles, formatAccuracy, createMarkerProps } from '@/Services/mapService';

// Define the background task before rendering
defineLocationTask();

export default function MapScreen() {
  const [location, setLocation] = useState<LocationData | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const mapRef = useRef<MapView>(null);
  const router = useRouter();

  useEffect(() => {
    let locationSubscription: any = null;

    const setupLocation = async () => {
      try {
        // Request location permissions
        const permissionResult = await requestLocationPermissions(LOCATION_TASK_NAME);
        
        if (!permissionResult.foregroundGranted) {
          setErrorMsg(permissionResult.errorMsg || 'Permission to access location was denied');
          setIsLoading(false);
          return;
        }

        // Get initial location
        const initialLocation = await getCurrentLocation();
        setLocation(initialLocation);

        // Start watching position
        locationSubscription = await watchLocationUpdates((newLocation) => {
          setLocation(newLocation);
        });
      } catch (err) {
        setErrorMsg('Error fetching location');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    setupLocation();

    // Cleanup function
    return () => {
      if (locationSubscription) {
        locationSubscription.remove();
      }
      
      const cleanup = async () => {
        await stopLocationUpdates(LOCATION_TASK_NAME);
      };
      
      cleanup().catch(err => console.error('Cleanup error:', err));
    };
  }, []);

  // Function to center the map on user
  const handleCenterOnUser = () => {
    if (location) {
      centerOnUser(location, mapRef);
    }
  };

  if (isLoading) {
    return (
      <View style={mapStyles.container}>
        <Text style={mapStyles.loadingText}>Loading location...</Text>
      </View>
    );
  }

  if (errorMsg) {
    return (
      <View style={mapStyles.container}>
        <Text style={mapStyles.errorText}>{errorMsg}</Text>
      </View>
    );
  }

  return (
    <View style={mapStyles.container}>
      {location && (
        <>
          <MapView
            ref={mapRef}
            style={mapStyles.map}
            showsUserLocation
            showsMyLocationButton={false}
            initialRegion={createMapRegion(location)}>
            <Marker {...createMarkerProps(location)} />
          </MapView>
          
          <View style={mapStyles.overlay}>
            <TouchableOpacity
              style={mapStyles.centerButton}
              onPress={handleCenterOnUser}>
              <Crosshair color="#007AFF" size={24} />
            </TouchableOpacity>
          </View>
          <View style={mapStyles.accuracyContainer}>
            <Text style={mapStyles.accuracyText}>
              {formatAccuracy(location)}
            </Text>
          </View>
        </>
      )}
    </View>
  );
}