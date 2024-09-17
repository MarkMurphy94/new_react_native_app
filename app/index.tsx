import { Text, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import { onAuthStateChanged, User } from 'firebase/auth';
import { FIREBASE_AUTH } from '@/firebaseConfig';
import { createStackNavigator } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import createEvent from './event_creation'
import createCharacter from './character_creation'
import createExperience from './experience_creation'

const Stack = createStackNavigator();

function DetailsStackNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Create Experience" component={createExperience} />
      <Stack.Screen name="Add Character" component={createCharacter} />
      <Stack.Screen name="Add Event" component={createEvent} />
    </Stack.Navigator>
  );
}

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
