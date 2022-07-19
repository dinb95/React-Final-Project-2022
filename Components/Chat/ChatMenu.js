import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import React, {useEffect, useState} from 'react'

export default function ChatMenu({navigation, route}) {
    const [useChats, setChats] = useState(<></>)
    
    useEffect(() => {
        // render the chat menu, chat for each line in the specified route.
        console.log("chat menu")
        let data = route.params.routeData;
        let lines = data.LineNumber.split(' ')
        lines.pop(lines.length-1)
        console.log("rendering chat menu", lines)
        const chats = lines.map((line, index) => {
            return(
                <View style={styles.optionContainer} key={index}>
                    <TouchableOpacity style={styles.chatOption} onPress={() => navigateToChat(line)}>
                     <Text style={styles.chatText} >Chat For Line {line}</Text>
                    </TouchableOpacity>
                </View>
            )
        })
        setChats(chats)
    }, [])
    
    const navigateToChat = (line) =>{
        let line_data = data;
        line_data.LineNumber = line;
        line_data["userId"] = route.params.userId;
        console.log("line data: ",line_data)
        navigation.navigate({name:'ChatScreen', params:line_data})
    }
  return (
    <View style={styles.container}>
      {/* <Text style={styles.title}>Chat Menu</Text> */}
      {useChats}
    </View>
  )
}
const styles = StyleSheet.create({
    container: {
        height:'100%',
        width:'100%',
        backgroundColor:'#cccccc'
    },
    optionContainer:{
        width:'100%',
        height:'15%',
        alignItems:'center',
        justifyContent:'center',
        alignContent:'center',
        display:"flex",
        marginTop:30,
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
        justifyContent:'center',
        backgroundColor: "white"
    },
    chatText:{
        textAlign:'center',
    }
})