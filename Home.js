import { View, Text, Button, PermissionsAndroid } from 'react-native';
import React, {useState, useEffect} from 'react';
import * as Location from 'expo-location';

export default function Home({navigation}) {
  
  return (
    <View>
      <Text>
          Timely
      </Text>
      <Button title='Look For a ride'  onPress={()=> navigation.navigate('Map')}/>

    </View>
  );
}
