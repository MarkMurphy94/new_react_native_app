import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Text, TextInput, Button, ImageBackground, TouchableOpacity, Keyboard, Dimensions } from 'react-native';
import DraggableFlatList from 'react-native-draggable-flatlist';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { useNavigation } from '@react-navigation/native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';

const CreateEventScreen = () => {
    const navigation = useNavigation();
    const [eventName, setEventName] = useState('');
    const [playerObjective, setplayerObjective] = useState('');
    const [listItems, setListItems] = useState([]);
    const [isFocused, setIsFocused] = useState(false);
    const [Address, setAddress] = useState("");
    const [searchText, setSearchText] = useState('')
    const [errorMsg, setErrorMsg] = useState('')
    const [selection, setSelection] = useState(null)
    const [location, setLocation] = useState(null)
    const [userLocation, setUserLocation] = useState(null)
    const [results, setResults] = useState([])
    const [placeId, setPlaceId] = useState('')
    const [marker, setMarker] = useState([]);
    const map = useRef('')

    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setErrorMsg('Permission to access location was denied');
                return;
            }
            let new_location = await Location.getCurrentPositionAsync({});
            setUserLocation(new_location);
        })();
    }, []);

    let text = 'Waiting..';
    if (errorMsg) {
        text = errorMsg;
        console.log(text)
    }
    const handleMapPress = e => {
        setSelection(e.nativeEvent.coordinate);
    }

    const handleSetLocation = e => {
        setLocation(selection);
    }

    const searchPlaces = async () => {
        if (!searchText.trim().length) return
        const googleAPIUrl = "https://maps.googleapis.com/maps/api/place/textsearch/json"
        const input = searchText.trim()
        const search_location = `${userLocation["coords"]["latitude"]},${userLocation["coords"]["longitude"]}&radius=200`
        const url = `${googleAPIUrl}?query=${input}&location=${search_location}&key=${MAPS_API_KEY}`
        try {
            const resp = await fetch(url)
            const resp_json = await resp.json()
            if (resp_json && resp_json.results) {
                const coords = []
                for (const item of resp_json.results) {
                    coords.push({
                        latitude: item.geometry.location.lat,
                        longitude: item.geometry.location.lng,
                    })
                }
                setResults(resp_json.results)
                if (coords.length) {
                    map.current?.fitToCoordinates(coords, {
                        edgePadding: {
                            top: 50,
                            right: 50,
                            bottom: 50,
                            left: 50
                        },
                        animated: true
                    })
                    Keyboard.dismiss()
                }
            }
            console.log(results)
        } catch (e) {
            console.log(e)
        }
    }

    const handleDragEnd = ({ data }) => {
        setListItems(data);
    };

    const addItemToList = () => {
        setListItems(prevItems => [
            ...prevItems,
            { key: `${prevItems.length + 1}`, label: `Item ${prevItems.length + 1}` }
        ]);
    };

    const onPlaceSelected = async (data, details) => {
        try {
            const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${data.place_id}&key=${MAPS_API_KEY}`;
            const resp = await fetch(url)
            const resp_json = await resp.json()
            if (resp_json.result) {
                const coords = resp_json.result
                const newMarker = {
                    latitude: coords.geometry.location.lat,
                    longitude: coords.geometry.location.lng,
                    title: coords.name,
                    address: coords.formatted_address
                }
                setMarker([newMarker]);
                map.current?.animateToRegion({
                    latitude: coords.geometry.location.lat,
                    longitude: coords.geometry.location.lng,
                    latitudeDelta: 0.05,
                    longitudeDelta: 0.05
                });
                // TODO: show callout bubble with place name, address and button to "Set Event Location"
            }
        } catch (e) {
            console.log(e)
        }
    }

    const renderItem = ({ item, drag, isActive }) => (
        <View style={[styles.listItem, isActive && styles.activeItem]}>
            <Text onLongPress={drag}>{item.label}</Text>
        </View>
    );

    return (
        <View style={styles.container}>
                <Text>Event Description</Text>
                <TextInput
                    value={eventName}
                    onChangeText={setEventName}
                    placeholder="Enter a brief description of this event"
                    style={{ borderBottomWidth: 1, marginBottom: 10 }}
                />
                <Text>Player Objective</Text>
                <TextInput
                    value={playerObjective}
                    onChangeText={setplayerObjective}
                    placeholder="Enter an objective for the player"
                    style={{ borderBottomWidth: 1, marginBottom: 10 }}
                />
                <Text>Characters in this event</Text>
                <DraggableFlatList
                    data={listItems}
                    renderItem={({ item, drag, isActive }) => (
                        <TouchableOpacity
                            style={{
                                padding: 10,
                                backgroundColor: isActive ? '#ddd' : '#fff',
                                borderBottomWidth: 1,
                                borderColor: '#ccc',
                            }}
                            onLongPress={drag}
                        >
                            <Text>{item.label}</Text>
                        </TouchableOpacity>
                    )}
                    keyExtractor={(item) => item.key}
                    onDragEnd={handleDragEnd}
                    style={{ marginTop: 20 }}
                />
            <Button title='Add Character' style={{ display: selection ? 'inline' : 'none' }} />
            <View style={styles.autocompleteContainer}>
                <GooglePlacesAutocomplete
                    placeholder="Search"
                    onPress={(data, details = null) => {
                        setAddress(details.description);
                        console.log(details.description);
                        console.log("Comming from Address UseState: ", Address)
                    }}
                    query={{
                        key: MAPS_API_KEY,
                        language: "en",
                    }}
                    onPress={onPlaceSelected}
                    styles={{
                        textInput: isFocused ? styles.textInputFocused : styles.textInput,
                        container: styles.inputContainer,
                    }}
                    textInputProps={{
                        // value: searchText,
                        onFocus: () => setIsFocused(true),
                        onBlur: () => setIsFocused(false),
                    }}
                />
            </View>
                <MapView
                    ref={map}
                    style={{ width: '100%', height: '50%' }}
                    provider={PROVIDER_GOOGLE}
                    region={userLocation}
                    onPress={handleMapPress}
                showsUserLocation={true}>
                    {results.length ? results.map((item, i) => {
                        const coord = {
                            latitude: item.geometry.location.lat,
                            longitude: item.geometry.location.lng,
                        }
                        return (
                            <Marker
                                key={`search-item-${i}`}
                                coordinate={coord}
                                title={item.name}
                            />
                        )
                    }) : null}
                {marker.map((marker, index) => (
                    <Marker
                        key={index}
                        coordinate={{
                            latitude: marker.latitude,
                            longitude: marker.longitude
                        }}
                        title={marker.title}
                    >
                        <Callout>
                            <View>
                                <Text>{marker.name}</Text>
                                <Text>{marker.address}</Text>
                            </View>
                        </Callout>
                    </Marker>
                ))}
                </MapView>
            </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        // backgroundColor: "darkblue",
        // paddingTop: 60,
        // paddingBottom: 25,
        // alignItems: "center",
        // borderBottomLeftRadius: 55,
        // borderBottomRightRadius: 55,
        // position: "absolute",
        // // shadowColor: "#000",
        // shadowOffset: { width: 0, height: 2 },
        // shadowOpacity: 0.1,
        // shadowRadius: 10,
        // elevation: 5,
        // marginBottom: 50,
    },
    input: {
        borderWidth: 1,
        padding: 10,
        marginVertical: 5,
        borderRadius: 5,
    },
    listItem: {
        padding: 15,
        marginVertical: 5,
        backgroundColor: '#f0f0f0',
        borderRadius: 5,
    },
    activeItem: {
        backgroundColor: '#ccc',
    },
    autocompleteContainer: {
        position: 'absolute',
        top: 120,  // Adjust based on screen size and placement
        left: 0,
        right: 0,
        zIndex: 1000,
    },
    map: {
        flex: 1,
        marginTop: 20,
    }
});

export default CreateEventScreen;


