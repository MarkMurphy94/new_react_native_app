import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Button } from 'react-native';
import * as expoLocation from 'expo-location';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { FIRESTORE, FIREBASE_AUTH, STORAGE } from '@/firebaseConfig';
import { collection, addDoc, GeoPoint } from 'firebase/firestore'


const RunningExperience = () => {
    const auth = FIREBASE_AUTH
    const navigation = useNavigation();
    const [userLocation, setUserLocation] = useState(null)

    useEffect(() => {
        (async () => {
            let { status } = await expoLocation.requestBackgroundPermissionsAsync();
            if (status !== 'granted') {
                setErrorMsg('Permission to access location was denied');
                return;
            }
            let new_location = await expoLocation.getCurrentPositionAsync({});
            handleLocation(new_location)
        })
        navigation.setOptions({
            headerLeft: () => (
                <Ionicons
                    name="arrow-back"
                    size={24}
                    color="black"
                    onPress={() => navigation.navigate('experience_creation')}  // Navigates back to the previous screen
                />
            ),
        });
    }, []);

    const handleLocation = location => {
        setUserLocation(location);
        uploadToFirebase()
    }

    async function uploadToFirebase() {
        const doc = {
            userId: auth.currentUser ? auth.currentUser.uid : null,
            location: userLocation
        }
        try {
            const docRef = await addDoc(collection(FIRESTORE, "LiveUsers"), doc);  // TODO: if doc with user and experience already exists, update
            console.log("location updated: ", doc);
            console.log("Document written with ID: ", docRef.id);
        } catch (e) {
            console.error("Error adding document: ", e);
        }
    }

    async function promptPermission() {
        let { status } = await expoLocation.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            setErrorMsg('Permission to access location was denied');
            return;
        }
        let new_location = await expoLocation.getCurrentPositionAsync({});
        console.log("got here: ", new_location);
        new_user_location = `${new_location["coords"]["latitude"]},${new_location["coords"]["longitude"]}`
        handleLocation(new_user_location)
    }

    return (
        <View>
            <Text>Your scheduled experience is active! Go to your next encounter!</Text>
            <Text>Your real-time location is tracked by the app while the experience is active</Text>
            <Button title="location access" onPress={promptPermission} />
            {/* <Text>Event will occur: {userLocation.toLocaleString()}</Text> */}
        </View>
    )
}

export default RunningExperience