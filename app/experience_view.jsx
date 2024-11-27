import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, FlatList, Image, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
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
    const [coverImageUrl, setCoverImageUrl] = useState('');
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

    return (
        <ScrollView style={{ flex: 1, padding: 10, }}>
            <Text>Cover Image below</Text>
            {coverImageUrl ? (
                <Image source={{ uri: coverImageUrl }} style={{ width: 70, height: 70 }} />
            ) : (
                <Text>No Cover Image</Text>
            )}
            <Text>{experienceTitle}</Text>
            <Text>------</Text>
            <Text>{oneLiner}</Text>
            <Text>------</Text>
            <Text>{description}</Text>
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
            {/* TODO: Edit button onlly visible for experience creator */}
            <Button title="Edit Experience" onPress={() => console.log('Edit Experience')} />
        </ScrollView>
    )
}

export default experience_view

const styles = StyleSheet.create({})