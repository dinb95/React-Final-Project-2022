import { View, Text, StyleSheet, Button, TouchableOpacity, Image } from 'react-native'
import React, {useState} from 'react'
import * as ImagePicker from 'expo-image-picker';


export default function SelectPictureScreen({route, navigation}) {
    const [image, setImage] = useState(null);

    const pickImage = async () => {
        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.All,
          allowsEditing: true,
          aspect: [4, 3],
          quality: 1,
        });
        console.log(result);
        if (!result.cancelled) {
          setImage(result.uri);
        }
    };
    const takePicture = (uri) => {
        setImage(uri);
      }
    const saveImage = () => {
        console.log(image)
        route.params.savePicture(image)
        navigation.goBack()
    }
  return (
    <View style={styles.container}>
        <Text style={styles.title}>Upload Picture</Text>
        {image && <Image source={{ uri: image }} style={{ borderRadius: 80, width: 150, height: 150, paddingBottom:20 }} />}
        <TouchableOpacity style={styles.uploadBtn} onPress={() => {navigation.navigate({
            name: 'CameraComp', 
            params:{takePicture:takePicture}
        })}}>
            <Text>Take a picture from camera</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.uploadBtn} onPress={pickImage} >
            <Text>Pick an image from camera roll</Text>
        </TouchableOpacity>
        <Button title='Save Image' onPress={saveImage}/>
    </View>
  )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#adb9ca",
      alignItems: "center",
     justifyContent: "center",
    },
  
    inputView: {
      backgroundColor: "#fff",
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
      backgroundColor: "#809bc2",
    },
    uploadBtn:{
        width: "60%",
        borderRadius: 25,
        height: 50,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#809bc2",
        margin:10
    },
    title:{
        position:'absolute',
        fontSize:40,
        top:50,
        color: '#fff'
    }
  });