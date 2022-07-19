import { View, Text, StyleSheet, Alert } from 'react-native'
import React from 'react'
import { initializeApp } from "firebase/app";
import { getDatabase, ref, remove, set } from "firebase/database";
import { TouchableOpacity } from 'react-native-gesture-handler';
import axios from 'axios';

const B = (props) => <Text style={{fontWeight: 'bold'}}>{props.children}</Text>

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

let key = 'AIzaSyCCwWKnfacKHx3AVajstMk6Ist1VUoNt9w'

export default function Travel({data, del}) {
  let rd;
  let date;
  if(data.routeData == undefined){
    rd = data
    date = data.routeDate
  }
  else {
    rd = data.routeData;
    date = data.date;
  }
  function getLines(route) {
    console.log(route.steps)
    let lines = ""
    for (let i = 0; i < route.steps.length; i++) {
        if (route.steps[i].travel_mode == "TRANSIT")
            lines += route.steps[i].transit_details.line.short_name + " ";
    }
    return lines
  }
function getStopsAndBuses(route) {
    let stops = 0;
    let numOfBuses = 0;
    for (let i = 0; i < route.steps.length; i++) {
        if (route.steps[i].travel_mode == "TRANSIT") {
            //count the number of stops and buses
            stops += route.steps[i].transit_details.num_stops;
            numOfBuses++;
        }
    }
    let list = [stops, numOfBuses]
    return list;
  }
  function formatTime(h, m){
    if (m < 10) 
        return `${h}:0${m}`
    else 
        return `${h}:${m}`
}

  const alertDelete = () => {
    Alert.alert("Delete Route",
    "Are you sure?",
    [{text:"No" ,style: "cancel"},{text:"Yes", onPress: () => deleteRoute()}])
  }
  const deleteRoute = () => {
    let db = ref(database, `PlannedRoutes/user_${data.userId}/${data.routeId}`);
    remove(db);
    db = ref(database, `TestRoutes/user_${data.userId}/${data.routeId}`);
    remove(db);
    db = ref(database, `onGoing/user_${data.userId}/${data.routeId}`)
    remove(db);
  }
  const changeRoute = () => {
  
    let routeData;
    let route;
    let arrival = new Date();
    let hm = data.timeTarget.split(":");

    arrival.setHours(hm[0], hm[1])
    console.log(arrival)
    arrival = Math.ceil(arrival.getTime() / 1000)
    var config = {
      method: 'get',
      url: `https://maps.googleapis.com/maps/api/directions/json?origin=${rd.Origin}&destination=${rd.Destination}&arrival_time=${arrival}&mode=transit&transit_mode=bus&key=${key}`,
      headers: { }
    };
    console.log(arrival)
    
    axios(config)
    .then(function (response) {
      let current_route = response.data.routes[0].legs[0]
      console.log(current_route)
      let lines = getLines(current_route);
      let sab = getStopsAndBuses(current_route);

      let dt = new Date(current_route.arrival_time.value * 1000) 
      let Hour = dt.getHours();
      let Minutes = dt.getMinutes();
      let arrival = formatTime(Hour, Minutes)
  
      dt = new Date(current_route.departure_time.value * 1000) 
      Hour = dt.getHours();
      Minutes = dt.getMinutes();
      let departure = formatTime(Hour, Minutes)

      routeData = {
        ArrivalTime: arrival,
        Day: rd.Day,
        DepartureTime: departure,
        Destination: rd.Destination,
        Hour: Hour,
        LineNumber: lines,
        NumOfBuses: sab[1],
        Origin: rd.Origin,
        Rain: rd.Rain,
        RouteDistance: current_route.duration.value,
        RouteDuration: current_route.distance.value,
        Stops: sab[0],
      }

      route = {
        TestTime: data.TestTime,
        alarmClock: data.alarmClock,
        date: date,
        raw_route: JSON.stringify(current_route),
        routeData: routeData,
        timeTarget: data.timeTarget,
        userId: data.userId,
      }
      let db = ref(database, `PlannedRoutes/user_${data.userId}/${data.routeId}_0`);
      set(db, route);
      deleteRoute();
    })
  }

  return (
      <View>
         <View style={styles.container}>
         <View style={{ flexDirection: 'row',flex:0.8,justifyContent: "center",alignItems: "center"}}> 
        <Text style={styles.dateTitle}>{date}</Text>
        </View>
            <Text style={styles.Txt}><B>Origin:</B>  {rd.Origin}</Text>
            <Text style={styles.Txt}><B>Destination:</B> {rd.Destination}</Text>
            <Text style={styles.Txt}><B>Arrival Time: </B>{rd.ArrivalTime}</Text>
            <Text style={styles.Txt}><B>Departure Time:</B> {rd.DepartureTime}</Text>
            <Text style={styles.Txt}><B>Lines: </B>{rd.LineNumber}</Text>
            {del  && rd.ArrivalTime > data.timeTarget ?  (
            <View>
            <View style={styles.lateView}>
              <Text style={styles.lateTxt}>It seems the bus is running late..</Text>
              </View>
              <View style={styles.deleteView}>
              <TouchableOpacity style={styles.deleteBtn} onPress={() => {changeRoute()}}>
                <Text style={styles.deleteTxt}>Change Route</Text>
              </TouchableOpacity>
            </View>
            </View>
              )
              :
              del && (<View style={styles.deleteView}>
              <TouchableOpacity style={styles.deleteBtn} onPress={() => {alertDelete()}}>
                <Text style={styles.deleteTxt}>Delete Route</Text>
              </TouchableOpacity>
            </View>)
            }
        </View>
      </View>
  )
}
const styles = StyleSheet.create({
    container: {
        height: 210,
        width:'95%',
        borderColor:'black',
        borderStyle:'solid',
        borderWidth: 1,
        backgroundColor:"white",
        marginBottom: 10,
        alignSelf: 'center', 
        borderRadius:7,
    },
    Txt:{
        margin: 2,
        fontSize:16,
        paddingLeft:10,
      },
    dateTitle: {
      fontSize:18, 
      color:'#51aae1',
      fontWeight: "bold",
      marginTop:5,
      textDecorationLine: 'underline'
    },
    lateView: {
      justifyContent: 'center',
      alignItems: 'center',
    },
    lateTxt: {
      color: 'red'
    },
    deleteView: {
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 0
      },
    deleteBtn: {
      backgroundColor: "red",
      padding: 3,
      borderWidth: 1,
      borderRadius: 10
    },
    deleteTxt: {
      color: "white"
    }
})