import { View, Text, TextInput, StyleSheet, Button } from 'react-native';
import axios from 'axios';
import React, {useState} from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';
import RouteResults from './RouteResults';

let key = 'AIzaSyCCwWKnfacKHx3AVajstMk6Ist1VUoNt9w'

export default function SearchRoute({navigation}) {

    const [origin, setOrigin] = useState('Hadera');
    const [destination, setDestination] = useState('Ruppin Academic Center');

    const [date, setDate] = useState(new Date());
    const [mode, setMode] = useState('date');
    const [show, setShow] = useState(false);

    const [results, setResults] = useState();

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
    const getDate = () => {
        return `${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`
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
      console.log(results)
      if(results === null)
        return "";
      return <RouteResults route_results={results}/>
    }
  return (
    <View style={styles.container}>
        <TextInput placeholder='Origin' style={styles.input} value={origin} onChangeText={setOrigin}></TextInput>
        <TextInput placeholder='Destination' style={styles.input} value={destination} onChangeText={setDestination}></TextInput>
        <View>
        <Button onPress={showDatepicker} title="Choose Date" />
        <Text>{getDate()}</Text>
      </View>
      <View>
        <Button onPress={showTimepicker} title="Choose Time" />
        <Text>{getTime()}</Text>
      </View>
        {show && (
        <DateTimePicker
          testID="dateTimePicker"
          value={date}
          mode={mode}
          is24Hour={true}
          display="default"
          onChange={onChange}
        />
      )}
        <Button title='Search' onPress={getDirections}/>
        {renderResults}
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height:'100%',
        alignItems: 'center',
        position:'absolute'
    },
    input: {
      height: 50,
      width: '70%',
      margin: 12,
      borderWidth: 1,
      padding: 10,
    },
    btn: {
        marginTop:10,
        width: '50%'
    }
  });
