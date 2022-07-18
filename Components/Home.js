import { View, Text, Button, StyleSheet,ImageBackground,TouchableOpacity, Alert } from 'react-native';
import React, {useState, useEffect} from 'react';
import PushPage from '../PushPage';
import { initializeApp } from 'firebase/app';
import { getDatabase, set, ref, onChildAdded, remove, onValue, get, child } from "firebase/database";
import AsyncStorage from '@react-native-async-storage/async-storage';
import UserLocation from './UserLocation';
import axios from 'axios';
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

let key = 'AIzaSyCCwWKnfacKHx3AVajstMk6Ist1VUoNt9w'

var user_location;
var buses_locations = []

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export default function Home({navigation}) {
  const [onGoingRoute, setOnGoingRoute] = useState(<></>)

  const route_setup = async (route) => {
  console.log("route setup")
  var buses_in_route = [];
  let steps = route.raw_route.steps;
  for(let i = 0; i < steps.length; i++){
    if(steps[i].travel_mode == "TRANSIT")
      buses_in_route.push(steps[i])
  }
  checkArrival(route, buses_in_route, 0, false)
}
const checkArrival = async (route, buses_in_route, index, flag) => {
  user_location = await getUserLocation()
  if(index < buses_in_route.length){
    const db = ref(database, `RunningBuses/user_${route.userId}`)
    onValue(db, (snapshot) => {
      data = snapshot.val()
      let tmpArr = []
      for(let line in data){
        tmpArr.push(data[line])
      }
      buses_locations = tmpArr;
    })
    try{
      check_locations(route, buses_in_route, index, flag, user_location, buses_locations)
    }
    catch{
      setTimeout(() => {checkArrival(route, buses_in_route, index, flag)}, 3000)
    } 
  }
  // no more buses are left in the route
  else if(calculate_distance(user_location, route.raw_route.end_location) <= 20){
    //the user arrived to the destination
      end_route(route)
    }
    else{
      // user did not reach his destination yet
      setTimeout(() => {checkArrival(route, buses_in_route, index, true)}, 3000)
    }
  }
  const check_locations = (route, buses_in_route, index, flag, user_location, buses_locations) => {
    let current_step = buses_in_route[index];
    let current_bus = buses_locations[index]
    if(flag){
      if(calculate_distance(user_location, current_bus) < 25) // user is on the bus
        setTimeout(() => {checkArrival(route, buses_in_route, ++index, false)}, 3000)
      else UserMissedBusAlert(user_location, route.routeData.Destination) // user missed the bus
    }
    else{
      //console.log("distance from the bus to the bus stop:",calculate_distance(current_step.start_location, current_bus))
      if(calculate_distance(current_step.start_location, current_bus) <= 30){ // bus is near the bus stop
        if(calculate_distance(current_step.start_location, user_location) <= 20){ //user is near the bus stop
          //check for a few seconds if the distance between the user and the bus increased
          setTimeout(() => {checkArrival(route, buses_in_route, index, true)}, 30000)
        }
        else UserMissedBusAlert(route.userId, user_location, route.routeData.Destination) //the user missed the bus
      }
      else{
        // bus did not arrive at the bus stop yet
        setTimeout(() => {checkArrival(route, buses_in_route, index, flag)}, 3000)
      }
    }
  }
  const UserMissedBusAlert = (user_location, destination) => {
    Alert.alert("Too Far!",
    "It seems that you're too far from the departure station. Would you like to get a new route from your current location?",
    [{text:"No", onPress: () => cancel_route() ,style: "cancel"},{text:"Yes", onPress: () => SuggestNewRoute(user_location, destination)}])
  }

  const cancel_route = (id) => {
    let db = ref(database, `onGoing/user_${id}`) //remove route from onGoing
    remove(db);
    setOnGoingRoute(<></>)
  }

  const end_route = (route) => {
    let route_summary = route.routeData;
    let now = new Date();
    let arrival = `${now.getHours()}:${now.getMinutes()}`;

    let dep_split = route_summary.DepartureTime.split(':'); // convert from "HH:MM" to the actual values
    let departure_time = new Date()
    departure_time.setHours(dep_split[0], dep_split[1]);
    let duration = now.getTime() - departure_time.getTime();

    route_summary["ArrivalTime"] = arrival;
    route_summary["RouteDuration"] = duration / 1000; 

    let api = "https://proj.ruppin.ac.il/bgroup54/test2/tar6/api/RouteData"
    fetch(api, {
        method: 'POST',
        body: JSON.stringify(route_summary),
        headers: new Headers({
            'Content-type': 'application/json; charset=UTF-8',
            'Accept': 'application/json; charset=UTF-8'
        })
    })
    let db = ref(database, `OldRoutes/user_${route.userId}/${route.routeId}`); // save route to oldRoutes
    set(db, route)

    db = ref(database, `onGoing/user_${route.userId}/${route.routeId}`) //remove route from onGoing
    remove(db);
  }
  
  const SuggestNewRoute = (current, destination) => {
    var config = {
      method: 'get',
      url: `https://maps.googleapis.com/maps/api/directions/json?origin=${current}&destination=${destination}&mode=transit&transit_mode=bus&key=${key}`,
      headers: { }
    };
    
    axios(config)
    .then(function (response) {
      route = {
        raw_route: response.data.routes[0].legs
      }
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
    })
    .catch(function (error) {
      console.log(error);
    });
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
            params: { origin: route.routeData.Origin, destination: route.routeData.Destination, data:route, userId: id }
          })}}>
          <Text style={styles.Txt}>View On-Going Route</Text>
        </TouchableOpacity>       
      )
      let date = route.date.split("-")
      let time = route.routeData.DepartureTime.split(":")
      let dt = new Date()
      dt.setMonth(date[0] - 1);
      dt.setDate(date[1]);
      dt.setFullYear(date[2])
      dt.setHours(time[0]);
      dt.setMinutes(time[1])
      console.log(date)
      //start the check when the departure time arrives
      let now = new Date()
      console.log(dt - now)
      if(dt - now < 0){
        
        //route is already finished, move to oldRoutes and end process
        let db = ref(database, `OldRoutes/user_${route.userId}/${route.routeId}`); // save route to oldRoutes
        set(db, route)
  
        db = ref(database, `onGoing/user_${route.userId}/${route.routeId}`) //remove route from onGoing
        remove(db);
        setOnGoingRoute(<></>)
      }
      else{
      let checkTimeout = setTimeout(() => {route_setup(route)}, 1000) 
      //let checkTimeout = setTimeout(() => {route_setup(route)}, dt.getTime() - (now.getTime())) 
      }
    })
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
  const getToken = async() => {
    const token = await AsyncStorage.getItem('usertoken')
    const id = await AsyncStorage.getItem('userid')
    const db = ref(database, `Tokens/${id}/`);
    set(db, token)
    console.log("got token for user", id)
    getOnGoingRoutes(id);
  }
  useEffect(()=> {
    getToken();
  },[])

  return (
    <View style={styles.container}>
       <ImageBackground source={require('../images/way1.jpg')} resizeMode="cover" blurRadius={1} style={styles.image}>
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