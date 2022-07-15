const fetch = require("node-fetch");
var axios = require('axios');
const lineReader = require('line-reader');
const http = require('http');
const https = require("https");
const agent = new https.Agent({
    rejectUnauthorized: false
  })
var GtfsRealtimeBindings = require('gtfs-realtime-bindings');
var request = require('request');

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
const { json } = require("body-parser");
const route = require("color-convert/route");
const { short } = require("webidl-conversions");
var testList = {};
let simList = [];
mainFunction()

executeMainFunction = setInterval(mainFunction, 60000)

// Get a database reference to our blog
mainFunction();
function mainFunction(){
    // let dt = new Date();
    // //let now = `${dt.getMonth()+1}-${dt.getDate()}-${dt.getFullYear()} ${dt.getHours()}:${dt.getMinutes()}:00.000`
    // let today = `${dt.getMonth()+1}-${dt.getDate()}-${dt.getFullYear()}`

    // let query = `select * from Timely_Routes where [Date]>='${today}' order by [Datetime]`
    // saveRoutesFromDB(query, true)
    // query = `select * from Timely_Routes where [Date]<'${today}' order by [Datetime]`
    // saveRoutesFromDB(query, false)
    updateRoutes();
    validateRoutes()
}

var GTFS_lines = [];
var GTFS_Shapes = [];
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
               console.log(steps[i].travel_mode)
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
        console.log(route_id);
        lineReader.eachLine('./trips.txt', function(line, last) {
            let sep = line.split(',');
            if(route_id == sep[0]){
                shape_id = sep[5];
                return false;
            }
        })
        console.log(`${shape_id} not included`)
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

// async function getRouteId(routeName, short_name){
//     lineReader.eachLine('./routes.txt', function(line, last) {
//         let sep = line.split(',');
//         if(short_name == sep[2]){
//             getTripId(sep[0], short_name);
//         }
//         if(last) {
//             console.log('Last line printed.');
//         }
//     })
// }
// function getTripId(route_id, short_name){
//     lineReader.eachLine('./trips.txt', function(line, last) {
//         let sep = line.split(',');
//         if(route_id == sep[0]){
//             getStopTime(sep[2], short_name);
//         }
//         if(last) {
//             console.log('Last line printed.');
//         }
//     })
// }
// function getStopTime(trip_id, short_name){
//     lineReader.eachLine('./stop_times.txt', function(line, last) {
//         let sep = line.split(',');
//         if(trip_id == sep[0] && sep[4] == 1){
//             console.log(trip_id, sep[0]);
//             const db = getDatabase();
//             const ref = db.ref(`/GTFS/${short_name}/`);
//             ref.push({depTime: sep[1]});
//         }
//         if(last) {
//             console.log('Last line printed from stop times.');
//         }
//     })
// }

function updateRoutes(){
    //move to here maybe?
    const db = getDatabase()
    const ref = db.ref("/PlannedRoutes/")
    ref.on("child_added", snapshot =>{ //get the routes in TestRoutes
        let routes = snapshot.val()
        let today = new Date()
        for(r in routes){
            let route = routes[r]
            let date = new Date(route.date);
            if(date.getMonth() == today.getMonth()){
                if(date.getDate() == today.getDate()){
                    if(startTest(route)){ //if true, need to start checking the route
                        saveToFb("TestRoutes", route, r) //save routes we need to test now
                        deleteFromFb("PlannedRoutes", route, r)
                }}}
            if(date.getMonth() <= today.getMonth() && date.getDate() < today.getDate())
                deleteFromFb("PlannedRoutes", route, r)
            }})
}


function startTest(route){
    //get the hours and minutes of the bus' departure time
    let time = route.routeData.DepartureTime.split(':');
    console.log(route.routeData.DepartureTime)
    //set depTime according to the departure hours and minutes
    let depTime = new Date();
    depTime = depTime.setHours(time[0], time[1]);

    //get the time to start testing the route
    let now = new Date();
    let testTime = new Date(now.getTime() + route.TestTime * 60 * 1000);
    //if departure time is smaller than test time --> we need to start checking
    //add the route to testList
    console.log(new Date(depTime), testTime)
    if(depTime <= testTime)
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
function deleteFromFb(collection, route, routeId){
    const db = getDatabase()
    const ref = db.ref(`/${collection}/user_${route.userId}/${routeId}`)
    ref.remove()
    console.log("deleted route", routeId, "to", collection)
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
                    console.log(simList)
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
const LT = 10000;
const L = 420000;
const M = 300000
const S = 120000

function simulate_route(route, user){
    let buses_in_route = []
    let shapes_for_route = []
    let steps = JSON.parse(route.raw_route).steps
    for(let i = 0; i < steps.length; i++){
        if(steps[i].travel_mode == "TRANSIT"){
            buses_in_route.push({
                name: steps[i].transit_details.line.name,
                departure_time: steps[i].transit_details.departure_time.value, 
                departure_location: steps[i].transit_details.departure_location.location
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
        console.log("line 305:", shapes.length, buses_in_route, shapes_for_route.length)
        // let now = new Date()
        // let departure_time = new Date(buses_in_route[0].departure_time * 1000)
        // console.log((departure_time - now) / JSON.parse(shapes_for_route[0].shape).length)
        run_buses(buses_in_route, shapes_for_route, user)
    })
}
function run_buses(buses, shapes, user){
    var intervals = []
    for(let i = 0; i < buses.length; i++){
        let shape = JSON.parse(shapes[i].data.shape);
        let now = new Date()
        let departure_time = new Date(buses[i].departure_time * 1000)
        console.log(departure_time)
        let stop_index = find_stop_index(shape, buses[i])
        intervals.push(setInterval(function (){
            if(shape.length == 0){
                clearInterval(intervals[i]);
                const db = getDatabase();
                const ref = db.ref(`/RunningBuses/${user}/${shapes[i].route_id}/`);
                ref.remove();
            }
            else{
            const db = getDatabase();
            const ref = db.ref(`/RunningBuses/${user}/${[i]}/`);
            ref.set(shape.shift())
            }
        }, (departure_time - now) / stop_index))//* Math.random() * (0.3) + 0.9) // add random parameter 0.90 - 1.20 
    }
}
function find_stop_index(shape, bus){
    for(let i = 0; i < shape.length; i++){
        if(calculate_distance(shape, bus.departure_location) <= 20){
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

function testRoute(route, depTime, user){
    let now = new Date();
    let timeDiff = Math.ceil((depTime - now) / 60 / 1000)
    console.log(route.routeId)
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
        else{
            let id = user.split('_')
            const db = getDatabase()
            const ref = db.ref(`/Tokens/${id[1]}`)
            ref.once("value", snapshot =>{
                let token = snapshot.val();
                sendPushNotification(token, 'You will need to leave your house in 10 Minutes!');
            })
            deleteFromFb("/TestRoutes/", route, route.routeId)
            saveToFb("/onGoing/", route, route.routeId)
        }
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

    } catch{
        // let id = user.split('_')
        // const db = getDatabase()
        // const ref = db.ref(`/Tokens/${id[1]}`)
        // ref.once("value", snapshot =>{
        //     let token = snapshot.val();
        //     sendPushNotification(token);
        // })
        console.log("-------------7 minutes------------- ", route.routeId)
        testList[route.routeId] = {
            interval: setInterval(function() {getPrediction(route, false);}, LT),
            intervalTime: L
        }
        //saveToFb("/onGoing/", route, route.routeId)
        getPrediction(route, false);
    }
}
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
            //console.log(result, route.routeId, route.DepartureTime, Math.ceil(result[0]/60))
            //console.log("T test result:", Math.ceil(result[3]))
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