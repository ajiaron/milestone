import  React, {useState} from "react";
import { Text, StyleSheet, View, Image, Pressable, TextInput, ScrollView, Dimensions } from "react-native";
import Icons from '../data/Icons.js'
import { Icon } from 'react-native-elements'
import AppLoading from 'expo-app-loading'
import { useNavigation } from "@react-navigation/native";
import GlobalStyles from "../styles/GlobalStyles";

const windowW= Dimensions.get('window').width
const windowH = Dimensions.get('window').height

const MilestoneTag = ({title, streak, img}) => {
    return (
        <View style={[styles.milestoneContainer]}>
            
            <View style={[styles.milestoneContentContainer]}>  
            <View style={[styles.milestoneIconContainer]}>
                <Image
                        style={styles.milestoneIcon}
                        resizeMode="cover"
                        source={Icons[img]}/>
            </View>
                <View style={[styles.milestoneContext]}>
                    <Text style={[styles.milestoneTitle]}>
                        {title}
                    </Text>
                    <Text style={[styles.milestoneStreak]}>
                        {streak}{' '}days<Text style={[styles.milestoneStreakContext]}> in a row</Text>
                    </Text>
                </View>
           
            </View>
        </View>
    )
}
const styles = StyleSheet.create({  
    milestoneContainer: {
        alignItems:"center",
        paddingTop:windowH*0.0185,
        width:windowW*0.800,
        height: windowH*0.0756,
        backgroundColor: "rgba(10, 10, 10, 1)",
        borderRadius: 8,
        marginBottom:16,
        alignSelf:"center"
    },
    milestoneContentContainer: {
        width:(windowW*0.8)*0.875,
        height:(windowH*0.0756)*0.4285,
        flex:1,
        flexDirection:"row",
        alignItems:"left",
    },
    milestoneIconContainer: {
        width:(windowW*0.082),
        height:(windowH*0.0378),

        backgroundColor: "rgba(214, 214, 214, 1)",
        borderRadius:5,
        justifyContent:"center",

    },
    milestoneIcon: {
        width:"100%",
        height:"100%",
        alignItems:"center",
        borderRadius:5,
        justifyContent:"center",
        alignSelf:"center"
    },
    milestoneContext: {
        textAlign:"left",
        width:windowW*0.52,
        paddingTop:4,
  
        justifyContent:"center",
        height:(windowH*0.0756)*0.4285,
    },
    milestoneTitle: {
        fontFamily:"InterBold",
        fontSize:16, 
        color:"white",
        left:windowW*0.0385,
    },
    milestoneStreak: {
        fontFamily:"InterBold",
        fontSize:11,
        left:windowW*0.0385,
        color:"rgba(53, 174, 146, 1)",
    },
    milestoneStreakContext: {
        fontFamily:"Inter",
        fontSize:11,
        height:12,
        color:"rgba(180, 180, 180, 1)",
    }
})


export default MilestoneTag