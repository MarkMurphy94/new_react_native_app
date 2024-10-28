import React, { useState, useEffect } from 'react';
import { Text, TextInput, ScrollView, View, Image, SafeAreaView, Button } from 'react-native';
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import FlatImagePicker from '../components/image_picker';


const CreateCharacterScreen = () => {
    const navigation = useNavigation();
    const route = useRoute()
    const [characterImage, setCharacterImage] = useState(null)
    const [characterName, setcharacterName] = useState('');
    const [briefDescription, setBriefDescription] = useState('');
    const [LongDescription, setLongDescription] = useState('');
    const [characterId, setCharacterId] = useState(0);

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

    useEffect(() => {
        if (route.params) {
            const characterData = route.params.item
            setCharacterName(characterData.characterName)
            setBriefDescription(characterData.briefDescription)
            setLongDescription(characterData.LongDescription)
            if (characterData.characterId !== null) {
                setCharacterId(characterData.characterId)
            }
        }
    }, [route.params])

    const addOrSaveCharacter = () => {
        navigation.navigate("experience_creation", {
            characterName: characterName,
            characterImage: characterImage,
            briefDescription: briefDescription,
            LongDescription: LongDescription,
            characterId: characterId
        })
        setcharacterId(null)
    }

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <ScrollView contentContainerStyle={{ padding: 20 }}>
                <FlatImagePicker
                    onSelectImage={new_image => setCharacterImage(new_image)}
                    styles={{ borderWidth: 1, width: 100, height: 150, justifyContent: 'center', alignItems: 'center' }}
                    text="Choose an image for the character" />
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
                    value={LongDescription}
                    onChangeText={setLongDescription}
                    placeholder="Enter longer description"
                    multiline
                    numberOfLines={4}
                    style={{ borderWidth: 1, marginBottom: 10, textAlignVertical: 'top' }}
                />

                <Button title="Save character" onPress={addOrSaveCharacter} />
                {/* <SafeAreaView>
                    <Button title="Save Character" />
                </SafeAreaView> */}
            </ScrollView>
        </GestureHandlerRootView>
    );
};

export default CreateCharacterScreen;
