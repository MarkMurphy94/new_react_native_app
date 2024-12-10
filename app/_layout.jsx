import "react-native-gesture-handler"
import { useEffect, useState } from "react";
import { useFonts } from "expo-font";
import { SplashScreen, Stack } from "expo-router";
import { Drawer } from "expo-router/drawer"
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Ionicons from "@expo/vector-icons/Ionicons";
import { onAuthStateChanged, User } from "firebase/auth";
import { FIREBASE_AUTH } from '../firebaseConfig'
import { Button, View } from "react-native";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

const RootLayout = () => {
  const [fontsLoaded, error] = useFonts({
    "Poppins-Black": require("../assets/fonts/Poppins-Black.ttf"),
    "Poppins-Bold": require("../assets/fonts/Poppins-Bold.ttf"),
    "Poppins-ExtraBold": require("../assets/fonts/Poppins-ExtraBold.ttf"),
    "Poppins-ExtraLight": require("../assets/fonts/Poppins-ExtraLight.ttf"),
    "Poppins-Light": require("../assets/fonts/Poppins-Light.ttf"),
    "Poppins-Medium": require("../assets/fonts/Poppins-Medium.ttf"),
    "Poppins-Regular": require("../assets/fonts/Poppins-Regular.ttf"),
    "Poppins-SemiBold": require("../assets/fonts/Poppins-SemiBold.ttf"),
    "Poppins-Thin": require("../assets/fonts/Poppins-Thin.ttf"),
  });
  const [user, setUser] = useState(null)

  useEffect(() => {
    onAuthStateChanged(FIREBASE_AUTH, (user) => {
      setUser(user)
    })
  })

  useEffect(() => {
    if (error) throw error;

    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, error]);

  if (!fontsLoaded) {
    return null;
  }

  if (!fontsLoaded && !error) {
    return null;
  }
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      {user ? (
        <Drawer>
          <Drawer.Screen name='index' options={{
            drawerLabel: "Home",
            headerTitle: "Home",
            drawerIcon: ({ size, color }) => (
              <Ionicons name="home-outline" size={size} color={color} />
            )
          }} />
          <Drawer.Screen name='experience_creation' options={{
            drawerItemStyle: { display: 'none' },
          }} />
          <Drawer.Screen name='event_creation' options={{
            drawerItemStyle: { display: 'none' },
          }} />
          <Drawer.Screen name='character_creation' options={{
            drawerItemStyle: { display: 'none' },
          }} />
          <Drawer.Screen name='create_account' options={{
            drawerItemStyle: { display: 'none' },
          }} />
          <Drawer.Screen name='login' options={{
            drawerItemStyle: { display: 'none' },
          }} />
          <Drawer.Screen name='profile' options={{
            drawerLabel: "Profile",
            headerTitle: "Profile",
            drawerIcon: ({ size, color }) => (
              <Ionicons name="person-outline" size={size} color={color} />
            )
          }} />
        </Drawer>
      ) : (
        <Drawer>
          <Drawer.Screen name='index' options={{
            drawerLabel: "Home",
            headerTitle: "Home",
            drawerIcon: ({ size, color }) => (
              <Ionicons name="home-outline" size={size} color={color} />
            )
          }} />
          <Drawer.Screen name='experience_creation' options={{
            drawerItemStyle: { display: 'none' },
          }} />
          <Drawer.Screen name='event_creation' options={{
            drawerItemStyle: { display: 'none' },
          }} />
          <Drawer.Screen name='character_creation' options={{
            drawerItemStyle: { display: 'none' },
          }} />
          <Drawer.Screen name='create_account' options={{
            drawerLabel: "Create Account",
            headerTitle: "Create Account",
            drawerIcon: ({ size, color }) => (
              <Ionicons name="person-outline" size={size} color={color} />
            )
          }} />
          <Drawer.Screen name='login' options={{
            drawerLabel: "Login",
            headerTitle: "Login",
            drawerIcon: ({ size, color }) => (
              <Ionicons name="person-outline" size={size} color={color} />
            )
          }} />
          <Drawer.Screen name='profile' options={{
            drawerLabel: "Profile",
            headerTitle: "Profile",
            drawerItemStyle: { display: 'none' },
            drawerIcon: ({ size, color }) => (
              <Ionicons name="person-outline" size={size} color={color} />
            )
          }} />
        </Drawer>
      )}
    </GestureHandlerRootView>

  )
};

export default RootLayout;