import React, {useState, useEffect, useContext} from "react";
import { Text, StyleSheet, View, Image, FlatList, Pressable, TextInput, Switch, Dimensions } from "react-native";
import * as Device from 'expo-device'
import { Icon } from 'react-native-elements'
import { useNavigation } from "@react-navigation/native";
import Footer from './Footer'
import Icons from '../data/Icons.js'
import userContext from '../contexts/userContext'
import axios from 'axios'

const windowW = Dimensions.get('window').width
const windowH = Dimensions.get('window').height

const CreateMilestone = () => {
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [commmentsEnabled, setCommentsEnabled] = useState(true)
    const toggleComments = () => setCommentsEnabled(previousState => !previousState)
    const [likesEnabled, setLikesEnabled] = useState(true)
    const toggleLikes = () => setLikesEnabled(previousState => !previousState)
    const [sharingEnabled, setSharingEnabled] = useState(true)
    const toggleSharing = () => setSharingEnabled(previousState => !previousState)
    return (
        <View style={styles.createMilestonePage}>
            <View style={styles.createMilestoneContainer}>
                <View style={{alignItems:"center", alignSelf:"center", justifyContent:"center"}}>
                    <Image
                        style={styles.milestonePic}
                        resizeMode="cover"
                        source={Icons['defaultmilestone']}/>
                    <Text style={styles.uploadText}>+Upload Photo</Text>
                <View style={styles.milestoneInfo}>

                    <View style={styles.milestoneInfoContainer}>
                        <View style={styles.milestoneInfoHeader}>
                            <Text style={styles.milestoneInfoHeaderText}>
                                TITLE
                            </Text>
                        </View>
                        <TextInput 
                            style={styles.milestoneInfoInput}
                            onChangeText={(e)=>setTitle(e)}
                            placeholder={"Add a title for your new Milestone Habit"}
                            placeholderTextColor={'white'}
                            value={title}/>
                    </View>

                    <View style={styles.milestoneDescriptionContainer}>
                        <View style={styles.milestoneInfoHeader}>
                            <Text style={styles.milestoneInfoHeaderText}>
                                DESCRIPTION
                            </Text>
                        </View>
                        <TextInput 
                            multiline
                            blurOnSubmit
                            style={(windowH > 900)?styles.milestoneDescriptionInputLarge:styles.milestoneDescriptionInput}
                            onChangeText={(e)=>setDescription(e)}
                            placeholder={"Add a description..."}
                            placeholderTextColor={'white'}
                            value={description}/>
                    </View>

                    <View style={styles.milestonePermissionContainer}>
                        <View style={styles.milestoneInfoHeader}>
                            <Text style={styles.milestoneInfoHeaderText}>
                                PERMISSIONS
                            </Text>
                        </View>
                        <View style={styles.milestonePermission}>
                            <Text style={[styles.milestonePermissionText, 
                                {marginLeft:2, alignSelf:"center"}]}>Who can post to this Milestone?</Text>
                            <View style={(windowW>400)?styles.milestonePermissionOptionsLarge:styles.milestonePermissionOptions}>  
                                <Text style={styles.optionsText}>{windowW>400?`Friends Only`:`Friends`}</Text>
                                <Icon 
                                    style={{right:0, top:windowW>400?1.5:2.5}}
                                    name="expand-more"
                                    color="white"
                                    size={windowW>400?20:18}
                                />
                            </View>
                        </View>
                        <View style={[styles.milestonePermission, {marginTop:(windowH>900)?12:8}]}>
                            <Text style={[styles.milestonePermissionText, 
                                {marginLeft:2, alignSelf:"center"}]}>Who can view this Milestone?</Text>
                            <View style={(windowW>400)?styles.milestonePermissionOptionsLarge:styles.milestonePermissionOptions}>  
                                <Text style={[styles.optionsText,{left:windowW>400?0:-1}]}>{windowW>400?`Only You`:`Only You`}</Text>
                                <Icon 
                                    style={{right:0, top:windowW>400?1.5:2.5}}
                                    name="expand-more"
                                    color="white"
                                    size={windowW>400?20:18}
                                />
                            </View>
                        </View>
                        
                        <View style={styles.switchContainer}>
                            <View style={{flexDirection:"row"}}>
                                <Text style={[styles.switchText, {bottom:(windowW>400)?0:0.5}]}>Comments</Text>
                                <Switch
                                    style={{ transform: (windowW > 400)?[{ scaleX: .5 }, { scaleY: .5 }]:[{ scaleX: .45 }, { scaleY: .45 }]}}
                                    trackColor={{ false: "#bbb", true: "#35AE92" }}
                                    thumbColor={commmentsEnabled ? "#1f1e1e" : "1f1e1e"}
                                    ios_backgroundColor="#fff"
                                    onValueChange={toggleComments}
                                    value={commmentsEnabled}
                                />
                            </View>
                            <View style={{flexDirection:"row"}}>
                                <Text style={[styles.switchText, {bottom:(windowW>400)?0:0.5}]}>Likes</Text>
                                <Switch
                                    style={{ transform: (windowW > 400)?[{ scaleX: .5 }, { scaleY: .5 }]:[{ scaleX: .45 }, { scaleY: .45 }]}}
                                    trackColor={{ false: "#bbb", true: "#35AE92" }}
                                    thumbColor={likesEnabled ? "#1f1e1e" : "1f1e1e"}
                                    ios_backgroundColor="#fff"
                                    onValueChange={toggleLikes}
                                    value={likesEnabled}
                                />
                            </View>
                            <View style={{flexDirection:"row"}}>
                                <Text style={[styles.switchText, {bottom:(windowW>400)?0:0.5}]}>Sharing</Text>
                                <Switch
                                    style={{ transform: (windowW > 400)?[{ scaleX: .5 }, { scaleY: .5 }]:[{ scaleX: .45 }, { scaleY: .45 }]}}
                                    trackColor={{ false: "#bbb", true: "#35AE92" }}
                                    thumbColor={sharingEnabled ? "#1f1e1e" : "1f1e1e"}
                                    ios_backgroundColor="#fff"
                                    onValueChange={toggleSharing}
                                    value={sharingEnabled}
                                />
                            </View>
                        </View>
                                     
                        <View style={[styles.milestoneInfoHeader, {marginTop:14}]}>
                            <Text style={styles.milestoneInfoHeaderText}>
                                DURATION
                            </Text>
                        </View>
                        <View style={[styles.milestonePermission, {marginTop:(windowH>900)?2:0}]}>
                            <Text style={[styles.milestonePermissionText, 
                                {marginLeft:2, alignSelf:"center"}]}>How long will this last?</Text>
                            <View style={(windowW>400)?styles.milestonePermissionOptionsLarge:styles.milestonePermissionOptions}>  
                                <Text style={[styles.optionsText,{left:windowW>400?0:-1}]}>{windowW>400?`Until Tomorrow`:`Next Day`}</Text>
                                <Icon 
                                    style={{right:0, top:windowW>400?1.5:2.5}}
                                    name="expand-more"
                                    color="white"
                                    size={windowW>400?20:18}
                                />
                            </View>
                        </View>    
                    </View>

                </View>
                                
                    <View style={[styles.buttonContainer]}>
                        <Pressable>
                            <View style={styles.saveButtonContainer}>
                                <Text style={styles.saveButtonText}>Archive</Text>
                            </View>
                        </Pressable>
                        <Pressable>
                        <View style={styles.publishButtonContainer}>
                            <Text style={styles.publishButtonText}>Publish</Text>
                        </View>
                        </Pressable>
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
    createMilestonePage: {
        backgroundColor: "rgba(28, 28, 28, 1)",
        minWidth:windowW,
        minHeight:windowH,
        overflow:"scroll",
    },
    createMilestoneContainer: {
        alignSelf:"center",
        marginTop:windowH*0.12,
        minWidth:windowW*0.785
    },
    milestonePic: {
        width: windowW * (86/windowW),
        height: windowH * (86/windowH),
        alignSelf:"center",
        borderRadius:5,
        marginBottom:windowH *(10/windowH)
    },
    uploadText: {
        fontFamily:"InterBold",
        fontSize:12,
        right:2,
        color:"rgba(53, 174, 146, 1)",
        alignSelf:"center"
    },
    milestoneInfo: {
        minWidth:windowW*0.785
    },
    milestoneInfoContainer: {
        width:windowW * 0.785,
        marginTop:windowH*(10/windowH),
        marginBottom:windowH*(10/windowH),
        justifyContent:"flex-start"
    },
    milestoneDescriptionContainer: {
        width:windowW * 0.785,
        marginTop:windowH*(6/windowH),
        marginBottom:windowH*(10/windowH),
        justifyContent:"flex-start"
    },
    milestonePermissionContainer: {
        width:windowW * 0.785,
        marginTop:windowH*(8/windowH),
        marginBottom:windowH*(10/windowH),
        justifyContent:"flex-start"
    },
    milestoneInfoHeader: {
        left:2,
        alignSelf:"flex-start",
        alignItems:"flex-start",
        marginBottom:windowH*(8/windowH),
        width:windowW * 0.785,
    },
    milestoneInfoHeaderText: {
        fontSize:11.5,
        color:"rgba(191, 191, 191, 1)",
        fontFamily:"InterBold"
    },
    milestoneInfoInput: {
        minWidth:windowW*0.785,
        minHeight: windowH * (30/windowH),
        paddingTop:1,
        backgroundColor:"rgba(10, 10, 10, 1)",
        paddingLeft:windowW * (14/windowW),
        paddingRight:windowW * (14/windowW),
        borderRadius:10,
        textAlign:"left",
        fontFamily:"Inter",
        fontSize:12,
        color:"white"
    },
    milestoneDescriptionInputLarge: {
        minWidth:windowW*0.785,
        minHeight:windowH * (120/windowH),
        paddingTop:windowH * (12/windowH),
        paddingBottom:windowH * (12/windowH),
        backgroundColor:"rgba(10, 10, 10, 1)",
        paddingLeft:windowW * (14/windowW),
        paddingRight:windowW * (14/windowW),
        borderRadius:10,
        textAlign:"left",
        alignItems:"flex-start",
        fontFamily:"Inter",
        fontSize:12,
        color:"white"
    },
    milestoneDescriptionInput: {
        minWidth:windowW*0.785,
        minHeight:windowH * (80/windowH),
        paddingTop:windowH * (10/windowH),
        paddingBottom:windowH * (10/windowH),
        backgroundColor:"rgba(10, 10, 10, 1)",
        paddingLeft:windowW * (14/windowW),
        paddingRight:windowW * (14/windowW),
        borderRadius:10,
        textAlign:"left",
        alignItems:"flex-start",
        fontFamily:"Inter",
        fontSize:12,
        color:"white"
    },
    milestonePermission: {
        flexDirection:"row",

        marginTop:windowH*(2/windowH),
        justifyContent:"space-between",
        minWidth:windowW*0.785,
        minHeight:windowH*(20/windowH)
    },
    milestonePermissionOptionsLarge: {
        backgroundColor:"rgba(10,10,10,1)",
        borderRadius:5,
        top:0,
        minHeight: windowH * (22/windowH),
        width: windowW * 0.3,
        paddingLeft:12,
        paddingRight:8,
        flexDirection:"row",
        justifyContent:"space-between",
        alignSelf:"flex-end"
    },
    milestonePermissionOptions: {
        backgroundColor:"rgba(10,10,10,1)",
        borderRadius:5,
        top:0,
        minHeight: windowH * (22/windowH),
        width: windowW * 0.25,
        paddingLeft:12,
        paddingRight:8,
        flexDirection:"row",
        justifyContent:"space-between",
        alignSelf:"flex-end"
    },
    milestonePermissionText: {
        color:"rgba(255, 255, 255, 1)",
        fontSize:11.5,
        alignSelf:"flex-start"
    },
    optionsText: {
        color:"white",
        fontFamily:"Inter",
        alignSelf:"center",
        fontSize:11,
        left:0,
        top:0.5

    },
    switchContainer: {
        minWidth:windowW*0.8,
        maxHeight:windowH * 0.016,
        flexDirection:"row",
        justifyContent:"space-between",
        alignItems:"center",
        marginTop:windowH*0.025,
        marginBottom:windowH*0.01,
        left:2
    },
    switchText: {
        fontFamily:"Inter",
        fontSize:11.5,
        color:"white",
        alignSelf:"center"
    },
    buttonContainer: {
        alignItems:"center",
        alignSelf:"center",
        justifyContent:"space-between",
        minHeight:windowH*0.08,
        minWidth: windowW*0.785,
        marginTop:windowH*0.015
    },
    saveButtonContainer: {
        minWidth:windowW * 0.8,
        minHeight: windowH * 0.0375,
        backgroundColor:"rgba(10, 10, 10, 1)",
        borderRadius:4,
        justifyContent:"center"
    },
    saveButtonText: {
        fontFamily:"InterBold",
        fontSize:13.5,
        color:"white",
        alignSelf:"center"
    },
    publishButtonContainer: {
        minWidth:windowW * 0.795,
        minHeight: windowH * 0.035,
        backgroundColor:"rgba(0, 82, 63, 1)",
        borderRadius:4,
        justifyContent:"center"
    },
    publishButtonText: {
        fontFamily:"InterBold",
        fontSize:13.5,
        color:"white",
        alignSelf:"center"
    },

})
export default CreateMilestone