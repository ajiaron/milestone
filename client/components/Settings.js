import React, {useState, useEffect, useContext} from "react";
import { Text, StyleSheet, View, Image, FlatList, Pressable, TextInput, Switch, Dimensions } from "react-native";
import * as Device from 'expo-device'
import { Icon } from 'react-native-elements'
import AppLoading from 'expo-app-loading'
import { useNavigation } from "@react-navigation/native";
import Footer from './Footer'
import MilestoneTag from "./MilestoneTag";
import userContext from '../contexts/userContext'
import axios from 'axios'

const windowW = Dimensions.get('window').width
const windowH = Dimensions.get('window').height

const ResetButton = ({user}) => {
    function handlePress(){
        console.log('User: ', user.username)
        axios.get(`http://${user.network}:19001/api/getposts`)  // if this throws an error, replace 10.0.0.160 with localhost
        .then((response)=> {
            console.log(response.data.map((val,k)=>val.text))
        }).catch(error => console.log(error))
    }
    return (
        <Pressable
            style={styles.resetPasswordButton}
            onPress={handlePress}>
            <View style={styles.resetButtonContent} > 
                <Text style={[styles.resetPasswordText]}>
                    Reset Password
                </Text>
            </View>
        </Pressable>
    )
}
const Settings = () => {
    const user = useContext(userContext)
    const [isPublic, setIsPublic] = useState(true)
    const togglePublic = () => setIsPublic(previousState => !previousState)
    const [newUsername, setNewUsername] = useState(user?user.username:"ajiaron")
    const [newName, setNewName] = useState("Aaron Jiang")
    const [newDescription, setNewDescription] = useState("I'm about writing apps and running laps")
    const [newEmail, setNewEmail] = useState("aaronjiang2001@gmail.com")
    return (
        <View style={styles.settingsPage}>
            <View style={styles.settingsContainer}>
                <View styles={styles.profilePicContainer}>
                    <Icon
                        style={{bottom:-8}}
                        name='face'
                        color='white'
                        size={100} 
                    />
                
                    <Text style={styles.changePicText}>Change Profile Picture</Text>
                </View>
                <View style={styles.userInfo}>
                    <View style={styles.userInfoContainer}>
                        <View style={styles.userInfoHeader}>
                            <Text style={styles.userInfoHeaderText}>
                                USERNAME
                            </Text>
                        </View>
                        <TextInput 
                            style={styles.userInfoInput}
                            onChangeText={(e)=>user.setUsername(e)}
                            placeholder={"ajiaron"}
                            placeholderTextColor={'white'}
                            value={user.username}/>
                    </View>
                    <View style={[styles.userInfoContainer, {marginTop:2}]}>
                        <View style={styles.userInfoHeader}>
                            <Text style={styles.userInfoHeaderText}>
                                NAME
                            </Text>
                        </View>
                        <TextInput 
                            style={styles.userInfoInput}
                            onChangeText={(e)=>setNewName(e)}
                            placeholder={"Aaron Jiang"}
                            placeholderTextColor={'white'}
                            value={newName}/>
                    </View>
                    <View style={[styles.userInfoContainer, {marginTop:2}]}>
                        <View style={styles.userInfoHeader}>
                            <Text style={styles.userInfoHeaderText}>
                                DESCRIPTION
                            </Text>
                        </View>
                        <TextInput 
                            style={styles.userInfoInput}
                            onChangeText={(e)=>setNewDescription(e)}
                            placeholder={"I'm about writing apps and running laps"}
                            placeholderTextColor={'white'}
                            value={newDescription}/>
                    </View>
                    <View style={[styles.userInfoContainer, {marginTop:2}]}>
                        <View style={styles.userInfoHeader}>
                            <Text style={styles.userInfoHeaderText}>
                                EMAIL ADDRESS
                            </Text>
                        </View>
                        <TextInput 
                            style={styles.userInfoInput}
                            onChangeText={(e)=>setNewEmail(e)}
                            placeholder={"aaronjiang2001@gmail.com"}
                            placeholderTextColor={'white'}
                            value={newEmail}/>
                    </View>
                    <View style={styles.publicAccountContainer}>
                        <Text style={styles.userInfoHeaderText}>
                            PUBLIC ACCOUNT
                        </Text>
                        <Switch
                            style={{ transform: [{ scaleX: .6 }, { scaleY: .6}], top:-1, marginLeft:windowW*(4/windowW)}}
                            trackColor={{ false: "#bbb", true: "#35AE92" }}
                            thumbColor={isPublic ? "#1f1e1e" : "1f1e1e"}
                            ios_backgroundColor="#eee"
                            onValueChange={togglePublic}
                            value={isPublic}
                        />
                    </View>
                    <ResetButton user={user}/>
                    <View style={styles.userProfileLinkContainer}>
                    <Icon 
                        style={{transform:[{rotate:"-45deg"}], top:-0.5}}
                        name='insert-link'
                        type='material'
                        color='rgba(178, 178, 178, 1)'
                        size={23}
                    />
                    <Text style={styles.userProfileLink}> milestone.com/aaronjiang2001</Text>
                </View>
                </View>
             
            </View>

            <View style={{position:"absolute", bottom:0}}>
                <Footer/>
            </View>

        </View>
    )
}


const styles = StyleSheet.create({
    settingsPage: {
        backgroundColor: "rgba(28, 28, 28, 1)",
        minWidth:windowW,
        minHeight:windowH,
        overflow:"scroll",
    },
    settingsContainer: {
        alignSelf:"center",
        marginTop:windowH*0.125-16
    },
    profilePicContainer: {
        alignSelf:"center",
        alignItems:"center",
        justifyContent:"center",
    },  
    profilePic: {
        alignSelf:"center",
        height:windowH*(80/windowH),
        width: windowW*(80/windowW),
    },
    changePicText: {
        fontFamily:"InterBold",
        fontSize:12.5,
        color:"#35AE92",
        alignSelf:"center",
        marginTop:0.02*windowH
    },
    userInfo: {
        height: windowH * (348/windowH),
        width:windowW * (288/windowW),
        marginTop:windowH*(26/windowH)
    },
    userInfoContainer: {
        width:windowW * (288/windowW),
        marginBottom:windowH*(16/windowH),
        justifyContent:"flex-start"
    },
    userInfoHeader: {
        left:0,
        alignSelf:"flex-start",
        alignItems:"flex-start",
        marginBottom:windowH*(12/windowH),
        width:windowW * (288/windowW),
    },
    userInfoHeaderText: {
        fontSize:12,
        color:"rgba(191, 191, 191, 1)",
        fontFamily:"InterBold"
    },
    userInfoInput: {
        minWidth:windowW * (288/windowW),
        minHeight: windowH * (28/windowH),
        backgroundColor:"rgba(10, 10, 10, 1)",
        paddingLeft:windowW * (14/windowW),
        paddingRight:windowW * (14/windowW),
        borderRadius:10,
        textAlign:"left",
        alignItems:"center",
        fontSize:12,
        color:"white"
    },
    userInfoText: {
        width:"100%",
        color:"white",
        fontFamily:"Inter",
        fontSize:12
    },
    publicAccountContainer: {
        flexDirection:"row",
        alignItems:"center",
        left:0,
        maxWidth:windowW * (288/windowW),
        height: windowH * (24/windowH),
        marginTop:windowH*(4/windowH),
        marginBottom:windowH*(18/windowH),
    },
    publicAccountToggle: {
        marginLeft:windowW * (18/windowW)
    },
    resetPasswordButton: {
        alignSelf:"center",
        width: windowW*(288/windowW),
        height: windowH*(28/windowH),
        alignItems:"center",
        borderRadius:5,
        textAlign:"center",
        justifyContent:"center",
        backgroundColor:"rgba(0, 82, 63, 1)"
    },
    resetPasswordText: {
        color:"white",
        fontFamily:"InterBold",
        alignSelf:"center",
        fontSize:12.5,
    },
    userProfileLinkContainer: {
        flexDirection:"row",
        width: windowW*(288/windowW),
        alignItems:"center",
        textAlign:"left",
        marginTop:windowH*(18/windowH),
        
    },
    userProfileLink: {
        fontFamily:"InterBold",
        color:"white",
        fontSize:12,
        marginLeft:windowW * (2/windowW)
    
    },
    userProfileLinkIcon: {
        
    }

    
})
export default Settings