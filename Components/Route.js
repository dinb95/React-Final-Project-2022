import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import React from 'react';
import axios from 'axios';

export default function Route({data, navigation}) {
    console.log(data)

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
            Rain: 0,
            Hour: data.hour
        }
        console.log(route)
        let api = "https://proj.ruppin.ac.il/bgroup54/test2/tar6/api/RouteRequest"
        fetch(api, {
        method: 'POST',
        body: JSON.stringify(route),
        headers: new Headers({
            'Content-type': 'application/json; charset=UTF-8', //very important to add the 'charset=UTF-8'!!!!
            'Accept': 'application/json; charset=UTF-8'
          })
        })
        .then(res => {
            return res.json()
        })
        .then(
            (result) => { //add test time to route
                console.log(result)
                data["date"] = data.date.getTime()
                console.log("Result: ",result, "Data: ", data)
                navigation.navigate({
                  name: 'Prediction Process',
                  params: {predParams: result, route_data: data}
  
              })
            })
        .catch(function(error) {
          console.log('There has been a problem with your fetch operation: ' + error.message);
           // ADD THIS THROW error
            throw error;
          });
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
