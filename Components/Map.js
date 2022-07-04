import React, {useEffect, useState} from 'react';
import {View, StyleSheet, Text, Image} from 'react-native'
import MapView, {Marker, Callout} from 'react-native-maps';
import Polyline from '@mapbox/polyline';
import Icon from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import Step from '../Components/Bus Instructions/Step'
import { ScrollView } from 'react-native-gesture-handler'

export default function Map({route}){
  const [useLocation, setLocation] = useState(<></>)

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
    console.log(coords)
    setLocation(
      <Marker coordinate={coords} title={"Your Location"}>
      </Marker>
    )
  }
  useFocusEffect(
    React.useCallback(() => {
      let interval = setInterval(getLocation, 5000)
      return (() => {
        console.log("removing interval")
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
  console.log("from map:", route.params.data)
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
      step.travel_mode=== 'WALKING' ? 
      <>
      <MapView.Polyline
        coordinates={coords}
        strokeColor={colors[index]}
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
      strokeColor={colors[index]}
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
             <View style={styles.card}>
              <Text style={styles.cardTitle}>Arrival instructions {"\n"} </Text>
              <Text style={styles.cardInfo}> {instructions}</Text>
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
      backgroundColor: 'rgba(255,255,255,0.7)',
      paddingHorizontal: 18,
      paddingVertical: 12,
      borderRadius: 20,
    },
    card: {
      backgroundColor:'#cccccc',
      height: 200,
      width: 250,
      marginVertical: 10,
      flexDirection: 'row',
      shadowColor: '#999',
      shadowOffset: {width: 0, height: 1},
      shadowOpacity: 0.8,
      shadowRadius: 2,
      elevation: 5,
      position:'absolute',
      top: 10,
      left: 10,
      borderRadius:7,

    },
    cardTitle: {
      fontSize: 20,
      fontWeight: 'bold',
    },
    cardInfo: {
      fontSize: 18,
      color: '#444',
      position:'relative',
      top: 26,
      left: -170,


    },
    
   });