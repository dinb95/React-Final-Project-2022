import { View, Text, StyleSheet, ScrollView, ImageBackground } from 'react-native'
import React, {useState, useEffect, useCallback, useLayoutEffect} from 'react'
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onChildAdded, set, push } from "firebase/database";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { GiftedChat, Bubble, InputToolbar, Composer } from 'react-native-gifted-chat'
import { TouchableOpacity } from 'react-native-gesture-handler';


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
  let pic;
  let name;

export default function ChatScreen({navigation, route}) {
    const [useChat, setChat] = useState();
    const [msgArr, setMsgArr] = useState([]);

    let data = route.params;
    let line = data.LineNumber.split(' ')

    useEffect(async () => {
        let isMounted = true
        if(isMounted){
            getMessages();
            name = await AsyncStorage.getItem('username');
            name = name.split(" ")[0]
            pic = await AsyncStorage.getItem('userpic');
            getStatus(data.userId)
            navigation.setOptions({title: line})
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

    // get the messages from all the users for this chat
    const getMessages = () => {
        const db = ref(database, `Chats/${line[0]}`);
        onChildAdded(db, (snapshot) => {
            const data = snapshot.val();
            setMsgArr(prev => [...prev, data]);
          })
    }
    // get user's status (banned from sending a message or not)
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
    // changing the message bubble style
    const renderBubble = (props) => {
        return (
          <Bubble
            {...props}
            wrapperStyle={{
              right: {
                backgroundColor: "#51aae1",
                marginBottom: 10,
              },
              left: {
                  backgroundColor: "white",
                  marginBottom: 10
              }
            }}
          />
        )
      }
    // chaning the message input at the bottom's style
    const renderInputToolbar = (props) => {
        return <InputToolbar {...props} containerStyle={styles.InputToolbar} /> 
    }
    // changing the placeholder text of the message input
    const renderComposer = (props) => {
        return <Composer {...props} placeholderTextColor="white"/>
    }
    // render the chat with all the messages
    function renderMessages(msgs){
        let messages = []
        msgs.forEach((msg, index) => {
            messages.push({
                _id: index,
                text: msg.message,
                user:{
                    _id: msg.id,
                    name: msg.name,
                    avatar: msg.avatar
                },
                createdAt: msg.dtSent 

            })
        });
        const gifted = (
            <GiftedChat 
                messages={messages} 
                inverted={false} 
                renderUsernameOnMessage={true} 
                user={{_id: data.userId, name: `${name}`, avatar: pic}}
                alwaysShowSend={true}
                onSend={messages => onSend(messages)}
                showUserAvatar={true}
                showAvatarForEveryMessage={true}
                renderBubble={renderBubble}
                renderInputToolbar={renderInputToolbar}
                renderComposer={renderComposer}
            />
            )
        setChat(gifted)
    }
    // send message handler
    const onSend = useCallback((msg) => {
        console.log(msg);
        if(status == 0){ // status == 0 => banned from chat
            alert("You are suspended from the chat")
            return;
        }
        let messageContent = {
            message: msg[0].text,
            id: msg[0].user._id,
            name: msg[0].user.name,
            dtSent: `${new Date()}`,
            avatar: pic
        }
        var Filter = require('bad-words')
        var filter = new Filter({ regex: /\*|\.|$/gi });

        // check if the message contains profane words
       if(filter.isProfane(messageContent.message)){
        const db = ref(database, `Profane/${messageContent.id}/`);
        push(db, messageContent);
        alert("Dont Swear!")
       }
       else{
        const db = ref(database, `Chats/${line[0]}/${len}/`);
        set(db, messageContent);
    }
      }, [])
 
  return (
    <View style={styles.container}>
        <TouchableOpacity onPress={() => {navigation.goBack()}}>
            <View style={styles.titleContainer} onPress>
                <Text style={styles.title}>Line {line} Chat</Text>
            </View>
        </TouchableOpacity>
    <ImageBackground source={require('../../images/chatBackground.jpeg')} resizeMode="cover" blurRadius={1} style={styles.image}>
        {useChat}
    </ImageBackground>
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
        backgroundColor: 'white',
    },
    image: {
        flex: 1,
        justifyContent: "center"
      },
    titleContainer: {
        flexDirection: 'row',
        backgroundColor: "#76b4d8",
        paddingBottom: 15,
        justifyContent:'center',
        alignContent:'center',
        alignItems: 'center',
    },
    title:{
        fontSize:20,
        position:'relative',
        display:"flex",
        textAlign:'center',
        marginTop:'10%',
        fontWeight: 'bold',
        color: "white",
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
      InputToolbar: {
        backgroundColor: "#76b4d8",
        borderRadius: 15,
        marginLeft: 10,
        marginRight: 10,
      }
})