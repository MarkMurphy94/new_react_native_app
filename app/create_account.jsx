import { View, Text, TextInput, ActivityIndicator, Button, KeyboardAvoidingView } from 'react-native'
import React, { useState } from 'react'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { FIREBASE_AUTH } from '../firebaseConfig'
import { AsyncStorage } from '@react-native-async-storage/async-storage';


const create_account = ({ navigation }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState('')
  const auth = FIREBASE_AUTH

  const signUp = async () => {
    setLoading(true)
    try {
      const response = await createUserWithEmailAndPassword(auth, email, password)
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
      await AsyncStorage.setItem('@user_token', token);
    }
  }

  return (
    <View>
      <KeyboardAvoidingView behavior="padding">
        <Text>create_account</Text>
        <TextInput value={email} placeholder="Email" onChangeText={(text) => setEmail(text)}></TextInput>
        <TextInput secureTextEntry={true} value={password} placeholder="Password" onChangeText={(text) => setPassword(text)}></TextInput>
        {loading ? <ActivityIndicator size="large" color="#0000ff" />
          : <>
            <Text>-----------------</Text>
            <Button title="Create account" onPress={() => signUp()} />
          </>}
      </KeyboardAvoidingView>
    </View>
  );
};

export default create_account