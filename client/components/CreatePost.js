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
import { Video } from 'expo-av'

const windowW = Dimensions.get('window').width
const windowH = Dimensions.get('window').height

const CreatePost = ({route}) => {
    const img = (route.params.uri !== undefined)?route.params.uri:require('../assets/samplepostwide.png')
    const imgType = (route.params.type !== undefined)?route.params.type:"back"
    var fileExt = (route.params.uri !== undefined)?route.params.uri.toString().split('.').pop():'png';
    const date = new Date().toISOString().slice(0, 19).replace('T', ' ')
    const [commmentsEnabled, setCommentsEnabled] = useState(true)
    const toggleComments = () => setCommentsEnabled(previousState => !previousState)
    const [likesEnabled, setLikesEnabled] = useState(true)
    const toggleLikes = () => setLikesEnabled(previousState => !previousState)
    const [sharingEnabled, setSharingEnabled] = useState(true)
    const toggleSharing = () => setSharingEnabled(previousState => !previousState)
    const [caption, setCaption] = useState('')
    const milestoneData = require('../data/Milestones.json')
    const [milestones, setMilestones] = useState([])
    const navigation = useNavigation()
    const user = useContext(userContext)
    const postData = {
        id:0,
        img:require('../assets/samplepost.png'),
        caption:'',
        profilePic:'defaultpic',
        username:user.username?user.username:'ajiaron',
        src:'defaultpost'
    }
    function handlePress() {
        axios.post('http://10.10.110.94:19001/api/pushposts', 
        {username:user.username?user.username:'ajiaron', caption:caption, profilepic:'defaultpic', src:img, date: date})
        .then(() => {console.log('new user posted')})
        .catch((error)=> console.log(error))
    }
    function sendPost() {
        postData.img = route.params.uri?{uri:img}:'defaultpost'
        postData.caption = caption
    }
    function submitPost() {
        handlePress()
        navigation.navigate("Feed", {post: postData, milestones:milestones})
    }
    const renderMilestone = ({ item }) => {
        return (
            <MilestoneTag 
                title={item.title} 
                streak={item.streak} 
                img={item.img} 
                id={item.id} 
                isLast={item.id == milestoneData.length}
                onSelectMilestone={(selected) => setMilestones([...milestones,selected])}
                onRemoveMilestone={(selected) => setMilestones(milestones.filter((item) => item.id !== selected.id))}
            />
        )
    }
    return (
        <View style={styles.createPostPage}>
            <View style={styles.createPostContainer}>
                <Text style={styles.milestoneHeaderText}>DESCRIPTION</Text>
                <View style={styles.newPostContent}>
                    <View style={styles.newPostCaption}>
                        <TextInput 
                            style={styles.newPostCaptionText}
                            placeholder={"Add a description..."}
                            placeholderTextColor={'rgba(130, 130, 130, 1)'}
                            onChangeText={text=>setCaption(text)}
                            multiline
                            blurOnSubmit
                            value={caption}
                            />
                    </View>           
                    {(fileExt === 'mov' || fileExt === 'mp4')?
                        <Video isLooping shouldPlay
                        style={(imgType==="front")?[styles.newPostImageContainer, {transform:[{rotateY:'180deg'}]}]:styles.newPostImageContainer}
                        resizeMode="cover"
                        source={{uri:img}}/>
                    :
                        <Image 
                        style={(imgType==="front")?[styles.newPostImageContainer, {transform:[{rotateY:'180deg'}]}]:styles.newPostImageContainer}
                        resizeMode="cover"
                        source={route.params.uri?{uri:img}:require('../assets/samplepost.png')}
                    />
                    }
       
                </View>
                <View style={styles.milestoneListHeader}>
                    <Text style={styles.milestoneHeaderText}>SELECT A MILESTONE</Text>
                </View>
                <View style={styles.PostTagContainer}>
                    <FlatList 
                        snapToAlignment="start"
                        decelerationRate={"fast"}
                        snapToInterval={(windowH*0.0756)+16}
                        showsVerticalScrollIndicator={false}
                        style={[styles.milestoneList]} 
                        data={milestoneData} 
                        renderItem={renderMilestone} 
                        keyExtractor={(item)=>item.id.toString()}>
                    </FlatList> 
                </View>   
                <View style={styles.switchContainer}>
                    <View style={{flexDirection:"row"}}>
                        <Text style={styles.switchText}>Comments</Text>
                        <Switch
                            style={{ transform: [{ scaleX: .45 }, { scaleY: .45 }]}}
                            trackColor={{ false: "#bbb", true: "#35AE92" }}
                            thumbColor={commmentsEnabled ? "#1f1e1e" : "1f1e1e"}
                            ios_backgroundColor="#fff"
                            onValueChange={toggleComments}
                            value={commmentsEnabled}
                        />
                    </View>
                    <View style={{flexDirection:"row"}}>
                        <Text style={styles.switchText}>Likes</Text>
                        <Switch
                            style={{ transform: [{ scaleX: .45 }, { scaleY: .45 }] }}
                            trackColor={{ false: "#bbb", true: "#35AE92" }}
                            thumbColor={likesEnabled ? "#1f1e1e" : "1f1e1e"}
                            ios_backgroundColor="#fff"
                            onValueChange={toggleLikes}
                            value={likesEnabled}
                        />
                    </View>
                    <View style={{flexDirection:"row"}}>
                        <Text style={styles.switchText}>Sharing</Text>
                        <Switch
                            style={{ transform: [{ scaleX: .45 }, { scaleY: .45 }]}}
                            trackColor={{ false: "#bbb", true: "#35AE92" }}
                            thumbColor={sharingEnabled ? "#1f1e1e" : "1f1e1e"}
                            ios_backgroundColor="#fff"
                            onValueChange={toggleSharing}
                            value={sharingEnabled}
                        />
                    </View>
                </View>
                <View style={[styles.buttonContainer]}>
                    <Pressable>
                        <View style={styles.savePostButtonContainer}>
                            <Text style={styles.savePostButtonText}>Archive</Text>
                        </View>
                    </Pressable>
                    <Pressable onPress={submitPost}>
                    <View style={styles.publishPostButtonContainer}>
                        <Text style={styles.publishPostButtonText}>Publish</Text>
                    </View>
                    </Pressable>
                </View>
            </View> 
            <View style={styles.footerContainer}>
                <Footer disable={"CreatePost"}/>
            </View> 
        </View>
    )
}
 

const styles = StyleSheet.create({
    createPostPage: {
        backgroundColor: "rgba(28, 28, 28, 1)",
        minWidth:windowW,
        minHeight:windowH,
        overflow:"scroll",
    },
    createPostContainer: {
        alignSelf:"center",
        marginTop:windowH*0.0835
    },
    newPostContent: {
        maxWidth:windowW*0.8,
        maxHeight:windowH*0.195,
        flexDirection:"row",
        justifyContent:"space-between",
        marginBottom:windowH*0.0325,
        alignItems:"center",
        marginTop:windowH*0.018,
    },
    newPostCaption: {
        paddingTop:6,
        paddingLeft:12,
        paddingRight:12,
        paddingBottom:6,
        width: windowW*0.55,
        height: windowH*0.1475,
        backgroundColor:"rgba(10, 10, 10, 1)",
        borderRadius:6,
        textAlignVertical:"top",
    },
    newPostCaptionText: {
        fontSize:11,
        fontFamily:"Inter",
        top:0,
        width:"100%",
        height:"100%",
        color:"rgba(255, 255, 255, 1)"
    },
    newPostImageContainer: {
        minWidth: windowW*0.1985,
        minHeight: windowH*0.1465,
        marginRight:2,
        bottom:0.5,
        borderRadius:6
    },
    newPostImage: {
        width: windowW*0.1985,
        minHeight: windowH*0.1465,
    },
    milestoneList: {
        top:14,
        minWidth:windowW*0.8,
        alignSelf:"center",
        borderRadius: 8,
    },
    PostTagContainer: {
        flex: 1,
        minWidth:windowW * 0.8,
        maxHeight:windowH * 0.365,
        alignSelf:"center",
        bottom:28
    },
    milestoneListHeader: {
        maxWidth:windowW * 0.8,
        height: windowH * 0.05,
        alignSelf:"left",
    },
    milestoneHeaderText: {
        fontFamily:"InterBold",
        left:2,
        fontSize:11,
        color:"rgba(195, 191, 191, 1)",
        alignSelf:"left"
    },
    postHeaderText: {
        fontFamily:"InterBold",
        left:0,
        fontSize:11,
        color:"rgba(195, 191, 191, 1)",
        alignSelf:"left",
    },
    switchContainer: {
        minWidth: windowW*0.8,
        maxHeight:windowH * 0.016,
        flexDirection:"row",
        justifyContent:"space-evenly",
        alignItems:"center",
        marginTop:windowH*0.012,
        left:4
    },
    toggleSwitch: {
        maxHeight:windowH * 0.014,
        maxWidth:windowW * 0.06
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
        minWidth: windowW*0.8,
        marginTop:windowH*0.034
    },
    savePostButtonContainer: {
        minWidth:windowW * 0.804,
        minHeight: windowH * 0.0375,
        backgroundColor:"rgba(10, 10, 10, 1)",
        borderRadius:4,
        justifyContent:"center"
    },
    savePostButtonText: {
        fontFamily:"InterBold",
        fontSize:14,
        color:"white",
        alignSelf:"center"
    },
    publishPostButtonContainer: {
        minWidth:windowW * 0.8,
        minHeight: windowH * 0.035,
        backgroundColor:"rgba(0, 82, 63, 1)",
        borderRadius:4,
        justifyContent:"center"
    },
    publishPostButtonText: {
        fontFamily:"InterBold",
        fontSize:14,
        color:"white",
        alignSelf:"center"
    },
    footerContainer: {
        position:"absolute",
        bottom:0
    }
})

export default CreatePost