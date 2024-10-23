import React, { useState, useEffect } from 'react';
import { Text, TextInput, ScrollView, View, Image, SafeAreaView, Button } from 'react-native';
import * as MediaLibrary from 'expo-media-library';
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

const CreateCharacterScreen = () => {
    const navigation = useNavigation();
    const [characterName, setcharacterName] = useState('');
    const [briefDescription, setBriefDescription] = useState('');
    const [description, setDescription] = useState('');
    const [albums, setAlbums] = useState(null);
    const [permissionResponse, requestPermission] = MediaLibrary.usePermissions();

    useEffect(() => {
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


    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <ScrollView contentContainerStyle={{ padding: 20 }}>
                {/* character Name */}
                <Text>character Name</Text>
                <TextInput
                    value={characterName}
                    onChangeText={setcharacterName}
                    placeholder="Enter character name"
                    style={{ borderBottomWidth: 1, marginBottom: 10 }}
                />

                {/* One/Two-liner */}
                <Text>character brief description</Text>
                <TextInput
                    value={briefDescription}
                    onChangeText={setBriefDescription}
                    placeholder="Enter brief character description"
                    style={{ borderBottomWidth: 1, marginBottom: 10 }}
                />

                {/* Longer Description */}
                <Text>character Longer Description</Text>
                <TextInput
                    value={description}
                    onChangeText={setDescription}
                    placeholder="Enter longer description"
                    multiline
                    numberOfLines={4}
                    style={{ borderWidth: 1, marginBottom: 10, textAlignVertical: 'top' }}
                />

                {/* <Button title="Save character" onPress={addcharacter} /> */}
                <SafeAreaView>
                    <Button title="Save Character" />
                </SafeAreaView>
            </ScrollView>
        </GestureHandlerRootView>
    );
};

export default CreateCharacterScreen;
