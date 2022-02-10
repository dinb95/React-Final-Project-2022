import { NavigationContainer, StackActions } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StyleSheet, Text, View } from 'react-native';
import Home from './Components/Home';
import Map from './Components/Map';
import SearchRoute from './Components/SearchRoute';
import RouteResults from './Components/RouteResults';

export default function App() {
  const Stack = createNativeStackNavigator();
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
      <Stack.Screen name="Home" component={Home}/>
      <Stack.Screen name="Search Route" component={SearchRoute}/>
      <Stack.Screen name="Route Results" component={RouteResults}/>
      <Stack.Screen name="Map" component={Map}/>
      </Stack.Navigator>
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
