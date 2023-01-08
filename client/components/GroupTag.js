import  React, {useState} from "react";
import { Text, StyleSheet, View, Image, Pressable, TextInput, ScrollView, Dimensions } from "react-native";
import { Icon } from 'react-native-elements'
import AppLoading from 'expo-app-loading'
import { useNavigation } from "@react-navigation/native";
import GlobalStyles from "../styles/GlobalStyles";

const windowW= Dimensions.get('window').width
const windowH = Dimensions.get('window').height

const GroupTag = ({title, users, img}) => {
    return (
        <View style={[styles.groupContainer]}>
            
            <View style={[styles.groupContentContainer]}>  
                <View style={[styles.groupIconContainer]}>
                    <Image
                            style={styles.groupIcon}
                            resizeMode="cover"
                            source={img}/>
                </View>
                <View style={[styles.groupContext]}>
                    <Text style={[styles.groupTitle]}>
                        {title}
                    </Text>
                    <View style={[styles.groupMemberContainer]}>
                        <Text style={[styles.groupMembers]} numberOfLines={1}>
                            <View style={[styles.groupIconSmall]}>
                             
                            </View>
                            
                            <Text style={[styles.groupMembersContext]}>
                               {''} {users[0]}, {users[1]}, and
                            </Text>
                        {' '}{Math.round(Math.random(9)*(9-1)+1)}+ others
                        </Text>
                    </View>
                </View>
                <View style={[styles.groupTagIcon]}>  
                    <Icon   
                        name='pending'
                        color="rgba(38, 38, 38, 1)"
                        size={32}
                    />
                </View>
            
            </View>
        </View>
    )
}
const styles = StyleSheet.create({  
    groupContainer: {
        alignItems:"center",
        paddingTop:windowH*0.0185,
        width:windowW*0.800,
        height: windowH*0.0756,
        backgroundColor: "rgba(10, 10, 10, 1)",
        borderRadius: 8,
        marginBottom:16,
        alignSelf:"center"
    },
    groupContentContainer: {
        width:(windowW*0.8)*0.875,
        height:(windowH*0.0756)*0.4285,
        flex:1,
        flexDirection:"row",
        alignItems:"left",
    },
    groupIconContainer: {
        width:(windowW*0.082),
        height:(windowH*0.0378),
        backgroundColor: "rgba(214, 214, 214, 1)",
        borderRadius:5,
        justifyContent:"center",
    },
    groupTagIcon: {
        left:6,
        alignItems:"center",
    },
    groupIcon: {
        width:"100%",
        height:"100%",
        alignItems:"center",
        borderRadius:5,
        justifyContent:"center",
        alignSelf:"center"
    },
    groupContext: {
        textAlign:"left",
        width:windowW*0.52,
        top:-1,
        justifyContent:"center",
        height:(windowH*0.0756)
    },
    groupTitle: {
        fontFamily:"InterBold",
        fontSize:16, 
        color:"white",
        left:windowW*0.0385,
    },
    groupMemberContainer: {
        flex:1,
        height:13,
        width:windowW*0.5,
   
    },
    groupMembers: {
        fontFamily:"InterBold",
        fontSize:11,

        
        overflow:"visible",
        left:windowW*0.0365,
        color:"rgba(53, 174, 146, 1)",
    },
    groupMembersContext: {
        fontFamily:"Inter",
        overflow:"visible",
  
        fontSize:10.5,
        height:12,
        color:"rgba(180, 180, 180, 1)",
    }
})


export default GroupTag