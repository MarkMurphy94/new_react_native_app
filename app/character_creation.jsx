import React, { useState, useEffect } from 'react';
import { Text, TextInput, ScrollView, View, Image, SafeAreaView, Button } from 'react-native';
import * as MediaLibrary from 'expo-media-library';
import { GestureHandlerRootView } from "react-native-gesture-handler";


const CreateCharacterScreen = ({ navigation }) => {
    const [characterName, setcharacterName] = useState('');
    const [briefDescription, setBriefDescription] = useState('');
    const [description, setDescription] = useState('');
    const [albums, setAlbums] = useState(null);
    const [permissionResponse, requestPermission] = MediaLibrary.usePermissions();

    async function getAlbums() {
        if (permissionResponse.status !== 'granted') {
            await requestPermission();
        }
        const fetchedAlbums = await MediaLibrary.getAlbumsAsync({
            includeSmartAlbums: true,
        });
        setAlbums(fetchedAlbums);
    }

    function AlbumEntry({ album }) {
        const [assets, setAssets] = useState([]);

        useEffect(() => {
            async function getAlbumAssets() {
                const albumAssets = await MediaLibrary.getAssetsAsync({ album });
                setAssets(albumAssets.assets);
            }
            getAlbumAssets();
        }, [album]);

        return (
            <View key={album.id}>
                <Text>
                    {album.title} - {album.assetCount ?? 'no'} assets
                </Text>
                <View>
                    {assets && assets.map((asset) => (
                        <Image source={{ uri: asset.uri }} width={50} height={50} />
                    ))}
                </View>
            </View>
        );
    }

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
                    <Button onPress={getAlbums} title="Get albums" />
                    <ScrollView>
                        {albums && albums.map((album) => <AlbumEntry album={album} />)}
                    </ScrollView>
                </SafeAreaView>
            </ScrollView>
        </GestureHandlerRootView>
    );
};

export default CreateCharacterScreen;
