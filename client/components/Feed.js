import  React, {useState} from "react";
import { Text, StyleSheet, View, Image, Pressable, TextInput, ScrollView } from "react-native";
import { Icon } from 'react-native-elements'
import AppLoading from 'expo-app-loading'
import { useNavigation } from "@react-navigation/native";
import GlobalStyles from "../styles/GlobalStyles";
import Footer from './Footer'
import PostItem from './PostItem'

const Feed = () => {
    return (
      <View style={styles.feedPage}>
        <View style={styles.feedContainer}>
         <ScrollView>
          <View style={styles.feedSpace}/>
            <PostItem username={'ajiaron'} caption={'call me kyrie cause i aint playing this year'} 
            src={require("../assets/profile-pic-empty.png")} postId={1}/>
            <PostItem username={'hzenry'} caption={'once you start learning the L goes silent'} 
            src={require("../assets/profile-pic-empty.png")} postId={2}/>
            <PostItem username={'antruong'} caption={'yodie gang i am obliviated'} 
            src={require("../assets/profile-pic-empty.png")} postId={3}/>
            <PostItem username={'jdason'} caption={'generic test caption'}
            src={require("../assets/profile-pic-empty.png")} postId={4}/>
            <PostItem username={'timwang'} caption={'my story written in braille'}
            src={require("../assets/profile-pic-empty.png")} postId={5}/>
          <View style={styles.footerSpace}/>
         </ScrollView>
        </View>
        <Footer/>
      </View>
    );
}

const styles = StyleSheet.create({
    feedSpace: {
        marginTop:48, 
    },
    footerSpace: {
        marginTop:10,
        backgroundColor:"rgba(28, 28, 28, 1)"
    },
    feedContainer: {
        justifyContent:"center",
        flex:1,
        alignItems:"center",
        alignSelf:"center"
    },
    feedPage: {
        backgroundColor:"rgba(28, 28, 28, 1)",
        flex: 1,
        minWidth: "100%",
        minHeight: "100%",
        overflow: "hidden",
    },
})
export default Feed