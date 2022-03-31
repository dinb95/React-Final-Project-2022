import { View, Text, Button, StyleSheet,ImageBackground,TouchableOpacity } from 'react-native';
import React, {useState, useEffect} from 'react';
import PushPage from '../PushPage';
import { initializeApp } from 'firebase/app';
import { getDatabase, set, ref } from "firebase/database";
import AsyncStorage from '@react-native-async-storage/async-storage';

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

export default function Home({navigation}) {
  const getToken = async() => {
    const token = await AsyncStorage.getItem('usertoken')
    const id = await AsyncStorage.getItem('userid')
    const db = ref(database, `Tokens/${id}/`);
    set(db, token)
  }
  useEffect(()=> {
    getToken();
  },[])
  return (
    <View style={styles.container}>
       <ImageBackground source={require('../images/way1.jpg')} resizeMode="cover" blurRadius={1} resizeMode="cover" style={styles.image}>
        <View>
            <Text style={styles.timely_title}>Timely</Text>
            <Text style={styles.timely_subtitle}>To the right place at the right time</Text>
            <TouchableOpacity
              style={styles.Btn}
              onPress={() => {navigation.navigate('Search Route')}}
              >
              <Text style={styles.Txt}>Look For a ride</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.Btn}
              onPress={() => {navigation.navigate('UserLocation')}}
              >
              <Text style={styles.Txt}>location</Text>
            </TouchableOpacity>
        </View>
     </ImageBackground>
     <PushPage/>
    </View>
  );
}

const styles = StyleSheet.create({
  container:{
    width: '100%',
    height:'100%',
  },
  timely_title: {
    textAlign: 'center',
    justifyContent:'center',
    alignContent: 'center',
    fontWeight:'bold',
    color:'white',
    fontSize: 50,
    marginBottom:20
  },
  timely_subtitle:{
    textAlign: 'center',
    justifyContent:'center',
    alignContent: 'center',
    color:'white',
    fontWeight:'bold',
    fontSize: 20,
    marginBottom:20
  },
  image: {
    flex: 1,
    justifyContent: "center"
  },
  Btn:{
    width: 150,
    fontSize: 70,
    alignItems: 'center',
    backgroundColor: '#51aae1',
    padding: 10 ,     
    borderRadius: 25,
    marginLeft:-20,
    justifyContent: 'center',
    alignSelf: 'center',
  },
  Txt:{
    fontSize: 18,
    alignItems: 'center',
  }
})