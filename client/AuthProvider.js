import React, { useState, useEffect, useCallback } from "react"
import AppLoading from 'expo-app-loading'
import * as Font from 'expo-font'
import { FlatList, StyleSheet, Text, View, Button } from 'react-native';
import 'react-native-gesture-handler'
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as SplashScreen from 'expo-splash-screen'
import { useAuth0, Auth0Provider } from "react-native-auth0";

const AuthProvider = ({children}) => {
    return (
        <Auth0Provider domain={"dev-njpcpyiv.us.auth0.com"} clientId={"FCFuOxvvebm1VW1N2kgQvWPrFYQO34aH"}>
            {children}
        </Auth0Provider>
    )
}
export default AuthProvider