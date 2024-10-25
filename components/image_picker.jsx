import { View, Text, Image, TouchableOpacity } from 'react-native';
import React, { useState } from 'react'
import * as ImagePicker from 'expo-image-picker';
import { uploadBytes, ref } from 'firebase/storage';
import { STORAGE } from '../firebaseConfig';

const FlatImagePicker = ({ styles }) => {
    const firebase_storage = STORAGE
    const [image, setImage] = useState(null);

    // Function to handle image picking
    const pickImage = async () => {
        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        console.log(result);

        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    };

    return (
        <View>
            <TouchableOpacity onPress={pickImage} style={{ marginBottom: 10 }}>
                <View style={styles}>
                    {image ? (
                        <Image source={{ uri: image }} style={{ width: '100%', height: '100%' }} />
                    ) : (
                        <Text>Select a cover image</Text>
                    )}
                </View>
            </TouchableOpacity>
        </View>
    )
}

export default FlatImagePicker