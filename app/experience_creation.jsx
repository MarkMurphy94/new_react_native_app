import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, FlatList, TouchableOpacity, ScrollView } from 'react-native';
import DraggableFlatList from 'react-native-draggable-flatlist';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { collection, addDoc } from 'firebase/firestore'
import { FIRESTORE, FIREBASE_AUTH, STORAGE } from '@/firebaseConfig';
import { uploadBytes, ref } from 'firebase/storage';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import FlatImagePicker from '../components/image_picker';

const CreateExperienceScreen = () => {
    const auth = FIREBASE_AUTH
    const firebase_storage = STORAGE
    const navigation = useNavigation();
    const route = useRoute()
    const [coverImage, setCoverImage] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [experienceName, setExperienceName] = useState('');
    const [oneLiner, setOneLiner] = useState('');
    const [description, setDescription] = useState('');
    const [events, setEvents] = useState([]);
    const [characters, setCharacters] = useState([]);
    const [eventId, setEventId] = useState(0);
    const [characterId, setCharacterId] = useState(0);

    useEffect(() => {
        if (route.params) {
            if (route.params.hasOwnProperty("eventId")) {
                if (route.params.eventId === null) {
                    AddEvent(route.params)
                } else if (route.params.eventId >= 0) {
                    EditEvent(route.params)
                }
            }
            else if (route.params.hasOwnProperty("characterId")) {
                if (route.params.characterId === null) {
                    AddCharacter(route.params)
                } else if (route.params.characterId >= 0) {
                    EditCharacter(route.params)
                }
            }
        }
    }, [route.params])


    const AddEvent = (event) => {
        const newId = eventId + 1
        setEventId(newId)
        const newEvent = { ...event, eventId: eventId }
        setEvents(new_events => [...new_events, newEvent])
    }

    const EditEvent = (event) => {
        const index = events.findIndex(e => e.eventId === event.eventId)
        if (index !== -1) {
            const updatedEvents = [...events]
            updatedEvents[index] = event
            setEvents(updatedEvents)
        }
    }

    const AddCharacter = (character) => {
        const newId = characterId + 1
        setCharacterId(newId)
        const newCharacter = { ...character, characterId: characterId }
        setCharacters(new_characters => [...new_characters, newCharacter])
    }

    const EditCharacter = (character) => {
        const index = characters.findIndex(e => e.characterId === character.characterId)
        if (index !== -1) {
            const updatedCharacters = [...characters]
            updatedCharacters[index] = character
            setCharacters(updatedCharacters)
        }
    }

    const uploadImage = async (image) => {
        if (!image) return;

        setUploading(true);
        console.log("image: ", image)

        try {
            // Convert image to blob
            const response = await fetch(image);
            const blob = await response.blob();

            // Create a reference to Firebase Storage
            const filename = `images/${Date.now()}_photo.jpg`;
            const storageRef = ref(firebase_storage, filename);

            // Upload image
            const snapshot = await uploadBytes(storageRef, blob);
            console.log('Uploaded a blob or file!', snapshot);
            console.log('Image uploaded!');
        } catch (error) {
            console.log("Upload Error: ", error);
        } finally {
            setUploading(false);
        }
    };

    async function addExperience() {
        try {
            const current_date = new Date((Date.now())).toString()
            const doc = {
                name: experienceName,
                oneliner: oneLiner,
                description: description,
                events: events,
                characters: characters,
                userId: auth.currentUser ? auth.currentUser.uid : null,
                createDate: current_date
            }
            console.log("doc: ", doc)
            const docRef = await addDoc(collection(FIRESTORE, "Experiences"), doc);
            for (let i = 0; i < characters.length; i++) {
                if (characters[i].characterImage) {
                    uploadImage(characters[i].characterImage)
                }
            }
            uploadImage(coverImage)
            console.log("Document written with ID: ", docRef.id);
        } catch (e) {
            console.error("Error adding document: ", e);
        }
    }

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

    // Function to handle the drag and drop of events
    const handleDragEnd = ({ data }) => {
        setEvents(data);
    };

    // Function to toggle character selection
    const toggleCharacterSelection = (id) => {
        const updatedCharacters = characters.map((char) =>
            char.id === id ? { ...char, selected: !char.selected } : char
        );
        setCharacters(updatedCharacters);
    };

    return (
        <ScrollView style={{ flex: 1, padding: 10, }}>
            <Text>Cover Image</Text>
            <FlatImagePicker
                image={coverImage}
                onSelectImage={new_image => setCoverImage(new_image)}
                styles={{ borderWidth: 1, height: 150, justifyContent: 'center', alignItems: 'center' }}
                text="Set a Cover Image" />
            <Text>Experience Name</Text>
            <TextInput
                value={experienceName}
                onChangeText={setExperienceName}
                placeholder="Enter experience name"
                style={{ borderBottomWidth: 1, marginBottom: 10 }}
            />

            <Text>Experience One/Two-Liner</Text>
            <TextInput
                value={oneLiner}
                onChangeText={setOneLiner}
                placeholder="Enter one/two-liner"
                style={{ borderBottomWidth: 1, marginBottom: 10 }}
            />

            <Text>Experience Longer Description</Text>
            <TextInput
                value={description}
                onChangeText={setDescription}
                placeholder="Enter longer description"
                multiline
                numberOfLines={4}
                style={{ borderWidth: 1, marginBottom: 10, textAlignVertical: 'top' }}
            />

            {/* Re-orderable List of Events */}
            <Text>Events</Text>
            <DraggableFlatList
                scrollEnabled={false}
                data={events}
                keyExtractor={(item, index) => index.toString()}
                onDragEnd={handleDragEnd}
                style={{ marginTop: 20, marginBottom: 20 }}
                renderItem={({ item, drag, isActive }) => (
                    <TouchableOpacity
                        style={{
                            padding: 10,
                            backgroundColor: isActive ? '#ddd' : '#fff',
                            borderBottomWidth: 1,
                            borderColor: '#ccc',
                        }}
                        onLongPress={drag}
                        onPress={() => {
                            navigation.navigate('event_creation', { item })
                        }}
                    >
                        <Text>{item.eventName}</Text>
                    </TouchableOpacity>
                )}
            />
            <Button title="Add Event" onPress={() =>
                navigation.navigate('event_creation')
            } />
            <Text>------</Text>
            <Text>Characters in this Experience</Text>
            <FlatList
                scrollEnabled={false}
                data={characters}
                keyExtractor={(item, index) => index.toString()}
                style={{ marginTop: 20, marginBottom: 20 }}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={{
                            padding: 10,
                            backgroundColor: item.selected ? '#ddd' : '#fff',
                            borderWidth: 1,
                            marginBottom: 10,
                        }}
                        onPress={() => {
                            navigation.navigate('character_creation', { item })
                        }}
                    >
                        <Text>{item.characterName}</Text>
                    </TouchableOpacity>
                )}
            />
            <Button title="Add Character" onPress={() => {
                navigation.navigate('character_creation')
            }} />
            <Text>------</Text>
            <Button title="Go to map view" onPress={() => console.log('Go to map view')} />
            <Text>------</Text>
            <Button title="Save Experience" onPress={addExperience} />
            <Text>------</Text>
        </ScrollView>
    );
};

export default CreateExperienceScreen;


//com.imers.io