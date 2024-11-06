import { View, Text, TextInput, Button, FlatList, ActivityIndicator, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import React, { useEffect, useState } from 'react'
import { onAuthStateChanged, User } from 'firebase/auth';
import { FIREBASE_AUTH, FIRESTORE, STORAGE } from '@/firebaseConfig';
import { useNavigation, useRoute } from '@react-navigation/native';
import { collection, getDocs } from "firebase/firestore";
import { ref, getDownloadURL } from "firebase/storage";
import ExperienceCard from '../components/experience_card_view'
// import { View } from 'react-native-reanimated/lib/typescript/Animated';

const RootLayout = () => {
  const navigation = useNavigation();
  const route = useRoute()
  const db = FIRESTORE
  const storage = STORAGE
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null)
  const [experience, setExperience] = useState()
  const [experiences, setExperiences] = useState([])

  useEffect(() => {
    onAuthStateChanged(FIREBASE_AUTH, (user) => {
      setUser(user)
    })
    getExperiences()
  }, [])

  // const getImageForExperience = (image) => {
  //   setExperienceData((experience) => ({
  //     ...experience,
  //     ...image
  //   }))
  // }

  const getExperiences = async () => {
    setLoading(true)
    setExperiences([])
    const experiencesCollection = await getDocs(collection(db, "ImmersiveExperiences"));
    experiencesCollection.forEach((doc) => {
      setExperiences(experiences => [...experiences, doc.data()])
    });
    console.log("Experiences loaded");
    setLoading(false)
    // console.log(experiences);
  }

  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={{ flex: 1 }}>
        <Text>New Experiences!</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scrollView}>
          {experiences.map((item, index) => (
            <ExperienceCard
              key={index}
              title={item.experienceTitle}
              description={item.description}
              imageUrl={item.coverImage}
              navigateTo='experience_view'
              params={item}
            />
          ))}
        </ScrollView>
      </ScrollView>
      <View style={styles.staticButtonContainer}>
        {loading ? <ActivityIndicator size="large" color="#0000ff" />
          : <>
            <Button title="Create Experience" style={{ paddingVertical: 50 }} onPress={() => navigation.navigate('experience_creation')} />
          </>}
      </View>
    </View>

  )
};

const styles = StyleSheet.create({
  staticButtonContainer: {
    position: 'absolute',
    flex: 1,
    bottom: 10,
    left: 0,
    right: 0,
    padding: 20,
  },
  scrollView: {
    flex: 1,
    top: 100,
    left: 0,
    right: 0,
    paddingVertical: 10,
    paddingBottom: 100,
  },
  card: {
    width: 150,
    marginHorizontal: 8,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowOffset: { width: 2, height: 2 },
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: 100,
    borderRadius: 8,
    marginBottom: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  description: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginTop: 4,
  },
});

export default RootLayout
