// import * as Location from 'expo-location';
// import * as TaskManager from 'expo-task-manager';
// import { useState } from 'react';
// import React from 'react';
// import { Platform } from 'react-native';

// export const permissions = async (LOCATION_TASK_NAME : string, LOCATION_TRACKING_OPTIONS : Location.LocationAccuracy)=> {
//     const [errorMsg, setErrorMsg] = useState<string | null>(null);
//     const [isLoading, setIsLoading] = useState(true);
//     const { status: foregroundStatus } = 
//     await Location.requestForegroundPermissionsAsync();
  
//   if (foregroundStatus !== 'granted') {
//     setErrorMsg('Permission to access location was denied');
//     setIsLoading(false);
//     return;
//   }

//   if (Platform.OS === 'android' || Platform.OS === 'ios') {
//     const { status: backgroundStatus } = 
//       await Location.requestBackgroundPermissionsAsync();
    
//     if (backgroundStatus === 'granted') {
//       await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, 
//         LOCATION_TRACKING_OPTIONS);
//     }
//   }
// } 
