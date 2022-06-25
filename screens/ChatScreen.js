import { View, Text, StyleSheet, ScrollView } from 'react-native'
import React, {useState, useEffect, useCallback} from 'react'
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onChildAdded, set, push } from "firebase/database";
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
  let status = 1;

export default function ChatScreen({route}) {
    const [useChat, setChat] = useState();
    const [msgArr, setMsgArr] = useState([]);
    const [user, setUser] = useState("")

    let data = route.params;
    let line = data.LineNumber.split(' ')
    useEffect(async () => {
        let isMounted = true
        if(isMounted){
            getMessages(data);
            const name = await AsyncStorage.getItem('username');
            setUser(name.split(" ")[0]); //extract the first name
            getStatus(data.userId)
            
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
        const db = ref(database, `Chats/${line[0]}`);
        onChildAdded(db, (snapshot) => {
            const data = snapshot.val();
            setMsgArr(prev => [...prev, data]);
          })
    }
    const getStatus = (id) => {
        console.log("user id:", id)
        let api = `https://proj.ruppin.ac.il/bgroup54/test2/tar6/api/Users?id=${id}&a=a`
        fetch(api, {
            method: 'GET',
            headers: new Headers({
                'Content-type': 'application/json; charset=UTF-8',
                'Accept': 'application/json; charset=UTF-8'
              })
            })
            .then(res => {
                return res.json()
            })
            .then((result) => {
                console.log("status: ",result)
                status = result
            })
            .catch(function(error) {
              console.log('There has been a problem with your fetch operation: ' + error.message);
                throw error;
            });
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
    const onSend = useCallback((msg) => {
        console.log(status)
        if(status == 0){
            alert("You are suspended from the chat")
            return;
        }
        let messageContent = {
            message: msg[0].text,
            id: msg[0].user._id,
            name: msg[0].user.name,
            dtSent: `${new Date()}`
        }
        var Filter = require('bad-words')
        // filter = new Filter();
        var filter = new Filter({ regex: /\*|\.|$/gi });
        //var filter = new Filter({ replaceRegex:  /[A-Za-z0-9가-힣_]/g }); 
        //console.log("--------------"+filter.isProfane(messageContent.message)+"-----------"); //
       if(filter.isProfane(messageContent.message)){
        const db = ref(database, `Profane/${messageContent.id}/`);
        push(db, messageContent);
        alert("Dont Swear!")
       }
       else{
        console.log(messageContent)
        const db = ref(database, `Chats/${line[0]}/${len}/`);
        set(db, messageContent);
        //setMessages(previousMessages => GiftedChat.append(previousMessages, messages))
    }
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