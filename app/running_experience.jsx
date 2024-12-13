import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Button } from 'react-native';
import * as expoLocation from 'expo-location';
import * as TaskManager from 'expo-task-manager';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { FIRESTORE, FIREBASE_AUTH } from '@/firebaseConfig';
import { collection, addDoc, query, where, doc, getDocs, updateDoc, serverTimestamp, GeoPoint } from 'firebase/firestore'

//TODO: Location tracking + checking for live experience needs to be done in the background too.
// - Still look into Firebase messaging?

const RunningExperience = () => {
    const auth = FIREBASE_AUTH
    const navigation = useNavigation();
    const [userLocation, setUserLocation] = useState(null)
    const [activeExperienceRef, setActiveExperienceRef] = useState(null)
    const experienceCalendarRef = collection(FIRESTORE, "ExperienceCalendar")
    const userRef = doc(FIRESTORE, "Users", auth.currentUser.uid);
    const LOCATION_TASK_NAME = 'background-location-task';

    // TaskManager, and thus Background location tracking, not available with Expo Go. Need to make a dev build to work with it
    //
    // TaskManager.defineTask(LOCATION_TASK_NAME, ({ data, error }) => {
    //     if (error) {
    //         console.error("Error in location task:", error);
    //         return;
    //     }
    //     if (data) {
    //         const { locations } = data;
    //         console.log("Received new location:", locations);
    //         // Handle location update (e.g., save to Firestore or update state)
    //     }
    // });

    // useEffect(() => {
    //     const startTracking = async () => {
    //         await startLiveLocationUpdates();
    //     };

    //     startTracking();

    //     return () => {
    //         stopLiveLocationUpdates();
    //     };
    // }, []);

    // const startLiveLocationUpdates = async () => {
    //     await expoLocation.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
    //         accuracy: expoLocation.Accuracy.High,
    //         timeInterval: 60000, // Minimum time interval between updates in ms
    //         distanceInterval: 50, // Minimum distance (in meters) for updates
    //         foregroundService: {
    //             notificationTitle: 'Location Tracking',
    //             notificationBody: 'Your location is being tracked.',
    //             notificationColor: '#fff',
    //         },
    //     });
    //     console.log("Location tracking started");
    // };

    // const stopLiveLocationUpdates = async () => {
    //     const isTaskRegistered = await TaskManager.isTaskRegisteredAsync(LOCATION_TASK_NAME);
    //     if (isTaskRegistered) {
    //         await expoLocation.stopLocationUpdatesAsync(LOCATION_TASK_NAME);
    //         console.log("Location tracking stopped");
    //     }
    // };

    useEffect(() => {
        navigation.setOptions({
            headerLeft: () => (
                <Ionicons
                    name="arrow-back"
                    size={24}
                    color="black"
                    onPress={() => navigation.navigate('experience_view')}  // Navigates back to the previous screen
                />
            ),
        });
        const fetchLiveExperiences = async () => {
            try {
                await checkForLiveExperience();
            } catch (error) {
                console.error("Error in useEffect logic:", error);
            }
        };
        fetchLiveExperiences();
        const intervalId = setInterval(checkForLiveExperience, 60000);
        return () => clearInterval(intervalId);
    }, []);

    useEffect(() => {
        if (activeExperienceRef) {
            let subscription;
            const startWatchingLocation = async () => {
                // Start watching the location
                subscription = await expoLocation.watchPositionAsync(
                    {
                        accuracy: expoLocation.Accuracy.High,
                        timeInterval: 5000, // Minimum time interval between updates (in ms)
                        distanceInterval: 10, // Minimum distance (in meters) for updates
                    },
                    (location) => {
                        // Update the user's locationsdfgws
                        console.log('New location:', location.coords);
                        const { latitude, longitude } = location.coords;
                        const geoPoint = new GeoPoint(latitude, longitude);
                        setUserLocation(geoPoint);
                        uploadToFirebase()
                    }
                );
            };

            startWatchingLocation();
            // Cleanup function to stop watching location
            return () => {
                if (subscription) {
                    subscription.remove();
                }
            };
        }
    }, []);

    const checkForLiveExperience = async () => {
        console.log("running every minute again");
        if (!auth.currentUser || !auth.currentUser.uid) {
            console.error("User not authenticated");
            return;
        }

        try {
            const experience_query = query(
                experienceCalendarRef,
                where('players', 'array-contains', auth.currentUser.uid),
                where('isActive', '==', true)
            );
            const querySnapshot = await getDocs(experience_query);

            if (querySnapshot.empty) {
                console.log("No live experiences at this time.");
                setActiveExperienceRef(null);
                return;
            }

            querySnapshot.forEach((res_doc) => {
                if (!activeExperienceRef) {
                    setActiveExperienceRef(res_doc.id);
                }
                console.log("Live experience", res_doc.id, "in progress");
            });
        } catch (error) {
            console.error("Error fetching live experiences:", error);
        }
    };

    async function uploadToFirebase() {
        const newDoc = {
            userId: auth.currentUser ? auth.currentUser.uid : null,
            location: userLocation,
            activeExperienceRef: activeExperienceRef
        };

        try {
            const liveUsersCollection = collection(FIRESTORE, "LiveUsers");

            // Query to check if a document with the same userId and activeExperienceRef exists
            const querySnapshot = await getDocs(
                query(
                    liveUsersCollection,
                    where("userId", "==", newDoc.userId),
                    where("activeExperienceRef", "==", newDoc.activeExperienceRef)
                )
            );

            if (!querySnapshot.empty) {
                // If a matching document exists, update it
                const existingDoc = querySnapshot.docs[0]; // Get the first matching document
                const docRef = existingDoc.ref;

                await updateDoc(docRef, {
                    location: newDoc.location,
                    updatedAt: serverTimestamp() // Optional: Add a timestamp to track updates
                });

                console.log("Document updated with ID: ", docRef.id);
            } else {
                // If no matching document exists, create a new one
                const docRef = await addDoc(liveUsersCollection, newDoc);
                console.log("New document written with ID: ", docRef.id);
            }
        } catch (e) {
            console.error("Error handling document: ", e);
        }
    }


    return (
        <View>
            <Text>Your scheduled experience is active! Go to your next encounter!</Text>
            <Text>Your real-time location is tracked by the app while the experience is active</Text>
            {/* <Button title="location access" onPress={''} /> */}
            {/* <Text>Event will occur: {userLocation.toLocaleString()}</Text> */}
        </View>
    )
}

export default RunningExperience