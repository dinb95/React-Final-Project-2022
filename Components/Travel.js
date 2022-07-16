import { View, Text, StyleSheet } from 'react-native'
import React from 'react'

const B = (props) => <Text style={{fontWeight: 'bold'}}>{props.children}</Text>

export default function Travel({data}) {
  let rd;
  let date;
  if(data.routeData == undefined){
    rd = data
    date = data.routeDate
  }
  else {
    rd = data.routeData;
    date = data.date;
  }
  return (
      <View>
         <View style={styles.container}>
         <View style={{ flexDirection: 'row',flex:0.8,justifyContent: "center",alignItems: "center"}}> 
        <Text style={styles.dateTitle}>{date}</Text>
        </View>
            <Text style={styles.Txt}><B>Origin:</B>  {rd.Origin}</Text>
            <Text style={styles.Txt}><B>Destination:</B> {rd.Destination}</Text>
            <Text style={styles.Txt}><B>Arrival Time: </B>{rd.ArrivalTime}</Text>
            <Text style={styles.Txt}><B>Departure Time:</B> {rd.DepartureTime}</Text>
            <Text style={styles.Txt}><B>Lines: </B>{rd.LineNumber}</Text>
        </View>
      </View>
  )
}
const styles = StyleSheet.create({
    container: {
        height: 160,
        width:'95%',
        borderColor:'black',
        borderStyle:'solid',
        borderWidth: 1,
        backgroundColor:"white",
        marginBottom: 10,
        alignSelf: 'center', 
        borderRadius:7,
    },
    Txt:{
        margin: 2,
        fontSize:16,
        paddingLeft:10,
      },
      dateTitle: {
        fontSize:18, 
        color:'#51aae1',
        fontWeight: "bold",
        marginTop:5,
        textDecorationLine: 'underline'
      }
     
})