import React, {useState, useEffect, useContext} from "react";
import { Text, StyleSheet, View, Image, FlatList, Pressable, TextInput, Switch, Dimensions, Alert } from "react-native";
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

const EditPost = ({route}) => {
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
    const [caption, setCaption] = useState(route.params.caption?route.params.caption:'')
    const [milestoneList, setMilestoneList] = useState([])
    const milestoneData = require('../data/Milestones.json')
    const [milestones, setMilestones] = useState([])
    const [linkedMilestones, setLinkedMilestones] = useState([])
    const navigation = useNavigation()
    const user = useContext(userContext)
    const [postId, setPostId] = useState(route.params.postId)
    const [confirmation, setConfirmation] = useState(false)

    useEffect(()=> {
        axios.get(`http://${user.network}:19001/api/getlinkedmilestones`)  
        .then((response)=> {
            setLinkedMilestones(response.data.filter((item)=>item.postid === postId).map((item)=>item.milestoneid))
        }).catch(error => console.log(error))
    }, [])
    useEffect(()=> {
        axios.get(`http://${user.network}:19001/api/getmilestones`)
        .then((response)=> {
            setMilestoneList(response.data)})
        .catch((error)=> console.log(error))
    },[])
    const DeleteAlert = () => {
        return new Promise((resolve, reject) => {
            Alert.alert('Delete Post?', 'You won\'t be able to restore this post after it is deleted.', [{
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
    const postData = {
        id:0,
        img:require('../assets/samplepost.png'),
        caption:'',
        profilePic:'defaultpic',
        username:user.username?user.username:'ajiaron',
        src:'defaultpost'
    }
    function deletePost() {
        axios.delete(`http://${user.network}:19001/api/deletepost`, {data: {postid:postId}})
        .then((response)=> console.log("post deleted")).catch(error=>console.log(error))
        axios.delete(`http://${user.network}:19001/api/removelinked`, {data: {postid:postId}})
        .then((response)=>console.log("links removed")).catch(error=>console.log(error))
        navigation.navigate("Feed", {post:postData})
    }
    function handlePress() {
        DeleteAlert().then((resolve)=> {
            if (resolve) {
                  deletePost()
                  navigation.navigate("Feed", {post:postData})
            }}
        )
    }
    function submitPost() {
        milestones.filter(item=>linkedMilestones.indexOf(item.id)<0).map(item=>{
            axios.post(`http://${user.network}:19001/api/linkmilestones`, {postid:postId, milestoneid:item.id})
            .then(()=>console.log('milestones added'))
        })
        linkedMilestones.filter(item=>milestones.map(item=>item.id).indexOf(item)<0).map(item=>{
            axios.delete(`http://${user.network}:19001/api/removelinktag`, {data: {postid:postId, milestoneid:item}})
            .then(()=>console.log("milestones removed"))
        })
        axios.put(`http://${user.network}:19001/api/updatepost`, 
        {postid:postId, caption:caption})
        .then(console.log('post caption updated'))
        navigation.navigate("Feed", {post: postData, milestones:milestones})
    }
    const renderMilestone = ({ item }) => {
        return (
            <MilestoneTag 
                title={item.title} 
                streak={item.streak} 
                img={milestoneList.length>0?item.src:item.img} 
                id={milestoneList.length>0?item.idmilestones:item.id} 
                isLast={item.id == milestoneData.length}
                selected={linkedMilestones.indexOf(item.idmilestones) > -1}
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
                            placeholder={caption}
                            placeholderTextColor={'rgba(255, 255, 255, 1)'}
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
                        initialNumToRender={4}
                        maxToRenderPerBatch={4}
                        snapToInterval={(windowH*0.0756)+16}
                        showsVerticalScrollIndicator={false}
                        style={[styles.milestoneList]} 
                        data={milestoneList.length>0?milestoneList:milestoneData} 
                        renderItem={renderMilestone} 
                        keyExtractor={(item)=>(milestoneList.length>0)?item.idmilestones.toString():item.id.toString()}>
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
                    <Pressable onPress={handlePress}>
                        <View style={styles.deletePostButtonContainer}>
                            <Text style={styles.deletePostButtonText}>Delete</Text>
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
        maxHeight:windowH * 0.367,
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
    deletePostButtonContainer: {
        minWidth:windowW * 0.78,
        minHeight: windowH * 0.035,
        backgroundColor:"rgba(180, 55, 87,1)",
        borderRadius:4,
        justifyContent:"center",
        alignSelf:"center",
    },
    deletePostButtonText: {
        fontFamily:"InterBold",
        fontSize:14,
        color:"white",
        alignSelf:"center"
    },
    publishPostButtonContainer: {
        minWidth:windowW * 0.785,
        minHeight: windowH * 0.036,
        backgroundColor:"rgba(0, 82, 63, 1)",
        borderRadius:4,
        justifyContent:"center",
        alignSelf:"center",
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

export default EditPost