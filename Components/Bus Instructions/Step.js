import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import { List } from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome';

export default function Step({data, index}) {
  // <View style={styles.container}>
  //   <Text></Text>
  //   <Text>Distance: {data.distance.text}</Text>
  //   <Text>Duration: {data.duration.text}</Text>
  // </View>
    const inst_step = data.travel_mode === 'WALKING' ? (
        //render walking instructions
        // walk to X
        // departure time, arrival time, distance
        <List.Accordion title={data.html_instructions} id={index}>
          <List.Item title="Item 1" />
        </List.Accordion>

    )
    :
    (
        //render bus instructions
        // take bus {bus number} to {departure location}
        // number of stops until getting off the bus
        // bus agency? 
        // departure time, arrival time, distance
        <View style={styles.container}>
            <Text>Take Bus {data.transit_details.line.short_name}</Text>
            <Text>
            From {data.transit_details.departure_stop.name} {"\n"}
            To {data.transit_details.arrival_stop.name}
             </Text>
        </View>
    )
  return (
    <View style={styles.border}>
      {inst_step}
    </View>
  )
}

const styles = StyleSheet.create({
    container: {
      marginBottom: 10,
      marginRight: 10
    },
    border: {
      width: "100%",
      borderBottomWidth: 1,
    }
  })