import { View, Text, StyleSheet } from 'react-native'
import React, {useState, useEffect} from 'react'

const B = (props) => <Text style={{fontWeight: 'bold'}}>{props.children}</Text>

export default function PredParams({route}) {
    const [params, setParams] = useState()

    useEffect(() => {
        let data = route.params.data
        delete data.route_data["raw_route"]
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
            <View style={{marginTop:"15%"}}>
                <Text style={styles.mainTitle}>Prediction Calculation</Text>
                <Text style={styles.title}>Coefficients (Rounded up for visual purposes):</Text>
                <Text>
                    <B>Buses:</B> {buses} {"\n"}
                    <B>Stops:</B> {stops} {"\n"}
                    <B>Distance:</B> {distance} {"\n"}
                    <B>Intercept:</B> {intercept} {"\n"}
                </Text>
                <Text style={styles.title}>Final Calculation : </Text>
                <Text><B>Route Duration</B> = ({buses}*{rd.numOfBuses}) + ({stops}*{rd.stops}) + ({distance}*{rd.routeDistance}) + {intercept}
                 = {calculation} Seconds ({Math.round(calculation/60)} Minutes) 
                 </Text>
                 <Text style={styles.title}>T-Test Result: </Text>
                 <Text>
                    <B>Tx:</B> {p[1]} {"\n"}
                    <B>P-Value:</B> {p[2]} {"\n"}
                 </Text>
                 {p[1] <= p[2] ? 
                 <Text>{"Tx <= P-Value, Prediction Rejected"}</Text>
                 :
                 <Text>{"Tx > P-Value, Prediction Accepted"}</Text>
                }
            </View>   
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
        // justifyContent: 'center',
        alignSelf: 'center',
        backgroundColor:'#cccccc',
        paddingRight: 15
    },
    mainTitle: {
        fontSize: 25,
        fontWeight:"bold",

        marginBottom:10
    },
    title: {
        fontSize:17,
        fontWeight:"bold",
        marginBottom:10,
    }

})