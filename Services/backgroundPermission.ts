import * as Location from 'expo-location'
import { Platform } from 'react-native' 


interface LocationTrackingOptions {
  accuracy: Location.Accuracy;
  distanceInterval: number;
  deferredUpdatesInterval: number;
  foregroundService: {
    notificationTitle: string;
    notificationBody: string;
  };
}

export const requestBackgroundPermission = async (LOCATION_TASK_NAME : string , LOCATION_TRACKING_OPTIONS : LocationTrackingOptions)=>{

  if (Platform.OS === 'android' || Platform.OS === 'ios') {
    const { status: backgroundStatus } = 
      await Location.requestBackgroundPermissionsAsync();
    
    if (backgroundStatus === 'granted') {
      await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, 
        LOCATION_TRACKING_OPTIONS);
    }
  }
}



