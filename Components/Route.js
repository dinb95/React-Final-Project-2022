import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import React from 'react';
import axios from 'axios';
const B = (props) => <Text style={{fontWeight: 'bold'}}>{props.children}</Text>

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
      <View style={{ flexDirection: 'row' }}>
        <Text style={styles.Txt}><B>Arrival:</B> {data.arrival}</Text>
        <Text style={styles.Txt}><B>Departure:</B> {data.departure}</Text>
      </View>
      <View style={{ flexDirection: 'row' }}>
        <Text style={styles.Txt}><B>Duration:</B> {data.duration}</Text>
        <Text style={styles.Txt}><B>Lines:</B> {data.lines}</Text>
      </View>
      <TouchableOpacity style={styles.saveBtn} onPress={getPrediction}>
        <Text style={styles.BtnTxt}>Save Route</Text>
      </TouchableOpacity>
    </View>
  );
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
    saveBtn: {
        position:'relative',
        width:'50%',
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
        backgroundColor: '#bddff5',
        padding: 6,  
        borderRadius:7,
        borderStyle:'solid',
        borderWidth: 1,
        borderColor:'black',
    },
    Txt:{
      margin: 10,
      fontSize:18,
    },
    BtnTxt:{
      fontSize:18,
    },

})
