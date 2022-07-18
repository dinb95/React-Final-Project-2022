import 'react-native-gesture-handler';
import React, {useState} from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StyleSheet, Text, View } from 'react-native';
import CustomDrawer from  './screens/CustomDrawer'
import LoginScreen from './Components/Login/LoginScreen';
import ReservedTravel from  './Components/Travel/ReservedTravel'
import SearchRoute from './Components/Route/SearchRoute'
import ProfTop from  './Components/Profile/ProfTop'
import LoginUser from './Components/Login/LoginUser'
import SignUpScreen from './Components/Sign Up/SignUpScreen'
import NavigationComp from './Components/NavigationComp'; 
import Ionicons from 'react-native-vector-icons/Ionicons';
import CameraComp from './Components/Sign Up/CameraComp';
import SelectPictureScreen from './Components/Sign Up/SelectPictureScreen';
import HistoryTravel from './Components/Travel/HistoryTravel'



export default function App() {
  const [isLogged, setLogged] = useState(false);
  const [isGoogle, setGoogle] = useState(false);
  const [fullName, setFullName] = useState("");
  const logUser = () => {
    setLogged(true)
  }
  const signOut= () => {
    alert("User Signed Out")
    setLogged(false);
    setGoogle(false);
  }
  const setName = (name) => {
    setFullName(name);
  }
  const Drawer = createDrawerNavigator();
  if(!isLogged){
    const Stack = createNativeStackNavigator();
    return (
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login Screen" screenOptions={{headerShown: false}}>
        <Stack.Screen name="Login Screen" component={LoginScreen} initialParams={{setLogged: logUser, setGoogle:setGoogle}}/>
        <Stack.Screen name="LoginUser" component={LoginUser}/>
        <Stack.Screen name="SignUp" component={SignUpScreen}/>
        <Stack.Screen name="CameraComp" component={CameraComp}/>
        <Stack.Screen name="SelectPictureScreen" component={SelectPictureScreen}/>
        </Stack.Navigator>
      </NavigationContainer>
    )
  }
  else return (
    <NavigationContainer >
      <Drawer.Navigator drawerContent={props=> <CustomDrawer {...props} signOut={signOut} />} screenOptions={{headerShown: false}} initialRouteName="Main">
        <Drawer.Screen name="Navigation" component={NavigationComp} options={{
          drawerIcon: ({color}) => (
            <Ionicons name="home-outline" size={22} color={color} /> ),
            }}/>
         <Drawer.Screen name="Search Route" component={SearchRoute} options={{
          drawerIcon: ({color}) => (
            <Ionicons name="search-circle-outline" size={22} color={color} /> ),
            }}/>
        {!isGoogle && <Drawer.Screen name="My Profile" component={ProfTop} initialParams={{setName:setName}} options={{//ProfileScreen
          drawerIcon: ({color}) => (
            <Ionicons name="star-outline" size={22} color={color} /> ), 
            }} />}
        <Drawer.Screen name="History" component={HistoryTravel}  options={{
          drawerIcon: ({color}) => (
            <Ionicons name="bookmark-outline" size={22} color={color} /> ), 
            }}/>
        <Drawer.Screen name="Reserved Travels" component={ReservedTravel}  options={{
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