import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import Icon from 'react-native-vector-icons/FontAwesome';

export default function Step({data, index}) {
    const inst_step = data.travel_mode === 'WALKING' ? (
        //render walking instructions
        // walk to X
        // departure time, arrival time, distance
        <View style={styles.container}>
            <Text>{data.html_instructions}</Text>
            <Text>Distance: {data.distance.text}</Text>
        </View>

    )
    :
    (
        //render bus instructions
        // take bus {bus number} to {departure location}
        // number of stops until getting off the bus
        // bus agency? 
        // departure time, arrival time, distance
        <View style={styles.container}>
            <Icon name="bus" size={20}/>
            <Text>{data.html_instructions}</Text>
        </View>
    )
  return (
    <View>
      {inst_step}
    </View>
  )
}

const styles = StyleSheet.create({
    container: {
      height:'auto',
      width:'90%',
      marginBottom:5,
      alignContent:'center',

    }
  })