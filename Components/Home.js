import { View, Text, Button, StyleSheet } from 'react-native';
import React, {useState, useEffect} from 'react';

export default function Home({navigation}) {
  
  return (
    <View style={styles.container}>
     <View>
        <Text style={styles.timely_title}>Timely</Text>
        <Text style={styles.timely_subtitle}>To the right place at the right time</Text>
        <Button title='Look For a ride'  onPress={()=> navigation.navigate('Search Route')}/>
      </View>
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
    fontSize: 50,
    marginBottom:20
  },
  timely_subtitle:{
    textAlign: 'center',
    justifyContent:'center',
    alignContent: 'center',
    fontSize: 20,
    marginBottom:20
  }
})