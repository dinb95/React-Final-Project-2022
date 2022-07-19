import React, { useState, useEffect } from 'react';
import { Button, Image, View, Platform,StyleSheet,Text,TextInput,TouchableOpacity } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { StatusBar } from "expo-status-bar";


export default function SignUpScreen({navigation}) {
  const [image, setImage] = useState(null);
  const [firstName, setfirstName] = useState("");
  const [LastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  //define this in userUpdate page
  const savePicture = (uri) => {
    console.log("uri from signup: ", uri)
    setImage(uri);
  }
  const SignUpUser = () => {
    if(firstName === "" || LastName === "" || email ==="" || password === "" || confirm === "" ){
      alert("Please fill all inputs")
    }
    if(image === null)
    {
      setImage("https://yt3.ggpht.com/ytc/AKedOLQf5MBcFSDzo2FeZIXSqafCvdRMGjW2C-0j8RpD=s900-c-k-c0x00ffffff-no-rj");
    }
    else if(!valid()){      
      alert("Email is Not Correct");
    }
    else if(password != confirm)
      alert("Passwords don't match")
    else {
      createUser();
    }
  }
 
  const valid = () => {
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
   return(reg.test(email));  
  }  

  const createUser = () => {
    var user = {
      FirstName: firstName,
      LastName: LastName,
      Email: email,
      Password: password
  }
  let api = "https://proj.ruppin.ac.il/bgroup54/test2/tar6/api/Users"
  fetch(api, {
  method: 'POST',
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
        if(result === -1)
          alert("This email is already in use, try a different email")
        else imageUpload(`${result}.jpg`, result)
      })
  .catch(function(error) {
    console.log('There has been a problem with your fetch operation: ' + error.message);
      throw error;
    });
  }
  const imageUpload = (picName, id) => {
    console.log(picName);
    console.log(image);
    let api = "https://proj.ruppin.ac.il/bgroup54/test2/tar6/uploadpicture"
    let data = new FormData();
    data.append('picture', {
      uri: image,
      name: picName,
      type: 'image/jpg'
    });
    const config = {
      method: 'POST',
      body: data
    }
    fetch(api, config)
    .then((res) => {
      console.log(res)
      if (res.status == 201) {return res.json(); }
      else {return "err"; }
      })
      .then((responseData) => {
        if (responseData != "err") {
          saveUserPic(responseData, id)
        }
      })
    }
    const saveUserPic = (url, id) => {
      const data = {
        id: id,
        url: url
      }
      let api = "https://proj.ruppin.ac.il/bgroup54/test2/tar6/api/UserPic"
      fetch(api, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: new Headers({
          'Content-type': 'application/json; charset=UTF-8',
          'Accept': 'application/json; charset=UTF-8'
        })
      })
      .then(() => {
        alert("User Registered Successfully")
        navigation.goBack()
      })
    }
  return (
   // <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
   <View style={styles.container}>
   <Text style={styles.title}>Sign Up</Text>
   {image && <Image source={{ uri: image }} style={{ borderRadius: 80, width: 150, height: 150, paddingBottom:20 }} />}
    
    <StatusBar style="auto" />
      <View style={styles.inputView}>
        <TextInput
          style={styles.TextInput}
          placeholder="First Name"
          placeholderTextColor="#003f5c"
          onChangeText={(firstName) => setfirstName(firstName)}
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
      <StatusBar style="auto" />
      <View style={styles.inputView}>
        <TextInput
          style={styles.TextInput}
          placeholder="Email"
          placeholderTextColor="#003f5c"
          onChangeText={(email) =>setEmail(email)}
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
      <TouchableOpacity style={styles.picBtn} onPress={() => navigation.navigate({
      name:'SelectPictureScreen',
      params:{savePicture:savePicture}
      })}>
      <Text style={styles.UploadPicText}>Upload Picture</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.SignUpBtn} onPress={SignUpUser}>
        <Text style={styles.SignUpText}>Sign Up</Text>
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
  
    inputView: {
      backgroundColor: "#bddff5",
      borderRadius: 30,
      width: "70%",
      height: 40,
      marginTop: 20,
      alignItems: "center",
    },
   
    TextInput: {
      height: 50,
      flex: 1,
      padding: 10,
      fontSize:18
    },
   

    SignUpBtn: {
      width: "80%",
      borderRadius: 25,
      height: 50,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "#51aae1",
      position:'absolute',
      bottom:50,
      marginTop:15,
    },
    picBtn:{
      backgroundColor: "#bddff5",
      borderRadius: 30,
      width: "70%",
      height: 40,
      alignItems: "center",
      justifyContent: "center",
      marginTop:15,
      color: "#51aae1",
    },
    title:{
        position:'absolute',
        fontSize:40,
        top:40,
        color: "#51aae1",
        fontWeight:'bold',
     

    },
    UploadPicText:{
      height: 50,
      flex: 1,
      padding: 10,
      fontSize:18,
      color: "blue",

    },
    SignUpText:{   fontSize:18}
  });
