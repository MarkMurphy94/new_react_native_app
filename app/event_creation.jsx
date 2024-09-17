import React, { useState } from 'react';
import { View, Text, TextInput, Button, TouchableOpacity, FlatList } from 'react-native';
import DraggableFlatList from 'react-native-draggable-flatlist';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const CreateEventScreen = ({ navigation }) => {
    const [eventName, setEventName] = useState('');
    const [playerObjective, setplayerObjective] = useState('');
    const [listItems, setListItems] = useState([]);
    const [newItem, setNewItem] = useState('');

    // Function to add a new item to the list
    const addItem = () => {
        if (newItem.trim()) {
            setListItems([...listItems, { key: newItem, label: newItem }]);
            setNewItem(''); // Clear the input field
        }
    };

    // Function to handle reordering items
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

                {/* <Button title="Add Item" onPress={addItem} /> */}

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
            </View>
        </GestureHandlerRootView>

    );
};

export default CreateEventScreen;
