import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import Step from './Step'
import { ScrollView } from 'react-native-gesture-handler'

export default function Instructions({route}) {
    let steps = route.params.route.raw_route.steps
    const instructions = steps.map((step, index) => {
      return (
        <Step data={step} key={index} index={index}/>
      )
    })
  return (
    <ScrollView style={styles.container}>
      {instructions}
    </ScrollView>
  )
}
const styles = StyleSheet.create({
  container: {
    height:'100%',
    width:'100%',
    marginTop:'20%',
    marginLeft:-10
  }
})