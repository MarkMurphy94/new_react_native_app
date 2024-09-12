import React, { useState } from 'react';
import { View, Text, TextInput, Button, FlatList, TouchableOpacity, ScrollView } from 'react-native';
import DraggableFlatList from 'react-native-draggable-flatlist';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { launchImageLibrary } from 'expo-image-picker';

const CreateExperienceScreen = () => {
    const [experienceName, setExperienceName] = useState('');
    const [oneLiner, setOneLiner] = useState('');
    const [description, setDescription] = useState('');
    const [coverImage, setCoverImage] = useState(null);
    const [events, setEvents] = useState([]);
    const [newEvent, setNewEvent] = useState('');
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
    const addEvent = () => {
        if (newEvent.trim()) {
            setEvents([...events, { key: newEvent, label: newEvent }]);
            setNewEvent('');
        }
    };

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
        <GestureHandlerRootView style={{ flex: 1 }}>
            <ScrollView contentContainerStyle={{ padding: 20 }}>
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
                {/* Experience Name */}
                <Text>Experience Name</Text>
                <TextInput
                    value={experienceName}
                    onChangeText={setExperienceName}
                    placeholder="Enter experience name"
                    style={{ borderBottomWidth: 1, marginBottom: 10 }}
                />

                {/* One/Two-liner */}
                <Text>Experience One/Two-Liner</Text>
                <TextInput
                    value={oneLiner}
                    onChangeText={setOneLiner}
                    placeholder="Enter one/two-liner"
                    style={{ borderBottomWidth: 1, marginBottom: 10 }}
                />

                {/* Longer Description */}
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
                    data={events}
                    renderItem={({ item, drag, isActive }) => (
                        <TouchableOpacity
                            style={{
                                padding: 10,
                                backgroundColor: isActive ? '#ddd' : '#fff',
                                borderBottomWidth: 1,
                                borderColor: '#ccc',
                            }}
                            onLongPress={drag}
                        >
                            <Text>{item.label}</Text>
                        </TouchableOpacity>
                    )}
                    keyExtractor={(item) => item.key}
                    onDragEnd={handleDragEnd}
                    style={{ marginTop: 20, marginBottom: 20 }}
                />
                <Button title="Add Event" onPress={addEvent} />
                <Text>------</Text>


                {/* Characters List */}
                <Text>Characters in this Experience</Text>
                <FlatList
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

                {/* Go to Map View Button */}
                <Button title="Go to map view" onPress={() => console.log('Go to map view')} />
                {/* <Button title="Save Experience" onPress={addExperience} /> */}
            </ScrollView>
        </GestureHandlerRootView>
    );
};

export default CreateExperienceScreen;
