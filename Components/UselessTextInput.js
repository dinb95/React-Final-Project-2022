import React from "react";
import { Button, Image, View, Platform,StyleSheet,Text,TextInput,TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { StatusBar } from "expo-status-bar";



const UselessTextInput = () => {
const [name, setName] = React.useState("");

  return (
    <View style={styles.container}>
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
    <TouchableOpacity style={styles.SaveBtn} onPress={() => {logUser()}}>
        <Text style={styles.Txt}>Save changes</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.DoNotSaveBtn} onPress={() => {logUser()}}>
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

export default UselessTextInput;

