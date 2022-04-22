import { View, Text, Button, StyleSheet,ImageBackground,TouchableOpacity, Alert } from 'react-native';
import React, {useState, useEffect} from 'react';
import PushPage from '../PushPage';
import { initializeApp } from 'firebase/app';
import { getDatabase, set, ref, onChildAdded, remove } from "firebase/database";
import AsyncStorage from '@react-native-async-storage/async-storage';
import UserLocation from './UserLocation';
// import {database} from './firebase'

const firebaseConfig = {
  apiKey: "AIzaSyDvDTL7yUQocA1JXW90LtKibG_uRm9z-E4",
  authDomain: "final-project-din-and-hadar.firebaseapp.com",
  databaseURL: "https://final-project-din-and-hadar-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "final-project-din-and-hadar",
  storageBucket: "final-project-din-and-hadar.appspot.com",
  messagingSenderId: "490950571924",
  appId: "1:490950571924:web:16a1d3b0896e4b41cfc181",
  measurementId: "G-4YV91X5FDZ"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export default function Home({navigation}) {
  const [onGoingRoute, setOnGoingRoute] = useState(<></>)

  const check = async (route) => {
    let start_location = route.raw_route.start_location
    let current_location = await getUserLocation()
    console.log("start: ", start_location, "current: ",current_location)

    if (calculate_distance(start_location, current_location) > 1000){ //if the user's current location is more than 1000 meters away from the start point
      Alert.alert("Too Far!",
       "It seems that you're too far from the departure station. Would you like to get a new route from your current location?",
       [{text:"No", style: "cancel"},
         {
           text:"Yes",
           onPress: () => SuggestNewRoute(current_location, route.routeData.Destination)
         }])
    }
    else{
      //start measuring time
      let start_time = new Date();
      let checkArrivalInterval = setInterval(() => checkArrival(start_time, route, checkArrivalInterval), 10000)
    }
  }
  const checkArrival = async (start, route, interval) => {
    let end_location = route.raw_route.end_location;
    let current_location = await getUserLocation()

    if(calculate_distance(end_location, current_location) <= 10){
      let total_time = (new Date() - start) / 1000 / 60 // calculate total travel time in minutes
      let db = ref(database, `OldRoutes/user_${route.userId}/${route.routeId}`); // save route to oldRoutes
      set(db, route)

      db = ref(database, `onGoing/user_${route.userId}/${route.routeId}`) //remove route from onGoing
      remove(db);

      //save route data with total_time

      clearInterval(interval);
    }

  }

  const calculate_distance = (start, current) => { // calculates the aerial distance between 2 coordinates
    let lat1 = start.lat;
    let lon1 = start.lng;
    let lat2 = current.lat;
    let lon2 = current.lng;

    const R = 6371e3; // metres
    const φ1 = lat1 * Math.PI/180; // φ, λ in radians
    const φ2 = lat2 * Math.PI/180;
    const Δφ = (lat2-lat1) * Math.PI/180;
    const Δλ = (lon2-lon1) * Math.PI/180;

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    const d = R * c; // in metres

    return d;
  }

  const getUserLocation = async () => {
    let l = await AsyncStorage.getItem("UserLocation");
    l = JSON.parse(l)
    let coords = { lat: l.coords.latitude, lng: l.coords.longitude}
    return coords
  }
  const SuggestNewRoute = (current, destination) => {

  }

  const getToken = async() => {
    const token = await AsyncStorage.getItem('usertoken')
    const id = await AsyncStorage.getItem('userid')
    const db = ref(database, `Tokens/${id}/`);
    set(db, token)
    console.log("got token for user", id)
    getOnGoingRoutes(id);
  }
  const getOnGoingRoutes = (id) => {
    console.log("getting ongoing routes for user", id)
    const db = ref(database, `onGoing/user_${id}`)
    onChildAdded(db, (snapshot) => {
      let route = snapshot.val()
      route.raw_route = JSON.parse(route.raw_route)

      setOnGoingRoute(
        <TouchableOpacity 
          style={styles.Btn} 
          onPress={() => {navigation.navigate({
            name:"Map",
            params: { origin: route.routeData.Origin, destination: route.routeData.Destination, data:route }
          })}}>
          <Text style={styles.Txt}>View On-Going Route</Text>
        </TouchableOpacity>       
      )
      let dt = new Date(route.date.concat(" ", route.routeData.DepartureTime))

      //start the check when the departure time arrives
      let now = new Date()
      //if(dt - now < 0){ //commented for testing purposes. dont forget to uncomment
        //route is already finished, move to oldRoutes and end process
      //}
      //else{
      //let checkTimeout = setTimeout(() => {check(route)}, dt.getTime() - (now.getTime())) 
      check(route)
    //}
    })
  }
  useEffect(()=> {
    getToken();
  },[])

  return (
    <View style={styles.container}>
       <ImageBackground source={require('../images/way1.jpg')} resizeMode="cover" blurRadius={1} resizeMode="cover" style={styles.image}>
        <View>
            <Text style={styles.timely_title}>Timely</Text>
            <Text style={styles.timely_subtitle}>To the right place at the right time</Text>
            <TouchableOpacity
              style={styles.Btn}
              onPress={() => {navigation.navigate('Search Route')}}
              >
              <Text style={styles.Txt}>Look For a ride</Text>
            </TouchableOpacity>
            {onGoingRoute}
            {/* <TouchableOpacity
              style={styles.Btn}
              onPress={() => {navigation.navigate('UserLocation')}}
              >
              <Text style={styles.Txt}>location</Text>
            </TouchableOpacity> */}
        </View>
        <UserLocation/>
     </ImageBackground>
     <PushPage/>
    </View>
  );
}

const styles = StyleSheet.create({
  container:{
    width: '100%',
    height:'100%',
  },
  timely_title: {
    textAlign: 'center',
    justifyContent:'center',
    alignContent: 'center',
    fontWeight:'bold',
    color:'white',
    fontSize: 50,
    marginBottom:20
  },
  timely_subtitle:{
    textAlign: 'center',
    justifyContent:'center',
    alignContent: 'center',
    color:'white',
    fontWeight:'bold',
    fontSize: 20,
    marginBottom:20
  },
  image: {
    flex: 1,
    justifyContent: "center"
  },
  Btn:{
    width: 180,
    fontSize: 70,
    alignItems: 'center',
    backgroundColor: '#51aae1',
    padding: 10 ,     
    borderRadius: 25,
    marginLeft:-20,
    marginBottom:10,
    justifyContent: 'center',
    alignSelf: 'center',
  },
  Txt:{
    fontSize: 16,
    alignItems: 'center',
  }
})