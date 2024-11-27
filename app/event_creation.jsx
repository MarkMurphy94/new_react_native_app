import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Text, TextInput, Button, ImageBackground, TouchableOpacity, Keyboard, ScrollView, KeyboardAvoidingView, Dimensions } from 'react-native';
import DraggableFlatList from 'react-native-draggable-flatlist';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { Dropdown } from 'react-native-element-dropdown';
import { useNavigation, useRoute } from '@react-navigation/native';
import MapView, { Marker, Callout, PROVIDER_GOOGLE } from 'react-native-maps';
import * as expoLocation from 'expo-location';
import { Ionicons } from '@expo/vector-icons';
import DateTimePickerComponent from '../components/date_time_picker';

const { width, height } = Dimensions.get("window")
const ASPECT_RATIO = width / height
const LATITUDE_DELTA = 0.02
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO
const EVENTTYPES = [
    { label: 'Message', value: 'Message' },
    { label: 'Planned Encounter', value: 'Planned Encounter' },
    { label: 'Surprise Encounter', value: 'Surprise Encounter' },
    { label: 'Item Encounter', value: 'Item Encounter' },
]

// TODO: Event types so far: automated messages, planned encounters, surprise encounters, item encounters
// DEfault event type implemented here- planned encounter

const CreateEventScreen = () => {
    const route = useRoute();
    const navigation = useNavigation();
    const [eventTitle, setEventTitle] = useState('');
    const [eventMessage, setEventMessage] = useState('');
    const [eventId, setEventId] = useState(null);
    const [eventType, setEventType] = useState(null);
    const [eventDateTime, setEventDateTime] = useState(new Date(1598051730000));
    const [playerObjective, setPlayerObjective] = useState('');
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
            setEventTitle(event_data.eventTitle)
            setPlayerObjective(event_data.playerObjective)
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
            eventTitle: eventTitle,
            eventDateTime: eventDateTime,
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
        <KeyboardAvoidingView style={styles.container} behavior="padding">
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={styles.card}>
                    <Text style={styles.label}>Event Description</Text>
                    <TextInput
                        value={eventTitle}
                        onChangeText={setEventTitle}
                        placeholder="Enter a brief description"
                        style={styles.textInput}
                    />
                </View>
                <View style={styles.card}>
                    <Text style={styles.label}>Event Time</Text>
                    <DateTimePickerComponent
                        onDateSelected={(newDate) => setEventDateTime(newDate)}
                    />
                    <Text style={styles.infoText}>Event will occur: {eventDateTime.toLocaleString()}</Text>
                </View>
                <View style={styles.card}>
                    <Text style={styles.label}>Event Type</Text>
                    <Dropdown
                        data={EVENTTYPES}
                        maxHeight={300}
                        labelField="label"
                        valueField="value"
                        placeholder="Select Event Type"
                        value={eventType}
                        onChange={(item) => setEventType(item.value)}
                    />
                </View>
                {/* Event Message */}
                {eventType === 'Message' && (
                    <View style={styles.card}>
                        <Text style={styles.label}>Message Text</Text>
                        <TextInput
                            value={eventMessage}
                            onChangeText={setEventMessage}
                            placeholder="Enter message text"
                            style={styles.textInput}
                        />
                    </View>
                )}

                {/* Map Section */}
                {(eventType === 'Planned Encounter' || eventType === 'Item Encounter') && (
                    <View style={styles.card}>
                        <Text style={styles.label}>Player Objective</Text>
                        <TextInput
                            value={playerObjective}
                            onChangeText={setPlayerObjective}
                            placeholder="Enter player's objective"
                            style={styles.textInput}
                        />
                        <MapView
                            ref={map}
                            style={styles.map}
                            provider={PROVIDER_GOOGLE}
                            region={userLocation}
                            onPress={handleMapPress}
                            showsUserLocation={true}
                        >
                            {results.map((item, i) => (
                                <Marker
                                    key={`search-item-${i}`}
                                    coordinate={{
                                        latitude: item.geometry.location.lat,
                                        longitude: item.geometry.location.lng,
                                    }}
                                    title={item.name}
                                />
                            ))}
                            {marker.map((m, i) => (
                                <Marker
                                    key={i}
                                    coordinate={{
                                        latitude: m.latitude,
                                        longitude: m.longitude,
                                    }}
                                    title={m.title}
                                >
                                    <Callout>
                                        <View>
                                            <Text>{m.name}</Text>
                                            <Text>{m.address}</Text>
                                        </View>
                                    </Callout>
                                </Marker>
                            ))}
                        </MapView>
                        <GooglePlacesAutocomplete
                            placeholder="Search for a location"
                            query={{
                                key: MAPS_API_KEY,
                                language: 'en',
                            }}
                            onPress={onPlaceSelected}
                            styles={{
                                textInput: isFocused ? styles.textInputFocused : styles.textInput,
                                container: styles.inputContainer,
                            }}
                            textInputProps={{
                                onFocus: () => setIsFocused(true),
                                onBlur: () => setIsFocused(false),
                            }}
                        />
                        <TouchableOpacity
                            onPress={handleSetLocation}
                            style={styles.button}
                        >
                            <Text style={styles.buttonText}>Set Location</Text>
                        </TouchableOpacity>
                    </View>
                )}

                {/* Characters Section */}
                {(eventType === 'Planned Encounter' || eventType === 'Surprise Encounter') && (
                    <View style={styles.card}>
                        <Text style={styles.label}>Characters in Event</Text>
                        <DraggableFlatList
                            data={characterList}
                            keyExtractor={(item) => item.key}
                            onDragEnd={handleDragEnd}
                            renderItem={({ item, drag, isActive }) => (
                                <TouchableOpacity
                                    style={[
                                        styles.listItem,
                                        { backgroundColor: isActive ? '#ddd' : '#fff' },
                                    ]}
                                    onLongPress={drag}
                                >
                                    <Text>{item.label}</Text>
                                </TouchableOpacity>
                            )}
                        />
                        <TouchableOpacity
                            onPress={addItemToList}
                            style={styles.button}
                        >
                            <Text style={styles.buttonText}>Add Character</Text>
                        </TouchableOpacity>
                    </View>
                )}

                {/* Submit Button */}
                <TouchableOpacity onPress={addOrSaveEvent} style={styles.submitButton}>
                    <Text style={styles.submitButtonText}>
                        {route.params ? 'Save Event' : 'Add Event'}
                    </Text>
                </TouchableOpacity>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

export default CreateEventScreen;
;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f9f9f9',
    },
    scrollContainer: {
        padding: 20,
    },
    card: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 15,
        marginBottom: 20,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 3,
    },
    autocompleteContainer: {
        position: 'absolute',
        top: 0,  // Adjust based on screen size and placement
        left: 0,
        right: 0,
        flex: 1
        // zIndex: 1000,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 8,
    },
    textInput: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        marginBottom: 10,
        backgroundColor: '#fff',
    },
    infoText: {
        fontSize: 14,
        color: '#666',
    },
    map: {
        height: 200,
        marginVertical: 10,
        borderRadius: 10,
    },
    button: {
        backgroundColor: '#4CAF50',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    listItem: {
        padding: 10,
        borderBottomWidth: 1,
        borderColor: '#ccc',
    },
    submitButton: {
        backgroundColor: '#007BFF',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 20,
    },
    submitButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
});


