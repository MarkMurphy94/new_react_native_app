import { Text, ScrollView, Button } from 'react-native'
import React, { useEffect, useState } from 'react'
import { onAuthStateChanged, User } from 'firebase/auth';
import { FIREBASE_AUTH } from '@/firebaseConfig';
import { useNavigation } from '@react-navigation/native';

const RootLayout = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null)
  const [experience, setExperience] = useState()

  const getExperienceData = async () => {
    const experiencesCollection = await firestore().collection("Experiences").get()
    setExperience(experiencesCollection.docs[0].data())  // ignore red lines i guess
  }

  useEffect(() => {
    onAuthStateChanged(FIREBASE_AUTH, (user) => {
      setUser(user)
    })
  })

  return (
    <ScrollView style={{ flex: 1 }}>
      <Text>weeeeeeeeeeeeeee</Text>
      <Button title="Create Experience" onPress={() => navigation.navigate('experience_creation')} />
    </ScrollView>
  )

  // return (
  //   <NavigationContainer>
  //     <Drawer.Navigator initialRouteName="Login">
  //       {user ? (
  //         <Drawer.Screen name="Login" component={profile} options={{ headerShown: false }} />
  //       ) : (
  //         <Drawer.Screen name="Login" component={login} options={{ headerShown: false }} />
  //       )}
  //     </Drawer.Navigator>
  //   </NavigationContainer>
  // )
};



export default RootLayout
