import  React, {useState, useRef, useEffect, useContext} from "react";
import { Animated, Text, StyleSheet, ActivityIndicator, View, Image, Pressable, TextInput, ScrollView, Dimensions, TouchableOpacity } from "react-native";
import { Icon } from 'react-native-elements'
import { useNavigation, useRoute, StackActions } from "@react-navigation/native";
import Icons from '../data/Icons.js'
import userContext from '../contexts/userContext'
import axios from 'axios'
import FastImage from 'react-native-fast-image'
import Footer from './Footer'
import * as MediaLibrary from 'expo-media-library'
import { Video } from 'expo-av'
import pushContext from "../contexts/pushContext.js";

const windowW = Dimensions.get('window').width
const windowH = Dimensions.get('window').height

const PostItem = ({username, caption, src, image, postId, liked, isLast, milestones, ownerId, date, index, count, isPublic, isViewable, onToggleComment}) => {
    const milestoneList = milestones?milestones:[]
    const user = useContext(userContext)
    const push = useContext(pushContext)
    const navigation = useNavigation()
    const route = useRoute()
    const [profilePic, setProfilePic] = useState()
    const [isActive, setIsActive] = useState(true)
    const [ownerid, setOwnerid] = useState(ownerId?ownerId:0)
    var fileExt = (image !== undefined)?image.toString().split('.').pop():'png'
    const currentDate = new Date().toLocaleString("en-US", { month: "long", day:"numeric", year:"numeric" })
    const dateparts = new Date(date).toLocaleString("en-US") 
    const postDate = new Date(dateparts).toLocaleDateString("en-US",{month:"long", day:"numeric",year:"numeric"})
    const postTime = new Date(dateparts).toLocaleTimeString([],{hour12:true, hour:'numeric', minute:'2-digit'})
    const [isMuted, setIsMuted] = useState(true)
    const [viewable, setViewable] = useState(true)
    const [commentCount, setCommentCount] = useState(0)
    const [isLiked, setIsLiked] = useState(liked?liked:false)
    const [likes, setLikes] = useState([])
    const [loading, setLoading] = useState(true)
    const [userToken, setUserToken] = useState()
    const animatedvalue = useRef(new Animated.Value(0)).current;
    const animatedsize = useRef(new Animated.Value(route.name === "MilestoneFeed"?100:0)).current;
    const AnimatedImage = Animated.createAnimatedComponent(FastImage);
    const [expanded, setExpanded] = useState(true)
    const data = {
        postId:postId,
        username:username,
        src:src,
        image:image,
        caption:caption, 
        liked:isLiked,
        milestones:milestoneList,
        ownerId:ownerid,
        isPublic:isPublic,
        date:date
    }

    useEffect(()=> {
        axios.get(`http://${user.network}:19001/api/getlikes`)  
        .then((response)=> {
            setLikes(response.data.filter((item)=>item.postid === postId))
            setIsLiked(response.data.filter((item)=>item.postid === postId).map((val)=> val.userid).indexOf(user.userId) > -1)
        }).catch(error => console.log(error))
    }, [])
    useEffect(()=> {
        axios.get(`http://${user.network}:19001/api/getcomments`)  
        .then((response)=> {
            setCommentCount(response.data.filter((item)=>item.postid === postId).length)
        }).catch(error => console.log(error))
    }, [])
    useEffect(()=> {
        axios.get(`http://${user.network}:19001/api/getusers`)  
        .then((response)=> {
            if (ownerId !== undefined) {
                setProfilePic(response.data.filter((item)=>item.id === ownerId)[0].src)
                setUserToken(response.data.filter((item)=> item.id === ownerId)[0].pushtoken?
                `ExponentPushToken[${response.data.filter((item)=> item.id === ownerId)[0].pushtoken}]`:null)
            }
        }).catch(error => console.log(error))
    }, [ownerId])
    useEffect(()=> {
        setViewable(isViewable)     // render first video without threshold
    }, [isViewable])
    const likeMessage = {
        to: userToken,
        sound: 'default',
        title: 'Milestone',
        body: `${user.username} liked your post.`,
        data: { route: "Post", item: data, comments:false },
    };
    function expandPost() {
        Animated.timing(animatedsize,{
            toValue:100,
            duration:200,
            useNativeDriver:false,
        }).start()
    }
    function compressPost() {
        Animated.timing(animatedsize,{
            toValue:0,
            duration:200,
            useNativeDriver:false,
        }).start()
    }
    function blurIn() {
        Animated.timing(animatedvalue,{
            toValue:100,
            duration:(fileExt==='mov'||fileExt==='mp4')?150:200,
            useNativeDriver:false,
        }).start()
    }
    function blurOut() {
        Animated.timing(animatedvalue,{
            toValue:0,
            duration:(fileExt==='mov'||fileExt==='mp4')?150:200,
            useNativeDriver:false,
        }).start()
    }
    function navigateProfile() {
        navigation.push("Profile", {id:ownerId})
    }
    function handleComment() {
        if (route.name ==="Post") {
            onToggleComment()
        } 
        else {
            navigation.navigate("Post", {item:data, comments:true})
        }
    }
    function handleNavigate() {
        navigation.navigate("Post", {item:data, comments:false})
    }
    const handleEdit = () => {
        navigation.navigate("EditPost", {uri:image, postId:postId, caption:caption})
    }

    const handleLike = () => {
        setIsLiked(!isLiked)
        liked = isLiked
        if (!isLiked) {
            axios.post(`http://${user.network}:19001/api/likepost`, 
            {postid:postId,userid:user.userId})
            .then(() => {
                console.log("post liked")
            })
            .catch((error)=> console.log(error))
            if (user.userId !== ownerId) {   // TODO: prevent multiple notifications from firing if user has already liked
                axios.post(`http://${user.network}:19001/api/likenotification`, 
                {requesterId: user.userId, recipientId: ownerId, type:"like", postId: postId})
                .then(() => {
                    console.log("like notified")
                })
            }
            if (userToken && (user.userId !== ownerId)) {    // must be using a physical device to send push notifications
                const sendPush = async() => {
                    await push.sendPushNotification(userToken, likeMessage)
                }
                sendPush()
            }
        }
        else {
            axios.delete(`http://${user.network}:19001/api/unlikepost`, {data: {postid:postId, userid:user.userId}})
            .then((response)=> console.log("post unliked")).catch(error=>console.log(error))
        } 
    }
    const handleSelect = () => {
        console.log(image)
     //   console.log(userToken)
     //   console.log(fileExt)
        setIsActive(!isActive)
        if (fileExt === 'mov' || fileExt === 'mp4') {
            if (!isActive && viewable) {
                blurIn()
            }
            if (isActive || !viewable) {
                blurOut()
            }
        }
    }
    const toggleMute = () => {
        setIsMuted(!isMuted)
    }
    useEffect(()=> {
        if (!viewable) {
            blurOut()
        } else {
            blurIn()
        }
    }, [viewable])
    useEffect(()=> {
        if (!expanded && route.name !== 'MilestoneFeed') {
            expandPost()
        } else {
            compressPost() 
        }
    }, [expanded])
    return (
     <View style={[styles.postContainer]}>
        {(route.name === 'MilestonePage' || route.name === 'Archive' || route.name === 'MilestoneFeed') ? // transparent header 
           <View style={{flexDirection:"row",flex:1, alignItems:"center", position:"absolute", zIndex:1}}>
           <Pressable style={[styles.postHeader, { backgroundColor:'rgba(0,0,0,0)'}]} onPress={navigateProfile}>
                   {(profilePic !== src || src !== 'defaultpic')?
                   <View style={[{minHeight:60,marginLeft:(route.name === "Archive" || route.name === 'MilestoneFeed')?14:12}]}>
                    {(!user.isExpo)?
                     <FastImage
                     style={(route.name==="Archive" || route.name === 'MilestoneFeed')?
                     {height:38, width:38, borderRadius:38, alignSelf:"center",top:4,left:2}:
                     {height:34, width:34, borderRadius:34, alignSelf:"center"}}
                     resizeMode={FastImage.resizeMode.cover}
                     source={{
                        uri:profilePic,
                        priority: FastImage.priority.normal
                    }}/>
                    :
                    <Image
                    style={(route.name==="Archive" || route.name ==='MilestoneFeed')?
                    {height:38, width:38, borderRadius:38, alignSelf:"center",top:2,left:2}:
                    {height:34, width:34, borderRadius:34, alignSelf:"center"}}
                    resizeMode="contain"
                    source={{uri:profilePic}}/>
                    }
                    </View>:
                   <View style={[styles.profilePicContainer]}>
                       <Image
                           style={styles.profilePic}
                           resizeMode="contain"
                           source={Icons['defaultpic']}/>
                   </View>}
                   <View style={[styles.postUserHeader]}>
                    {(route.name !== "Archive" && route.name !== "MilestoneFeed") &&
                       <Text style={[styles.postOwnerName]}> 
                            {username} 
                       </Text>
                    }
                        <Text style={[(route.name === 'Archive' || route.name ==='MilestoneFeed')?
                        styles.ownerTimeArchive:styles.postOwnerTime]}>
                            {(date !== undefined)?
                            (postDate === currentDate)?`Today at ` + 
                            postTime:(route.name==="Archive" || route.name === 'MilestoneFeed')?
                            postDate:postDate + ' at ' + postTime
                            :`Today at ${currentDate}`}
                        </Text>
                   </View>
                </Pressable>
            </View>
        :
        <View style={{flexDirection:"row",flex:1, alignItems:"center"}}>   
        <Pressable style={[styles.postHeader, {backgroundColor:"#1c1c1c", 
        borderTopLeftRadius:(route.name)==='Post'?12:0}]} 
        onPress={navigateProfile}>
                {(profilePic !== src || src !== 'defaultpic')?
                <View style={[{minHeight:60,marginLeft:12}]}>
                {
                    (!user.isExpo)?
                    <FastImage
                        style={{height:34, width:34, borderRadius:34, alignSelf:"center"}}
                        source={{
                            uri:profilePic,
                            priority: FastImage.priority.normal
                        }}
                        resizeMode={FastImage.resizeMode.cover}/>
                    :
                 <Image
                 style={{height:34, width:34, borderRadius:34, alignSelf:"center"}}
                 resizeMode="contain"
                 source={{uri:profilePic}}/>
                }
                 </View>:
                <View style={[styles.profilePicContainer]}>
                    <Image
                        style={styles.profilePic}
                        resizeMode="contain"
                        source={Icons['defaultpic']}/>
                </View>}
                <View style={[styles.postUserHeader]}>
                    <Text style={[styles.postOwnerName]}> {username} </Text>
                    <Text style={[styles.postOwnerTime]}>
                        {(date !== undefined)?
                        (postDate === currentDate)?`Today at ` + postTime:postDate + ' at ' + postTime
                        :`Today at ${currentDate}`}</Text>
                </View>
                </Pressable>
            {(route.name==="Post" && ownerId === user.userId)?
            <Pressable onPress={handleEdit} style={{backgroundColor:'#1c1c1c', height:60, justifyContent:'center',
            borderTopRightRadius:(route.name)==='Post'?12:0}}>
                 <Icon 
                 name='tune' 
                 size={28} 
                 color="rgba(220,220,220,1)" 
                 style={{marginRight:(windowW>400)?windowW*(22/windowW):windowW*(18/windowW), 
                 alignSelf:"center", bottom:1.5}}/>
            </Pressable>
                 :null
            }
        </View>
}
        <Pressable onPress={handleSelect}>
            <Animated.View style={[styles.postWrapper, 
                {backgroundColor:"rgba(10,10,10,1)",
                height:(route.name === 'MilestonePage')?windowW:
                ((fileExt === 'mov' || fileExt === 'mp4') && route.name !=="Archive" && route.name !== 'MilestoneFeed')
                ?windowH*(526/windowH):(route.name==="Archive" || route.name === 'MilestoneFeed')?
                animatedsize.interpolate({inputRange:[0,100], outputRange:[windowW,(route.name === 'MilestoneFeed')?windowH-170:windowH-152]}):
                windowW 
            }]}>                                                                                                               
                {(loading)&&
                    <ActivityIndicator size="large" color="#ffffff" style={{top:"47%", position:"absolute", alignSelf:"center"}}/>
                }
                {(route.name === 'MilestonePage' || image !=='defaultpost')?
                (fileExt === 'mov' || fileExt === 'mp4')? 
                <Animated.View style={{opacity:animatedvalue.interpolate({inputRange:[0,100],outputRange:[0.4,1]})}}>
                    <Video isLooping shouldPlay={isActive && viewable}
                        isMuted={isMuted} 
                        source={{uri:image}}
                        resizeMode={'cover'}
                        onLoad={()=> {setLoading(false)}}
                        style={{height:"100%", width:"100%",alignSelf:"center", 
                        }}>
                        <View style={{minWidth:20, minHeight:20, zIndex:999, alignSelf:"flex-end", bottom:10, right:13, position:"absolute"}}>
                            <TouchableOpacity onPress={toggleMute}>
                                <Icon
                                name={(isMuted)?'volume-off':'volume-up'}
                                color='white'
                                size={20}
                                />
                            </TouchableOpacity>
                        </View>
                    </Video>
                </Animated.View>
                :
                (!user.isExpo)?
                <AnimatedImage
                    onLoad={blurIn}
                    onLoadEnd={()=> {setLoading(false)}}
                    source={{
                        uri:image,
                        priority: FastImage.priority.normal
                    }}
                    resizeMode={FastImage.resizeMode.cover}
                    style={{height:"100%", width:"100%",alignSelf:"center", bottom:0, zIndex:1,
                    opacity:animatedvalue.interpolate({inputRange:[0,100], outputRange:[0,1]})}}
                />:
                <Animated.Image
                    onLoad={blurIn}
                    onLoadEnd={()=> {setLoading(false)}}
                    source={{
                        uri:image,
                    }}
                    resizeMode={"cover"}
                    style={{height:"100%", width:"100%",alignSelf:"center", bottom:0, zIndex:1,
                    opacity:animatedvalue.interpolate({inputRange:[0,100], outputRange:[0,1]})}}
                /> 
                :null
                } 
            </Animated.View>
        </Pressable>
        <View style={[(route.name === "Archive"|| route.name === "MilestoneFeed")?styles.actionbarAlt:styles.actionbarContainer]}>
            {(route.name !=="Archive" && route.name !== "MilestoneFeed")&&
            <View style={[(route.name==="Archive" || route.name === "MilestoneFeed")?styles.actionIconAlt:styles.actionIcon, 
            (route.name==="Archive" || route.name === "MilestoneFeed")?styles.actionThumbsAlt:styles.actionThumbsUp]}>
                <Pressable onPress={handleLike}>
                    <Icon 
                    size={28}
                    name='thumb-up-off-alt'
                    color={(isLiked)?'rgba(53, 174, 146, 1)':'white'}/>
                </Pressable>
            </View>
            }
            {(route.name !=="Archive" && route.name !== "MilestoneFeed")&&
                <View style={[(route.name==="Archive" || route.name === "MilestoneFeed")?
                styles.actionIconAlt:styles.actionIcon, styles.actionComment, 
                {paddingTop:(route.name === 'Archive' || route.name ==='MilestoneFeed'?2:0)}]}>
                    <Pressable onPress={handleComment}>
                        <Icon 
                            size={25.5}
                            name='question-answer'
                            color='white'
                        />
                    </Pressable>
                </View>
            }
            
            
            {(route.name === 'MilestonePage' || route.name ==="Archive" || route.name === "MilestoneFeed")?      // scroll slider on milestone page; doesn't really work well
              null
            :
            <Pressable onPress={()=> navigation.navigate("Post", {item:data, comments:false})}>
                <View style={[(route.name==="Archive" || route.name === "MilestoneFeed")
                ?styles.actionIconAlt:styles.actionIcon, {right:(route.name ==="Archive" || route.name === "MilestoneFeed")?2:0, 
                top:(route.name === 'Archive' || route.name === 'MilestoneFeed')?3:0}]}>
                    <Image
                        style={[styles.milebookImage, {bottom:(route.name === 'Archive' || route.name === 'MilestoneFeed')?2:0}]}
                        resizeMode="contain"
                        source={require("../assets/milebook-logo.png")} 
                    />
                </View>
            </Pressable>
            }
            {((route.name === "Feed" || route.name === "Post") && !isPublic)?
            <View style={{right:16,top:10,position:"absolute"}}>
                <Icon
                    name = "lock"
                    size={20}
                    color="rgba(100,100,100,1)"
                />
            </View>
            :null}
        </View>
        {
            (route.name === "MilestonePage" || route.name === "Archive" || route.name === "MilestoneFeed")?
            <View style={[styles.commentsContainer, 
                {minHeight:(route.name === 'MilestonePage'|| route.name==="Archive" || route.name === "MilestoneFeed")?
                50:(route.name === "Post")?
            (windowH>900)?75:60:80, position:"absolute", backgroundColor:"rgba(0,0,0,0)", zIndex:1, 
            bottom:(route.name ==="Archive" || route.name === "MilestoneFeed")?6:48}]}>
                <Text numberOfLines={(route.name !== 'Post')?(route.name === 'Archive' || route.name === "MilestoneFeed")?1:2:0}
                 style={[styles.commentsContent, {width:(route.name === 'Archive' || route.name === "MilestoneFeed")?
                 windowW*0.8:windowW*0.89}]}>
                    {caption}
                </Text>
                {(route.name === "Feed" || route.name === "MilestonePage")?
                <Pressable onPress={(commentCount>0 || likes.length>0)?handleComment:handleNavigate}>
                <Text style={[styles.viewPostLink, {color:(route.name === "Archive" || route.name === "MilestoneFeed")?"#eee":"rgba(144,144,144,1)"}]}>
                    {(commentCount>0)?
                    `View ${commentCount}${(commentCount>1)?" comments":" comment"}${(likes.length>0)?` & ${likes.length}${likes.length>1?" likes":" like"}` :''}`
                    :
                    (likes.length>0)?`View ${likes.length}${(likes.length>1)?" likes":" like"}`:
                    `View Milestones & Groups`}
                </Text>
                </Pressable>
                :(route.name === "Archive" || route.name === "MilestoneFeed")?null:
                (commentCount>0)?
                <Pressable onPress={handleComment}>
                    <Text style={[styles.viewPostLink, {fontSize:11.5, color:(route.name === "Archive")?"#eee":"rgba(144,144,144,1)"}]}>
                    View {commentCount}{(commentCount>1)?" comments ":" comment "}{(likes.length>0)?`& ${likes.length}${likes.length>1?" likes":" like"}` :''}
                    </Text>
                </Pressable>
                :(route.name === "Archive" || route.name === "MilestoneFeed")?null:
                (likes.length>0)?
                <Pressable onPress={handleComment}>
                    <Text style={[styles.viewPostLink, {fontSize:11.5, 
                        color:(route.name === "Archive" || route.name === "MilestoneFeed")?"#eee":"rgba(144,144,144,1)"}]}>
                        View {likes.length}{(likes.length>1)?" likes":" like"}
                    </Text>
                </Pressable>
                :(route.name === "Archive" || route.name === "MilestoneFeed")?null:
                <Pressable onPress={handleComment}>
                    <Text style={[styles.viewPostLink, {fontSize:11.5, color:(route.name === "Archive" || route.name === "MilestoneFeed")?
                    "#eee":"rgba(144,144,144,1)"}]}>
                        Be the {<Text style={[styles.viewPostLink, {fontFamily:'Inter', 
                        color:(route.name === "Archive" || route.name === "MilestoneFeed")?"#eee":"rgba(144,144,144,1)"}]}>
                        first</Text>} to comment on {username}'s post
                    </Text>
                </Pressable>
            }
            </View>
            :
        <View style={[styles.commentsContainer, {minHeight:(route.name === 'MilestonePage')?50:(route.name === "Post")?
        (windowH>900)?75:60:80}]}>
            <Text numberOfLines={(route.name !== 'Post')?2:0} style={[styles.commentsContent, {width:windowW*0.89}]}>
                {caption}
            </Text>
            {(route.name === "Feed" || route.name === "MilestonePage")?
            <Pressable onPress={(commentCount>0 || likes.length>0)?handleComment:handleNavigate}>
            <Text style={[styles.viewPostLink, {color:(route.name === "Archive" || route.name === "MilestoneFeed")?
            "#eee":"rgba(144,144,144,1)"}]}>
                {(commentCount>0)?
                `View ${commentCount}${(commentCount>1)?" comments":" comment"}${(likes.length>0)?` & ${likes.length}${likes.length>1?" likes":" like"}` :''}`
                :
                (likes.length>0)?`View ${likes.length}${(likes.length>1)?" likes":" like"}`:
                `View Milestones & Groups`}
            </Text>
            </Pressable>
            :(route.name === "Archive" || route.name === "MilestoneFeed")?null:
            (commentCount>0)?
            <Pressable onPress={handleComment}>
                <Text style={[styles.viewPostLink, {fontSize:11.5, color:(route.name === "Archive" || route.name === "MilestoneFeed")?
                "#eee":"rgba(144,144,144,1)"}]}>
                View {commentCount}{(commentCount>1)?" comments ":" comment "}
                {(likes.length>0)?`& ${likes.length}${likes.length>1?" likes":" like"}` :''}
                </Text>
            </Pressable>
            :
            (likes.length>0)?
            <Pressable onPress={handleComment}>
                <Text style={[styles.viewPostLink, {fontSize:11.5, color:(route.name === "Archive" || route.name === "MilestoneFeed")?
                "#eee":"rgba(144,144,144,1)"}]}>
                    View {likes.length}{(likes.length>1)?" likes":" like"}
                </Text>
            </Pressable>
            :(route.name === "Archive" || route.name === "MilestoneFeed")?null:
            <Pressable onPress={handleComment}>
                <Text style={[styles.viewPostLink, {fontSize:11.5, color:(route.name === "Archive" || route.name === "MilestoneFeed")?
                "#eee":"rgba(144,144,144,1)"}]}>
                    Be the {<Text style={[styles.viewPostLink, 
                    {fontFamily:'Inter', color:(route.name === "Archive" || route.name === "MilestoneFeed")?
                    "#eee":"rgba(144,144,144,1)"}]}>
                    first</Text>} to comment on {username}'s post
                </Text>
            </Pressable>
        }
        </View>
}
        {isLast?<View style={{marginBottom:48}}/>:null}
     </View>
    );
}
const styles = StyleSheet.create({
    actionbarContainer: {
        flex:1,
        paddingTop:8,
        flexDirection:"row",
        backgroundColor:"rgba(28, 28, 28, 1)",
        maxHeight:38
    },
    actionbarAlt: {
        flex:1,
        alignItems:"center",
        flexDirection:"column",
        position:"absolute",
        right:4,
        width:50,
        paddingLeft:3,
 
        justifyContent:"space-evenly",
        alignSelf:"center",
        bottom:0,
        //backgroundColor:"rgba(28, 28, 28, 0.25)",
        height:'37.5%',
    },
    actionIcon: {
        marginLeft:32,
    },
    actionIconAlt: {
        marginLeft:0,
        backgroundColor:"rgba(28, 28, 28, 0.35)",
        width: 40,
        height:40,
        borderRadius:40,
        alignItems:"center",
        justifyContent:"center",
    },
    actionThumbsUp: {
        marginTop:.75,
        marginRight:2,
        marginLeft:20,
    },
    actionThumbsAlt: {
        marginTop:.75,
        marginRight:2,
    },
    actionComment: {
        marginTop:3,
        marginRight:4.5
    },
    milebookImage: {
        maxHeight:26,
        maxWidth:26,

    },
    feedSpace: {
        marginTop:44, 
    },
    footerSpace: {
        marginTop:10,
        backgroundColor:"rgba(28, 28, 28, 1)"
    },
    postWrapper: {
        height:windowH*(296/windowH),
        maxWidth:"100%",
        backgroundColor:"rgba(10,10,10,1)",
        position:"relative",
        borderRadius:6,
    },
    profilePicContainer: {
        minHeight:30,
        minWidth:30,
        marginLeft:12,
        alignItems:"center",
    },
    profilePic: {
        maxHeight:34,
        maxWidth:34,
    },
    postContainer: {
        minHeight:304,
        minWidth:"100%"
    },
    postHeader: {
        maxHeight:60,
        justifyContent:"center",
        flex:1,
        flexDirection:"row",
        backgroundColor:"rgba(28, 28, 28, 1)",
        paddingTop:13,
    },
    commentsContent: {
        fontFamily:"InterSemiLight",
        fontSize:14,
       
        color:"white"
    },
    viewPostLink: {
        fontFamily:"InterLight",
        marginTop:6,
        color: "rgb(144, 144, 144)",
        fontSize:11
    },
    commentsContainer: {
        paddingLeft:20,
        paddingRight:20,
        paddingTop:10,
        minHeight:windowH*(80/windowH),
        flex:1,
        backgroundColor:"rgba(28, 28, 28, 1)",
    },
    postUserHeader: {
        minHeight:34,
        flex:1,
        textAlign:"left"
    },
    postOwnerName: {
        fontFamily:"InterBold",
        left:8,
        color:"white",
        top:-1,
        fontSize:14.5
    },
    postOwnerTime: {
        fontFamily:"InterSemiLight",
        left:11,
        color:"rgba(222,222,222,1)",
        bottom:-1,
        fontSize:11
    },
    ownerTimeArchive: {

        fontFamily:"InterBold",
        alignSelf:"flex-end",
        right:18,
        top:6,
        color:"rgba(240,240,240,1)",
        fontSize:21
        
    },
    feedContainer: {
        justifyContent:"center",
        flex:1,
        alignItems:"center",
        alignSelf:"center"
    },
    feedPage: {
        backgroundColor:"rgba(28, 28, 28, 1)",
        flex: 1,
        minWidth: "100%",
        minHeight: "100%",
        overflow: "hidden",
    },
    feedText: {
        fontFamily:"Inter",
        color:"white",
        alignSelf:"center",
        fontSize:22,
    },
    postIndex: {
        backgroundColor:"#D9D9D9",
        width:6,
   
        height:6,
        borderRadius:4,
        zIndex:1
    },
})
export default PostItem