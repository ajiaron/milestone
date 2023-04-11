import  React, {useState, useEffect, useContext, useRef, useCallback} from "react";
import { Animated, ActivityIndicator, Text, StyleSheet, View, Image, FlatList, Pressable, TextInput,ScrollView, Dimensions, RefreshControl } from "react-native";
import { Icon } from 'react-native-elements'
import { useNavigation, useRoute } from "@react-navigation/native";
import Footer from './Footer'
import Navbar from "./Navbar";
import userContext from '../contexts/userContext'
import axios from 'axios'

const windowW = Dimensions.get('window').width      
const windowH = Dimensions.get('window').height    

const Notifications = () => {
    const scrollY = useRef(new Animated.Value(0)).current
    return (
        <View style={[styles.notificationsPage]}>
            <Navbar title={'notifications'} scrollY={scrollY}/>
            <View style={{position:"absolute", bottom:0}}>
                <Footer/>
            </View>
        </View>
    )
}
const styles = StyleSheet.create({
    notificationsPage: {
        backgroundColor:"rgba(28, 28, 28, 1)",
        flex: 1,
        minWidth: "100%",
        minHeight: "100%",
        overflow: "hidden",
    }
})
export default Notifications;