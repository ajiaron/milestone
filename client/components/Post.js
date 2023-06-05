import  React, {useState, useEffect, useContext, useRef, useCallback} from "react";
import { Text, StyleSheet, View, Image, Pressable, TextInput, ScrollView, FlatList, Dimensions, Animated, RefreshControl } from "react-native";
import { Icon } from 'react-native-elements'
import Icons from '../data/Icons.js'
import { useNavigation, useRoute } from "@react-navigation/native";
import GlobalStyles from "../styles/GlobalStyles";
import Footer from './Footer'
import axios from 'axios'
import PostItem from "./PostItem";
import userContext from '../contexts/userContext'
import MilestoneTag from "./MilestoneTag";
import RequestButton from "./RequestButton.js";
import CommentBox from "./CommentBox.js";
import Navbar from "./Navbar.js";
import pushContext from "../contexts/pushContext.js";

const windowW = Dimensions.get('window').width
const windowH = Dimensions.get('window').height

const Post = ({navigation, route}) => {
    const user = useContext(userContext)
    const push = useContext(pushContext)
    const milestoneData = require('../data/Milestones.json')
    const [commentToggle, setCommentToggle] = useState(route.params.comments?true:false)
    const [postId, setPostId] = useState(route.params.item.postId?route.params.item.postId:0)
    const [isPublic, setIsPublic] = useState(route.params.item.isPublic?route.params.item.isPublic:true)
    const [linkedMilestones, setLinkedMilestones] = useState([])
    const [milestoneList, setMilestoneList] = useState([])
    const [newComment, setNewComment] = useState('')
    const [userToken, setUserToken] = useState()
    const [commentList, setCommentList] = useState([])
    const [likesList, setLikesList] = useState([])
    const [userList, setUserList] = useState([])
    const [mediaType, setMediaType] = useState(route.params.item.image.toString().split('.').pop())
    const currentRoute = useRoute()
    const [loading, setLoading] = useState(true)
    const scrollY = useRef(new Animated.Value(0)).current

    const commentMessage = {
        to: userToken,
        sound: 'default',
        title: 'Milestone',
        body: `${user.username} commented on your post.`,  
        data: { route: "Post", item:route.params.item, comments:true},
    };

    function submitComment(comment) {
        setNewComment(comment)
        axios.post(`http://${user.network}:19001/api/postcomment`, 
            {postid:postId,userid:user.userId, comment:comment})
            .then(() => {console.log('comment posted')})
            .catch((error)=> console.log(error))
            if (user.userId !== route.params.item.ownerId) {   
                axios.post(`http://${user.network}:19001/api/commentnotification`, 
                {requesterId: user.userId, recipientId: route.params.item.ownerId, type:"comment", comment:comment, postId: postId})
                .then(() => {
                    console.log("comment notified")
                })
                .catch((error)=> console.log(error))
                if (userToken) {
                    const sendPush = async() => {
                        await push.sendPushNotification(userToken, commentMessage)
                    }
                    sendPush()
                }
            }
    }
    useEffect(()=> {    // for push notification on comments
        axios.get(`http://${user.network}:19001/api/getusers`)  
        .then((response)=> {
            if (route.params.item.ownerId !== undefined) {
                setUserToken(response.data.filter((item)=> item.id === route.params.item.ownerId)[0].pushtoken?
                `ExponentPushToken[${response.data.filter((item)=> item.id === route.params.item.ownerId)[0].pushtoken}]`:null)    
            }
        }).catch(error => console.log(error))
    }, [])
    useEffect(()=> {
        axios.get(`http://${user.network}:19001/api/getuserlikes/${postId}`)  
        .then((response)=> {
            setLikesList(response.data)
        }).catch(error => console.log(error))
    }, [])
    useEffect(()=> {
        axios.get(`http://${user.network}:19001/api/getusercomments/${postId}`)  
        .then((response)=> {
            setCommentList(response.data)
            setLoading(false)
        }).catch(error => console.log(error))
    }, [newComment])
    useEffect(()=> {
        axios.get(`http://${user.network}:19001/api/getpostmilestones/${postId}`)
        .then((response) => {
            setMilestoneList(response.data)
        }).catch(error=>console.log(error))
    }, [])
    function handlePress() {
        console.log(route.params)
     //   console.log(likesList)
     //   console.log(commentList)
    }
    const renderMilestone = ({ item }) => {
        return (
            <MilestoneTag 
                title={item.title} 
                streak={item.streak} 
                img={(item.img === undefined)?item.src:item.img} 
                id={item.idmilestones} 
                isLast={milestoneList.indexOf(item)=== milestoneList.length-1}
            />
        )
    }
    return (
        <View style={[styles.postPage]}>
            <Navbar title={'milestone'} scrollY={scrollY}/>
            <ScrollView nestedScrollEnabled={true} showsVerticalScrollIndicator={false}>
            <View style={[styles.feedSpace]}/>
            <View style={[styles.postContainer]}>
                <PostItem username={route.params.item.username} caption={route.params.item.caption} 
                src={route.params.item.src} image={route.params.item.image} postId={route.params.item.postId} 
                ownerId={route.params.item.ownerId} date={route.params.item.date}
                liked={route.params.item.liked} isLast={false} isPublic={route.params.item.isPublic} isViewable={true} onToggleComment={()=>setCommentToggle(!commentToggle)}/>
            </View>
            <View style={{marginTop:windowH*0.02}}>
                <View style={[(windowH>900)?styles.milestoneHeaderContainerLarge:styles.milestoneHeaderContainer]}>
                {milestoneList.length > 0?
                    <View style={{flexDirection:"row"}}>
                        <Text style={(windowH>900)?styles.milestoneHeaderLarge:styles.milestoneHeader}>
                            Posted Milestones             
                        </Text>
                        <Pressable onPress={handlePress}>
                           <Icon 
                           name='navigate-next' 
                           size={29} 
                           color="rgba(53, 174, 146, 1)" 
                           style={{bottom: 1}}/>
                      </Pressable>
                    </View>
                :null}
                </View>
                <View style={(windowH>900)?styles.PostTagContainerLarge:styles.PostTagContainer}>
                    <ScrollView horizontal scrollEnabled={false}>
                        <FlatList 
                            snapToAlignment="start"
                            decelerationRate={"fast"}
                            snapToInterval={(windowH*0.0756)+16}
                            showsVerticalScrollIndicator={false}
                            style={[styles.milestoneList]} 
                            data={milestoneList} 
                            renderItem={renderMilestone} 
                            keyExtractor={(item, index)=>index}>
                        </FlatList>
                    </ScrollView>
                </View>
            </View>
            </ScrollView>
                {(commentToggle)?
                     <CommentBox postId={route.params.item.postId} userId={user.userId} startToggle={commentToggle} mediaType={mediaType} 
                     likesList={likesList} commentList={commentList} onSubmitComment={(comment)=>submitComment(comment)} onToggle={()=>setCommentToggle(false)}
                     loading={loading}/>:null
                }
            <Footer/>
        </View>
    )
}

const styles = StyleSheet.create({
    postPage: {
        backgroundColor:"rgba(28, 28, 28, 1)",
        width:windowW,
        height: windowH + 300,
        overflow: "scroll",
        paddingBottom:300  
    },
    postContainer: {
        justifyContent:"center",
        flex:1,
        alignItems:"center",
        alignSelf:"center"
    },
    feedSpace: {
        marginTop:94, 
    },
    postSpace: {
        top:48
    },
    milestoneList: {
        minWidth:windowW*0.8,
        borderRadius: 8,
    },
    PostTagContainer: {
        minWidth:windowW * 0.8,
        maxHeight:windowH * 0.175,     
        top:windowH*(18/812),
        marginBottom:windowH*(56/windowH),
        alignSelf:"center"
    },
    milestoneHeaderContainer: {
        alignSelf:"center",
        minWidth:windowW*0.8,
        flexDirection:"row",
        left:4,
        maxHeight:22,
    },
    milestoneHeaderContainerLarge: {
        alignSelf:"center",
        minWidth:windowW*0.8,
        flexDirection:"row",
        left:4,
        maxHeight:22,
        top:windowH*(2/926),
    },
    PostTagContainerLarge: {
        minWidth:windowW * 0.8,
        maxHeight:windowH * 0.275,     
        marginBottom:windowH*(56/windowH),
        top: windowH*(22/926),
        alignSelf:"center"
    },
    milestoneHeader: {
        fontFamily:"Inter",
        fontSize: 20,
        color:"white",
    },
    milestoneHeaderLarge: {
        fontFamily:"Inter",
        fontSize: 20,
        color:"white",
    },
    footerPosition: {
        position:"absolute",
        bottom:0
    },
    footerSpace: {
        position:"absolute",
        bottom:0,
    },
    profilePic: {
        maxHeight:28,
        maxWidth:28,
    },
    addFriendContainer: {
        minWidth:windowW * (88/windowW),
        height: windowH * (24/windowH),
        borderRadius:4,
        justifyContent:"center"
    },
    addFriendText: {
        fontFamily:"InterBold",
        alignSelf:"center"
    },
})
export default Post