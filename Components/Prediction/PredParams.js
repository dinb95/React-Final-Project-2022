import { View, Text, StyleSheet } from 'react-native'
import React, {useState, useEffect} from 'react'

export default function PredParams({route}) {
    const [params, setParams] = useState()

    useEffect(() => {
        let data = route.params.data
        delete data.route_data["raw_route"]
        console.log(data.route_data.prediction)
        renderParams(data)
    }, [])
    const renderParams = (data) => {
        console.log("from render: ", data)
        let p = data.route_data.prediction
        let rd = data.route_data

        let buses = Math.round(p[7])
        let stops = Math.round(p[8])
        let distance = p[9].toFixed(5)
        let intercept = Math.round(p[11])
        let calculation = buses*rd.numOfBuses + stops*rd.stops + distance*rd.routeDistance + intercept;
        setParams(
            <>
                <Text>Prediction Calculation</Text>
                <Text>Coefficients (Rounded up for visual purposes):</Text>
                <Text>
                    Buses: {buses} {"\n"}
                    Stops: {stops} {"\n"}
                    Distance: {distance} {"\n"}
                    Intercept: {intercept} {"\n"}
                </Text>
                <Text>Final Calculation : </Text>
                <Text>Route Duration = ({buses}*{rd.numOfBuses}) + ({stops}*{rd.stops}) + ({distance}*{rd.routeDistance}) + {intercept}
                 = {calculation} Seconds ({Math.round(calculation/60)} Minutes) 
                 </Text>
                 <Text>T-Test Result: </Text>
                 <Text>
                    Tx: {p[1]} {"\n"}
                    P-Value: {p[2]} {"\n"}
                 </Text>
                 {p[1] <= p[2] ? 
                 <Text>{"Tx <= P-Value, Prediction Rejected"}</Text>
                 :
                 <Text>{"Tx > P-Value, Prediction Accepted"}</Text>
                }
            </>   
        )
    }

  return (
    <View style={styles.container}>
        {params}    
    </View>
  )
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignSelf: 'center',
        backgroundColor:'#cccccc'

    },
})