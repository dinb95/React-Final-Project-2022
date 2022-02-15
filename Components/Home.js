import { View, Text, Button, StyleSheet,ImageBackground,TouchableOpacity } from 'react-native';
import React, {useState, useEffect} from 'react';


export default function Home({navigation}) {
  
  return (
    <View style={styles.container}>
       <ImageBackground source={require('../images/way1.jpg')} resizeMode="cover" style={styles.image}>
        <View>
            <Text style={styles.timely_title}>Timely</Text>
            <Text style={styles.timely_subtitle}>To the right place at the right time</Text>
            <TouchableOpacity
              style={styles.Btn}
              onPress={() => {navigation.navigate('Search Route')}}
              >
              <Text style={styles.Txt}>Look For a ride</Text>
            </TouchableOpacity>
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
    backgroundColor: '#7fa7e3',
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