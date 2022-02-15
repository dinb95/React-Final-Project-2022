import { View, Text, StyleSheet } from 'react-native'
import React from 'react'

export default function PredictionCard({data}) {
    console.log(data)
    const status = {
        0: 'You will arrive on time if you take this bus!',
        1: 'T-Test failed, prediction not reliable. Searching for a new route...',
        2: 'You will not arrive on time. Searching for a new route...'
    }
    //data.arrival
    //data.route_data
    //data.status
    const renderCard = () => {
        var hours = data.arrival.getHours();
        var minutes = data.arrival.getMinutes();
        if(minutes < 10)
            var arrival = `${hours}:0${minutes}`
        else var arrival = `${hours}:${minutes}`
        return(
            <View>
             <Text>Predicted Arrival Time: {arrival}</Text>
             <Text>Departure Time: {data.route_data.departure}</Text>
             <Text>Lines: {data.route_data.lines}</Text>
             <Text>{status[data.status]}</Text>
            </View>
        )
    }
  return (
    <View style={styles.container}>
      {renderCard()}
    </View>
  )
}

const styles = StyleSheet.create({
    container: {
        height: 110,
        width:'100%',
        borderColor:'black',
        borderStyle:'solid',
        borderWidth: 1,
        margin: 5,
        padding:5,

    }
})