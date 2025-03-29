import { StyleSheet, View, Text, Switch, Platform } from 'react-native';
import { useState, useEffect } from 'react';
import * as Location from 'expo-location';

export default function SettingsScreen() {
  const [isLocationEnabled, setIsLocationEnabled] = useState(false);
  const [isBackgroundEnabled, setIsBackgroundEnabled] = useState(false);

  useEffect(() => {
    checkLocationPermissions();
  }, []);

  const checkLocationPermissions = async () => {
    const foregroundStatus = await Location.getForegroundPermissionsAsync();
    setIsLocationEnabled(foregroundStatus.status === 'granted');

    if (Platform.OS !== 'web') {
      const backgroundStatus = await Location.getBackgroundPermissionsAsync();
      setIsBackgroundEnabled(backgroundStatus.status === 'granted');
    }
  };

  const toggleLocationPermission = async () => {
    if (isLocationEnabled) {
      // Can't programmatically revoke permissions, direct user to settings
      alert('Please disable location permissions in your device settings');
    } else {
      const { status } = await Location.requestForegroundPermissionsAsync();
      setIsLocationEnabled(status === 'granted');
    }
  };

  const toggleBackgroundPermission = async () => {
    if (isBackgroundEnabled) {
      // Can't programmatically revoke permissions, direct user to settings
      alert('Please disable background location permissions in your device settings');
    } else {
      const { status } = await Location.requestBackgroundPermissionsAsync();
      setIsBackgroundEnabled(status === 'granted');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Location Settings</Text>
        
        <View style={styles.setting}>
          <View style={styles.settingTextContainer}>
            <Text style={styles.settingTitle}>Location Access</Text>
            <Text style={styles.settingDescription}>
              Allow app to access your location
            </Text>
          </View>
          <Switch
            value={isLocationEnabled}
            onValueChange={toggleLocationPermission}
          />
        </View>

        {Platform.OS !== 'web' && (
          <View style={styles.setting}>
            <View style={styles.settingTextContainer}>
              <Text style={styles.settingTitle}>Background Location</Text>
              <Text style={styles.settingDescription}>
                Allow app to track location in background
              </Text>
            </View>
            <Switch
              value={isBackgroundEnabled}
              onValueChange={toggleBackgroundPermission}
            />
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  section: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
  },
  setting: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#e0e0e0',
  },
  settingTextContainer: {
    flex: 1,
    marginRight: 16,
  },
  settingTitle: {
    fontSize: 16,
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
    color: '#666',
  },
});