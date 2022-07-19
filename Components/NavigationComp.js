import { View, Text } from 'react-native'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react'
import Home from './Home';
import Map from './Route/Map';
import SearchRoute from './Route/SearchRoute';
import ProfileScreen from './Profile/ProfileScreen';
import Prediction from './Prediction/Prediction';
import AlarmClock from './Route/AlarmClock';
import UserLocation from './UserLocation';
import ChatScreen from './Chat/ChatScreen';
import ChatMenu from './Chat/ChatMenu';
import Instructions from './Bus Instructions/Instructions';
import PredParams from './Prediction/PredParams';
import { HeaderTitle } from 'react-navigation-stack';

export default function NavigationComp() {
    const Stack = createNativeStackNavigator();
  return (
    <Stack.Navigator initialRouteName="Home" screenOptions={{headerShown: false}}>
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="Search Route" component={SearchRoute}/>
      <Stack.Screen name="Prediction Process" component={Prediction}/>
      <Stack.Screen name="Map" component={Map} options={{headerShown:true}}/>
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="AlarmClock" component={AlarmClock} />
      <Stack.Screen name="UserLocation" component={UserLocation} />
      <Stack.Screen name="ChatScreen" component={ChatScreen}  />
      <Stack.Screen name="ChatMenu" component={ChatMenu} options={{headerShown: true, headerStyle: {backgroundColor: "#76b4d8"}, headerTitleStyle: {color: "white"}}}/>
      <Stack.Screen name="Instructions" component={Instructions}/>
      <Stack.Screen name="Prediction Parameters" component={PredParams} />
    </Stack.Navigator>
  )
}
//options={{headerShown: true, headerStyle: {backgroundColor: "#4065b5"}}}