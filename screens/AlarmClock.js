import { View, Text, StyleSheet, Image, TouchableOpacity, Switch } from 'react-native'
import React,{ useState } from 'react'
import NumericInput from 'react-native-numeric-input'

const AlarmClock = ({navigation, route}) => {
  // const [isEnabled, setIsEnabled] = useState(false);
  // const toggleSwitch = () => setIsEnabled(previousState => !previousState);
  const [alarm, setAlarm] = useState()

  const save = () => {
    route.params.setAlarmClock(alarm)
    navigation.goBack()
  }

  return (
    <View style={styles.container}>
        <Text style={styles.title}>AlarmClock</Text>
        <Text style={styles.Txt}>Let us know how long it takes you to get organized and we want to remember you</Text>
        <Image
         source={require('../images/AlarmClock.png')}
         style={{height: 150, width: 150, marginBottom: 30, justifyContent: 'center', display:'flex', alignItems: 'center'}}/>
        <View style={styles.Btn}>
          <NumericInput minValue={0}  step={5} onChange={value => setAlarm(value) } />
        </View>
        {/* <Switch style={styles.SwitchBtn}
        trackColor={{ false: "#767577", true: "#51aae1" }}
        thumbColor={isEnabled ? "#767577" : "#51aae1"}
        ios_backgroundColor="#3e3e3e"
        onValueChange={toggleSwitch}
        value={isEnabled}
      /> */}
       <TouchableOpacity style={styles.loginBtn} onPress={() => {save()}}>
        <Text style={styles.loginText}>Save</Text>
      </TouchableOpacity>
    </View>
  )
}

export default AlarmClock
const styles = StyleSheet.create({
  container: {
    width:'100%',
    height:'100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  Btn: {
    justifyContent:'center',
    alignSelf:'center',
    textAlign:'center',
    display:'flex',  
  },
  title:{
    position:'absolute',
    fontSize:40,
    top:50,
    color: "#51aae1",
    fontWeight:'bold',
    alignSelf:'center',
    margin:20,
    marginBottom: 40
},
Txt:{
  justifyContent:'center',
    alignSelf:'center',
    textAlign:'center',
    display:'flex',  
    top:20,
    fontWeight:'bold',
    alignSelf:'center',
    marginBottom: 40
},
// SwitchBtn:{
//   marginTop: 40
// },
loginBtn: {
  width: "80%",
  position:'absolute',
  borderRadius: 25,
  height: 50,
  alignItems: "center",
  justifyContent: "center",
  bottom:40,
  backgroundColor: "#51aae1",
},
loginText:{
  fontSize:18
}
 
});