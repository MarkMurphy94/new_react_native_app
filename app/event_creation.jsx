import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, TouchableOpacity, PermissionsAndroid, Platform, Alert, ActivityIndicator } from 'react-native';
import DraggableFlatList from 'react-native-draggable-flatlist';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import MapView from 'react-native-maps';
import * as Location from 'expo-location';

const CreateEventScreen = () => {
    const navigation = useNavigation();
    const [eventName, setEventName] = useState('');
    const [playerObjective, setplayerObjective] = useState('');
    const [listItems, setListItems] = useState([]);
    const [newItem, setNewItem] = useState('');
    const [searchText, setSearchText] = useState('')
    const [errorMsg, setErrorMsg] = useState('')
    const [location, setLocation] = useState(null)

    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setErrorMsg('Permission to access location was denied');
                return;
            }
            let location = await Location.getCurrentPositionAsync({});
            setLocation(location);
        })();
    }, []);

    let text = 'Waiting..';
    if (errorMsg) {
        text = errorMsg;
        console.log(text)
    } else if (location) {
        text = JSON.stringify(location);
    }

    const searchPlaces = () => {
        if (!searchText.trim().length) return
        const googleAPIUrl = "https://maps.gooogleapis.com/maps/api/place/textsearch/json"
        const input = searchText.trim()
        const location = `${INITIAL_LAT},${INITIAL_LONG}&radius=200000`
        const url = `${googleAPIUrl}?query=${input}&location=${location}&key=GET A KEY`
        try {
            const resp = fetch(url)
            const json = resp.json
            console.log(json)
        } catch (e) {
            console.log(e)
        }
    }

    const handleDragEnd = ({ data }) => {
        setListItems(data);
    };

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <View style={{ padding: 20 }}>
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
                <TextInput onChangeText={setSearchText} autoCapitalize='sentences' style={{ borderBottomWidth: 1, marginBottom: 10 }} />
                <Button onPress={searchPlaces} title="search location" />
                <Text>                   </Text>
                <MapView
                    style={{ width: '100%', height: '30%' }}
                    region={location}
                    showsUserLocation={true} //TODO: probably don't need to show this here
                />
            </View>
        </GestureHandlerRootView>

    );
};

export default CreateEventScreen;


