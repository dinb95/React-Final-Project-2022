import React from "react";
import { StyleSheet, View, Button } from "react-native";
import * as Google from "expo-google-app-auth";

const LoginScreen = ({setLogged}) => {
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
        setLogged(user)
        //navigation.navigate("Profile", { user });
      }
    } catch (error) {
      console.log("LoginScreen.js 19 | error with login", error);
    }
  };

  return (
    <View style={styles.container}>
      <Button title="Login with Google" onPress={signInAsync} />
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    alignContent: 'center',
    justifyContent: 'center',
    height:'100%',
    width: '100%'
  }
});