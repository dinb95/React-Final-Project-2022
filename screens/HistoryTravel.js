import { View, Text, Button, StyleSheet } from 'react-native'
import React, {useState, useEffect} from 'react'
import { initializeApp } from 'firebase/app';
import { getDatabase, onValue, ref } from "firebase/database";
import AsyncStorage from '@react-native-async-storage/async-storage';
import History from './History';

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

export default function HistoryTravel() {
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
      const db = ref(database, `OldRoutes/user_${userId}/`);
      onValue(db, (snapshot) => {
        const data = snapshot.val();
        for (var d in data){
          setTravels(prev => [...prev, data[d]])
        }
      })
    }
    const renderedTravels = travels.map((travel, index) => {
      return <History data={travel} key={index}/>
    })
  
    return (
      <View style={styles.container}>
      {renderedTravels}
      <Button title='Press' onPress={() => {console.log(travels)}}/>
      </View>
  
    )
}