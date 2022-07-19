import React, { useState, useEffect } from 'react';
import { Platform, View } from 'react-native';
import Constants from 'expo-constants';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function UserLocation() {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    (async () => {
      if (Platform.OS === 'android' && !Constants.isDevice) {
        setErrorMsg(
          'Oops, this will not work on Snack in an Android emulator. Try it on your device!'
        );
        return;
      }
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let locationInterval = setInterval(getLocation, 10000)
      getLocation();
    })();
  }, []);

  const getLocation = async () => {
    let loc = await Location.getCurrentPositionAsync({});
    await AsyncStorage.setItem("UserLocation", JSON.stringify(loc))
    setLocation(loc);
  }

  let text = 'Waiting..';
  if (errorMsg) {
    text = errorMsg;
  } else if (location) {
    text = JSON.stringify(location);
    //console.log(location)
  }

  return (
    // <View style={styles.container}>
    //   <Text style={styles.paragraph}>{text}</Text>
    // </View>
    <View/>
  );
}
