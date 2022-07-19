import React, {useEffect, useState} from 'react';
import {View, StyleSheet, Text} from 'react-native'
import MapView, {Marker} from 'react-native-maps';
import Polyline from '@mapbox/polyline';
import Icon from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import Step from '../Bus Instructions/Step'
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler'
import { List } from 'react-native-paper';
import { getDatabase, ref, onValue } from "firebase/database";
import { initializeApp } from 'firebase/app';

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

export default function Map({route}){
  const [useShow, setShow]  = useState(false);
  const [useLocation, setLocation] = useState(<></>);
  const [busMarkers, setBusMarkers] = useState(<></>);

  useEffect(() => {
    if(route.params.userId){
      const db = ref(database, `RunningBuses/user_${route.params.userId}`)
      onValue(db, (snapshot) => {
        let data = snapshot.val()
        let arr = [];
        for(let line in data){
          arr.push(data[line]);
        }
        renderMarkers(arr);
      })
    }
  }, [])

  const renderMarkers = (arr) => {
    let rr = route.params.data.raw_route
    let buses = []
    for(let i = 0; i < rr.steps.length; i++){
      if(rr.steps[i].travel_mode == "TRANSIT")
        buses.push(rr.steps[i].transit_details.line.short_name)
    }
    const markers = arr.map((bus, index) => {
      return (<Marker
      key={`bus_${buses[index]}`}
      coordinate={{latitude: parseFloat(bus.lat), longitude: parseFloat(bus.lng)}}
      title={`Bus ${buses[index]}`}
      >
        <View style={styles.bubble}>
          <Icon name="bus" size={30} />
          </View>
    </Marker>
      )
    })
    setBusMarkers(markers)
  }


  let steps = route.params.data.raw_route.steps
  const instructions = steps.map((step, index) => {
    return (
      <Step data={step} key={index} index={index}/>
    )
  })
  
  const getLocation = async () => {
    let l = await AsyncStorage.getItem("UserLocation");
    l = JSON.parse(l)
    let coords = { latitude: l.coords.latitude, longitude: l.coords.longitude}
    setLocation(
      <Marker coordinate={coords} title={"Your Location"}>
      </Marker>
    )
  }
  const show_instructions = () => {
    setShow(!useShow)
  }
  useFocusEffect(
    React.useCallback(() => {
      let interval = setInterval(getLocation, 5000)
      return (() => {
        clearInterval(interval)
      })
    }, [])
  )
  const colors = {
    0: 'blue',
    1: 'green',
    2: 'orange',
    3: 'red'
  }
  const directions = route.params.data.raw_route.steps.map((step, index) => {
    let points = Polyline.decode(step.polyline.points);
    let coords = points.map((point) => {
      return  {
          latitude : point[0],
          longitude : point[1]
      }
  })

    // let markerCoords = {
    //   latitude: coords[(coords.length) / 2].latitude,
    //   longitude: coords[(coords.length) / 2].longitude
    // }
    return(
      step.travel_mode === 'WALKING' ? 
      <>
      <MapView.Polyline
        coordinates={coords}
        strokeColor={colors[index % 4]}
        strokeWidth={5}
        lineDashPattern={[1]}
        
      />
      {/* <Marker
        key={index}
        coordinate={markerCoords}
        title={"WALKING"}
        >
          <Image source={require('../images/walking.png')} style={{height: 35, width:35 }} />
        </Marker> */}
    </>
      :
      <>
      <MapView.Polyline
      coordinates={coords}
      strokeColor={colors[index % 4]}
      strokeWidth={5}
      
    />
      {/* <Marker
        coordinate={markerCoords}
        anchor={{x:1.2, y:1.2}}
        >
        <View style={styles.bubble}>
          <Icon name="bus" size={30} />
          <Text>921</Text>
          </View>
        </Marker> */}
        <Marker
          coordinate={coords[0]}
          title={"Bus Station"}
        >
        </Marker>
        {busMarkers}
    </>
    )
  })
    return(
        <View style={styles.container}>
          <MapView
            style={styles.map}
            initialRegion={{
              latitude: 32.4365,
              longitude: 34.9196,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
            >
            {directions}
            {useLocation}
            </MapView>
             {useShow && (
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Arrival Instructions</Text>
              <ScrollView>
               <List.AccordionGroup >
                 {instructions}
                </List.AccordionGroup>
              </ScrollView>
            </View>
             )}
            <View style={{position:"absolute", flex:1}}>
              <TouchableOpacity style={styles.instructionsBtn} onPress={() => show_instructions()}> 
                {!useShow ? <Text style={styles.instructionsTxt}>Show Instructions</Text> : <Text>Hide Instructions</Text>}
              </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
      ...StyleSheet.absoluteFillObject,
      height: '100%',
      width: '100%',
      justifyContent: 'flex-end',
      alignItems: 'center',
    },
    map: {
      ...StyleSheet.absoluteFillObject,
    },
    bubble:{
      flex: 1,
      paddingHorizontal: 18,
      paddingVertical: 12,
    },
    card: {
      backgroundColor:'white',
      height: 200,
      width: "90%",
      marginVertical: 10,
      shadowColor: '#999',
      shadowOffset: {width: 0, height: 1},
      shadowOpacity: 0.8,
      opacity: 0.8,
      shadowRadius: 2,
      elevation: 5,
      position:'absolute',
      bottom: 50,
      borderRadius:7,
      borderWidth: 0.5,
      marginBottom: 20,
    },
    cardTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom:5,
      textAlign:"center"
    },
    cardInfo: {
      fontSize: 16,
      color: '#444',
      position:'relative',
    },
    instructionCard : {
      flex: 1,
      flexDirection: 'row',
      marginLeft:5,
      marginBottom: 10
    },
    instructionsBtn: {
      position: 'relative',
      height: 40,
      width: '100%',
      alignItems: 'center',
      justifyContent: 'center',
      alignSelf: 'center',
      backgroundColor: '#bddff5',
      padding: 3,
      borderRadius: 7,
      borderStyle: 'solid',
      borderWidth: 1,
      borderColor: 'black',
      fontSize: 18,
      margin: 10,
      marginBottom: 20
    },
    instructionsTxt: {
      fontWeight: 'bold',
    }
   });