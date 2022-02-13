import React from "react";
import { StyleSheet, View, Button, ImageBackground, Text} from "react-native";
import * as Google from "expo-google-app-auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

const LoginScreen = ({ setLogged }) => {
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
        setLogged(user)
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
      <ImageBackground source={require('../images/way.jpeg')} resizeMode="cover" style={styles.image}>
      <Text style={styles.timely_title}>Timely</Text>
      <Button style={styles.button} title="Login with Google" onPress={signInAsync} />
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
  }
})
