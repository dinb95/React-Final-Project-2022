import { View, Text } from 'react-native'
import React from 'react'

export default function Instructions({route}) {
    console.log("from instructions", route.params)
  return (
    <View>
      <Text>Instructions</Text>
    </View>
  )
}