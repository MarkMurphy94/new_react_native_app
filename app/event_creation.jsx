import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Text, TextInput, Button, ImageBackground, TouchableOpacity, Keyboard, KeyboardAvoidingView, Dimensions } from 'react-native';
import DraggableFlatList from 'react-native-draggable-flatlist';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { useNavigation, useRoute } from '@react-navigation/native';
import MapView, { Marker, Callout, PROVIDER_GOOGLE } from 'react-native-maps';
import * as expoLocation from 'expo-location';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get("window")
const ASPECT_RATIO = width / height
const LATITUDE_DELTA = 0.02
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO

const CreateEventScreen = () => {
    const route = useRoute();
    const navigation = useNavigation();
    const [eventName, setEventName] = useState('');
    const [eventId, setEventId] = useState(null);
    const [playerObjective, setplayerObjective] = useState('');
    const [characterList, setCharacterList] = useState([]);
    const [isFocused, setIsFocused] = useState(false);
    const [searchText, setSearchText] = useState('')
    const [errorMsg, setErrorMsg] = useState('')
    const [selection, setSelection] = useState(null)
    const [location, setLocation] = useState(null)
    const [userLocation, setUserLocation] = useState(null)
    const [results, setResults] = useState([])
    const [marker, setMarker] = useState([]);
    const map = useRef('')

    useEffect(() => {
        (async () => {
            let { status } = await expoLocation.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setErrorMsg('Permission to access location was denied');
                return;
            }
            let new_location = await expoLocation.getCurrentPositionAsync({});
            setUserLocation(new_location);
        })
        navigation.setOptions({
            headerLeft: () => (
                <Ionicons
                    name="arrow-back"
                    size={24}
                    color="black"
                    onPress={() => navigation.navigate('experience_creation')}  // Navigates back to the previous screen
                />
            ),
        });
    }, []);

    useEffect(() => {
        if (route.params) {
            const event_data = route.params.item
            setEventName(event_data.eventName)
            setplayerObjective(event_data.playerObjective)
            // setCharacterList(event_data.characterList)
            setLocation(event_data.eventLocation)
            if (event_data.eventId !== null) {
                setEventId(event_data.eventId)
            }
        }
    }, [route.params])

    let text = 'Waiting..';
    if (errorMsg) {
        text = errorMsg;
        console.log("error: ", text)
    }
    const handleMapPress = e => {
        setSelection(e.nativeEvent.coordinate);
    }

    const handleSetLocation = () => {
        setLocation(marker);
    }

    const addOrSaveEvent = () => {
        navigation.navigate("experience_creation", {
            eventName: eventName,
            playerObjective: playerObjective,
            characterList: characterList,
            eventLocation: location,
            eventId: eventId
        })
        setEventId(null)
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
        } catch (e) {
            console.log(e)
        }
    }

    const handleDragEnd = ({ data }) => {
        setCharacterList(data);
    };

    const addItemToList = () => {
        // TODO: get character list
        // setCharacterList(prevItems => [
        //     ...prevItems,
        //     { key: `${prevItems.length + 1}`, label: `Item ${prevItems.length + 1}` }
        // ]);
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
                    locationName: coords.name,
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

    return (
        <KeyboardAvoidingView style={styles.container} behavior='padding'>
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
            <View style={styles.listContainer}>
                <DraggableFlatList
                    data={characterList}
                    keyExtractor={(item) => item.key}
                    onDragEnd={handleDragEnd}
                    style={{ marginTop: 20 }}
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
                />
                <Button title='Add Character' style={{ display: selection ? 'inline' : 'none' }} onPress={addItemToList} />
                {/* Add Character button should open a list of characters created in the previous screen, including an option to create one from this screen */}
            </View>

            <MapView
                ref={map}
                style={{ width: '100%', height: '50%', borderBottomWidth: 1, marginTop: 1, flex: 1 }}
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
            <View style={styles.container} behavior='padding'>
                <View style={styles.autocompleteContainer}>
                    <GooglePlacesAutocomplete
                        placeholder="Search"
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
                    <Button title='Set Location' style={{ display: selection ? 'inline' : 'none' }} onPress={handleSetLocation} />
                </View>
            </View>
            <Button title={route.params ? 'Save Event' : 'Add Event'} onPress={addOrSaveEvent} />
        </KeyboardAvoidingView>
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
    scrollContainer: {
        flexGrow: 1,
        padding: 10,
    },
    input: {
        borderWidth: 1,
        padding: 10,
        marginVertical: 5,
        borderRadius: 5,
    },
    listContainer: {
        flexGrow: 0, // Ensure the list resizes dynamically
        marginVertical: 10,
        padding: 10
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
        top: 0,  // Adjust based on screen size and placement
        left: 0,
        right: 0,
        flex: 1
        // zIndex: 1000,
    },
    map: {
        flex: 1,
        marginTop: 20,
    }
});

export default CreateEventScreen;


