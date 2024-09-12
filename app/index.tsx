import { Text, View } from 'react-native'
import React from 'react'
import { Link } from 'expo-router'
import { StatusBar } from 'expo-status-bar'

const RootLayout = () => {
  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Text className='text-3xl font-pblack'>wee</Text>
      <StatusBar style="auto" />
      <Link href="/home">Go to home</Link>
      <Link href="/event_creation">Go to event creation</Link>
      <Link href="/experience_creation">Go to experience creation</Link>
      <Link href="/character_creation">Go to character creation</Link>
    </View>
  )
}

export default RootLayout
