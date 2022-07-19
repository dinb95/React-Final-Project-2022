const fetch = require("node-fetch");
var axios = require('axios');
const lineReader = require('line-reader');
const http = require('http');

const hostname = '127.0.0.1';
const port = 3000;

//configurate and initialize firebase
var admin = require("firebase-admin");
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://final-project-din-and-hadar-default-rtdb.europe-west1.firebasedatabase.app"
});

const { getDatabase } = require('firebase-admin/database');
var testList = {};
let simList = [];

executeMainFunction = setInterval(mainFunction, 60000)

var GTFS_lines = [];
var GTFS_Shapes = [];
var test_routes = [];

// Get a database reference to our blog
mainFunction();
function mainFunction(){
    updateRoutes();
    validateRoutes()
}


bus_simulation();
async function bus_simulation(){

    const db = getDatabase();
    GTFS_Shapes = await get_GTFS();
    console.log("shapes: ",GTFS_Shapes)

    console.log("gtfs lines: ",GTFS_lines)
    const ref = db.ref("/PlannedRoutes/")
    ref.on("child_added", async (snapshot) =>  {
        var data = snapshot.val();
        for(let d in data){
           let steps = JSON.parse(data[d].raw_route).steps
           for(let i = 0; i < steps.length; i++){
               if(steps[i].travel_mode == "TRANSIT"){
                var short_name = steps[i].transit_details.line.short_name
                var long_name = steps[i].transit_details.line.name
                console.log(short_name);
                getShape(short_name, long_name);
               }
           }
           
        }
    })
}


async function getShape(short_name, long_name){
    console.log("getting shape for", short_name)
    console.log(GTFS_Shapes)
        var coords = []
        let i = 1;
        var route_id; var shape_id;

        lineReader.eachLine('./routes.txt', function(line, last) {
            let sep = line.split(',');
            if(long_name == sep[3]){
                route_id = sep[0]
                return false;
            }
        })
        lineReader.eachLine('./trips.txt', function(line, last) {
            let sep = line.split(',');
            if(route_id == sep[0]){
                shape_id = sep[5];
                return false;
            }
        })
        lineReader.eachLine('./shapes.txt', function(line, last){
        let sep = line.split(',');
        if(sep[0] == shape_id){
            coords.push({lat: sep[1], lng: sep[2]})
            }
        else if(coords.length != 0){
                console.log("adding to firebase", route_id)
                const db = getDatabase();
                const ref = db.ref(`/GTFS_Shapes/${route_id}/`)
                ref.set({ 
                    shape: JSON.stringify(coords),
                    long_name: long_name
                });
                return false;
            }
        })                    
}

async function get_GTFS(){
    let shapes = []
    const db = getDatabase();
    // const GTFS_ref = db.ref("/GTFS/")
    // GTFS_ref.on("value", (snapshot) => {
    //     let data = snapshot.val();
    //     for (let d in data){
    //         GTFS_lines.push(d);
    //     }
    // })
    const Shapes_ref = db.ref("/GTFS_Shapes")
    await Shapes_ref.on("value", async (snapshot) => {
        let data = snapshot.val();
        for (let d in data){
            shapes.push(d);
        }
        console.log("shapes:", shapes)
        
    })
    return shapes;

}

function updateRoutes(){
    const db = getDatabase()
    const ref = db.ref("/PlannedRoutes/")
    // get the routes in TestRoutes
    ref.on("child_added", snapshot =>{ 
        console.log("updating routes")
        let routes = snapshot.val()
        let today = new Date()
        for(r in routes){
            let route = routes[r]
            let date = new Date(route.date);
            if(date.getMonth() == today.getMonth()){
                if(date.getDate() == today.getDate()){
                    if(startTest(route) && !(test_routes.includes(r))){ // if true, need to start checking the route
                        test_routes.push(r);
                        saveToFb("TestRoutes", route, r) //save routes we need to test now
                        console.log(test_routes);
                        let [h, m] = route.routeData.ArrivalTime.split(":")
                        let arrival = new Date()
                        arrival.setHours(h, m)

                        setTimeout(() => {
                            deleteFromFb("PlannedRoutes", route, r.routeId)
                        }, arrival.getTime() - new Date().getTime()); 
                }}}
            if(date.getMonth() <= today.getMonth() && date.getDate() < today.getDate())
                deleteFromFb("PlannedRoutes", route, r)
            }})
}


//if route is already over, delete route from testRoutes and move it to oldRoutes
function validateRoutes(){ 
    //list?
    console.log("validating...")
    let now = new Date();
    const db = getDatabase()
    const ref = db.ref("/TestRoutes/")
    ref.once("value", snapshot =>{ //get the routes in TestRoutes
        users = snapshot.val()
        for(var user in users){ //for each user
            let routes = users[user]
            for (var route in routes){ // for every route
                r = routes[route]

                let time = r.timeTarget.split(':');
                let date = r.date.split('-');
                let tt = new Date(date[2],date[1]-1,date[0]);
                tt.setHours(time[0], time[1])

                //if route already over, delete
                if(now > tt){
                    deleteFromFb("TestRoutes", r, route)
                    saveToFb("OldRoutes", r, route)
                }
                else {
                    let t = r.routeData.DepartureTime.split(':')
                    let dt = new Date()
                    dt.setHours(t[0], t[1])
                    r["routeId"] = route;
                    testRoute(r, dt, user);
                    if(!simList.includes(user.split('_')[1])){
                        simulate_route(r, user)
                        simList.push(user.split('_')[1])
                    }
                    else{
                        console.log(simList)
                    }
                }
            }
        }
    })
}

//simulate buses for a route
function simulate_route(route, user){
    let buses_in_route = []
    let shapes_for_route = []
    let steps = JSON.parse(route.raw_route).steps
    for(let i = 0; i < steps.length; i++){
        if(steps[i].travel_mode == "TRANSIT"){
            buses_in_route.push({
                name: steps[i].transit_details.line.name,
                short_name: steps[i].transit_details.line.short_name,
                departure_time: steps[i].transit_details.departure_time.value, 
                departure_location: steps[i].transit_details.departure_stop.location,
                route: steps[i]
            })
        }
    }

    const db = getDatabase()
    const ref = db.ref("/GTFS_Shapes/")
    
    ref.on("value", snapshot => {
        let data = snapshot.val();
        var shapes = []
        for (let d in data){
            shapes.push({data: data[d], route_id: d})
        }
        for(let i = 0; i < buses_in_route.length; i++){
            for(let j = 0; j < shapes.length; j++){
                if(buses_in_route[i].name == shapes[j].data.long_name){
                    shapes_for_route.push(shapes[j]);
                }
            }
        }
        run_buses(buses_in_route, shapes_for_route, user, route)
    })
}
// simulate the buses according to the shapes and buses the route has
function run_buses(buses, shapes, user, route){
    var intervals = []
    var delays = [];
    try{
        for(let i = 0; i < buses.length; i++){
            let shape = JSON.parse(shapes[i].data.shape);
            let now = new Date()
            let departure_time = new Date(buses[i].departure_time * 1000)
    
            let stop_index = find_stop_index(shape, buses[i])
            //let random = (Math.random() * (0.3) + 0.9)
            let random = 2;
            if (random > 1)
                delays.push({random: random, bus: buses[i]});
            intervals.push(setInterval(function (){
                if(shape.length == 0){
                    clearInterval(intervals[i]);
                    const db = getDatabase();
                    const ref = db.ref(`/RunningBuses/${user}/${shapes[i].route_id}/`);
                    ref.remove();
                    let index = simList.indexOf(user.split("_")[0])
                    if(index != -1)
                        simList.splice(index, 1);
                }
                else{
                const db = getDatabase();
                const ref = db.ref(`/RunningBuses/${user}/${[i]}/`);
                ref.set(shape.shift())
                }
            }, ((departure_time - now) / stop_index)) * random)//Math.random() * (0.3) + 0.9) // add random delay multiplier 0.90 - 1.20 
        }
        handleDelays(delays, user, route);
    }
    catch(err){
        console.log("297: ",err)
        setTimeout(() => {run_buses(buses, shapes, user, route)}, 10000)
    }
}
// update the new arrival time (delay) in the firebase
function handleDelays(delays, userId, route){
    let total_delay = 0;
    for(let i = 0; i < delays.length; i++){
        total_delay += delays[i].bus.route.duration.value * delays[i].random
    }

    raw_route = JSON.parse(route.raw_route)
    let arrival_date = new Date((raw_route.arrival_time.value + total_delay) * 1000);

    const db = getDatabase()
    arrival_date = formatTime(arrival_date.getHours(), arrival_date.getMinutes())

    if(route.timeTarget < arrival_date){
        console.log("sending delay notification")

        let id = userId.split('_')

        const ref = db.ref(`/Tokens/${id[1]}`)
        ref.once("value", snapshot =>{
            let token = snapshot.val();
            sendPushNotification(token, 'We Detected a Delay in your route!');
        })
}
    let update = {}
    update[`/PlannedRoutes/${userId}/${route.routeId}/routeData/ArrivalTime`] = arrival_date
    console.log(update)

    db.ref().update(update)
}
//approximating the index in the shape where the relevant bus stop is located
function find_stop_index(shape, bus){
    for(let i = 0; i < shape.length; i++){
        let coords = {
            lat: parseFloat(shape[i].lat),
            lng: parseFloat(shape[i].lng)
        }
        if(calculate_distance(coords, bus.departure_location) <= 30){
            return i;
        }
    }
    return shape.length
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

const LT = 10000;
const L = 420000;
const M = 300000
const S = 120000

// set an testing interval for each route.
function testRoute(route, depTime, user){
    let now = new Date();
    let timeDiff = Math.ceil((depTime - now) / 60 / 1000)

    if(!route.routeId.includes("_")){
        try{
            if(timeDiff > 60){
                if(testList[route.routeId].intervalTime != L){
                    console.log("-------------7 minutes------------- ", route.routeId)
                    clearInterval(testList[route.routeId].intervalId);
                    testList[route.routeId] = {
                        intervalId: setInterval(function() {getPrediction(route, false);}, L),
                        intervalTime: L
                    }
                    saveToFb("/onGoing/", route, route.routeId)
                    getPrediction(route, false)
                }
            }
            else if(timeDiff > 30){
                if(testList[route.routeId].intervalTime != M){
                    console.log("-------------5 minutes------------- ", route.routeId)
                    clearInterval(testList[route.routeId].intervalId);
                    testList[route.routeId] = {
                        intervalId: setInterval(function() {getPrediction(route, false);}, M),
                        intervalTime: M
                    }
                    saveToFb("/onGoing/", route, route.routeId)
                    getPrediction(route, false);
                }
            }
            else if(timeDiff > 10){
                if(testList[route.routeId].intervalTime != S){
                    console.log("-------------2 minutes------------- ", route.routeId)
                    clearInterval(testList[route.routeId].intervalId);
                    testList[route.routeId] = {
                        interval: setInterval(function() {getPrediction(route, false);}, S),
                        intervalTime: S
                    }
                    saveToFb("/onGoing/", route, route.routeId)
                    getPrediction(route, false);
                }
            }
            // the route is about to start. send a notification to the user and delete from "TestRoutes"
            else{
                let id = user.split('_')
                const db = getDatabase()
                const ref = db.ref(`/Tokens/${id[1]}`)
                ref.once("value", snapshot =>{
                    let token = snapshot.val();
                    sendPushNotification(token, 'You will need to leave your house in 10 Minutes!');
                })
                clearInterval(testList[route.routeId].intervalId);
                deleteFromFb("/TestRoutes/", route, route.routeId)
                saveToFb("/onGoing/", route, route.routeId)
            }
            // if user defined an alarm clock
            if(route.alarmClock != 0){
                let alarmTime = new Date(depTime - (route.alarmClock * 60 * 1000))
                if(now > alarmTime){
                    let id = user.split('_')
                    const db = getDatabase()
                    const ref = db.ref(`/Tokens/${id[1]}`)
                    ref.once("value", snapshot =>{
                        let token = snapshot.val();
                        sendPushNotification(token, `You need to leave the house in ${route.alarmClock} minutes. Time to get ready!`);
                    })
                    deleteFromFb("/TestRoutes/", route, route.routeId)
                    saveToFb("/onGoing/", route, route.routeId)
                    route.alarmClock = 0;
            }
        }
        //default state, will be executed if "testList" does not contain the corresponding interval
        } catch{
            console.log("-------------7 minutes------------- from catch ", route.routeId)
            testList[route.routeId] = {
                interval: setInterval(function() {getPrediction(route, false);}, LT),
                intervalTime: L
            }
            //saveToFb("/onGoing/", route, route.routeId)
            getPrediction(route, false);
        }
    }
    else{
        saveToFb("/onGoing/", route, route.routeId)
        if(timeDiff < 10){
            let id = user.split('_')
            const db = getDatabase()
            const ref = db.ref(`/Tokens/${id[1]}`)
            ref.once("value", snapshot =>{
                let token = snapshot.val();
                sendPushNotification(token, `You need to leave the house in ${route.alarmClock} minutes. Time to get ready!`);
            })
            deleteFromFb("/TestRoutes/", route, route.routeId)
        } 
    }
}
// send notification to the user
async function sendPushNotification(expoPushToken, body) {
        const message = {
            to: expoPushToken,
            sound: 'default',
            title: 'Timely',
            body: body,
        };
        await fetch('https://exp.host/--/api/v2/push/send', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Accept-encoding': 'gzip, deflate',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(message),
        });
    }
function get_Date(stringDate){   
    let d = new Date();
    let [hours, minutes] = stringDate.split(':');
    return d.setHours(hours, minutes);
}

// get the prediction parameters from the c# server
function getPrediction(route, flag){
    let api = "https://proj.ruppin.ac.il/bgroup54/test2/tar6/api/RouteRequest"
    fetch(api, {
      method: 'POST',
      body: JSON.stringify(route.routeData),
      headers: {
        'Content-Type': 'application/json; charset=UTF-8',
      }
  })
      .then(res => {
          return res.json()
      })
      .then(
          (result) => { //add test time to route
            route["TestTime"] = calculateTestTime(route.alarmClock, result);
            if(result[3] == 0 || get_Date(route.timeTarget) < get_Date(route.routeData.DepartureTime) + Math.ceil(result[0] * 1000)){
                console.log("------- need to change a bus -------");
                getNewDirections(route);
            }
            else if(flag){
                //update existing route
                console.console.log("------- good bus, we update in the DB  -------");
                let api = "https://proj.ruppin.ac.il/bgroup54/test2/tar6/api/UsersManagement/"+ route.routeId
                fetch(api, {
                  method: 'PUT',
                  body: JSON.stringify(route),
                  headers: {
                    'Content-Type': 'application/json; charset=UTF-8',
                  }
              })
                console.log(flag);
                console.log("------- route updated successfully -------");
            }
          },
          (error) => {
              console.log("err post=", error);
          });
}
// if the bus wont arrive on time to the target, search for a new route
function getNewDirections(route){
    console.log("getting a new direction")
    let key = 'AIzaSyCCwWKnfacKHx3AVajstMk6Ist1VUoNt9w'
    let now = new Date();
    let hm = route.timeTarget.split(':');
    if(route.counter != undefined)
        now = now.setHours(hm[0], hm[1] - (10 * route.counter));
    else
        now = now.setHours(hm[0], hm[1] - 10);
    let arrival =  Math.ceil(now / 1000)

    var config = {
        method: 'get',
        url: `https://maps.googleapis.com/maps/api/directions/json?origin=${route.routeData.Origin}&destination=${route.routeData.Destination}&mode=transit&transit_mode=bus&arrival_time=${arrival}&key=${key}`,
        headers: { }
      };
      
      axios(config)
      .then(function (response) {
        let newRoute = getNewRoute(response.data, route, hm)
        console.log(newRoute);
        getNewWeather(newRoute, true)
      })
      .catch(function (error) {
        console.log(error);
      });
}

function getNewRoute(result, oldRoute, hm){ 
    let route = result.routes[0].legs[0] //extract the relevant data of the route
    let lines = ""
    for (let i = 0; i < route.steps.length; i++) {
        if (route.steps[i].travel_mode == "TRANSIT")
            lines += route.steps[i].transit_details.line.short_name + " ";
    }
    let stops = 0;
    let numOfBuses = 0;
    for (let i = 0; i < route.steps.length; i++) {
        if (route.steps[i].travel_mode == "TRANSIT") {
            //count the number of stops and buses
            stops += route.steps[i].transit_details.num_stops;
            numOfBuses++;
        }
    }
    let dt = new Date(route.arrival_time.value * 1000) 
    let Hour = dt.getHours();
    let Minutes = dt.getMinutes();
    let arrival = formatTime(Hour, Minutes)

    dt = new Date(route.departure_time.value * 1000) 
    Hour = dt.getHours();
    Minutes = dt.getMinutes();
    departure = formatTime(Hour, Minutes)
    data = {
        LineNumber: lines,
        Origin: oldRoute.Origin,
        Destination: oldRoute.Destination,
        ArrivalTime: arrival,
        DepartureTime: departure,
        RouteDuration: route.duration.value,
        Day: oldRoute.Day,
        Hour: Hour,
        Stops: stops,
        NumOfBuses: numOfBuses,
        RouteDistance: route.distance.value,
        Rain: 0,
        date: oldRoute.routeDate,
        timeTarget: oldRoute.TargetTime,
        TargetTime: oldRoute.TargetTime,
        alarmClock: oldRoute.alarmClock,
        userId: oldRoute.userId,
        routeId : oldRoute.routeId
    }
    if(oldRoute.counter == undefined)
        data["counter"] = 2
    else data.counter = oldRoute.counter++
    return data;
}

function getNewWeather(route, flag) {
    //---> get current time or forecast according to departure time <--
    //need to
    let origin = route.Origin;
    let rain;
    let date = new Date();
    let lat;
    let lon;

    if (origin == "Hadera") {
        lat = 32.4365
        lon = 34.9196
    }
    else if (origin == "Ruppin Academic Center") {
        lat = 32.3437
        lon = 34.9134
    }
    else if (origin == "Netanya") {
        lat = 32.3163
        lon = 34.8566
    }
    else if (origin == "Tel Aviv") {
        lat = 32.0882
        lon = 34.7817
    }

    let api = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&appid=4d1ae42821f3fa1979e5a5d7251013a8   ";
    fetch(api, {
        method: 'GET'
    })
        .then(res => {
            return res.json()
        })
        .then(
            (result) => {
                console.log("Getting Weather Forecast")
                try {
                    rain = result.hourly[date.getHours()].rain["1h"] //get rain data from the last hour
                } catch (e) {
                    rain = 0 //no result found, rain=0
                }
                route.Rain = rain
                console.log("Another Prediction", route.date)
                getPrediction(route, flag)
            },
            (error) => {
                console.log("err post=", error);
            });
    return rain;
}
function startTest(route){
    //get the hours and minutes of the bus' departure time
    let time = route.routeData.DepartureTime.split(':');
    //set depTime according to the departure hours and minutes
    let depTime = new Date();
    depTime = depTime.setHours(time[0], time[1]);

    //get the time to start testing the route
    let now = new Date();
    let testTime = new Date(now.getTime() + route.TestTime * 60 * 1000);
    //if departure time is smaller than test time --> we need to start checking
    //add the route to testList
    if(depTime <= testTime && depTime > now)
        return true;
    else return false;
}
//save route to firebase, according to the user's id and route id
function saveToFb(collection, route, routeId){
    const db = getDatabase();
    const ref = db.ref(`/${collection}/user_${route.userId}/${routeId}/`);
    ref.set(route)
    console.log("saved route", routeId, "to", collection)
}
// delete route from firebase
function deleteFromFb(collection, route, routeId){
    console.log(routeId)
    console.log("deleting...")
    const db = getDatabase()
    const ref = db.ref(`/${collection}/user_${route.userId}/${routeId}`)
    ref.remove()
    console.log("deleted route", routeId, "to", collection)
}
// old, not currently in use.
function saveRoutesFromDB(queryString, flag){
    //get all routes scheduled for today from DB
    //save the routes in firebase
    var sql = require("mssql");

    // config for your database
    var config = {
        user: 'bgroup54',
        password: 'bgroup54_99992',
        server: 'media.ruppin.ac.il', 
        database: 'bgroup54_test2' ,
        options: {
            encrypt: true, // for azure
            trustServerCertificate: true // change to true for local dev / self-signed certs
          }
    };
  
    // connect to your database
    sql.connect(config, function (err) {
    
        if (err) console.log(err);
  
        // create Request object
        var request = new sql.Request();
        //
        // query to the database and get the records
        request.query(queryString, function (err, recordset) { 
            if (err) 
                console.log(err)
            else {
                if(flag){
                    recordset.recordset.forEach(route => {
                        dt = new Date(route.Datetime)
                        if(dt.getMinutes() < 10)
                            route["TargetTime"] = `${dt.getHours()-2}:0${dt.getMinutes()}`;
                        else route["TargetTime"] = `${dt.getHours()-2}:${dt.getMinutes()}`;

                        route["routeDate"] = `${dt.getDate()}-${dt.getMonth()+1}-${dt.getFullYear()}`
                        
                        if(dt.getDate() == new Date().getDate()){ //if the route is planned for today
                            if(startTest(route)){ //if true, need to start checking the route
                                saveToFb("TestRoutes", route.userId, route) //save routes we need to test now
                                deleteFromFb("PlannedRoutes", route.userId, route)
                            }
                            else saveToFb("PlannedRoutes", route.userId, route) //else future route, no need to test yet 
                        }
                        else saveToFb("PlannedRoutes", route.userId, route); //route not for today
                    }); 
                }
                else{
                    recordset.recordset.forEach(route => {
                        dt = new Date(route.Datetime)
                        route["routeDate"] = `${dt.getDate()}-${dt.getMonth()+1}-${dt.getFullYear()}`
                        saveToFb("OldRoutes", route.userId, route) //save old routes to firebase
                    })
                }
            };
        })
    })
}
function calculateTestTime(alarmClock, predParams){
    return Math.ceil((predParams[6] + predParams[5] + alarmClock + predParams[4] * 3)/60);
}
function formatTime(h, m){
    if (m < 10) 
        return `${h}:0${m}`
    else 
        return `${h}:${m}`
}

const server = http.createServer((req, res) => {
  res.statusCode = 200;

  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello World');
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});