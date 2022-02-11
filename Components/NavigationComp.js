import { View, Text } from 'react-native'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react'
import Home from './Home';
import Map from './Map';
import SearchRoute from './SearchRoute';
import RouteResults from './RouteResults';
import LoginScreen from '../screens/LoginScreen';
import ProfileScreen from '../screens/ProfileScreen';
import Prediction from './Prediction';

export default function NavigationComp() {
    const Stack = createNativeStackNavigator();

  return (
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen name="Home" component={Home}/>
      <Stack.Screen name="Search Route" component={SearchRoute}/>
      <Stack.Screen name="Route Results" component={RouteResults}/>
      <Stack.Screen name="Prediction Process" component={Prediction}/>
      <Stack.Screen name="Map" component={Map}/>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
    </Stack.Navigator>
  )
}