import { View, Text, StyleSheet, ScrollView } from 'react-native'
import React, {useState, useEffect} from 'react'
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

export default function ChatScreen({navigation, route}) {
    console.log(route)
    const [message, setMessage] = useState();
    const [useMessages, setMessages] = useState();
    const [msgArr, setMsgArr] = useState([]);
    const [user, setUser] = useState("")

    let data = route.params;
    let line = data.LineNumber.split(' ')

    useEffect(async () => {
        getMessages(data);
        const name = await AsyncStorage.getItem('username');
        setUser(name);
    }, [])
    useEffect(() => {
        renderMessages(msgArr)
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
                    name: 'Din'
                }

            })
        });
        // let arr = msgs.map((msg, index) => {
        //     return (
        //     <ChatMessage data={msg} key={index} userId={data.userId}/>
        //     )
        // })
        //setMessages(arr);
        console.log(messages)
        const gifted = <GiftedChat messages={messages} inverted={false} renderUsernameOnMessage={true} user={{_id: data.userId}}/>
        setMessages(gifted)
    }
    const postMessage = () => {
        let messageContent = {
            message: message,
            id: data.userId,
            name: user.split(" ")[0]
        }
        console.log(msgArr.length)
        const db = ref(database, `Chats/${line[0]}/${msgArr.length}/`);
        set(db, messageContent);
        setMessage("");
    }
 
  return (
    // <View style={styles.container}>
    //     <Text style={styles.title}>Line {line} Chat</Text>
    //     <ScrollView style={styles.messagesContainer}>
            
    //     </ScrollView>
    //     <View style={styles.inputContainer}>
    //     <TextInput placeholder='Message' style={styles.input} value={message} onChangeText={setMessage}/>
    //   <TouchableOpacity style={styles.BtnSearch} onPress={() => postMessage()}>
    //       <Text>Send</Text>
    //   </TouchableOpacity>
    //   </View>
    // </View>
    <View style={styles.container}>
        <Text style={styles.title}>Line {line} Chat</Text>
        {useMessages}
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