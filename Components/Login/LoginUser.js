import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  Button,
  TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function LoginUser({route}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
 
  // log Timely user in (not from google)
  const logUser = () => {
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
    if(!reg.test(email)){
      alert("Email is Not Correct");
      setEmail("");
      return false;
  }
  
  let api = `https://proj.ruppin.ac.il/bgroup54/test2/tar6/api/Users?email=${email}&password=${password}`
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
  .then(
      (result) => {
        if(result.Message == "user not found")
          alert("Wrong email or password")
        else saveToStorage(result)
      })
  .catch(function(error) {
    console.log('There has been a problem with your fetch operation: ' + error.message);
      throw error;
    });
  }
  // save data to local storage for later purposes
  const saveToStorage = async(user) => {
    AsyncStorage.setItem('username', `${user.FirstName} ${user.LastName}`)
    AsyncStorage.setItem('userid', JSON.stringify(user.Id))
    
    //get user profile picture
    let api = `https://proj.ruppin.ac.il/bgroup54/test2/tar6/api/UserPic/${user.Id}`
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
    .then(
        (result) => { 
          AsyncStorage.setItem('userpic', JSON.stringify(result))
          route.params.setLogged();
        })

    
  }
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>

      <Image source={require("../../images/logo3.jpg")}
             style={{height: 150, width: 150, borderRadius: 80, marginBottom: 60, justifyContent: 'center', alignItems: 'center'}}
             />
             
      <StatusBar style="auto" />
      <View style={styles.inputView}>
        <TextInput
          style={styles.TextInput}
          placeholder="Email"
          placeholderTextColor="#003f5c"
          onChangeText={(email) => setEmail(email)}
        />
      </View>
 
      <View style={styles.inputView}>
        <TextInput
          style={styles.TextInput}
          placeholder="Password"
          placeholderTextColor="#003f5c"
          secureTextEntry={true}
          onChangeText={(password) => setPassword(password)}
        />
      </View> 
      <TouchableOpacity style={styles.loginBtn} onPress={() => {logUser()}}>
        <Text style={styles.loginText}>Login</Text>
      </TouchableOpacity>
    </View>
  );
}
 
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
   justifyContent: "center",
  }, 
  title:{
    position:'absolute',
    fontSize:40,
    top:40,
    color: "#51aae1",
    fontWeight:'bold',
 

},

  inputView: {
    backgroundColor: "#bddff5",
    borderRadius: 30,
    width: "70%",
    height: 45,
    marginBottom: 20,
 
    alignItems: "center",
  },
 
  TextInput: {
    height: 50,
    flex: 1,
    padding: 10,
    fontSize:18
  },
 
  forgot_button: {
    height: 30,
    marginBottom: 30,
  },
 
  loginBtn: {
    width: "80%",
    borderRadius: 25,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 40,
    backgroundColor: "#51aae1",
  },
  loginText:{
    fontSize:18

  }
 
});