import { View, Text, Button, StyleSheet,ImageBackground } from 'react-native';
import React, {useState, useEffect} from 'react';
import * as Location from 'expo-location';



export default function Home({navigation}) {
 
  return (
    <View style={styles.container}>
       <ImageBackground source={require('../images/way.jpeg')} resizeMode="cover" style={styles.image}>
        <View>
            <Text style={styles.timely_title}>Timely</Text>
            <Text style={styles.timely_subtitle}>To the right place at the right time</Text>
            <Button title='Look For a ride'  onPress={()=> navigation.navigate('Search Route')}/>
        </View>
     </ImageBackground>
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
    fontFamily:'"Steelfish Rg", "helvetica neue", helvetica, arial, sans-serif',
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
    fontFamily:'"Steelfish Rg", "helvetica neue", helvetica, arial, sans-serif',
    fontSize: 20,
    marginBottom:20
  },
  image: {
    flex: 1,
    justifyContent: "center"
  }
})