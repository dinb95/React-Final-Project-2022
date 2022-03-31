import { View, Text, StyleSheet } from 'react-native';
import Route from './Route'
import React from 'react';

export default function RouteResults({route_results, navigation}) {
    let route_data = route_results.route_data;
    let route_dateTime = new Date(route_data.date)

    var routes = route_results.results.routes.map((direction, index) => {
        current_route = direction.legs[0]
    
        let lines = getLines(current_route);
        let sab = getStopsAndBuses(current_route);

        let dt = new Date(current_route.arrival_time.value * 1000) 
        let Hour = dt.getHours();
        let Minutes = dt.getMinutes();
        let arrival = formatTime(Hour, Minutes)
    
        dt = new Date(current_route.departure_time.value * 1000) 
        Hour = dt.getHours();
        Minutes = dt.getMinutes();
        departure = formatTime(Hour, Minutes)

        var bus_data = {
            arrival: arrival,
            departure: departure,
            duration: current_route.duration.text,
            lines: lines,
            origin: route_data.origin,
            destination: route_data.destination,
            date: route_dateTime,
            day: route_dateTime.getDay(),
            hour: Hour,
            stops: sab[0],
            numOfBuses: sab[1],
            routeDuration: current_route.duration.value, //in seconds
            routeDistance: current_route.distance.value, // in meters
            Rain: 0,
            timeTarget: route_data.TimeTarget,
            alarmClock: 0,
        }
        return <Route data={bus_data} key={index} navigation={navigation}/>
    })
    function getLines(route) {
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

  return (
    <View style={styles.container}>
      {routes}
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
        width:'100%',
        height: '100%',
       // marginLeft:30,
        display:'flex',
        justifyContent:'center',
        alignSelf: 'center',
        backgroundColor:'#cccccc'
        
    }
})
