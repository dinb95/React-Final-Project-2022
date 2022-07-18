import { View, Text, StyleSheet, Alert } from 'react-native'
import React from 'react'
import { initializeApp } from "firebase/app";
import { getDatabase, ref, remove } from "firebase/database";
import { TouchableOpacity } from 'react-native-gesture-handler';

const B = (props) => <Text style={{fontWeight: 'bold'}}>{props.children}</Text>

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

export default function Travel({data, del}) {
  if(del)
    console.log(data.routeId)
  let rd;
  let date;
  if(data.routeData == undefined){
    rd = data
    date = data.routeDate
  }
  else {
    rd = data.routeData;
    date = data.date;
  }

  const alertDelete = () => {
    Alert.alert("Delete Route",
    "Are you sure?",
    [{text:"No" ,style: "cancel"},{text:"Yes", onPress: () => deleteRoute()}])
  }
  const deleteRoute = () => {
    let db = ref(database, `PlannedRoutes/user_${data.userId}/${data.routeId}`);
    remove(db);
    db = ref(database, `OnGoing/user_${data.userId}/${data.routeId}`)
    remove(db);
  }
  return (
      <View>
         <View style={styles.container}>
         <View style={{ flexDirection: 'row',flex:0.8,justifyContent: "center",alignItems: "center"}}> 
        <Text style={styles.dateTitle}>{date}</Text>
        </View>
            <Text style={styles.Txt}><B>Origin:</B>  {rd.Origin}</Text>
            <Text style={styles.Txt}><B>Destination:</B> {rd.Destination}</Text>
            <Text style={styles.Txt}><B>Arrival Time: </B>{rd.ArrivalTime}</Text>
            <Text style={styles.Txt}><B>Departure Time:</B> {rd.DepartureTime}</Text>
            <Text style={styles.Txt}><B>Lines: </B>{rd.LineNumber}</Text>
            {del  && rd.ArrivalTime > data.timeTarget &&  (<View style={styles.lateView}>
              <Text style={styles.lateTxt}>It seems the bus is running late..</Text>
              </View>)}
            {del && (<View style={styles.deleteView}>
              <TouchableOpacity style={styles.deleteBtn} onPress={() => {alertDelete()}}>
                <Text style={styles.deleteTxt}>Delete Route</Text>
              </TouchableOpacity>
            </View>)}  
        </View>
      </View>
  )
}
const styles = StyleSheet.create({
    container: {
        height: 210,
        width:'95%',
        borderColor:'black',
        borderStyle:'solid',
        borderWidth: 1,
        backgroundColor:"white",
        marginBottom: 10,
        alignSelf: 'center', 
        borderRadius:7,
    },
    Txt:{
        margin: 2,
        fontSize:16,
        paddingLeft:10,
      },
    dateTitle: {
      fontSize:18, 
      color:'#51aae1',
      fontWeight: "bold",
      marginTop:5,
      textDecorationLine: 'underline'
    },
    lateView: {
      justifyContent: 'center',
      alignItems: 'center',
    },
    lateTxt: {
      color: 'red'
    },
    deleteView: {
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 0
      },
    deleteBtn: {
      backgroundColor: "red",
      padding: 3,
      borderWidth: 1,
      borderRadius: 10
    },
    deleteTxt: {
      color: "white"
    }
})