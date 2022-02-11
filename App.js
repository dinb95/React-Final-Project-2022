import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import React, {useState} from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { StyleSheet, Text, View } from 'react-native';
import LoginScreen from './screens/LoginScreen';
import NavigationComp from './Components/NavigationComp';


export default function App() {
  const [logged, setLogged] = useState(false);
  const logUser = (user) =>{
    console.log(user)
    setLogged(true);
  }
  const Drawer = createDrawerNavigator();
  if(!logged){
    return <LoginScreen setLogged={logUser}/>
  }
  else return (
    <NavigationContainer>
      <Drawer.Navigator initialRouteName="Main">
        <Drawer.Screen name="Search Menu" component={NavigationComp} />
        <Drawer.Screen name="Login" component={LoginScreen} />
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
