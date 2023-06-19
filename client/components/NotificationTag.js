import  React, {useState, useEffect, useRef, useContext} from "react";
import { Text, StyleSheet, View, Image, Pressable, Dimensions, Animated, Alert } from "react-native";
import Icons from '../data/Icons.js'
import { Icon } from 'react-native-elements'
import { useNavigation, useRoute } from "@react-navigation/native";
import {Swipeable} from 'react-native-gesture-handler'
import userContext from '../contexts/userContext'
import FastImage from "react-native-fast-image";
import axios from 'axios'
import uuid from 'react-native-uuid';

const windowW= Dimensions.get('window').width
const windowH = Dimensions.get('window').height

const NotificationTag = ({id, requesterId, recipientId, type, comment, postId, milestoneId, date, index, isFirst, refreshing, onClear}) => {
    const navigation = useNavigation()
    const user = useContext(userContext)
    const [userImg, setUserImg] = useState()
    const [username, setUsername] = useState()
    const [postImg, setPostImg] = useState()
    const [postData, setPostData] = useState()
    const [timestamp, setTimestamp] = useState()
    const [milestoneData, setMilestoneData] = useState()
    const [milestoneImg, setMilestoneImg] = useState()
    const [prompt, setPrompt] = useState()
    const [accepted, setAccepted] = useState(false)
    const [fileExt, setFileExt] = useState('')
    const [isFriend, setIsFriend] = useState(false)
    const animatedvalue = useRef(new Animated.Value(0)).current
    function clearNotification() {
        Animated.timing(animatedvalue,{
            toValue:100,
            duration:200,
            extrapolate:'clamp',
            useNativeDriver:false,
          }).start(()=>onClear(id))
    }
    const renderRightActions = (progress, dragX) => {
        const trans = dragX.interpolate({
            inputRange: [0, windowW/2],
            outputRange: [0,windowW/2],
            extrapolate:'clamp'
          });
        return (
            <Pressable onPress={clearNotification} style={[styles.deleteBody, {maxWidth:windowW*0.25}]}>
                <Text style={{color:"#fff", fontFamily:"Inter", fontSize:17}}>Clear</Text>
            </Pressable>
        )
    }
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
            if (type === 'join' && milestoneData) {
                milestoneData.id = milestoneData.idmilestones
                navigation.push("MilestonePage",
                { 
                    milestone:milestoneData, 
                    date:new Date(milestoneData.date).toLocaleDateString("en-US", {month:"short", day:"numeric", year:"numeric"}), 
                    count:milestoneData.count
                })
            }
            else {
                Alert.alert("This post no longer exists.", "The owner has removed this post, or it could not be found.")
            }
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
        console.log(fileExt)
    }
    function navigateProfile() {
        navigation.navigate("Profile", {id:requesterId})
    }
    useEffect(()=> {
        const postDate = new Date(date)
        const newDate = new Date()
        if ((Math.abs(newDate-postDate)/1000) < 60) {
            setTimestamp(Math.round(Math.abs(newDate-postDate)/1000).toString()+'s')
        }
        else if ((Math.abs(newDate-postDate)/60000) <= 60) {
            setTimestamp(Math.round(Math.abs(newDate-postDate)/60000).toString()+'m')
        }
        else if ((Math.abs(newDate-postDate)/3600000) <= 24) {
            setTimestamp(Math.round(Math.abs(newDate-postDate)/3600000).toString()+'h')
        }
        else if ((Math.abs(newDate-postDate)/86400000) <= 7) {
            setTimestamp(Math.round(Math.abs(newDate-postDate)/86400000).toString()+'d')
        }
        else if ((Math.abs(newDate-postDate)/86400000) <= 30) {
            setTimestamp(Math.round(Math.round(Math.abs(newDate-postDate)/86400000)/7).toString()+'w')
        }
        else if ((Math.abs(newDate-postDate)/2592000000) <= 12) {
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
        if (type == 'join') {
            axios.get(`http://${user.network}:19001/api/getmilestonedetails/${milestoneId}`)
            .then((response)=> {
                setMilestoneImg(response.data[0].src)
                setFileExt((response.data[0].src !== undefined)?response.data[0].src.toString().split('.').pop():response.data[0].src)
                setMilestoneData(response.data[0])
            })
            .catch((error)=> console.log(error))  
        }
    }, [])
    useEffect(()=> {
        if (type !=='friend' && type !== 'accept' && type !== 'join') {
            axios.get(`http://${user.network}:19001/api/getposts`) 
            .then((response)=> {
                setPostImg(response.data.filter((item)=> item.idposts === postId)[0].src)
                setFileExt(response.data.filter((item)=> item.idposts === postId)[0].src.toString().split('.').pop())
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
        <Swipeable renderRightActions={renderRightActions} overshootRight={false} >
            <Animated.View style={[styles.notificationBody,
            { height:animatedvalue.interpolate({inputRange:[0,100], outputRange:[windowH*0.0756,0]}),
              opacity:animatedvalue.interpolate({inputRange:[0,100], outputRange:[1,0]}),
             borderBottomWidth:(index===0)?0:animatedvalue.interpolate({inputRange:[0,100], outputRange:[2,0]}),
              borderTopWidth:(isFirst === index+1)?0:animatedvalue.interpolate({inputRange:[0,100], outputRange:[2,0]})}]}>
                <View style={[styles.notificationContent, ]}>
                    <View style={{flexDirection:"row"}}>
                        <View style={{maxHeight:33, alignItems:"center", paddingRight:12, alignSelf:"center"}}>
                            <Pressable onPress={handleTest}>
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
                                {
                                    (type === 'join')&&
                                    <Text>{` joined your milestone!`}
                                    </Text>
                                }
                                    <Text style={{color:"rgba(140,140,140,1)", fontSize:13, fontStyle:"InterLight"}}>  {timestamp}</Text>
                                </Text>
                            </Text>
                        </View>
                    </View>
            
                    <View style={{maxHeight:(fileExt==='jpg' || fileExt==='png')?34:31,maxWidth:(fileExt==='jpg' || fileExt==='png')?34:31, 
                    alignItems:"center", right:16, position:"absolute"}}>
                        <Pressable onPress={handleNavigation}>
                            {
                            (!user.isExpo)?
                            <FastImage
                                style={{height:(fileExt==='jpg' || fileExt==='png')?34:31, width:(fileExt==='jpg' || fileExt==='png')?34:31, 
                                borderRadius:4, alignSelf:"center"}}
                                source={
                                    (type==='join')?
                                        (fileExt==='jpg' || fileExt==='png')?
                                        {     
                                            uri:milestoneImg,
                                            priority:FastImage.priority.normal
                                        }
                                        :
                                        Icons[milestoneImg]
                                    :
                                    {
                                        uri:postImg,
                                        priority:FastImage.priority.normal
                                    }
                                }
                                resizeMode={FastImage.resizeMode.cover}
                            />
                            :
                            <Image
                                style={{height:(fileExt==='jpg' || fileExt==='png')?34:31, width:(fileExt==='jpg' || fileExt==='png')?34:31,
                                borderRadius:4, alignSelf:"center"}}
                                source={(fileExt!=='jpg'&&fileExt!=='png')?Icons[milestoneImg]:{uri:(type === 'join')?milestoneImg:postImg}}
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
            </Animated.View>
        </Swipeable>
    )
}
const styles = StyleSheet.create({
    notificationBody: {
        backgroundColor:'#232323',
        width:windowW,
        borderColor:"rgba(28, 28, 28, 1)",
        borderTopWidth:1,
        borderBottomWidth:1,
        flex:1,
        alignItems:"center",
        justifyContent:"center"
    },
    deleteBody: {
        backgroundColor:'#9c3a53',
        height:(windowH*0.0756),
        borderColor:"rgba(28, 28, 28, 1)",
        borderTopWidth:2,
        borderBottomWidth:2,
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