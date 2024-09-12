import React, { useState } from 'react';
import { Text, TextInput, ScrollView } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const CreateCharacterScreen = () => {
    const [characterName, setcharacterName] = useState('');
    const [briefDescription, setBriefDescription] = useState('');
    const [description, setDescription] = useState('');

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
            </ScrollView>
        </GestureHandlerRootView>
    );
};

export default CreateCharacterScreen;
