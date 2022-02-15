import React, {useEffect, useState} from "react";
import { Button, Image, View, Platform,StyleSheet,Text,TextInput,TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { StatusBar } from "expo-status-bar";
import AsyncStorage from "@react-native-async-storage/async-storage";

const UserUpdateForm = ({navigation}) => {
const [firstName, setFirstName] = useState("");
const [lastName, setLastName] = useState("");
const [password, setPassword] = useState("");
const [confirm, setConfirm] = useState("");
const [id, setId] = useState();

  useEffect(async() =>{
    let userId = await AsyncStorage.getItem('userid');
    setId(JSON.parse(userId))
  }, [])

  const updateInfo = () => {
    console.log(firstName)
    if(firstName === "" || lastName === "" || password === "" || confirm === ""){
      alert("Please fill all inputs")
    }
    else if(password != confirm)
      alert("Passwords don't match")
    else {
      var user = {
        Id: id,
        FirstName: firstName,
        LastName: lastName,
        Password: password
      }
      console.log(id)
      let api = "https://proj.ruppin.ac.il/bgroup54/test2/tar6/api/Users"
      fetch(api, {
      method: 'PUT',
      body: JSON.stringify(user),
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
            console.log(result)
            if(result == "User Updated"){
              alert("User's Information Updated Successfully")
              navigation.goBack();
            }
            else alert("Something went wrong..")
          })
      .catch(function(error) {
        console.log('There has been a problem with your fetch operation: ' + error.message);
          throw error;
        });

    }
  }

  return (
    <View style={styles.container}>
    <StatusBar style="auto" />
    <View style={styles.inputView}>
      <TextInput
        style={styles.TextInput}
        placeholder="First Name"
        placeholderTextColor="#003f5c"
        onChangeText={(firstName) => setFirstName(firstName)}
      />
    </View>
    <StatusBar style="auto" />
    <View style={styles.inputView}>
      <TextInput
        style={styles.TextInput}
        placeholder="Last Name"
        placeholderTextColor="#003f5c"
        onChangeText={(LastName) => setLastName(LastName)}
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
    <View style={styles.inputView}>
      <TextInput
        style={styles.TextInput}
        placeholder="Confirm Password"
        placeholderTextColor="#003f5c"
        secureTextEntry={true}
        onChangeText={(password) => setConfirm(password)}
      />
    </View>
    <TouchableOpacity style={styles.SaveBtn} onPress={updateInfo}>
        <Text style={styles.Txt}>Save changes</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.DoNotSaveBtn} onPress={() => {navigation.goBack()}}>
        <Text style={styles.Txt}>Do not save changes</Text>
      </TouchableOpacity>
    </View>
    
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
   justifyContent: "center",
   marginTop:60,

  },
  
  inputView: {
    backgroundColor: "#7bbee9",
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
    marginLeft: 20,
    fontSize:18
  },
  
  forgot_button: {
    height: 30,
    marginBottom: 30,
  },
  SaveBtn: {
    width: "80%",
    borderRadius: 25,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    backgroundColor: "#00cc44",
  },
  DoNotSaveBtn: {
    width: "80%",
    borderRadius: 25,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    backgroundColor: "#ff4d4d",
  },
  Txt:{
    fontSize:18
  }
});

export default UserUpdateForm;

