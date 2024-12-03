import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, FlatList, Image, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { collection, addDoc } from 'firebase/firestore'
import { FIRESTORE, FIREBASE_AUTH, STORAGE } from '@/firebaseConfig';
import { uploadBytes, ref, getDownloadURL } from 'firebase/storage';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import DateTimePickerComponent from '../components/date_time_picker';

const experience_view = () => {
    const auth = FIREBASE_AUTH
    const firebase_storage = STORAGE
    const navigation = useNavigation();
    const route = useRoute()
    const [coverImageUrl, setCoverImageUrl] = useState('');
    const [experienceTitle, setExperienceTitle] = useState('');
    const [experienceDateTime, setExperienceDateTime] = useState(new Date(1598051730000));
    const [oneLiner, setOneLiner] = useState('');
    const [description, setDescription] = useState('');
    const [events, setEvents] = useState([]);
    const [characters, setCharacters] = useState([]);

    useEffect(() => {
        navigation.setOptions({
            headerLeft: () => (
                <Ionicons
                    name="arrow-back"
                    size={24}
                    color="black"
                    onPress={() => navigation.goBack()}
                />
            ),
        });
    }, [navigation])

    useEffect(() => {
        getExperienceInfo()
    }, [route.params])

    const getExperienceInfo = () => {
        if (route.params) {
            const experienceData = route.params
            console.log('experienceData: ', experienceData)
            setExperienceTitle(experienceData.experienceTitle)
            setOneLiner(experienceData.oneLiner)
            setDescription(experienceData.description)
            setCharacters(experienceData.characters)
            setCoverImageUrl(experienceData.coverImageUrl)
        }
    }

    const scheduleExperience = async () => {
        try {
            const doc = {
                experienceTitle: experienceTitle,
                description: description,
                eventsQueue: events,
                characters: characters,
                players: [auth.currentUser ? auth.currentUser.uid : null],
                startDateTime: experienceDateTime
                // createDate: serverTimestamp(), // currentDate,
                // coverImage: coverImageFileRef._location.path
            }
            const docRef = await addDoc(collection(FIRESTORE, "ExperienceCalendar"), doc);
            console.log("Document written with ID: ", docRef.id);
        } catch (e) {
            console.error("Error adding document: ", e);
        }
    }

    return (
        <ScrollView contentContainerStyle={styles.container}>
            {/* Cover Image */}
            <View style={styles.coverImageContainer}>
                {coverImageUrl ? (
                    <Image source={{ uri: coverImageUrl }} style={styles.coverImage} />
                ) : (
                    <Text style={styles.placeholderText}>No Cover Image</Text>
                )}
            </View>

            {/* Experience Details */}
            <View style={styles.section}>
                <Text style={styles.title}>{experienceTitle}</Text>
                <Text style={styles.separator}>---------------------</Text>
                <Text style={styles.oneLiner}>{oneLiner}</Text>
                <Text style={styles.separator}>---------------------</Text>
                <Text style={styles.description}>{description}</Text>
            </View>

            {/* Characters Section */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Characters in this Experience</Text>
                <FlatList
                    horizontal
                    data={characters}
                    keyExtractor={(item, index) => index.toString()}
                    style={styles.characterList}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            style={[
                                styles.characterCard,
                                item.selected && styles.characterCardSelected,
                            ]}
                            onPress={() =>
                                navigation.navigate('character_view', { item }) // TODO: implement character_view
                            }
                        >
                            <Text style={styles.characterName}>{item.characterName}</Text>
                        </TouchableOpacity>
                    )}
                    showsHorizontalScrollIndicator={false}
                />
            </View>
            <View style={styles.section}>
                <Text style={styles.label}>Event Time</Text>
                <DateTimePickerComponent
                    onDateSelected={(newDate) => setExperienceDateTime(newDate)}
                />
                <Text style={styles.infoText}>Event will occur: {experienceDateTime.toLocaleString()}</Text>
                <Button
                    title="Schedule Experience"
                    onPress={scheduleExperience}
                />
            </View>
            <View style={styles.section}>
                <Button
                    title="Edit Experience"
                    onPress={() => console.log('Edit Experience')}
                />
            </View>
        </ScrollView>
    );
};

export default experience_view;

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: '#f5f5f5',
    },
    coverImageContainer: {
        alignItems: 'center',
        marginBottom: 20,
    },
    coverImage: {
        width: 120,
        height: 120,
        borderRadius: 10,
    },
    placeholderText: {
        fontSize: 16,
        color: '#aaa',
    },
    section: {
        marginBottom: 20,
        padding: 10,
        backgroundColor: '#fff',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 3,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 10,
    },
    oneLiner: {
        fontSize: 16,
        textAlign: 'center',
        color: '#555',
    },
    description: {
        fontSize: 14,
        color: '#777',
        marginTop: 10,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    separator: {
        textAlign: 'center',
        color: '#ccc',
        marginVertical: 10,
    },
    characterList: {
        paddingVertical: 10,
    },
    characterCard: {
        padding: 15,
        marginRight: 10,
        backgroundColor: '#fff',
        borderRadius: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 3,
        borderWidth: 1,
        borderColor: '#ccc',
    },
    characterCardSelected: {
        backgroundColor: '#e0f7fa',
        borderColor: '#00796b',
    },
    characterName: {
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    },
});
