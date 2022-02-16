import { View, Text, StyleSheet } from 'react-native'
import React from 'react'

export default function History({data}) {
  return (
    <View>
      <Text style={styles.dateTitle}>Date: {data.routeDate}</Text>
      <View style={styles.container}>
          <Text style={styles.Txt}><B>Origin:</B>  {data.Origin}</Text>
          <Text style={styles.Txt}><B>Destination:</B> {data.Destination}</Text>
          <Text style={styles.Txt}><B>Arrival Time: </B>{data.ArrivalTime}</Text>
          <Text style={styles.Txt}><B>Departure Time:</B> {data.DepartureTime}</Text>
          <Text style={styles.Txt}><B>Lines: </B>{data.LineNumber}</Text>
      </View>
    </View>
)
}
const styles = StyleSheet.create({
  container: {
      height: 137,
      width:'100%',
      borderColor:'black',
      borderStyle:'solid',
      borderWidth: 1,
      backgroundColor: '#7bbee9',
      marginBottom: 10
  },
  Txt:{
      margin: 2,
      fontSize:16,
    },
    dateTitle: {
        width:'100%',
        justifyContent:'center',
        alignSelf:'center',
        display:'flex',
        backgroundColor:'aqua',
        textAlign: 'center'
    }
   
})