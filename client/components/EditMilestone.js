import React, { useState, useEffect, useContext, useRef } from "react";
import { Animated, Text, StyleSheet, View, Image, FlatList, Pressable, TextInput, Switch, Dimensions, TouchableOpacity, Alert } from "react-native";
import * as Device from 'expo-device'
import { Icon } from 'react-native-elements'
import { useNavigation, useRoute } from "@react-navigation/native";
import Navbar from "./Navbar";
import Footer from './Footer'
import Icons from '../data/Icons.js'
import userContext from '../contexts/userContext'
import axios from 'axios'
import { ScrollView } from "react-native-gesture-handler";
import pushContext from "../contexts/pushContext";
import * as ImagePicker from 'expo-image-picker'
import DatePicker from 'react-native-date-picker';
import { Amplify, Storage } from 'aws-amplify';
import awsconfig from '../src/aws-exports';

Amplify.configure(awsconfig);

const windowW = Dimensions.get('window').width
const windowH = Dimensions.get('window').height

const DropdownPermission = ({permission, setPermission, permisisonList}) => {
    const user = useContext(userContext)
    const [toggled, setToggled] = useState(false)
    const animatedvalue = useRef(new Animated.Value(0)).current;
    const [selectedDate, setSelectedDate] = useState(new Date())
    const [toggleDate, setToggleDate] = useState(false)
    const [confirmed, setConfirmed] = useState(false)   // unused; set in date picker
    const slidedown = () => {
        setToggled(true)
        Animated.timing(animatedvalue,{
            toValue:windowH*(88/windowH),
            duration:300,
            useNativeDriver:false,
        }).start()
    }
    const slideup = () => {
        Animated.timing(animatedvalue,{
            toValue:0,
            duration:300,
            useNativeDriver:false,
            
        }).start(() => setToggled(false))
    }
    function handleToggle() { 
        if (!toggled) {
            slidedown()
        } else {
            slideup()
        }
    }
    function handleSelect(e, id) {
        if (e !== "Custom") {
            setPermission(e)
            console.log(e)
        } 
        else {
            setToggleDate(true)
            console.log(selectedDate)
        }
    }
    const renderOption = ({item,id}) => {
        return (
            <TouchableOpacity 
            style={[(windowW>400)?styles.dropdownPermissionsLarge:styles.dropdownPermissionOptions,
                 {borderBottomLeftRadius:(item.id === permisisonList.length)?5:0,
                  borderBottomRightRadius:(item.id === permisisonList.length)?5:0}]}
            onPress={() => handleSelect(item, id)}
          >  
                <Text style={styles.optionsText}>{item}</Text>
            </TouchableOpacity>
        )
    }
    return (
        <View>
            <TouchableOpacity onPress={handleToggle}
                style={[(windowW>400)?styles.milestonePermissionOptionsLarge:styles.milestonePermissionOptions,
                {borderBottomLeftRadius:(toggled)?0:5,
                borderBottomRightRadius:(toggled)?0:5}]}
            >  
                <Text style={styles.optionsText}>{permission}</Text>
                <Icon 
                    style={{right:0, top:windowW>400?1.5:2.5}}
                    name="expand-more"
                    color="white"
                    size={windowW>400?20:18}
                />
            </TouchableOpacity>
            {toggled?
            <Animated.View style={[{maxHeight:animatedvalue}]}>
                <ScrollView horizontal={true} scrollEnabled={false}>
                    <FlatList
                        scrollEnabled={false}
                        style={{maxWidth:(windowW>400)?windowW * 0.3:windowW*0.25, borderBottomLeftRadius:5,
                        borderBottomRightRadius:5}}
                        data={permisisonList.filter((item)=>item != permission)}
                        renderItem={renderOption}
                        keyExtractor={(item, index)=>{return index.toString()}}
                    />
                </ScrollView>
            </Animated.View>
            :null}
            <DatePicker
                useNativeDriver={false}
                modal
                theme = "dark"
                date={selectedDate}
                mode="date"
                title={"How long should your milestone take?"}
                open={toggleDate && !user.isExpo}
                onConfirm = {(selectedDate)=> {
                    setToggleDate(false)
                    setConfirmed(true)
                    setSelectedDate(selectedDate)
                    setPermission(selectedDate.toLocaleDateString('en-US',{month:'short', day:'numeric',year:'numeric'}))
                }}
                onCancel={()=> {
                    setToggleDate(false)
                }}
                minimumDate={new Date(+new Date() + 86400000)}
            />
        </View>
    )
}

const EditMilestone = ({route}) => {
    const permissionList = ['Everyone', 'Friends', 'Groups', 'Only You']
    const durationListLarge = ['Until Tomorrow', 'Next Month', 'Indefinitely', 'Custom']
    const durationList = ['Next Day', '1 Month', 'Indefinitely', 'Custom']
    const user = useContext(userContext)
    const push = useContext(pushContext)
    const routes = useRoute()
    const navigation = useNavigation();
    const [originalImage, setOriginalImage] = useState()
    const [image, setImage] = useState((route.params.src !== undefined)?route.params.src:null)
    const [photoUri, setPhotoUri] = useState()
    const [title, setTitle] = useState((route.params.title !== undefined)?route.params.title:'')
    const [description, setDescription] = useState((route.params.description !== undefined)?route.params.description:'')
    const [commmentsEnabled, setCommentsEnabled] = useState(true)
    const toggleComments = () => setCommentsEnabled(previousState => !previousState)
    const [likesEnabled, setLikesEnabled] = useState(true)
    const toggleLikes = () => setLikesEnabled(previousState => !previousState)
    const [sharingEnabled, setSharingEnabled] = useState(true)
    const toggleSharing = () => setSharingEnabled(previousState => !previousState)
    const [postPermission, setPostPermission] = useState((route.params.postable !== undefined)?route.params.postable:'Everyone')
    const [viewPermission, setViewPermission] = useState((route.params.viewable !== undefined)?route.params.viewable:'Everyone')
    const [duration, setDuration] = useState((route.params.duration !== undefined)?route.params.duration:null)
    const [loading, setLoading] = useState(false)
    const scrollY = useRef(new Animated.Value(0)).current;
    const [progress, setProgress] = useState(0)
    var fileExt = (image !== undefined)?image.toString().split('.').pop():'calender'
    const DeleteAlert = () => {
        return new Promise((resolve, reject) => {
            Alert.alert('Delete Milestone?', 'You won\'t be able to restore this post after it is deleted.', [{
                text:'Cancel',
                onPress: () => resolve(false),
                style: 'cancel'
            },
            {
                text:"Delete",
                onPress: () => resolve(true),
                style:{fontFamily:"Inter", color:"red"}
            }
            ], {cancelable:false})
        })
    }
    function deleteMilestone() {
        axios.delete(`http://${user.network}:19001/api/deletemilestone`, {data: {milestoneid:route.params.id}})
        .then((response)=> console.log("milestone deleted")).catch(error=>console.log(error))
        axios.delete(`http://${user.network}:19001/api/removelinkedposts`, {data: {milestoneid:route.params.id}})
        .then((response)=>console.log("links removed")).catch(error=>console.log(error))
    }
    function handlePress() {
        DeleteAlert().then((resolve)=> {
            if (resolve) {
                  deleteMilestone()
                  navigation.navigate("Feed")
            }}
        )
    }
    function handleDate() {
        const now = (duration !== "Indefinitely" && duration !== "1 Month" && duration !== "Next Day")?
        new Date(duration).toISOString():new Date()
        const currentTime = new Date().toLocaleTimeString('en-US', { hour12: false });
        const modifiedISOString = (duration === "1 Month")?
        `${new Date(now.getFullYear(), now.getMonth()+1, now.getDate()).toISOString().substr(0, 11)}`+
        `${currentTime}${new Date(now.getFullYear(), now.getMonth()+1, now.getDate()).toISOString().substr(19, 5)}`
        :(duration === "Next Day")?
        `${new Date(now.getFullYear(), now.getMonth(), now.getDate()+1).toISOString().substr(0, 11)}`+
        `${currentTime}${new Date(now.getFullYear(), now.getMonth(), now.getDate()+1).toISOString().substr(19, 5)}`:
        (duration !== "Indefinitely")?
        `${now.substr(0, 11)}${currentTime}${now.substr(19, 5)}`:null
        return modifiedISOString
    }
    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing:true,
            quality:1,
        })
        if (!result.canceled) {
            setImage(result.assets[0].uri)
            setPhotoUri(result.assets[0].uri)
        }
    }
    function handleSelection() {
        pickImage()
    }
    const fetchContent = async (uri) => {
        setLoading(true)
        const response = await fetch(uri)
        const blob = await response.blob()
        return blob
    }
    const uploadContent = async (uri) => {
        const content = await fetchContent(uri)
        return Storage.put(`milestone-content-${Math.random()}.${image.substring(image.indexOf('.')+1)}`, content, {
            level:'public',
            contentType: 'image',
            progressCallback(uploadProgress) {
                setProgress(Math.round((uploadProgress.loaded/uploadProgress.total)*100))
                console.log('progress --',uploadProgress.loaded+'/'+uploadProgress.total)
            }
        })
        .then((res)=> {
            const modifiedISOString = handleDate()
            console.log('result ---',`https://d2g0fzf6hn8q6g.cloudfront.net/public/${res.key}`)
            axios.put(`http://${user.network}:19001/api/updatemilestone`, 
            {milestoneid: route.params.id, title: title, description:description,
            src:`https://d2g0fzf6hn8q6g.cloudfront.net/public/${res.key}`, postable:postPermission, viewable:viewPermission,
            duration:modifiedISOString})
            .then(() => {
                console.log('milestone updated')
                setLoading(false)
                navigation.navigate("Feed")
            })
            .catch((error)=> console.log(error))
        })
        .catch((e)=>console.log(e))
    }
    function submitMilestone() {
       if (image !== originalImage) {
        uploadContent(image)
       }
       else {
        const modifiedISOString = handleDate()
        axios.put(`http://${user.network}:19001/api/updatemilestone`, 
        {milestoneid: route.params.id, title: title, description:description, 
        src:image, postable:postPermission, viewable:viewPermission, duration:modifiedISOString})
        .then(() => {
            console.log('milestone updated')
            setLoading(false)
            navigation.navigate("Feed")
        })
        .catch((error)=> console.log(error))
       }
    }
    useEffect(()=> {
        setOriginalImage((route.params.src !== undefined)?route.params.src:null)
    }, [routes])
    function handleTest() {
        const modifiedISOString = handleDate()
        console.log(modifiedISOString)
       // push.cancelScheduledNotification('35af2a30-21be-42dd-af19-8d1978874c2d')
    }
    return (
        <View style={styles.createMilestonePage}>
            <Navbar title={'milestone'} scrollY={scrollY}/>
            <ScrollView nestedScrollEnabled={true} showsVerticalScrollIndicator={false}>
                <View style={styles.createMilestoneContainer}>
                    <View style={{alignItems:"center", alignSelf:"center", justifyContent:"center"}}>
                        <Image
                            style={styles.milestonePic}
                            resizeMode="cover"
                            source={(fileExt==='jpg' || fileExt==='png')?{uri:image}:(image !== undefined)?Icons[image]:Icons['defaultmilestone']}/>
                        <Pressable onPress={handleSelection}>
                            <Text style={styles.uploadText}>+Upload Photo</Text>
                        </Pressable>
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
                                <DropdownPermission permission={postPermission} setPermission={setPostPermission} 
                                permisisonList={(windowW>400)?permissionList:permissionList}/>
                            </View>
                            <View style={[styles.milestonePermission, {marginTop:(windowH>900)?12:8}]}>
                                <Text style={[styles.milestonePermissionText, 
                                    {marginLeft:2, alignSelf:"center"}]}>Who can view this Milestone?</Text>
                                <DropdownPermission permission={viewPermission} setPermission={setViewPermission}
                                permisisonList={(windowW>400)?permissionList:permissionList}/>
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
                                <Pressable onPress={handleTest}>
                                    <Text style={styles.milestoneInfoHeaderText}>
                                        DURATION
                                    </Text>
                                </Pressable>
                            </View>
                            <View style={[styles.milestonePermission, {marginTop:(windowH>900)?2:0}]}>
                                <Text style={[styles.milestonePermissionText, 
                                    {marginLeft:2, alignSelf:"center"}]}>How long will this last?</Text>
                            <DropdownPermission permission={(duration === null)?"Indefinitely":
                            (duration === "Indefinitely"||duration === "Next Day"||duration === "1 Month")?
                            duration:
                            new Date(duration).toLocaleDateString('en-US',{month:'short', day:'numeric',year:'numeric'})}
                            setPermission={setDuration}
                            permisisonList={durationList}/>
                            </View>    
                        </View>
                    </View>            
                        <View style={[styles.buttonContainer]}>
                            <Pressable onPress={handlePress}>
                                <View style={styles.deleteButtonContainer}>
                                    <Text style={[styles.deleteButtonText, {fontSize:(windowW>400)?14:13, top:(windowH>900)?0:0.5}]}>Delete Milestone</Text>
                                </View>
                            </Pressable>
                            <Pressable onPress={submitMilestone}>
                            <View style={styles.publishButtonContainer}>
                                <Text style={[styles.publishButtonText, {fontSize:(windowW>400)?14:13, top:(windowH>900)?0:0.5}]}>{(loading)?`Loading... ${progress}%`:"Save Changes"}</Text>
                            </View>
                            </Pressable>
                        </View>
                    </View>
                </View>
            </ScrollView>
            <Footer/>
        </View>
    )
}


const styles = StyleSheet.create({
    createMilestonePage: {
        backgroundColor: "rgba(28, 28, 28, 1)",
        width:windowW,
        height:windowH+300,
        overflow:"scroll",
        paddingBottom:300,
    },
    createMilestoneContainer: {
        alignSelf:"center",
        marginTop:windowH*0.15,
        marginBottom:windowH*0.06,
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
    dropdownPermissionsLarge: {
        backgroundColor:"rgba(10,10,10,1)",
        paddingHorizontal:0,
        height: windowH * (22/windowH),
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
    dropdownPermissionOptions: {
        backgroundColor:"rgba(10,10,10,1)",
        top:0,
        height: windowH * (22/windowH),
        width: windowW * 0.25,
        paddingLeft:12,
        paddingRight:8,
        flexDirection:"row",
        justifyContent:"space-between",
        alignSelf:"flex-end"
    },
    dropdownItem: {
        backgroundColor:"red",
        height: windowH * (22/windowH),
        zIndex:-1,
        paddingVertical:0, 
        overflow:'visible',
        borderRadius:5
    },
    milestonePermissionText: {
        color:"rgba(255, 255, 255, 1)",
        fontSize:11.5,
        alignSelf:"flex-start",
    },
    optionsText: {
        color:"white",
        fontFamily:"Inter",
        alignSelf:"center",
        fontSize:11,
        left:0,
    },
    dropdownOptionsText: {
        color:"white",
        fontFamily:"Inter",
        bottom:10,
        fontSize:11,
        left:0,
        alignSelf:"flex-start",
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
        minHeight:windowH*0.0785,
        minWidth: windowW*0.785,
        marginTop:windowH*0.02
    },
    deleteButtonContainer: {
        shadowColor: '#000',
        shadowOffset: {
        width: 0,
        height: 2,
        },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        minWidth:windowW * 0.795,
        minHeight: windowH * 0.035,
        backgroundColor:"#9c3a53",
        borderRadius:4,
        justifyContent:"center",
        alignSelf:"center",

    },
    deleteButtonText: {
        fontFamily:"InterBold",
        left:1,
        color:"white",
        alignSelf:"center"
    },
    publishButtonContainer: {
        shadowColor: '#000',
        shadowOffset: {
        width: 0,
        height: 2,
        },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        minWidth:windowW * 0.8,
        minHeight: windowH * 0.036,
        backgroundColor:"rgba(0, 82, 63, 1)",
        borderRadius:4,
        alignSelf:"center",
        justifyContent:"center"
    },
    publishButtonText: {
        fontFamily:"InterBold",
     
        color:"white",
        alignSelf:"center"
    },
})
export default EditMilestone