import { View, Text, Image, TouchableOpacity } from 'react-native';
import React, { useState } from 'react'
import * as ImagePicker from 'expo-image-picker';


const CoverImagePicker = () => {
    const [image, setImage] = useState(null);

    // async function getAlbums() {
    //     if (permissionResponse.status !== 'granted') {
    //         await requestPermission();
    //     }
    //     const fetchedAlbums = await MediaLibrary.getAlbumsAsync({
    //         includeSmartAlbums: true,
    //     });
    //     setAlbums(fetchedAlbums);
    // }

    // function AlbumEntry({ album }) {
    //     const [assets, setAssets] = useState([]);

    //     useEffect(() => {
    //         async function getAlbumAssets() {
    //             const albumAssets = await MediaLibrary.getAssetsAsync({ album });
    //             setAssets(albumAssets.assets);
    //         }
    //         getAlbumAssets();
    //     }, [album]);

    //     return (
    //         <View key={album.id}>
    //             <Text>
    //                 {album.title} - {album.assetCount ?? 'no'} assets
    //             </Text>
    //             <View>
    //                 {assets && assets.map((asset) => (
    //                     <Image source={{ uri: asset.uri }} width={50} height={50} />
    //                 ))}
    //             </View>
    //         </View>
    //     );
    // }

    // Function to handle image picking
    const pickImage = async () => {
        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
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
                <View style={{ borderWidth: 1, height: 150, justifyContent: 'center', alignItems: 'center' }}>
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

export default CoverImagePicker