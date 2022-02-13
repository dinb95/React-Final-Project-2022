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
        <Drawer.Screen name="Search Menu" component={NavigationComp} options={{
          drawerIcon: ({color}) => (
            <Ionicons name="search-circle-outline" size={22} color={color} /> ),
            }}/>
        <Drawer.Screen name="Login" component={LoginScreen}  
        options={{
          drawerIcon: ({color}) => (
            <Ionicons name="log-in-outline" size={22} color={color} /> ), 
            }} />
        <Drawer.Screen name="My Profile" component={ProfileScreen} options={{
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
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
