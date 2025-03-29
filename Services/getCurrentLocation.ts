import { MutableRefObject } from 'react';
import MapView from 'react-native-maps';

type MapRef = MutableRefObject<MapView | null>;
type Location = { 
    coords: {
        latitude: number;
        longitude: number;
    };
};



export const centerOnUser = (
  location: Location | null,
  mapRef: MapRef
) => {
  
    if (location && mapRef?.current) {
      mapRef.current.animateToRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      }, 1000);
    }
  };