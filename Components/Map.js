import React from 'react';
import {View, StyleSheet, Text} from 'react-native'
import MapView from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';

export default function Map(){
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
             <MapViewDirections
             origin='Hadera'
             destination='Ruppin Academic Center'
             mode='TRANSIT'
             apikey='AIzaSyDvDTL7yUQocA1JXW90LtKibG_uRm9z-E4'
             strokeWidth={3}
              />
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