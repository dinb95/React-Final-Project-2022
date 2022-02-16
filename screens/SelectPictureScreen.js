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
        <TouchableOpacity style={styles.Btn1} onPress={() => {navigation.navigate({
            name: 'CameraComp', 
            params:{takePicture:takePicture}
        })}}>
            <Text style={styles.TextInput}>Take a picture from camera</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.Btn2} onPress={pickImage} >
            <Text style={styles.TextInput}>Pick an image from camera roll</Text>
        </TouchableOpacity>
        <Button title='Save Image' onPress={saveImage}/>
    </View>
  )
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
   
    title:{
      position:'absolute',
        fontSize:40,
        top:40,
        color: "#51aae1",
        fontWeight:'bold',
  },
  Btn1: {
    backgroundColor: "#51aae1",
    borderRadius: 30,
    width: "80%",
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    marginTop:15,
  },
  Btn2: {
    backgroundColor: "#bddff5",
    borderRadius: 30,
    width: "80%",
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    marginTop:15,
    marginBottom: 15
  },
  TextInput: {
    height: 50,
    flex: 1,
    padding: 10,
    fontSize:18
  },
  });