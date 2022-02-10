import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import React from 'react';

export default function Route({data}) {

    const getPrediction = () => {
        var route = {
            LineNumber: data.lines,
            Day: data.day,
            ArrivalTime: data.arrival,
            DepartureTime: data.departure,
            NumOfBuses: data.numOfBuses,
            Stops: data.stops,
            RouteDuration: data.routeDuration,
            RouteDistance: data.routeDistance,
            Origin: data.origin,
            Destination: data.destination,
            Rain: data.rain,
            Hour: data.hour
        }

        let api = "http://localhost:58913/api/RouteRequest"
        fetch(api, {
        method: 'POST',
        body: JSON.stringify(route),
        headers: {
            'Content-Type': 'application/json; charset=UTF-8',
        }
        })
        .then(res => {
            return res.json()
        })
        .then(
            (result) => { //add test time to route
                console.log(result)
            })
    }
    
  return (
    <View style={styles.container}>
      <Text>Arrival: {data.arrival}</Text>
      <Text>Departure: {data.departure}</Text>
      <Text>Duration: {data.duration}</Text>
      <Text>Lines: {data.lines}</Text>
      <TouchableOpacity style={styles.saveBtn} onPress={getPrediction}>
        <Text>Save Route</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
        height: 110,
        width:'100%',
        borderColor:'black',
        borderStyle:'solid',
        borderWidth: 1,
        margin: 5,
        padding:5
    },
    saveBtn: {
        position:'relative',
        width:'20%',
        backgroundColor: 'lightblue',

    }
})
