import 'react-native-gesture-handler';
import React, {useState} from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { StyleSheet, Text, View } from 'react-native';
import CustomDrawer from  './screens/CustomDrawer'
import LoginScreen from './screens/LoginScreen';
import ProfileScreen from './screens/ProfileScreen';
import ReservedTravel from  './screens/ReservedTravel'
import History from  './screens/History'
import SearchRoute from  './Components/SearchRoute'
import ProfTop from  './Components/ProfTop'
import LoginUser from './screens/LoginUser'
import SignInScreen from './screens/SignInScreen'

import AlarmClock from  './screens/AlarmClock'
import NavigationComp from './Components/NavigationComp'; 
import Ionicons from 'react-native-vector-icons/Ionicons';



export default function App() {
  const [isLogged, setLogged] = useState(false);
  const [LoggedUser, setUser] = useState();
  const logUser = (user) => {
    setUser(user);
    setLogged(true)
  }

  const Drawer = createDrawerNavigator();
  if(!isLogged){
    return <LoginScreen setLogged={logUser}/>
  }
  else return (
    <NavigationContainer>
      <Drawer.Navigator drawerContent={props=> <CustomDrawer {...props} />} screenOptions={{headerShown: false}} initialRouteName="Main">
        <Drawer.Screen name="Home" component={NavigationComp} options={{
          drawerIcon: ({color}) => (
            <Ionicons name="home-outline" size={22} color={color} /> ),
            }}/>
         <Drawer.Screen name="Search Route" component={SearchRoute} options={{
          drawerIcon: ({color}) => (
            <Ionicons name="search-circle-outline" size={22} color={color} /> ),
            }}/>
          <Drawer.Screen name="LoginUser" component={LoginUser} options={{
          drawerIcon: ({color}) => (
            <Ionicons name="search-circle-outline" size={22} color={color} /> ),
            }}/>
             <Drawer.Screen name="SignIn Screen" component={SignInScreen} options={{
          drawerIcon: ({color}) => (
            <Ionicons name="search-circle-outline" size={22} color={color} /> ),
            }}/>
        <Drawer.Screen name="My Profile" component={ProfTop} options={{//ProfileScreen
          drawerIcon: ({color}) => (
            <Ionicons name="star-outline" size={22} color={color} /> ), 
            }} />
        <Drawer.Screen name="Alarm Clock" component={AlarmClock} options={{
          drawerIcon: ({color}) => (
            <Ionicons name="alarm-outline" size={22} color={color} /> ), 
            }} />
        <Drawer.Screen name="History" component={History}  options={{
          drawerIcon: ({color}) => (
            <Ionicons name="bookmark-outline" size={22} color={color} /> ), 
            }}/>
        <Drawer.Screen name="ReservedTravel" component={ReservedTravel}  options={{
          drawerIcon: ({color}) => (
            <Ionicons name="bus-outline"size={22} color={color} /> ), 
            }}/>
      </Drawer.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({

  container: {
    //flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row'
  },
  drawerHeader: {
    height: 100,
    backgroundColor: 'white',
    flexDirection: 'row'
  },
  drawerImage: {
    height: 50,
    width: 50,
    borderRadius: 75
  }

})