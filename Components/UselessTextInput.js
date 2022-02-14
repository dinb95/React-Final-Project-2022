import React from "react";
import { SafeAreaView, StyleSheet, TextInput } from "react-native";
import Ionicons from 'react-native-vector-icons/Ionicons';


const UselessTextInput = () => {
const [text, onChangeText] = React.useState("Useless Text");

  return (
   
      <TextInput
        style={styles.input}
        onChangeText={onChangeText}
        value={text}
      />
  );
};

const styles = StyleSheet.create({
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
});

export default UselessTextInput;