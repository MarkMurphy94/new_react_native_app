import { View, Text, Image, TouchableOpacity } from 'react-native';
import React, { useState } from 'react'
import * as ImagePicker from 'expo-image-picker';

const FlatImagePicker = (props) => {
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
        if (!result.canceled) {
            setImage(result.assets[0].uri);
            props.onSelectImage(result.assets[0].uri)
        }
    };

    return (
        <View>
            <TouchableOpacity onPress={pickImage} style={{ marginBottom: 10 }}>
                <View style={props.styles}>
                    {props.image ? (
                        <Image source={{ uri: props.image }} style={{ width: '100%', height: '100%' }} />
                    ) : (
                        <Text>{props.text}</Text>
                    )}
                </View>
            </TouchableOpacity>
        </View>
    )
}

export default FlatImagePicker