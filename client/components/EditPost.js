import React, {useState, useEffect, useContext, useRef, useCallback} from "react";
import { Text, Animated, ActivityIndicator, StyleSheet, RefreshControl, View, Image, FlatList, Pressable, TextInput, Switch, Dimensions, Alert, ScrollView } from "react-native";
import * as Device from 'expo-device'
import { Icon } from 'react-native-elements'
import { useNavigation, useRoute, useIsFocused } from "@react-navigation/native";
import Footer from './Footer'
import MilestoneTag from "./MilestoneTag";
import userContext from '../contexts/userContext'
import axios from 'axios'
import { Video } from 'expo-av'
import FastImage from "react-native-fast-image";

const windowW = Dimensions.get('window').width
const windowH = Dimensions.get('window').height

const EditPost = ({route}) => {
    const img = (route.params.uri !== undefined)?route.params.uri:require('../assets/samplepostwide.png')
    const imgType = (route.params.type !== undefined)?route.params.type:"back"
    const isFocused = useIsFocused()
    var fileExt = (route.params.uri !== undefined)?route.params.uri.toString().split('.').pop():'png';
    const [commentsEnabled, setCommentsEnabled] = useState(true)
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
    const routes = navigation.getState()?.routes;
    const user = useContext(userContext)
    const [postId, setPostId] = useState(route.params.postId)
    const [personalMilestones, setPersonalMilestones] = useState([])
    const [refreshing, setRefreshing] = useState(false);
    const [loading, setLoading] = useState(true)    // for loading image & video preview
    const [isPersonal, setIsPersonal] = useState(true)
    const animatedvalue = useRef(new Animated.Value(0)).current;

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        setTimeout(() => {
            setRefreshing(false);
        }, 800);
    }, []);
    function switchPersonal() {
        Animated.timing(animatedvalue,{
            toValue:100,
            duration:150,
            useNativeDriver:false,
        }).start(()=>setIsPersonal(false))
    }
    function switchPublic() {
        Animated.timing(animatedvalue,{
            toValue:0,
            duration:150,
            useNativeDriver:false,
        }).start(()=>setIsPersonal(true))
    }
    function checkDate(duration) {
        if ((new Date(duration) - new Date())/86400000 > 0 || duration === null) {
            return true
        } 
        return false
    }
    useEffect(()=> {
        axios.get(`http://${user.network}:19001/api/getposts`)  
        .then((response)=> {
            setLikesEnabled(response.data.filter((item)=> item.idposts === postId)[0].likes === 1?true:false)
            setCommentsEnabled(response.data.filter((item)=> item.idposts === postId)[0].comments === 1?true:false)
            setSharingEnabled(response.data.filter((item)=> item.idposts === postId)[0].public === 1?true:false)
        }).catch(error => console.log(error))
    }, [])
    useEffect(()=> {
        axios.get(`http://${user.network}:19001/api/getlinkedmilestones`)  
        .then((response)=> {
            setLinkedMilestones(response.data.filter((item)=>item.postid === postId).map((item)=>item.milestoneid))
        }).catch(error => console.log(error))
    }, [isFocused])
    useEffect(()=> {
        console.log('focused')
        axios.get(`http://${user.network}:19001/api/getpostmilestones/${postId}`)  
        .then((response)=> {
            setMilestones(response.data)
        }).catch(error => console.log(error))
    }, [])
    useEffect(()=> {
        axios.get(`http://${user.network}:19001/api/getusermilestones/${user.userId}`)
        .then((response)=> {
            setPersonalMilestones(response.data.filter((item)=>checkDate(item.duration)))})      // TODO: Friends condition
        .catch((error)=> console.log(error))
    },[isFocused, refreshing])
    useEffect(()=> {
        axios.get(`http://${user.network}:19001/api/getmilestones`)
        .then((response)=> {
            setMilestoneList(response.data.filter((item)=>item.postable === "Everyone" && checkDate(item.duration)))})      // TODO: Friends condition
        .catch((error)=> console.log(error))
    },[isFocused, refreshing])
    function handleTest() {
    //    console.log(routes)
        console.log(linkedMilestones, milestones.map((item)=>item.title))
    }
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
        axios.delete(`http://${user.network}:19001/api/deletecomments`, {data: {postid:postId}})
        .then((response)=>console.log("comments removed")).catch(error=>console.log(error))
        axios.delete(`http://${user.network}:19001/api/deletelikes`, {data: {postid:postId}})
        .then((response)=>console.log("likes removed")).catch(error=>console.log(error))
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
        // check owner of each milestone and send notification of post to milestone owners
        milestones.filter(item=>linkedMilestones.indexOf(item.idmilestones)<0).map(item=>{
            axios.post(`http://${user.network}:19001/api/linkmilestones`, {postid:postId, milestoneid:item.idmilestones})
            .then(()=>console.log('milestones added'))
        })
        linkedMilestones.filter(item=>milestones.map(item=>item.idmilestones).indexOf(item)<0).map(item=>{
            axios.delete(`http://${user.network}:19001/api/removelinktag`, {data: {postid:postId, milestoneid:item}})
            .then(()=>console.log("milestones removed"))
        })
        axios.put(`http://${user.network}:19001/api/updatepost`, 
        {postid:postId, caption:caption, likes:likesEnabled, comments:commentsEnabled, public:sharingEnabled})
        .then(
            ()=>{
                console.log('post updated')
                navigation.navigate("Feed", {post: postData, milestones:milestones})
            }
        )
    }
    const renderMilestone = ({ item }) => {
        return (
            <MilestoneTag 
                title={item.title} 
                streak={item.streak} 
                img={milestoneList.length>0?item.src:item.img} 
                id={milestoneList.length>0?item.idmilestones:item.id} 
                ownerid={milestoneList.length>0?item.ownerId:0}
                isLast={milestoneList.indexOf(item) === milestoneList.length}
                selected={linkedMilestones.indexOf(item.idmilestones) > -1}
                isEmpty={isPersonal && personalMilestones.indexOf(item) === 0}
                date={item.date}
                onSelectMilestone={(selected) => setMilestones([...milestones,selected])}
                onRemoveMilestone={(selected) => setMilestones(milestones.filter((item) => item.idmilestones !== selected.idmilestones))}
            />
        )
    }
    return (
        <View style={styles.createPostPage}>
            <View style={styles.createPostContainer}>
                <Pressable onPress={handleTest}>
                <Text style={[styles.milestoneHeaderText,{fontSize:(windowH>900)?11.5:11}]}>DESCRIPTION</Text>
                </Pressable>
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
                    {(loading)&&
                        <ActivityIndicator size="small" color="#ffffff" style={{left:windowW*(0.125), bottom:0.5, zIndex:99}}/>
                    }
                    {(fileExt === 'mov' || fileExt === 'mp4')?
                        <Video isLooping shouldPlay
                        style={(imgType==="front")?[styles.newPostImageContainer, {transform:[{rotateY:'180deg'}]}]:styles.newPostImageContainer}
                        resizeMode="cover"
                        onLoad={()=> {setLoading(false)}}
                        source={{uri:img}}/>
                    :
                        (!user.isExpo)?
                        <FastImage
                        onLoadEnd={()=> {setLoading(false)}}
                        style={(imgType==="front")?[styles.newPostImageContainer, {transform:[{rotateY:'180deg'}]}]:styles.newPostImageContainer}
                        resizeMode={FastImage.resizeMode.cover}
                        source={route.params.uri?{
                            uri:img,
                            priority:FastImage.priority.normal
                        }:require('../assets/samplepost.png')}
                        />
                        :
                        <Image 
                        onLoadEnd={()=> {setLoading(false)}}
                        style={(imgType==="front")?[styles.newPostImageContainer, {transform:[{rotateY:'180deg'}]}]:styles.newPostImageContainer}
                        resizeMode="cover"
                        source={route.params.uri?{uri:img}:require('../assets/samplepost.png')}
                        />
                    }
                </View>
                <View style={[styles.milestoneListHeader]}>
                    <Pressable onPress={switchPublic} style={{height:"100%"}}>
                        <Animated.Text style={[styles.milestoneHeaderText, 
                            {fontSize:(windowH>900)?11.5:11, 
                            color:animatedvalue.interpolate({inputRange:[0,100], outputRange:['rgba(53,174,146,1)','rgba(195, 191, 191, 1)']})
                            }]}>
                            PERSONAL MILESTONES
                        </Animated.Text>
                    </Pressable>
                    <Pressable onPress={switchPersonal} style={{height:"100%"}}>
                        <Animated.Text style={[styles.milestoneHeaderEndText, 
                            {fontSize:(windowH>900)?11.5:11,
                            color:
                            animatedvalue.interpolate({inputRange:[0,100], outputRange:['rgba(195, 191, 191, 1)','rgba(53,174,146,1)']})
                            }]}>
                            PUBLIC MILESTONES</Animated.Text>
                    </Pressable>
                </View>
                    <View style={styles.PostTagContainer}>
                    {((isPersonal)&& milestoneList.filter((item)=>item.ownerId === user.userId).length === 0) ?
                         <Pressable onPress={()=>navigation.navigate("CreateMilestone", {from:'create'})} style={{top:15, marginBottom:232}}>
                         <View style={[styles.milestoneEmptyContainer]}>
                             <View style={{alignItems:"center",alignSelf:"center", justifyContent:"space-evenly"}}>
                                 <Icon
                                 name = {'add-to-photos'}
                                 color="rgba(58, 184, 156, 1)"
                                 size={(windowH>900)?27.5:26}
                                 />
                                 <Text style={{fontFamily:"Inter", color:"rgba(58, 184, 156, 1)", 
                                 fontSize:(windowH>900)?12:11, paddingTop:6}}>Add a new milestone...</Text>
                             </View>
             
                         </View>
                     </Pressable>
                     :
                        <FlatList 
                            snapToAlignment="start"
                            decelerationRate={"fast"}
                            refreshControl={
                                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                            }
                            initialNumToRender={0}
                            snapToInterval={(windowH*0.0756)+16}
                            showsVerticalScrollIndicator={false}
                            style={[styles.milestoneList]} 
                            data={isPersonal?personalMilestones:milestoneList} 
                            renderItem={renderMilestone} 
                            keyExtractor={(item)=>item.idmilestones.toString()}>
                        </FlatList> 
                    }
                    </View>   
                <View style={[styles.switchContainer]}>
                    <View style={{flexDirection:"row"}}>
                        <Text style={styles.switchText}>Comments</Text>
                        <Switch
                            style={{ transform: [{ scaleX: .45 }, { scaleY: .45 }]}}
                            trackColor={{ false: "#bbb", true: "#35AE92" }}
                            thumbColor={commentsEnabled ? "#1f1e1e" : "1f1e1e"}
                            ios_backgroundColor="#fff"
                            onValueChange={toggleComments}
                            value={commentsEnabled}
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
                        <Text style={styles.switchText}>Public</Text>
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
        marginTop:windowH*0.08
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
        minWidth:windowW * 0.8,
        alignSelf:"center",
        bottom:0,
        flex:1,
        maxHeight:windowH * 0.367,
        bottom:24
    },
    milestoneListHeader: {
        maxWidth:windowW * 0.8,
        height: windowH * 0.05,
        flex:1,
        flexDirection:"row",
        justifyContent:"space-between"
    },
    milestoneHeaderText: {
        fontFamily:"InterBold",
        left:2,
        fontSize:11,
        color:"rgba(195, 191, 191, 1)",
    },
    milestoneHeaderEndText: {
        fontFamily:"InterBold",
        fontSize:11,
        right:2,
        color:"rgba(195, 191, 191, 1)",
    },
    postHeaderText: {
        fontFamily:"InterBold",
        left:0,
        fontSize:11,
        color:"rgba(195, 191, 191, 1)",
        alignSelf:"flex-start",
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
        fontSize:12,
        bottom:0.25,
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
        backgroundColor:"#9c3a53",
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
    },
    milestoneEmptyContainer: {
        alignItems:"center",
        padding:(windowH*0.0185)-2.25,
        width:windowW*0.800,
        height: windowH*0.0756,
        backgroundColor: "rgba(28, 28, 28, 1)",
        borderColor:"rgba(58, 184, 156, 1)",
        borderRadius: 8,
        borderWidth:2.25,
        borderStyle:"dashed",
        marginBottom:16,
        shadowColor: '#000',
        shadowOffset: {
        width: 0,
        height: 2,
        },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        alignSelf:"center"
    },
})

export default EditPost