import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import React, {useEffect} from 'react'

export default function ChatMenu({navigation, route}) {
    let data = route.params;
    let lines = data.LineNumber.split(' ')
    lines.pop(lines.length-1)

    const chats = lines.map((line) => {
        console.log(line)
        return(
            <View style={styles.optionContainer}>
                <TouchableOpacity style={styles.chatOption} onPress={() => navigateToChat(line)}>
                 <Text style={styles.chatText} >Chat For Line {line}</Text>
                </TouchableOpacity>
            </View>
        )
    })
    const navigateToChat = (line) =>{
        let line_data = data;
        line_data.LineNumber = line;
        navigation.navigate({name:'ChatScreen', params:line_data})
    }



    
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Chat Menu</Text>
      {chats}
    </View>
  )
}
const styles = StyleSheet.create({
    container: {
        height:'60%',
        width:'100%'
    },
    optionContainer:{
        width:'100%',
        height:'20%',
        alignItems:'center',
        justifyContent:'center',
        alignContent:'center',
        display:"flex",
        marginTop:10,
    },
    title:{
        marginTop:'10%',
        justifyContent:'center',
        alignContent:'center',
        display:"flex",
        textAlign:'center',
        fontSize:20,
    },
    chatOption:{
        height:'100%',
        width:'50%',
        borderWidth:1,
        borderRadius:10,
        justifyContent:'center'
    },
    chatText:{
        textAlign:'center',
    }
})