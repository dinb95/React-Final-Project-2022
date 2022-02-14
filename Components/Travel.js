import { View, Text } from 'react-native'
import React from 'react'

export default function Travel({data}) {
    console.log(data)
  return (
    <View>
      <Text>Travel {data.routeId}</Text>
    </View>
  )
}