import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { FIRESTORE, FIREBASE_AUTH, STORAGE } from '@/firebaseConfig';
import { ref, getDownloadURL } from 'firebase/storage';


const ExperienceCard = ({ title, description, imageUrl, navigateTo, params }) => {
    const navigation = useNavigation();
    const storage = STORAGE
    const [coverImageUrl, setCoverImageUrl] = useState('')
    const [experienceData, setExperienceData] = useState(params)

    useEffect(() => {
        if (imageUrl && imageUrl !== '') {
            getCoverImageUri()
        }
    }, [])

    const handlePress = () => {
        navigation.navigate(navigateTo, experienceData);
        // console.log('from card: ', experienceData)
    };

    const getImageForExperience = (image) => {
        setExperienceData((experience) => ({
            ...experience,
            ...image
        }))
    }

    const getCoverImageUri = () => {
        getDownloadURL(ref(storage, imageUrl))
            .then((url) => {
                setCoverImageUrl(url)
                getImageForExperience({ 'coverImageUrl': url })
            })
            .catch((error) => {
                console.log('Error: ', error)
            });
    }

    return (
        <TouchableOpacity onPress={handlePress} style={styles.card}>
            {coverImageUrl ? <Image source={{ uri: coverImageUrl }} style={styles.image} /> : null}
            <View style={styles.content}>
                <Text style={styles.title}>{title}</Text>
                {description && <Text style={styles.description}>{description}</Text>}
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderRadius: 8,
        elevation: 3,
        shadowColor: '#000',
        shadowOpacity: 0.3,
        shadowRadius: 5,
        shadowOffset: { width: 2, height: 2 },
        marginVertical: 10,
        padding: 10,
    },
    image: {
        width: 60,
        height: 60,
        borderRadius: 8,
        marginRight: 10,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    description: {
        fontSize: 14,
        color: '#666',
    },
});

export default ExperienceCard;
