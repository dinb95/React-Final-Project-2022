import { View, Text ,ImageBackground, Image, StyleSheet } from 'react-native'
import React from 'react'
import {useState} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import UserUpdateForm from './UserUpdateForm'

export default function ProfTop({navigation, route}) {
    const [username, setUsername] = useState();
    const [userpic, setUserpic] = useState();
    const getUser = async() => {
        const name = await AsyncStorage.getItem('username');
        const pic = await AsyncStorage.getItem('userpic'); 
        if(name !== null)
            setUsername(name)        
        if(pic !== null){
          try{
            setUserpic(JSON.parse(pic))
          }
          catch{setUserpic(pic)}
        console.log(userpic)
      }
    }
      getUser();
     

  return (
    <View style={styles.container}>
      <ImageBackground
          source={require('../../images/blueBackjpg.jpg')}
          style={{padding:110,paddingBottom:20,paddingTop:40}}>
          <Image
            source={{uri: userpic}}
            style={{height: 150, width: 150, borderRadius: 80, marginBottom: 10, justifyContent: 'center', alignItems: 'center'}}
          />
          <Text
            style={{
              color: '#fff',
              fontSize: 18,
              marginBottom: 5,
              textAlign: 'center'
            }}>
            {username}
          </Text>
        </ImageBackground>
       <UserUpdateForm navigation={navigation} route={route}/>
    </View>
  )
}
const styles = StyleSheet.create({
  container: {
    width:'100%'
  }
})
