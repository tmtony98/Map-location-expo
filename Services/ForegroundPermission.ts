import * as Location from 'expo-location'
import { useState } from 'react';



const requestForegroundPermission = async () => {

    const [isLoading, setIsLoading] = useState(true);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    
const { status: foregroundStatus } = 
await Location.requestForegroundPermissionsAsync();

if (foregroundStatus !== 'granted') {
setErrorMsg('Permission to access location was denied');
setIsLoading(false);
return;
}
}

export default requestForegroundPermission;