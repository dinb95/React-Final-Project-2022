import { View, ScrollView, Text, Button, StyleSheet, TouchableOpacity } from 'react-native'
import React, {useState, useEffect} from 'react'
import { initializeApp } from 'firebase/app';
import { getDatabase, onValue, ref, get } from "firebase/database";
import AsyncStorage from '@react-native-async-storage/async-storage';
import Travel from './Travel';

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

const ReservedTravel = ({navigation}) => {
  
  const [travels, setTravels] = useState([]);
  const [user, setUser] = useState();

  useEffect(() => {
    getUser()
  }, [user])

  const getUser = async() => {
    var userId = await AsyncStorage.getItem('userid')
    if(userId !== null){
      setUser(user)
      console.log('setting user', userId)
      getReservedTravels(userId)
    }
  }

  const getReservedTravels = (userId) => {
    console.log('getting user', userId, 'routes')
    const db = ref(database, `PlannedRoutes/user_${userId}/`);
    onValue(db, (snapshot) => {
      let res_routes = [];
      const data = snapshot.val();
      for (var d in data){
          let tmp = data[d];
          tmp["routeId"] = d;
          res_routes.push(tmp);
      }
      setTravels(res_routes);
    })
  }
  const renderedTravels = travels.map((travel, index) => {
    let data = travel;
    data["userId"] = travel.userId
    console.log("rendering chat", data.routeData.LineNumber)
    return (
      <View key={index}>
        <Travel data={data} del={true}/>
        <TouchableOpacity style={styles.chatBtnContainer} onPress={() => {navigation.navigate({name:'ChatMenu', params:data})}}>
          <Text style={styles.chatBtn}>Route Chat</Text>
        </TouchableOpacity>
      </View>
    )
  })

  return (
    <View style={styles.container}>
    <Text style={styles.title}>Reserved Travels</Text>
      <ScrollView style={styles.resCard}>
        {renderedTravels}
      </ScrollView>
    </View>

  )
}

export default ReservedTravel

const styles = StyleSheet.create({
  container: {
    width:'100%',
    height: '100%',
    display:'flex',
    justifyContent:'center',
    alignSelf: 'center',
    backgroundColor:'#cccccc'
  },
  title:{
    fontSize:40,
    top:20,
    color: "#51aae1",
    fontWeight:'bold',
    alignSelf:'center',
    margin:20,
    marginBottom: 40
},
chatBtnContainer:{
  width:'30%',
  display:'flex',
  justifyContent:'center',
  alignSelf: 'center',
  marginBottom:10
},
chatBtn:{
  fontSize:15,
  textAlign:'center',
  borderWidth:1,
  borderRadius: 5,
  backgroundColor: "#51aae1"
}

})