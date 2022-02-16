import { View, Text, TextInput, StyleSheet,ImageBackground, Button, TouchableOpacity} from 'react-native';
import axios from 'axios';
import React, {useState} from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';
import RouteResults from './RouteResults';
import { ScrollView } from 'react-native-gesture-handler';
import DateTimePickerModal from "react-native-modal-datetime-picker";



let key = 'AIzaSyCCwWKnfacKHx3AVajstMk6Ist1VUoNt9w'

export default function SearchRoute({navigation}) {

    const [origin, setOrigin] = useState('Hadera');
    const [destination, setDestination] = useState('Ruppin Academic Center');

    const [date, setDate] = useState(new Date());
    const [mode, setMode] = useState('date');
    const [show, setShow] = useState(false);

    const [results, setResults] = useState("");

    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        setShow(Platform.OS === 'ios');
        setDate(currentDate);
      };
    
      const showMode = (currentMode) => {
        setShow(true);
        setMode(currentMode);
      };
    
      const showDatepicker = () => {
        showMode('date');
      };
    
      const showTimepicker = () => {
        showMode('time');
      };
      const handleConfirm = (newdate) => {
        const currentDate = newdate || date;
        setDate(currentDate)
        setShow(false)
      }
    const getDate = () => {
        return `${date.getDate()}/${date.getMonth()+1}/${date.getFullYear()}`
    }
    const getTime = () => {
        if(date.getMinutes() < 10)
            return `${date.getHours()}:0${date.getMinutes()}`
        else return `${date.getHours()}:${date.getMinutes()}`
    }
    const getDirections = () => {
        //get route directions according to user's origin, destination and date
        let arrival = Math.ceil(date.getTime() / 1000)

        var config = {
            method: 'get',
            url: `https://maps.googleapis.com/maps/api/directions/json?origin=${origin}&destination=${destination}&mode=transit&transit_mode=bus&arrival_time=${arrival}&alternatives=true&key=${key}`,
            headers: { }
          };
          
          axios(config)
          .then(function (response) {
            let route_data = {
                origin:origin,
                destination:destination,
                date: date.getTime(),
                TimeTarget: getTime()
            }
            let route_result = {
              route_data:route_data,
              results: response.data
            }
            setResults(route_result)
          })
          .catch(function (error) {
            console.log(error);
          });
    }
    const renderResults = () => {
      if(results === "")
        return <Text></Text>;
      return (
        <ScrollView style={styles.scrollView}>
         <RouteResults route_results={results} navigation={navigation}/>
        </ScrollView>
      )
    }
  return (
 

    /////
        <View style={styles.container}>
          <ImageBackground source={require('../images/blueWay.jpg')} resizeMode="cover" blurRadius={1} style={styles.image}>
          <View style={{marginTop:20}}>
            <TextInput placeholder='Origin' style={styles.input} value={origin} onChangeText={setOrigin}></TextInput>
            <TextInput placeholder='Destination' style={styles.input} value={destination} onChangeText={setDestination}></TextInput>
            <TouchableOpacity style={styles.Btn} onPress={showDatepicker}>
                <Text style={styles.BtnTxt}>Choose Date and Time</Text>
              </TouchableOpacity>
            <View>
              <View>
                  <Text style={styles.GetFromBtn}>Time: {getDate()}</Text>
              </View>
              <View>
                  <Text style={styles.GetFromBtn}>Date: {getTime()}</Text>
              </View>
                  {show && (
                  <DateTimePickerModal
                    isVisible={show}
                    value={date}
                    mode='datetime'
                    is24Hour={true}
                    onCancel={() => setShow(false)}
                    onConfirm={handleConfirm}
                  />
                )}
              </View>
                <TouchableOpacity style={styles.BtnSearch} onPress={getDirections}>
                  <Text style={styles.BtnTxt}>Search</Text>
                </TouchableOpacity>
                </View>
          </ImageBackground>
            {renderResults()}
        </View>
  );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height:'100%',
        alignItems: 'center',
        position:'absolute',
    },
    image: {
      width:'100%',
      backgroundColor:'rgba(0,0,0,.6)',
    },
    input: {
      height: 50,
      width: '70%',
      margin: 12,
      borderWidth: 1,
      padding: 10,
      borderRadius:7,
      backgroundColor:'#ffffff',
      alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
    },
    scrollView: {
      height: '100%',
      width: '100%'
    },
    GetFromBtn:{
      alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
        color:"#ffffff",
        fontWeight:'bold',
        marginLeft:30,
    },
    Btn:{
      alignItems: 'center',
      justifyContent: 'center',
      alignSelf: 'center',
      display:'flex',
      backgroundColor: '#bddff5',
      padding: 7,  
      borderRadius:7,
      margin:10,
    },
    BtnSearch:{
      alignItems: 'center',
      justifyContent: 'center',
      alignSelf: 'center',
      display:'flex',
      backgroundColor: '#51aae1',
      padding:7,  
      borderRadius:7,
      marginBottom:10,
      
    },
    BtnTxt:{
      fontWeight:'bold',
      alignItems: 'center',
      justifyContent: 'center',
      alignSelf: 'center',
      display:'flex',
      
    }

  });
