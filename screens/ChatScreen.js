import { View, Text, StyleSheet, ScrollView } from 'react-native'
import React, {useState, useEffect, useCallback} from 'react'
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onChildAdded, set } from "firebase/database";
import { TextInput, TouchableOpacity } from 'react-native-gesture-handler';
import ChatMessage from '../Components/ChatMessage';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { GiftedChat } from 'react-native-gifted-chat'


const firebaseConfig = {
    apiKey: "AIzaSyDvDTL7yUQocA1JXW90LtKibG_uRm9z-E4",
    authDomain: "final-project-din-and-hadar.firebaseapp.com",
    databaseURL: "https://final-project-din-and-hadar-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "final-project-din-and-hadar",
    storageBucket: "final-project-din-and-hadar.appspot.com",
    messagingSenderId: "490950571924",
    appId: "1:490950571924:web:16a1d3b0896e4b41cfc181",
    measurementId: "G-4YV91X5FDZ"
  };
  
  const app = initializeApp(firebaseConfig);
  const database = getDatabase(app);
  let len = 0
export default function ChatScreen({route}) {
    const [message, setMessage] = useState();
    const [useChat, setChat] = useState();
    const [msgArr, setMsgArr] = useState([]);
    const [user, setUser] = useState("")

    let data = route.params;
    console.log(data)
    let line = data.LineNumber.split(' ')

    useEffect(async () => {
        let isMounted = true
        if(isMounted){
            getMessages(data);
            const name = await AsyncStorage.getItem('username');
            setUser(name.split(" ")[0]); //extract the first name
        }
        return () => {isMounted = false}
    }, [])
    useEffect(() => {
        let isMounted = true
        if(isMounted){
        renderMessages(msgArr)
        len = msgArr.length
        }
        return () => {isMounted = false}
    }, [msgArr])

    const getMessages = (data) => {
        console.log(data)
        const db = ref(database, `Chats/${line[0]}`);
        onChildAdded(db, (snapshot) => {
            const data = snapshot.val();
            setMsgArr(prev => [...prev, data]);
          })
    }
    function renderMessages(msgs){
        let messages = []
        msgs.forEach((msg, index) => {
            messages.push({
                _id: index,
                text: msg.message,
                user:{
                    _id: msg.id,
                    name: msg.name
                },
                createdAt: msg.dtSent 

            })
        });
        const gifted = (
            <GiftedChat 
                messages={messages} 
                inverted={false} 
                renderUsernameOnMessage={true} 
                user={{_id: data.userId, name: `${user}`}}
                alwaysShowSend={true}
                onSend={messages => onSend(messages)}
                showUserAvatar={true}
            />
            )
        setChat(gifted)
    }
    // const postMessage = () => {
    //     let messageContent = {
    //         message: message,
    //         id: data.userId,
    //         name: user.split(" ")[0]
    //     }
    //     console.log(msgArr.length)
    //     const db = ref(database, `Chats/${line[0]}/${msgArr.length}/`);
    //     set(db, messageContent);
    //     setMessage("");
    // }
    const onSend = useCallback((msg) => {
        console.log(msg)
        let messageContent = {
            message: msg[0].text,
            id: msg[0].user._id,
            name: msg[0].user.name,
            dtSent: `${new Date()}`
        }
        console.log(messageContent)
        const db = ref(database, `Chats/${line[0]}/${len}/`);
        set(db, messageContent);
        //setMessages(previousMessages => GiftedChat.append(previousMessages, messages))
      }, [])
 
  return (
    <View style={styles.container}>
        <Text style={styles.title}>Line {line} Chat</Text>
        {useChat}
    </View>
  )
}

const styles = StyleSheet.create({
    container: {
        width:'100%',
        height: '100%',
        justifyContent:'center',
        alignContent:'center',
        display:"flex",
        backgroundColor: '#bddff5',
        
    },
    title:{
        fontSize:40,
        position:'relative',
        justifyContent:'center',
        alignContent:'center',
        display:"flex",
        textAlign:'center',
        marginTop:'10%'
    },
    input: {
        height: 50,
        width: '90%',
        margin: 12,
        borderWidth: 1,
        padding: 10,
        borderRadius:7,
        backgroundColor:'#ffffff',
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
        fontSize:18
      },
      BtnSearch:{
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
        display:'flex',
        backgroundColor: '#51aae1',
        padding:7,  
        borderRadius:7,
        marginBottom:10,
        marginTop:10,
        
      },
      messagesContainer:{
          backgroundColor:'lightgray',
          marginTop:'30%',
          height:'60%',
          width:'100%',
          marginBottom:10,
          marginTop:'10%',
          paddingTop:10
      },
      inputContainer:{
      }
})