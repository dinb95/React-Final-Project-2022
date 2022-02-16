import { View, Text, StyleSheet } from 'react-native'
import React from 'react'

const B = (props) => <Text style={{fontWeight: 'bold'}}>{props.children}</Text>

export default function Travel({data}) {
    const renderCard = () => {
        <View>
        <Text style={styles.Txt}><B>Predicted Arrival Time: </B>{}</Text>
        <Text style={styles.Txt}><B>Departure Time:</B> {}</Text>
        <Text style={styles.Txt}><B>Lines: </B>{}</Text>
    </View>
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