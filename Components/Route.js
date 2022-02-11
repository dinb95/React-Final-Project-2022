import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import React from 'react';
import axios from 'axios';

export default function Route({data, navigation}) {
    const getPrediction = () => {
      data["date"] = data.date.getTime()
        navigation.navigate({
          name: 'Prediction Process',
          params: {route_data: data}
      })
    }
  return (
    <View style={styles.container}>
      <Text>Arrival: {data.arrival}</Text>
      <Text>Departure: {data.departure}</Text>
      <Text>Duration: {data.duration}</Text>
      <Text>Lines: {data.lines}</Text>
      <TouchableOpacity style={styles.saveBtn} onPress={getPrediction}>
        <Text>Save Route</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
        height: 110,
        width:'100%',
        borderColor:'black',
        borderStyle:'solid',
        borderWidth: 1,
        margin: 5,
        padding:5
    },
    saveBtn: {
        position:'relative',
        width:'20%',
        backgroundColor: 'lightblue',

    }
})
