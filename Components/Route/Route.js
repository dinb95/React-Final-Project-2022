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
       <View style={{ flexDirection: 'row',flex:0.8,justifyContent: "center",alignItems: "center"}}> 
       <Text style={styles.LineTxt}><B></B> {data.lines}</Text>
       </View>
      <View style={{ flexDirection: 'row' }}>
        <Text style={styles.Txt}><B>Arrival:</B> {data.arrival}</Text>
        <Text style={styles.Txt}><B>Departure:</B> {data.departure}</Text>
      </View>
      <View style={{ flexDirection: 'row' }}>
        <Text style={styles.Txt}><B>Duration:</B> {data.duration}</Text>
      </View>
      <TouchableOpacity style={styles.saveBtn} onPress={getPrediction}>
        <Text style={styles.BtnTxt}>Save Route</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
        height: 180,
        width:'90%',
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 3,
        },
        shadowOpacity: 0.27,
        shadowRadius: 4.65,
        elevation: 6,        
        margin: 5,
        padding:5,
        borderRadius:10,
        backgroundColor:"white",
        marginLeft:18,
        justifyContent: 'center',
        //backgroundColor: '#bddff5',
        //backgroundColor:'#cccccc'
    },
    saveBtn: {
        position:'relative',
        width:'50%',
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
//        backgroundColor: '#7bbee9',
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
      alignItems: "center"

    },
    BtnTxt:{
      fontSize:18,
    },
    LineTxt:{
     // margin: 10,
      fontSize:20, 
      color:'#51aae1',
      fontWeight: "bold",
      marginTop:5,
      textDecorationLine: 'underline'
    },

})
