import React from "react";
import { StyleSheet, View, ImageBackground,TouchableOpacity, Text} from "react-native";
import * as Google from "expo-google-app-auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from 'react-native-vector-icons/FontAwesome';
import PushPage from '../../PushPage';

const LoginScreen = ({ route, navigation}) => {

  // save a google user to the database
  const saveToDB = (user) => {
    data = {
      Id: user["id"],
      FirstName: user["givenName"],
      LastName: user["familyName"],
      Email: user["email"],
      Image: user["photoUrl"] 
    }
    let api = "https://proj.ruppin.ac.il/bgroup54/test2/tar6/api/GoogleUser"
    fetch(api, {
      method: "POST",
      body: JSON.stringify(data),
      headers: new Headers({
          'Content-type': 'application/json; charset=UTF-8',
          'Accept': 'application/json; charset=UTF-8'
          })
    })
  }
  // login with google
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
        saveToDB(user)
        route.params.setLogged(user)
        route.params.setGoogle(true);
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
      <ImageBackground source={require('../../images/way1.jpg')} resizeMode="cover" style={styles.image}>
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
