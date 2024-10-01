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

    return (
        <GestureHandlerRootView style={{ flex: 1, position: 'absolute', padding: 10 }}>
            <View style={{ padding: 20, }}>
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
                <Text>Select a location for this event or search for an address</Text>
                {/* <TextInput onChangeText={setSearchText} autoCapitalize='sentences' style={{ borderBottomWidth: 1, marginBottom: 10 }} /> */}
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
                    styles={{
                        textInput: isFocused ? styles.textInputFocused : styles.textInput,
                        container: styles.inputContainer,
                    }}
                    textInputProps={{
                        onFocus: () => setIsFocused(true),
                        onBlur: () => setIsFocused(false),
                    }}
                />
                <Text>                   </Text>
                <Button onPress={searchPlaces} title="search location" />
                <Text>                   </Text>
                <MapView
                    ref={map}
                    style={{ width: '100%', height: '50%' }}
                    provider={PROVIDER_GOOGLE}
                    region={userLocation}
                    onPress={handleMapPress}
                    showsUserLocation={true} //TODO: probably don't need to show this here?
                >
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
                </MapView>
                <Text>                   </Text>
                <Button title='Set Location' onPress={handleSetLocation} style={{ display: selection ? 'inline' : 'none' }} />
            </View>
        </GestureHandlerRootView>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: "darkblue",
        paddingTop: 60,
        paddingBottom: 25,
        alignItems: "center",
        borderBottomLeftRadius: 55,
        borderBottomRightRadius: 55,
        position: "absolute",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
        marginBottom: 50,
    },
    textInput: {
        borderWidth: 1,
        borderColor: "#ccc",
        height: 50,
        borderRadius: 25,
        paddingLeft: 25,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
    },
    inputContainer: {
        width: "95%",
    },
    textInputFocused: {
        borderWidth: 1,
        borderColor: "darkblue",
        height: 50,
        borderRadius: 25,
        paddingLeft: 25,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
    },
});

export default CreateEventScreen;


