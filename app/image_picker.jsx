import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const image_picker = () => {

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
        <View>
            <Text>image_picker</Text>
        </View>
    )
}

export default image_picker

const styles = StyleSheet.create({})