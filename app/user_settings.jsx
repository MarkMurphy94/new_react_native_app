import React, { useState } from "react";
import { View, Text, Switch, StyleSheet, Alert } from "react-native";
import * as expoLocation from 'expo-location';

const SettingsView = () => {
    const [isLocationEnabled, setIsLocationEnabled] = useState(false);

    const toggleLocationTracking = async (value) => {
        if (value) {
            // Enabling location tracking
            const { status } = await expoLocation.requestBackgroundPermissionsAsync();
            if (status === "granted") {
                setIsLocationEnabled(true);
                Alert.alert("Location Access Enabled", "This app will only track your location during an experience");
            } else {
                Alert.alert("Permission Denied", "Location tracking requires your permission.");
                setIsLocationEnabled(false);
            }
        } else {
            Alert.alert("Location access permissions still enabled", "You will need to go to the app settings on your phone and deny the location permission for this app");
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Settings</Text>

            <View style={styles.settingItem}>
                <Text style={styles.label}>Enable Location Tracking</Text>
                {/* <Text style={styles.label}>Your location will ONLY be tracked while you are playing through an experience</Text> */}
                <Switch
                    value={isLocationEnabled}
                    onValueChange={toggleLocationTracking}
                    thumbColor={isLocationEnabled ? "#4CAF50" : "#f4f3f4"}
                    trackColor={{ false: "#767577", true: "#81b0ff" }}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: "#f9f9f9",
    },
    header: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 20,
    },
    settingItem: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginVertical: 10,
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: "#ddd",
    },
    label: {
        fontSize: 18,
        color: "#333",
    },
    subTitle: {
        fontSize: 15,
        color: "#333",
    },
});

export default SettingsView;
