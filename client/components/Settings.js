import React, {useState, useEffect, useContext} from "react";
import { Text, StyleSheet, View, Image, ScrollView, Pressable, TextInput, Switch, Dimensions, KeyboardAvoidingView, Alert } from "react-native";
import * as Device from 'expo-device'
import { Icon } from 'react-native-elements'
import * as ImagePicker from 'expo-image-picker'
import { useNavigation } from "@react-navigation/native";
import Footer from './Footer'
import Icons from '../data/Icons.js'
import AsyncStorage from '@react-native-async-storage/async-storage';
import MilestoneTag from "./MilestoneTag";
import userContext from '../contexts/userContext'
import FastImage from "react-native-fast-image";
import axios from 'axios'
import { Amplify, Auth, Storage } from 'aws-amplify';

import awsconfig from '../src/aws-exports';
Amplify.configure(awsconfig);

const windowW = Dimensions.get('window').width
const windowH = Dimensions.get('window').height

const Settings = () => {
    const user = useContext(userContext)
    var fileExt = (user.image !== undefined)?user.image.toString().split('.').pop():'png';
    const [isPublic, setIsPublic] = useState(true)
    const togglePublic = () => setIsPublic(previousState => !previousState)
    const toggleQuality = () => user.setQuality(!user.quality)
    const [newUsername, setNewUsername] = useState(user?user.username:'')
    const [newName, setNewName] = useState(user?user.fullname:'')
    const [oldDescription, setOldDescription] = useState('')
    const [newDescription, setNewDescription] = useState('')
    const [oldEmail, setOldEmail] = useState('')
    const [newEmail, setNewEmail] = useState('')
    const [oldImage, setOldImage] = useState(user?user.image:'defaultpic')
    const [preview, setPreview] = useState(false)
    const [image, setImage] = useState(user?user.image:'defaultpic')
    const [file, setFile] = useState('')
    const [loading, setLoading] = useState(false)
    const [progress, setProgress] = useState(0)
    const navigation = useNavigation()
    const fetchContent = async (uri) => {
        setLoading(true)
        const response = await fetch(uri)
        const blob = await response.blob()
        return blob
    }
    const handleChanges = async () => {
        const content = await fetchContent(image)
        if (oldImage === image) {
            axios.put(`http://${user.network}:19001/api/updateuser`, 
            {username: newUsername, description: newDescription, email:newEmail, fullname: newName, 
            src:image, userid:user.userId})
            .then(() => {
                console.log('user info updated')
                setLoading(false)
                navigation.navigate("Profile", {id:user.userId})
            })
            .catch((error)=> console.log(error))
        }
        else {
            return Storage.put(`post-content-${Math.random()}.jpg`, content, {
                level:'public',
                contentType: 'image',
                progressCallback(uploadProgress) {
                    setProgress(Math.round((uploadProgress.loaded/uploadProgress.total)*100))
                    console.log('progress --',uploadProgress.loaded+'/'+uploadProgress.total)
                }
            }).then((res)=> {
                setFile(`https://d2g0fzf6hn8q6g.cloudfront.net/public/${res.key}`)
                console.log('result ---',`https://d2g0fzf6hn8q6g.cloudfront.net/public/${res.key}`)
                user.setImage(`https://d2g0fzf6hn8q6g.cloudfront.net/public/${res.key}`)    // TODO: convert image uri and store into S3
                axios.put(`http://${user.network}:19001/api/updateuser`, 
                {username: newUsername, description: newDescription, email:newEmail, fullname: newName, 
                src:`https://d2g0fzf6hn8q6g.cloudfront.net/public/${res.key}`, userid:user.userId})
                .then(() => {
                    console.log('user info updated')
                    setLoading(false)
                    navigation.navigate("Profile", {id:user.userId})
                })
                .catch((error)=> console.log(error))  
            })
        }
    }
    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing:true,
            quality:1,
        })
        if (!result.canceled) {
            setImage(result.assets[0].uri)
        }
    }
    
    const handleSignOut = async() => {
        try {
            await Auth.signOut()
            user.setLogged(false)
            navigation.navigate("Landing")
        } catch(e) {
            Alert.alert("An error occured.", e.message)
        }
    }
    useEffect(()=> {
        axios.get(`http://${user.network}:19001/api/getusers`)
        .then((response)=> {
            setNewDescription(response.data.filter((item)=> item.id === user.userId)[0].blurb)
            setNewEmail(response.data.filter((item)=> item.id === user.userId)[0].email)
        })
    }, [])
    useEffect(()=> {
        setPreview(image)
    }, [image])
    return (
        <View style={styles.settingsPage}>
            <KeyboardAvoidingView
                style={{flex:1}}
                behavior={Platform.OS === "ios" ? "padding" : null}
                keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={styles.settingsContainer}>
                        <View styles={styles.profilePicContainer}>
                            {(!preview)&&(fileExt !== 'jpg'|| fileExt !== 'png' || fileExt !== 'jpeg' || user.image === undefined)?
                            <Icon
                                style={{bottom:-8}}
                                name='face'
                                color='white'
                                size={100} 
                            />:
                            <Pressable onPress={()=>console.log(image)}>
                            {
                            (!user.isExpo)?
                            <FastImage
                                style={{width:windowW*(94/windowW), height:windowH*(94/windowH), alignSelf:"center", borderRadius:94}}
                                resizeMode={FastImage.resizeMode.contain}
                                defaultSource={require("../assets/profile-pic-empty.png")}
                                source={{
                                    uri:image,
                                    priority: FastImage.priority.normal
                                }}
                            />
                            :
                            <Image
                                style={{width:windowW*(94/windowW), height:windowH*(94/windowH), alignSelf:"center", borderRadius:94}}
                                resizeMode="contain"
                                defaultSource={require("../assets/profile-pic-empty.png")}
                                source={{uri:image}}
                            />
                                }
                            </Pressable>
                            }
                            <Pressable onPress={pickImage}>
                                <Text style={styles.changePicText}>Change Profile Picture</Text>
                            </Pressable>
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
                                    onChangeText={(e)=>setNewUsername(e)}
                                    placeholder={user.username}
                                    placeholderTextColor={'rgba(221, 221, 221, 1)'}
                                    value={newUsername}/>
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
                                    placeholder={user.fullname}
                                    placeholderTextColor={'rgba(221, 221, 221, 1)'}
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
                                    placeholder={oldDescription}
                                    placeholderTextColor={'rgba(221, 221, 221, 1)'}
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
                                    placeholder={oldEmail}
                                    placeholderTextColor={'rgba(221, 221, 221, 1)'}
                                    value={newEmail}/>
                            </View>
                            <View style={styles.publicAccountContainer}>
                                <Text style={styles.userInfoHeaderText}>
                                    PUBLIC ACCOUNT
                                </Text>
                                <Switch
                                    style={{ transform: [{ scaleX: .6 }, { scaleY: .6}], top:-1, marginLeft:windowW*(4/windowW)}}
                                    trackColor={{ false: "#bbb", true: "#35AE92" }}
                                    thumbColor={isPublic ? "#1f1e1e" : "#1f1e1e"}
                                    ios_backgroundColor="#eee"
                                    onValueChange={togglePublic}
                                    value={isPublic}
                                />
                               
                            </View>
                            <View style={[styles.qualityContainer]}>
                                <Text style={styles.userInfoHeaderText}>
                                    REDUCED RENDERING
                                </Text>
                                <Switch
                                    style={{ transform: [{ scaleX: .6 }, { scaleY: .6}], top:-1, marginLeft:windowW*(4/windowW)}}
                                    trackColor={{ false: "#bbb", true: "#35AE92" }}
                                    thumbColor={user.quality ? "#1f1e1e" : "#1f1e1e"}
                                    ios_backgroundColor="#eee"
                                    onValueChange={toggleQuality}
                                    value={user.quality}
                                />
                               
                            </View>
                            <Pressable onPress={handleChanges}
                                style={styles.saveChangesButton}
                                >
                                <View style={styles.resetButtonContent} > 
                                    <Text style={[styles.saveChangesText]}>
                                        {(loading)?`Loading... ${progress}%`:"Save Changes"}
                                    </Text>
                                </View>
                            </Pressable>

                            <Pressable onPress={handleSignOut}
                                style={styles.logoutButton}
                                >
                                <View style={styles.resetButtonContent} > 
                                    <Text style={[styles.logoutText]}>
                                        Logout
                                    </Text>
                                </View>
                            </Pressable>

                            <View style={styles.userProfileLinkContainer}>
                                <Icon 
                                    style={{transform:[{rotate:"-45deg"}], top:-0.5}}
                                    name='insert-link'
                                    type='material'
                                    color='rgba(178, 178, 178, 1)'
                                    size={23}
                                />
                                <Text style={styles.userProfileLink}> {`milestone.com/${user.username}`}</Text>
                            </View>
                        </View>
                    </View>
                    </ScrollView>
                </KeyboardAvoidingView>
            <Footer/>
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
    settingsContent: {
        backgroundColor: "rgba(28, 28, 28, 1)",
        minWidth:windowW,
        minHeight:windowH-76,
        overflow:"scroll",
    },
    settingsContainer: {
        alignSelf:"center",
        marginTop:windowH*0.125-26,
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
        marginTop:windowH*(22/windowH)
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
        height: windowH * (20/windowH),
        marginTop:windowH*(4/windowH),
        marginBottom:windowH*(16/windowH),
    },
    qualityContainer: {
        flexDirection:"row",
        alignItems:"center",
        left:0,
        maxWidth:windowW * (288/windowW),
        height: windowH * (20/windowH),
        marginBottom:windowH*(20/windowH),
    },
    publicAccountToggle: {
        marginLeft:windowW * (18/windowW)
    },
    saveChangesButton: {
        alignSelf:"center",
        width: windowW*(288/windowW),
        height: windowH*(28/windowH),
        alignItems:"center",
        borderRadius:5,
        textAlign:"center",
        justifyContent:"center",
        backgroundColor:"rgba(0, 82, 63, 1)"
    },
    logoutButton: {
        marginTop:14,
        alignSelf:"center",
        width: windowW*(288/windowW),
        height: windowH*(28/windowH),
        alignItems:"center",
        borderRadius:5,
        borderStyle:"dashed",
        textAlign:"center",
        borderColor:"#eeeeee",
        borderWidth:1,
        justifyContent:"center",
        backgroundColor:"rgba(16,16,16,1)"
    },
    saveChangesText: {
        color:"white",
        fontFamily:"InterBold",
        alignSelf:"center",
        fontSize:12.5,
    },
    logoutText: {
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
    
})
export default Settings