import { View, Text, TextInput, ActivityIndicator, Button, KeyboardAvoidingView } from 'react-native'
import React, { useState } from 'react'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { FIREBASE_AUTH } from '../firebaseConfig'
import { useNavigation } from '@react-navigation/native';


const login = () => {
    const navigation = useNavigation()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState('')
    const auth = FIREBASE_AUTH

    const signIn = async () => {
        setLoading(true)
        try {
            const response = await signInWithEmailAndPassword(auth, email, password)
            navigation.navigate("index")
            console.log("login successful")
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <View>
            <KeyboardAvoidingView behavior="padding">
                <Text>login</Text>
                <TextInput value={email} placeholder="Email" onChangeText={(text) => setEmail(text)}></TextInput>
                <Text>-----------------</Text>
                <TextInput secureTextEntry={true} value={password} placeholder="Password" onChangeText={(text) => setPassword(text)}></TextInput>
                {loading ? <ActivityIndicator size="large" color="#0000ff" />
                    : <>
                        <Button title="Login" onPress={() => signIn()} />
                        <Text>-----------------</Text>
                        <Button title="Create account" />
                    </>}
            </KeyboardAvoidingView>
        </View>
    );
};

export default login