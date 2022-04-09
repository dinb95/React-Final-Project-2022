import React from 'react';
import {View, StyleSheet, Text} from 'react-native'
import MapView, { Polyline } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';

export default function Map({route}){
  console.log("from map", route.params.data.raw_route.steps.length)

  const colors = {
    0: 'blue',
    1: 'green',
    2: 'orange',
    3: 'red'
  }

  const directions = route.params.data.raw_route.steps.map((step, index) => {
    let coords = [];
    console.log(route.params.data.raw_route.steps[1])
    // for(let i = 0; i > step.lat_lngs.length; i++){
    //   coords.push({latitude: step.lat_lngs[i].lat, longitude: step.lat_lngs[i].lng})
    // }
    return(
      <Polyline
        coordinates={coords}
        strokeColor={colors[index]}
        strokeWidth={5}
      />
      // <MapViewDirections
      //         origin={{latitude: step.start_location.lat, longitude: step.start_location.lng}}
      //         destination={{latitude: step.end_location.lat, longitude: step.end_location.lng}}
      //         mode={step.travel_mode}
      //         apikey='AIzaSyDvDTL7yUQocA1JXW90LtKibG_uRm9z-E4'
      //         strokeWidth={5}
      //         strokeColor={colors[index]}
              
      // />

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
             </MapView>
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
   });