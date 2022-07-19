import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import { List } from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome';

export default function Step({data, index}) {
  // <View style={styles.container}>
  //   <Text></Text>
  //   <Text>Distance: {data.distance.text}</Text>
  //   <Text>Duration: {data.duration.text}</Text>
  // </View>
  const fix_html = (str) => {
    // removes the html from the string (<div></div> for example).
    let fixed_html = ""
    for(let i = 0; i < str.length; i++){
      if(str[i] != "<"){
        fixed_html += str[i]
      }
      else if(str.substring(i+1, i+4) == "div"){
        while(str[i] != ">"){
          i++;
        }
        fixed_html += ". ";
      }
      else if(str.substring(i+2, i+5) == "div"){
        while(str[i] != ">"){
          i++;
        }
      }
      else{
        while(str[i] != ">"){
          i++;
        }
      }
    }
    return fixed_html;
  }
  const inst_step = data.travel_mode === 'WALKING' ? (
      //render walking instructions
      <List.Accordion title={data.html_instructions} id={`${index}`} >
        {data.steps.map((step, index) => {
          let str = fix_html(step.html_instructions)
          return <List.Item key={index+1} title={<Text style={{fontSize: 10}}>{str}</Text>}/>
        })}
      </List.Accordion>
  )
  :
  (
    // render transit instructions
    <List.Accordion title={`Bus ${data.transit_details.line.short_name}`} id={`${index}`}>
      <List.Item title={`From ${data.transit_details.departure_stop.name}`} styl />
      <List.Item title={`To ${data.transit_details.arrival_stop.name}`} />
    </List.Accordion>
  )
  return (
  <>
    {inst_step}
  </>

  )
}

const styles = StyleSheet.create({
    container: {
      marginBottom: 10,
      marginRight: 10
    },
    border: {
      width: "100%",
      borderBottomWidth: 1,
    }
  })