import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';


const LOCATION_TASK_NAME = 'background-location-task';

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
