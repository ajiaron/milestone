import  React, {useState} from "react";
import { Text, StyleSheet, View, Image, Pressable, TextInput, ScrollView,  } from "react-native";
import { Icon } from 'react-native-elements'
import AppLoading from 'expo-app-loading'
import { useNavigation } from "@react-navigation/native";
import GlobalStyles from "../styles/GlobalStyles";
import Footer from './Footer'
import PostItem from "./PostItem";

const Post = ({navigation, route}) => {
    
    return (
        <View style={[styles.postPage]}>
            <View style={[styles.feedSpace]}/>
            <View style={[styles.postContainer]}>
                <PostItem username={route.params.item.username} caption={route.params.item.caption} 
                src={route.params.item.src} postId={route.params.item.postId} liked={route.params.item.liked}/>
            </View>
          
            <View style={[styles.footerSpace]}/>
            <View style={[styles.footerPosition]}>
                <Footer/>
            </View>
     
        </View>
    )
}

const styles = StyleSheet.create({
    postPage: {
        backgroundColor:"rgba(28, 28, 28, 1)",
        flex: 1,
        minWidth: "100%",
        minHeight: "100%",
        overflow: "hidden",
    },
    postContainer: {
        justifyContent:"center",
        flex:1,
        alignItems:"center",
        alignSelf:"center"
    },
    feedSpace: {
        marginTop:48, 
    },
    postSpace: {
        top:48
    },
    footerPosition: {
        position:"absolute",
        bottom:0
    },
    footerSpace: {
        marginTop:10,
        backgroundColor:"rgba(28, 28, 28, 1)"
    },
    
})
export default Post