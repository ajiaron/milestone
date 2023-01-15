import React, { useState, useEffect, useCallback } from "react"
import AppLoading from 'expo-app-loading'
import * as Font from 'expo-font'
import { FlatList, StyleSheet, Text, View, Button } from 'react-native';
import 'react-native-gesture-handler'
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as SplashScreen from 'expo-splash-screen'
import { useFonts } from 'expo-font'
import Landing from './components/Landing'
import Login from './components/Login'
import Register from './components/Register'
import Feed from './components/Feed'
import Post from './components/Post'
import Profile from './components/Profile'
import Settings from './components/Settings'
import CreatePost from './components/CreatePost'
import TakePost from './components/TakePost'
import CreateMilestone from './components/CreateMilestone'
import UserProvider from "./contexts/UserProvider";

const Stack = createNativeStackNavigator()


function App() {
  const [loaded] = useFonts({
    Inter: require('./assets/fonts/Inter-Medium.otf'),
    InterBold: require('./assets/fonts/Inter-SemiBold.otf'),
    InterLight: require('./assets/fonts/Inter-Light.otf'),
    InterSemiLight: require('./assets/fonts/Inter-Regular.otf'),
  })
  if (!loaded) {
    return null
  }
    return (
      <UserProvider>
          <NavigationContainer>
            <Stack.Navigator screenOptions={{headerShown: false}} initialRouteName="Landing">
              <Stack.Screen name="Landing" component={Landing} />
              <Stack.Screen name="Login" component={Login} />
              <Stack.Screen name="Register" component={Register} />
              <Stack.Screen name="Feed" component={Feed} />
              <Stack.Screen name="Post" component={Post} />
              <Stack.Screen name="Profile" component={Profile} />
              <Stack.Screen name="Settings" component={Settings} />
              <Stack.Screen name="TakePost" component={TakePost} />
              <Stack.Screen name="CreatePost" component={CreatePost} />
              <Stack.Screen name="CreateMilestone" component={CreateMilestone} />
            </Stack.Navigator>
          </NavigationContainer>
        </UserProvider>
      );
    }

  const styles = StyleSheet.create({
    container: {
      flex:'1',
      backgroundColor: '#1f1e1e',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily:"Inter"
    },
});


export default App;