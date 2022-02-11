import { View, Text } from 'react-native'
import React, {useEffect} from 'react'
import axios from 'axios';

let key = 'AIzaSyCCwWKnfacKHx3AVajstMk6Ist1VUoNt9w'
let loopCounter = 0;

export default function Prediction({route}) {
    var route_data = route.params.route_data

    useEffect(() => {
        getPrediction(route_data);
    })

    const getPrediction = (route_data) => {
        var route = {
            LineNumber: route_data.lines,
            Day: route_data.day,
            ArrivalTime: route_data.arrival,
            DepartureTime: route_data.departure,
            NumOfBuses: route_data.numOfBuses,
            Stops: route_data.stops,
            RouteDuration: route_data.routeDuration,
            RouteDistance: route_data.routeDistance,
            Origin: route_data.origin,
            Destination: route_data.destination,
            Rain: 0,
            Hour: route_data.hour
        }
        let api = "https://proj.ruppin.ac.il/bgroup54/test2/tar6/api/RouteRequest"
        fetch(api, {
        method: 'POST',
        body: JSON.stringify(route),
        headers: new Headers({
            'Content-type': 'application/json; charset=UTF-8',
            'Accept': 'application/json; charset=UTF-8'
          })
        })
        .then(res => {
            return res.json()
        })
        .then(
            (result) => { //add test time to route
                console.log("Data: ", route_data)
                runPrediction(result, route_data)
            })
        .catch(function(error) {
          console.log('There has been a problem with your fetch operation: ' + error.message);
            throw error;
          });
    }

    const runPrediction = (p, route_data) => {
        if(p == null){
            alert("No data was found, could not predict route time");
            //render default route
        }

        var Predicted_D = Math.ceil(p[0] / 60);

        let hm = route_data.departure.split(':');
        let hours = parseInt(hm[0])
        let minutes = parseInt(hm[1])

        let route_arrival = new Date(route_data.date);
        route_arrival.setHours(hours, minutes + Predicted_D) //get route predicted arrival time
        //if predicted arrival time is lower than the user's targetted arrival time:
        if (route_arrival.getTime() <= route_data.date) {
            console.log("arrival time good. arrival time: ", route_arrival,"route duration: ", Predicted_D)
            //if T-test failed - results aren't reliable        
            if (p[3] == 0) {
                console.log("t test failed, searching previous route")
                //render route
                searchPrevRoute(route_data)
            }
            else {
                console.log("route good, saving route")
                //render route and finish

                //render on map
                //save route for user
            }
        }
        else {
            console.log("the bus will arrive late, searching new route")
            //predicting the bus will arrive after the user's targetted arrival time
            //search for an earlier bus and predict route's arrival time again
            //////////////+=///////////////////////
            //render route
            searchPrevRoute(route_data)
        }

    }
    function searchPrevRoute(route){
        loopCounter++;
        var origin = route.origin;
        var destination = route.destination;
        var arrival = Math.ceil((route.date - (loopCounter * 10 * 60000)) / 1000)

        console.log(origin, destination, arrival)

        var config = {
            method: 'get',
            url: `https://maps.googleapis.com/maps/api/directions/json?origin=${origin}&destination=${destination}&mode=transit&transit_mode=bus&arrival_time=${arrival}&alternatives=true&key=${key}`,
            headers: { }
          };
          
          axios(config)
          .then(function (response) {
              console.log("got new route from google")
            let user_route_input = {
                origin:origin,
                destination:destination,
                date: route.date,
                TimeTarget: route.timeTarget
            }
            let new_route = getRouteParams(response.data, user_route_input) //get the relevant parameters for route arrival time prediction
            console.log("new route:",new_route)
            getPrediction(new_route);
            })
    }
    //get the relevant parameters for route arrival time prediction
    const getRouteParams = (new_route, user_route_input) => {
        let route_dateTime = new Date(user_route_input.date)
        
        current_route = new_route.routes[0].legs[0]
    
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
            origin: user_route_input.origin,
            destination: user_route_input.destination,
            date: route_dateTime,
            day: route_dateTime.getDay(),
            hour: Hour,
            stops: sab[0],
            numOfBuses: sab[1],
            routeDuration: current_route.duration.value, //in seconds
            routeDistance: current_route.distance.value, // in meters
            Rain: 0,
            timeTarget: user_route_input.TimeTarget,
            alarmClock: 0,
        }
        return bus_data;
    }


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
    <View>
      <Text>Prediction</Text>
    </View>
  )
}