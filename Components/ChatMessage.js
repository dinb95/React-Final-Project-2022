import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import { GiftedChat } from 'react-native-gifted-chat'

export default function ChatMessage({data, userId}) {
    return(
        ""
    )
//     let sameId = (userId === data.id)
//   return ( sameId ? 
//     <View style={style.containerLeft}>
//         <Text>{data.name}</Text>
//         <Text style={style.message}>{data.message}</Text>
//     </View>
//     :
//     <View style={style.containerRight}>
//         <Text>{data.name}</Text>
//         <Text style={style.message}>{data.message}</Text>
//   </View>
//  )
}

const style = StyleSheet.create({
    containerLeft:{
        height:'auto',
        minHeight:'5%',
        width:"60%",
        borderColor:'white',
        backgroundColor:'white',
        borderWidth:1,
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
        display:'flex',
        marginBottom:10,
        flexDirection:'row',
        position:'relative',
        marginLeft:'30%',
        padding:5,
        borderRadius:8

    },
    containerRight:{
        height:'auto',
        minHeight:'5%',
        width:"60%",
        borderColor:'lightgreen',
        backgroundColor:'lightgreen',
        borderWidth:1,
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
        display:'flex',
        marginBottom:10,
        flexDirection:'row',
        position:'relative',
        marginRight:'30%',
        padding:5,
        borderRadius:8
    },
    message: {
        color: 'black',
        position:'relative',
        textAlign:'right',
        display:'flex',
        flex:1,
        marginRight:10,
        textAlign:'right',
     
    }
})