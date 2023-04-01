import  React, {useState, useEffect, useRef, useContext} from "react";
import { Text, StyleSheet, View, Image, Pressable, PixelRatio, TouchableOpacity, Dimensions, Animated } from "react-native";
import Icons from '../data/Icons.js'
import { Icon } from 'react-native-elements'
import { useNavigation, useRoute, NavigationActions } from "@react-navigation/native";
import GlobalStyles from "../styles/GlobalStyles";
import userContext from '../contexts/userContext'
import axios from 'axios'

const windowW= Dimensions.get('window').width
const windowH = Dimensions.get('window').height

const FriendTag = ({username, img}) => {
    return (
        <View style={[styles.friendContainer]}>
            <View style={[styles.friendContentContainer]}>  
                <View style={[styles.friendIconContainer]}>
                    <Image
                            style={styles.friendIcon}
                            resizeMode="cover"
                            source={img}/>
                </View>
                <View style={[styles.friendContext]}>
                    <Text style={[styles.friendTitle]}>
                        {username}
                    </Text>
                </View>
            </View>
        </View>
    )
}
const styles = StyleSheet.create({
    friendContainer: {
        alignItems:"center",
        width:windowW*0.800,
        height: windowH*0.0756,
        backgroundColor: "rgba(10, 10, 10, 1)",
        borderRadius: 8,
        marginBottom:16,
        alignSelf:"center",
        shadowColor: '#000',
        shadowOffset: {
        width: 0,
        height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
    },
    friendContentContainer: {
        width:(windowW*0.8)*0.875,
        height:(windowH*0.0756)*0.4285,
        flex:1,
        flexDirection:"row",
        alignItems:"center"
    },
    friendIconContainer: {
        width:(windowW*0.082),
        height:(windowH*0.0378),
        backgroundColor: "rgba(214, 214, 214, 1)",
        borderRadius:5,
        justifyContent:"center",
    },
    friendIcon: {
        width:"100%",
        height:"100%",
        alignItems:"center",
        borderRadius:5,
        justifyContent:"center",
        alignSelf:"center"
    },
    friendContext: {
        left:0,
        width:windowW*0.52,
        alignSelf:"center",
        justifyContent:"center",
    },
    friendTitle: {
        fontFamily:"InterBold",
        fontSize:16, 
        color:"white",
        left:windowW*0.0385,
    },
})
export default FriendTag