import { View, Text ,ImageBackground, Image,TouchableOpacity,SafeAreaView, StyleSheet, TextInput } from 'react-native'
import React from 'react'
import {useState} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import UselessTextInput from './UselessTextInput'

export default function ProfTop() {
    const [username, setUsername] = useState();
    const [userpic, setUserpic] = useState();
    const getUser = async() => {
        const name = await AsyncStorage.getItem('username');
        const pic = await AsyncStorage.getItem('userpic'); 
        if(name !== null)
            setUsername(name)        
        if(pic !== null)
            setUserpic(pic)
      }
      getUser();
     

  return (
    <View>
      <ImageBackground
          source={require('../images/menu-bg.jpeg')}
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
       <UselessTextInput></UselessTextInput>
    </View>
  )
}
