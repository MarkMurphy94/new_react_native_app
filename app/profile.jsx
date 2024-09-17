import { View, Text, Button } from 'react-native'
import React from 'react'
import { FIREBASE_AUTH } from '@/firebaseConfig'

const profile = ({ navigation }) => {
    return (
        <View>
            <Text>profile</Text>
            <Button onPress={() => FIREBASE_AUTH.signOut()} title="Logout" />
        </View>
    )
}

export default profile