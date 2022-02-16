import React from "react";
import { StyleSheet, View, Button, ImageBackground,TouchableOpacity, Text} from "react-native";
import * as Google from "expo-google-app-auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { blue } from "@mui/material/colors";
import Icon from 'react-native-vector-icons/FontAwesome';
import SignUpScreen from "./SignUpScreen";
import LoginUser from "./LoginUser";
import PushPage from '../PushPage';



const LoginScreen = ({ route, navigation}) => {
  const signInAsync = async () => {
    console.log("LoginScreen.js 6 | loggin in");
    try {
      const { type, user } = await Google.logInAsync({
        iosClientId: `573877279106-nfjo7fbe6g6thvju60uv3u2286oov7e2.apps.googleusercontent.com`,
        androidClientId: `573877279106-ev0q9g82ln8lieu30pldlgmmgioo5a0k.apps.googleusercontent.com`,
      });
      if (type === "success") {
        // Then you can use the Google REST API
        console.log("LoginScreen.js 17 | success, navigating to profile");
        console.log(user)
        route.params.setLogged(user)
        await AsyncStorage.setItem('username', user.name)
        await AsyncStorage.setItem('userid', user.id)
        await AsyncStorage.setItem('userpic', user.photoUrl)
      }
    } catch (error) {
      console.log("LoginScreen.js 19 | error with login", error);
    }
  };

  return (
    <View style={styles.container}>
      <ImageBackground source={require('../images/way1.jpg')} resizeMode="cover" style={styles.image}>
      <Text style={styles.timely_title}>Timely</Text>
      <View style={{ flexDirection: 'row' }}>
          <TouchableOpacity
              style={styles.signInBtn}
              onPress={() => {navigation.navigate('SignUp')}}
              >
              <Text style={styles.Txt}>Sign Up</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.LoginBtn}
              onPress={() => {navigation.navigate({name: 'LoginUser', params:{setLogged: route.params.setLogged}})}}
              >
              <Text style={styles.Txt}>Login</Text>
            </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={signInAsync}
        
          style={styles.googleBtn} >  
          <View style={{ flexDirection: 'row' }}>
            <Icon name="google" size={20} color="blue" />
            <Text style={styles.googleTxt} > Quick login with Google</Text>
          </View>
        </TouchableOpacity>
        <PushPage/>
      </ImageBackground>

    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container:{
    flex: 1,
    justifyContent: 'center',
  },
  button:{
    alignSelf: "flex-start",
    marginHorizontal: "1%",
    marginBottom: 6,
    minWidth: "48%",
    textAlign: "center",
  },
  timely_title: {
    textAlign: 'center',
    justifyContent:'center',
    alignContent: 'center',
    fontWeight:'bold',
    color:'white',
    fontSize: 50,
    marginBottom:20
  },
  image: {
    flex: 1,
    justifyContent: "center"
  },
  signInBtn:{
    width: 150,
    fontSize: 60,
    alignItems: 'center',
    backgroundColor: '#bddff5',
    padding: 10 ,     
    borderRadius: 25,
    marginLeft:20

  },
  LoginBtn:{
    width: 150,
    fontSize: 60,
    alignItems: 'center',
    backgroundColor: '#bddff5',
    padding: 10 ,
    borderRadius: 25,
    marginLeft:20
  },
  googleBtn:{
    width: 230,
    fontSize: 60,
    alignItems: 'center',
    backgroundColor: '#51aae1',
    padding: 10 ,
    borderRadius: 25,
    justifyContent: 'center',
    alignSelf: 'center',
    color:'blue',
    margin:10


  },
  googleTxt:{
    fontSize: 18,
    alignItems: 'center',
    color:'blue',
  },
  Txt:{
    fontSize: 18,
    alignItems: 'center',
  }
})
