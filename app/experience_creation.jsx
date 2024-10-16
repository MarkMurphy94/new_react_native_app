import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, FlatList, TouchableOpacity, ScrollView } from 'react-native';
import DraggableFlatList from 'react-native-draggable-flatlist';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { launchImageLibrary } from 'expo-image-picker';
import { collection, addDoc } from 'firebase/firestore'
import { FIRESTORE } from '@/firebaseConfig';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';


const CreateExperienceScreen = () => {
    const navigation = useNavigation();
    const route = useRoute()
    const [experienceName, setExperienceName] = useState('');
    const [oneLiner, setOneLiner] = useState('');
    const [description, setDescription] = useState('');
    const [coverImage, setCoverImage] = useState(null);
    const [events, setEvents] = useState([]);
    const [characters, setCharacters] = useState([
        { id: 1, name: 'Character 1', selected: false },
        { id: 2, name: 'Character 2', selected: false },
        { id: 3, name: 'Character 3', selected: false }
    ]);

    // Function to handle image picking
    const pickImage = () => {
        const options = {
            mediaType: 'photo',
            quality: 1,
        };

        launchImageLibrary(options, (response) => {
            if (!response.didCancel && !response.error) {
                const { uri } = response.assets[0];
                setCoverImage(uri);
            }
        });
    };

    // Function to add an event to the reorderable list
    const addEvent = (event) => {
        // determine here if edited event or new event?
        setEvents(new_events => [...new_events, event])
    };

    async function addExperience() {
        try {
            const docRef = await addDoc(collection(FIRESTORE, "Experiences"), {
                name: experienceName,
                oneliner: oneLiner,
                description: description,
                events: events,
                characters: characters
            });
            console.log("Document written with ID: ", docRef.id);
        } catch (e) {
            console.error("Error adding document: ", e);
        }
    }

    useEffect(() => {
        if (route.params) {  // TODO: specify if coming from event creation or character creation
            addEvent(route.params)
        }
        console.log("events: ", events)
    }, [route.params])

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
            <TouchableOpacity onPress={pickImage} style={{ marginBottom: 10 }}>
                <View style={{ borderWidth: 1, height: 150, justifyContent: 'center', alignItems: 'center' }}>
                    {coverImage ? (
                        <Image source={{ uri: coverImage }} style={{ width: '100%', height: '100%' }} />
                    ) : (
                        <Text>Select a cover image</Text>
                    )}
                </View>
            </TouchableOpacity>
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
                            console.log("item: dfrdrde")
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
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={{
                            padding: 10,
                            backgroundColor: item.selected ? '#ddd' : '#fff',
                            borderWidth: 1,
                            marginBottom: 10,
                        }}
                        onPress={() => toggleCharacterSelection(item.id)}
                    >
                        <Text>{item.name}</Text>
                    </TouchableOpacity>
                )}
                keyExtractor={(item) => item.id.toString()}
            />
            <Button title="Add Character" onPress={addEvent} />
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