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
                    onPress={() => navigation.navigate("Landing")}>
                <View styles={styles.feedIcon}>
                    <Icon 
                        name='dynamic-feed'
                        type='material'
                        color='white'
                        size={27}
                    />
                </View>
                </Pressable>
                
                <View styles={styles.addMilestoneIcon}>
                    <Image
                        style={styles.milebookImage}
                        resizeMode="contain"
                        source={require("../assets/milebook-logo.png")} 
                    />
                </View>
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
                <View styles={styles.profileIcon}>
                    <Image
                    style={styles.profilePic}
                    resizeMode="contain"
                    source={require("../assets/profile-pic-empty.png")}/>
                </View>
            </View>
        </View>

    )
}
const styles = StyleSheet.create({
    footerContainer: {
        minHeight:64,
        minWidth:"100%",
        backgroundColor:"rgba(10, 10, 10, 1)",
        
  
    },
    iconContainer: {
        flex: 1,
        justifyContent:"space-evenly",
        alignItems:"center",
        paddingBottom:12,
        flexDirection:"row"
    },
    footerIcons: {
        height:16
    },
    milebookImage: {
        maxHeight:26,
        maxWidth:26
    },
    profilePic: {
        maxHeight:25,
        maxWidth:25,
        top:0
        
    },
    feedIcon: {

    },
    addMilestoneIcon: {
  
    },
    createPostIcon: {

    },
    friendsIcon: {
        top:1,
    },
    profileIcon: {
  
    },


})

export default Footer