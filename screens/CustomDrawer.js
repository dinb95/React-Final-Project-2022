import React, {useState} from 'react';
import {
  View,
  Text,
  ImageBackground,
  Image,
  TouchableOpacity,
} from 'react-native';
import {
  DrawerContentScrollView,
  DrawerItemList,
} from '@react-navigation/drawer';

import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from "@react-native-async-storage/async-storage";


const CustomDrawer = (props) => {

  const [username, setUsername] = useState();
  const [userid, setUserid] = useState();
  const [userpic, setUserpic] = useState();

  const getUser = async() => {
    const name = await AsyncStorage.getItem('username');
    const id = await AsyncStorage.getItem('userid');
    const pic = await AsyncStorage.getItem('userpic');
    if(name !== null)
      setUsername(name)
    if(id !== null){
      setUserid(id)
    }
    if(pic !== null){
      try{
        setUserpic(JSON.parse(pic))
      }
      catch{setUserpic(pic)}

  }
  }
  const signOutBtn = () => {
    props.signOut();
  }
  getUser();
  return (
    <View style={{flex: 1}}>
      <DrawerContentScrollView
        {...props}
        contentContainerStyle={{backgroundColor: '#7bbee9'}}>
        <ImageBackground
          source={require('../images/blueBackjpg.jpg')}
          style={{padding: 20}}>
          <Image
            source={{uri: userpic}}
            style={{height: 80, width: 80, borderRadius: 40, marginBottom: 10}}
          />
          <Text 
            style={{
              color: '#080808',
              fontWeight:'bold',
              fontSize: 18,
            //   fontFamily: 'Roboto-Medium',
              marginBottom: 5,
            }}>
            {username}
          </Text>
        </ImageBackground>
        <View style={{flex: 1, backgroundColor: '#fff', paddingTop: 10}}>
          <DrawerItemList {...props}  />
        </View>
      </DrawerContentScrollView>
      <View style={{padding: 20, borderTopWidth: 1, backgroundColor: '#fff', borderTopColor: '#ccc'}}>
        <TouchableOpacity onPress={() => {signOutBtn()}} style={{paddingVertical: 15}}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Ionicons name="exit-outline" size={22} />
            <Text
              style={{
                fontSize: 15,
                // fontFamily: 'Roboto-Medium',
                marginLeft: 5,
              }}>
              Sign Out
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CustomDrawer;