import { View, Text, StyleSheet, ImageBackground } from 'react-native'
import React from 'react'

const B = (props) => <Text style={{fontWeight: 'bold'}}>{props.children}</Text>

export default function PredictionCard({data}) {
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
                <Text style={styles.Txt}><B>Predicted Arrival Time: </B>{arrival}</Text>
                <Text style={styles.Txt}><B>Departure Time:</B> {data.route_data.departure}</Text>
                <Text style={styles.Txt}><B>Lines: </B>{data.route_data.lines}</Text>
                <Text style={styles.statusTxt}>{status[data.status]}</Text>
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
        height: 137,
        width:'90%',
        borderColor:'black',
        borderStyle:'solid',
        borderWidth: 1,
        margin: 5,
        padding:5,
        borderRadius:10,
        backgroundColor: '#7bbee9'

    },
    Txt:{
        margin: 2,
        fontSize:18,
      },
      BtnTxt:{
        fontSize:18,
      },
      statusTxt:{
        margin: 2,
        fontSize:18,  
        alignSelf: 'center',
      },
     
})