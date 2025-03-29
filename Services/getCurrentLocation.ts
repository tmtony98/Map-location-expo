import { MutableRefObject } from 'react';
import MapView from 'react-native-maps';


type Location = { 
    coords: {
        latitude: number;
        longitude: number;
    };
};

type MapRef = MutableRefObject<MapView | null>;


export const centerOnUser = (location: Location, mapRef: React.RefObject<MapView>) => {

    
    if (location && mapRef.current) {
      mapRef.current.animateToRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      }, 1000);
    }
  };