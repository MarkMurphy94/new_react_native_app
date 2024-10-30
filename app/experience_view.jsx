import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, FlatList, TouchableOpacity, ScrollView } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { collection, addDoc } from 'firebase/firestore'
import { FIRESTORE, FIREBASE_AUTH, STORAGE } from '@/firebaseConfig';
import { uploadBytes, ref, getDownloadURL } from 'firebase/storage';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import FlatImagePicker from '../components/image_picker';

const experience_view = () => {
    const auth = FIREBASE_AUTH
    const firebase_storage = STORAGE
    const currentDate = new Date((Date.now())).toString()
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

    // TODO: useEffect -> get data from firebase + pop

    return (
        <ScrollView style={{ flex: 1, padding: 10, }}>
            <Text>Cover Image</Text>
            <FlatImagePicker
                image={coverImage}
                onSelectImage={new_image => setCoverImage(new_image)}
                styles={{ borderWidth: 1, height: 150, justifyContent: 'center', alignItems: 'center' }}
                text="Set a Cover Image" />
            <Text>Experience Name</Text>
            <Text>------</Text>
            <Text>Experience One/Two-Liner</Text>
            <Text>------</Text>
            <Text>Experience Longer Description</Text>
            <Text>------</Text>
            <Text>Characters in this Experience</Text>
            <FlatList // TODO: make this horizontal + enable scroll
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
                            navigation.navigate('character_view', { item })
                        }}
                    >
                        <Text>{item.characterName}</Text>
                    </TouchableOpacity>
                )}
            />
            <Text>------</Text>
            <Button title="Schedule Experience" onPress={() => console.log('Go to map view')} />
            <Text>------</Text>
        </ScrollView>
    )
}

export default experience_view

const styles = StyleSheet.create({})