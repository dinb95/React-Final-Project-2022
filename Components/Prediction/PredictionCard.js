import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'

const B = (props) => <Text style={{fontWeight: 'bold'}}>{props.children}</Text>

export default function PredictionCard({data, navigation}) {
    const status = {
        0: 'You will arrive on time if you take this bus!',
        1: 'T-Test failed, prediction not reliable. Searching for a new route...',
        2: 'You will not arrive on time. Searching for a new route...'
    }

    const renderCard = () => {
        var hours = data.arrival.getHours();
        var minutes = data.arrival.getMinutes();
        if(minutes < 10)
            var arrival = `${hours}:0${minutes}`
        else var arrival = `${hours}:${minutes}`
        return(  
            <View>
                <TouchableOpacity onPress={() => navigation.navigate({
                    name:"Prediction Parameters",
                    params: {data:data}
                })}>
                    <Text style={styles.Txt}>
                        <B>Predicted Arrival Time: </B>{arrival}{"\n"}
                        <B>Departure Time:</B> {data.route_data.departure}{"\n"}
                        <B>Lines: </B>{data.route_data.lines}{"\n"}
                        {status[data.status]}
                    </Text>
                </TouchableOpacity>
            </View>
        )
    }
  return (
      data.status === 0 ? 
    <View style={styles.containerBlack}>
      {renderCard()}
    </View>
    :
    <View style={styles.containerRed}>
    {renderCard()}
  </View>
  )
}

const styles = StyleSheet.create({
    containerBlack: {
        height: 137,
        width:'90%',
        borderColor:'black',
        borderStyle:'solid',
        borderWidth: 1,
        margin: 5,
        padding:5,
        borderRadius:10,
        backgroundColor: 'white',
    },
    containerRed: {
        height: 145,
        width:'90%',
        borderColor:'red',
        borderStyle:'solid',
        borderWidth: 2,
        margin: 5,
        padding:5,
        borderRadius:10,
        backgroundColor: 'white',
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