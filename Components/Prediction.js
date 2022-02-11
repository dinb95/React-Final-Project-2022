import { View, Text } from 'react-native'
import React, {useEffect} from 'react'

export default function Prediction({route}) {
    console.log(route.params.predParams)
    var p = route.params.predParams;
    var route_data = route.params.route_data
    console.log(new Date(route_data.date).getHours())
    useEffect(() => {
        
    })
    const runPrediction = (p, route_data) => {
        if(p == null)
            alert("No data was found, could not predict route time");

        var Predicted_D = Math.ceil(p[0] / 60);

    }

  return (
    <View>
      <Text>Prediction</Text>
    </View>
  )
}