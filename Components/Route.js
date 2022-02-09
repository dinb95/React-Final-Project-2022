import { View, Text, StyleSheet } from 'react-native';
import React from 'react';
import { borderColor } from 'react-native/Libraries/Components/View/ReactNativeStyleAttributes';

export default function route({data}) {
    console.log(data)
  return (
    <View style={styles.container}>
      <Text>Arrival: {data.arrival}</Text>
      <Text>Departure: {data.departure}</Text>
      <Text>Duration: {data.duration}</Text>
      <Text>Lines: {data.lines}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
        height: 90,
        borderColor:'black',
        borderStyle:'solid',
        borderWidth: 1,
        margin: 5,
        padding:5
    }
})
