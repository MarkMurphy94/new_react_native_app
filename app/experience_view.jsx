import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, FlatList, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { collection, addDoc } from 'firebase/firestore'
import { FIRESTORE, FIREBASE_AUTH, STORAGE } from '@/firebaseConfig';
import { uploadBytes, ref, getDownloadURL } from 'firebase/storage';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

const experience_view = () => {
    const auth = FIREBASE_AUTH
    const firebase_storage = STORAGE
    const navigation = useNavigation();
    const route = useRoute()
    const [coverImage, setCoverImage] = useState(null);
    const [experienceTitle, setExperienceTitle] = useState('');
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
        console.log(route.params)
    }, [navigation])

    const getExperienceInfo = () => {
        if (route.params) {
            const experienceData = route.params.item
            setExperienceTitle(experienceData.experienceTitle)
            setOneLiner()
            setDescription()
            setCharacters()
            // setCharacterList(experienceData.characterList)
        }
    }

    const getCoverImage = () => {

    }

    // TODO: useEffect(() => {from experience selected in homescreen, get data from firebase + pop}, [navigation?])

    return (
        <ScrollView style={{ flex: 1, padding: 10, }}>
            <Text>Cover Image</Text>
            {/* <View style={{ flex: 1 }}>
                {props.image ? (
                    <Image source={{ uri: props.image }} style={{ width: '60%', height: '60%' }} />
                ) : (
                    <Text>{props.text}</Text>
                )}
            </View> */}
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
                            navigation.navigate('character_view', { item }) // TODO: implement character_view
                        }}
                    >
                        <Text>{item.characterName}</Text>
                    </TouchableOpacity>
                )}
            />
            <Text>------</Text>
            <Button title="Schedule Experience" onPress={() => console.log('Schedule Experience')} />
            <Text>------</Text>
            <Button title="Edit Experience" onPress={() => console.log('Edit Experience')} />
            <Text>------</Text>
        </ScrollView>
    )
}

export default experience_view

const styles = StyleSheet.create({})