import  React, {useState} from "react";
import { Text, StyleSheet, View, Image, Pressable, TextInput, ScrollView } from "react-native";
import { Icon } from 'react-native-elements'
import AppLoading from 'expo-app-loading'
import { useNavigation } from "@react-navigation/native";
import GlobalStyles from "../styles/GlobalStyles";

const Footer = () => {
    const navigation = useNavigation()
    return (
        <View style={[styles.footerContainer]}>
            <View style={[styles.iconContainer]}>
                <Pressable  
                    onPress={() => navigation.navigate("Feed")}>
                <View styles={styles.feedIcon}>
                    <Icon 
                        name='dynamic-feed'
                        type='material'
                        color='white'
                        size={27}
                    />
                </View>
                </Pressable>
                <Pressable  
                    onPress={() => navigation.navigate("Landing")}>
                <View styles={styles.addMilestoneIcon}>
                    <Image
                        style={styles.milebookImage}
                        resizeMode="contain"
                        source={require("../assets/milebook-logo.png")} 
                    />
                </View>
                </Pressable>
                <View styles={styles.createPostIcon}>
                    <Icon
                        name='add-circle-outline'
                        color='white'
                        size={28}
                    />
                </View>
                <View styles={styles.friendsIcon}>
                    <Icon 
                        style={styles.friendsIcon}
                        name='people-outline'
                        color='white'
                        size={29}
                    />
                </View>
                <Pressable styles={styles.profileButton}
                    onPress={() => navigation.navigate("Profile")}> 
                
                <View styles={styles.profileIcon}>
                    <Image
                    style={styles.profilePic}
                    resizeMode="contain"
                    source={require("../assets/profile-pic-empty.png")}/>
                </View>
                </Pressable>
            </View>
        </View>

    )
}
const styles = StyleSheet.create({
    footerContainer: {
        height:66,
        minWidth:"100%",
        bottom:0,
        position:"relative",
        backgroundColor:"rgba(10, 10, 10, 1)",
    },
    iconContainer: {
        flex: 1,
        justifyContent:"space-evenly",
        alignItems:"center",
        paddingBottom:14,
        flexDirection:"row"
    },
    footerIcons: {
        height:16
    },
    milebookImage: {
        maxHeight:26,
        maxWidth:26,
        top:17
    },
    profileButton: {
       minHeight:25,
       minWidth:25
    },
    profilePic: {
        maxHeight:25,
        maxWidth:25,
        top:18
    },
    friendsIcon: {
        top:1,
    },



})

export default Footer