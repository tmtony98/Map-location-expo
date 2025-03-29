import * as Location from 'expo-location';

export const getinitialLocation =  async () => {

    try {
        const initialLocation = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.BestForNavigation,
        });
        return initialLocation;
    } catch (error) {
        console.error(error);
        return null;
    }
   
};