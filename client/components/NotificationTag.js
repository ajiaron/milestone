import  React, {useState, useEffect, useRef, useContext} from "react";
import { Text, StyleSheet, View, Image, Pressable, Dimensions, Animated, Alert } from "react-native";
import Icons from '../data/Icons.js'
import { Icon } from 'react-native-elements'
import { useNavigation, useRoute } from "@react-navigation/native";
import userContext from '../contexts/userContext'
import FastImage from "react-native-fast-image";
import axios from 'axios'
import uuid from 'react-native-uuid';

const windowW= Dimensions.get('window').width
const windowH = Dimensions.get('window').height

const NotificationTag = ({id, requesterId, recipientId, type, comment, postId, milestoneId, date, index, isFirst, refreshing}) => {
    const navigation = useNavigation()
    const user = useContext(userContext)
    const [userImg, setUserImg] = useState()
    const [username, setUsername] = useState()
    const [postImg, setPostImg] = useState()
    const [postData, setPostData] = useState()
    const [timestamp, setTimestamp] = useState()
    const [milestoneImg, setMilestoneImg] = useState()
    const [prompt, setPrompt] = useState()
    const [accepted, setAccepted] = useState(false)
    const [isFriend, setIsFriend] = useState(false)
    function acceptFriend() {
        axios.put(`http://${user.network}:19001/api/acceptfriend`, 
        {requesterid:requesterId,recipientid:user.userId})
        .then(() => {
            console.log('friend accepted')
        })
        axios.post(`http://${user.network}:19001/api/acceptnotification`, 
        {requesterId:user.userId,recipientId:requesterId, type:'accept'})
        .then(() => {
            console.log('acceptance notified')
        })
        .catch((error)=> console.log(error))
        setIsFriend(true)
    }
    function handleNavigation() {
        if (!postData) {
            Alert.alert("This post no longer exists.", "The owner has removed this post, or it could not be found.")
        }
        else {
            navigation.navigate("Post", {item:{
                postId:postId,
                username:postData.username,
                src:postData.profilepic,
                image:postImg,
                caption:postData.caption,
                ownerId:postData.ownerid,
                isPublic:postData.public,
                date:postData.date
            }, comments:false})
        }
    }
    function handleTest() {
        console.log(timestamp)
    }
    useEffect(()=> {
        const postDate = new Date(date)
        const newDate = new Date()
        if ((Math.abs(newDate-postDate)/1000) < 60) {
            setTimestamp(Math.round(Math.abs(newDate-postDate)/1000).toString()+'s')
        }
        else if ((Math.abs(newDate-postDate)/60000) < 60) {
            setTimestamp(Math.round(Math.abs(newDate-postDate)/60000).toString()+'m')
        }
        else if ((Math.abs(newDate-postDate)/3600000) < 24) {
            setTimestamp(Math.round(Math.abs(newDate-postDate)/3600000).toString()+'h')
        }
        else if ((Math.abs(newDate-postDate)/86400000) < 7) {
            setTimestamp(Math.round(Math.abs(newDate-postDate)/86400000).toString()+'d')
        }
        else if ((Math.abs(newDate-postDate)/86400000) < 30) {
            setTimestamp(Math.round(Math.round(Math.abs(newDate-postDate)/86400000)%7).toString()+'w')
        }
        else if ((Math.abs(newDate-postDate)/2592000000) < 12) {
            setTimestamp(Math.round(Math.abs(newDate-postDate)/2592000000).toString()+'mo')
        } else {
            setTimestamp(Math.round(Math.abs(newDate-postDate)/31536000000).toString()+'y')
        }
    }, [refreshing])
    useEffect(()=> {
        if (type === 'friend') {
            axios.get(`http://${user.network}:19001/api/getrequests`) 
            .then((response)=>{ 
                setIsFriend(response.data.filter((item)=>((item.requesterId === requesterId)||(item.recipientId === requesterId))&&
                ((item.requesterId === user.userId) || (item.recipientId === user.userId))).length > 0?
                response.data.filter((item)=>((item.requesterId === requesterId)||(item.recipientId === requesterId))&&
                ((item.requesterId === user.userId) || (item.recipientId === user.userId)))[0]?.approved:false)
            })
        }
    }, [])
    useEffect(()=> {
        if (type !=='friend' && type !== 'accept') {
            axios.get(`http://${user.network}:19001/api/getposts`) 
            .then((response)=> {
                setPostImg(response.data.filter((item)=> item.idposts === postId)[0].src)
                setPostData(response.data.filter((item)=> item.idposts === postId)[0])
            })
            .catch((error)=> console.log(error))
        }
    }, [])
    useEffect(()=> {
        axios.get(`http://${user.network}:19001/api/getusers`) 
        .then((response)=> {
          setUserImg(response.data.filter((item)=>item.id === requesterId)[0].src)
          setUsername(response.data.filter((item)=>item.id === requesterId)[0].name)
        })
        .catch((error)=> console.log(error))
    }, [])
    return (
        <View style={[styles.notificationBody, 
        {borderBottomWidth:(index===0)?0:2, borderTopWidth:(isFirst === index+1)?0:2}]}>
            <View style={[styles.notificationContent, ]}>
                <View style={{flexDirection:"row"}}>
                    <View style={{maxHeight:33, alignItems:"center", paddingRight:12, alignSelf:"center"}}>
                        <Pressable onPress={()=>navigation.navigate("Profile", {id:requesterId})}>
                            {
                            (!user.isExpo)?
                            <FastImage
                                style={{height:33, width:33, borderRadius:33, alignSelf:"center"}}
                                source={{
                                    uri:userImg,
                                    priority:FastImage.priority.normal
                                }}
                                resizeMode={FastImage.resizeMode.cover}
                            />:
                            <Image
                                style={{height:33, width:33, borderRadius:33, alignSelf:"center"}}
                                source={{uri:userImg}}
                                resizeMode='cover'
                            />
                            }
                        </Pressable>
                    </View>
                    <View style={{flexDirection:"row",alignSelf:"center", maxWidth:windowW*0.65}}>
                        <Text style={{fontFamily:"InterBold", color:"#fff", fontSize:14, alignSelf:"center"}} numberOfLines={2}>
                            {username}
                            <Text style={{fontFamily:"Inter"}}>
                            {
                                (type === 'like')&&
                                <Text>{` liked your recent post. `}<Text style={{fontSize:13}}>👍</Text>
                                </Text>

                            }
                            {
                                (type === 'comment')&&<Text numberOfLines={1}>{` commented: ${comment}`}</Text>
                            }
                            {
                                (type === 'friend')&&
                                <Text>{` sent you a friend request. `}<Text style={{fontSize:13}}>👋</Text>
                                </Text>
                            }
                            {
                                (type === 'accept')&&
                                <Text>{` accepted your friend request!`}<Text style={{fontSize:13}}></Text>
                                </Text>
                            }
                            {
                                (type === 'post')&&
                                <Text>{` posted to your milestone!`}
                                </Text>
                            }
                                <Text style={{color:"rgba(140,140,140,1)", fontSize:13, fontStyle:"InterLight"}}>  {timestamp}</Text>
                            </Text>
                        </Text>
                    </View>
                </View>
         
                <View style={{maxHeight:32,maxWidth:32, alignItems:"center", right:16, position:"absolute"}}>
                    <Pressable onPress={handleNavigation}>
                        {
                        (!user.isExpo)?
                        <FastImage
                            style={{height:32, width:32, borderRadius:4, alignSelf:"center"}}
                            source={{
                                uri:postImg,
                                priority:FastImage.priority.normal
                            }}
                            resizeMode={FastImage.resizeMode.cover}
                        />
                        :
                        <Image
                            style={{height:32, width:32, borderRadius:4, alignSelf:"center"}}
                            source={{uri:postImg}}
                            resizeMode='cover'
                        />
                        }
                    </Pressable>
                </View>
                {(type==='friend')?
                (isFriend)?
                <View style={{flexDirection:"row", position:"absolute", right:16}}>
                    <Icon 
                        name='check-circle'
                        style={{backgroundColor:"rgba(43, 164, 136, 1)", borderRadius:30}}
                        color="#232323"
                        size={28}
                    />
                </View>
                :
                 <View style={{flexDirection:"row", position:"absolute", right:16}}>
                    <Pressable onPress={acceptFriend}>
                        <Icon 
                            name='check-circle'
                            color="rgba(43, 164, 136, 1)"
                            size={32}
                        />
                    </Pressable>
                </View>:null
                }
            </View>
        </View>
    )
}
const styles = StyleSheet.create({
    notificationBody: {
        backgroundColor:'#232323',
        height:windowH*0.0756,
        width:windowW,
        borderColor:"rgba(28, 28, 28, 1)",
        borderTopWidth:1,
        borderBottomWidth:1,
        flex:1,
        alignItems:"center",
        justifyContent:"center"
    },
    notificationContent: {
        minWidth:windowW,
        flexDirection:"row",
        alignItems:"center",
        alignSelf:"center",
        paddingLeft:16,
        paddingRight:16
    },
    addFriendContainer: {
        minWidth:windowW * (68/windowW),
        height: windowH * (24/windowH),
        borderRadius:4,
        position:"absolute",
        right:12,
        justifyContent:"center"
    },
    addFriendText: {
        fontFamily:"InterBold",
        alignSelf:"center"
    },
})
export default NotificationTag