import  React, {useState, useRef, useEffect} from "react";
import { Text, StyleSheet, View, Image, Pressable, TextInput, ScrollView, Dimensions, TouchableOpacity } from "react-native";
import { Icon } from 'react-native-elements'
import AppLoading from 'expo-app-loading'
import { useNavigation, useRoute } from "@react-navigation/native";
import Icons from '../data/Icons.js'
import axios from 'axios'
import Footer from './Footer'
import { Video } from 'expo-av'

const windowW = Dimensions.get('window').width
const windowH = Dimensions.get('window').height

const PostItem = ({username, caption, src, image, postId, liked, isLast, milestones, date, index, count, isViewable}) => {
    const milestoneList = milestones?milestones:[]
    const navigation = useNavigation()
    const route = useRoute()
    const [isActive, setIsActive] = useState(true)
    var fileExt = (image !== undefined)?image.toString().split('.').pop():'png'
    const month = new Date().toLocaleString("en-US", { month: "short" })
    const day = new Date().getDate()
    const postdate = month + ' ' + day
    const [isMuted, setIsMuted] = useState(true)
    const [isLiked, setIsLiked] = useState(liked?liked:false)
    const [postDate, setPostDate] = useState(date?date:postdate)
    const [viewable, setViewable] = useState(true)
    useEffect(()=> {
        setViewable(isViewable)
    }, [isViewable])
    const handlePress = () => {
        setIsLiked(!isLiked)
        liked = isLiked
    }
    const handleSelect = () => {
        setIsActive(!isActive)
        console.log(fileExt)
    }
    const toggleMute = () => {
        if (isViewable !== undefined) {
            console.log(isActive)
        }
        setIsMuted(!isMuted)
    }
    const data = {
        postId:postId,
        username:username,
        src:src,
        image:image,
        caption:caption, 
        liked:isLiked,
        milestones:milestoneList
    }
    return (
     <View style={[styles.postContainer]}>
        <View style={[styles.postHeader]}>
            <View style={[styles.profilePicContainer]}>
            <Image
                style={styles.profilePic}
                resizeMode="contain"
                source={Icons[src]}/>
            </View>
            <View style={[styles.postUserHeader]}>
                <Text style={[styles.postOwnerName]}> {username} </Text>
                <Text style={[styles.postOwnerTime]}>{(date)?(date === postdate)?`Today at ` + date:date:`Today at Jan 02`}</Text>
            </View>
        </View>
        <Pressable onPress={handleSelect}>
            <View style={[styles.postWrapper, 
                    {backgroundColor:(route.name === 'MilestonePage')?'rgba(108, 162, 183,1)':"rgba(10,10,10,1)",
                    height:(route.name === 'MilestonePage')?windowH*(246/windowH):(fileExt === 'mov' || fileExt === 'mp4')?windowH*(526/windowH):windowH*(266/windowH)
                    }]}>
                    {(route.name === 'MilestonePage' || image !=='defaultpost')?
                    (fileExt === 'mov' || fileExt === 'mp4')? 
                        <Video isLooping shouldPlay={isActive && viewable}
                            isMuted={isMuted} 
                            source={{uri:image}}
                            resizeMode={'cover'}
                            style={{height:"100%", width:"100%",alignSelf:"center"}}>
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
                    :
                    <Image
                        source={(image === 'defaultpost')?Icons[image]:{uri:image}}
                        resizeMode={'cover'}
                        style={{height:"100%", width:"100%",alignSelf:"center", bottom:0, zIndex:1}}
                    />:null
                    } 
            </View>
        </Pressable>
        <View style={[styles.actionbarContainer]}>
            <View style={[styles.actionIcon, styles.actionThumbsUp]}>
                <Pressable onPress={handlePress}>
                    {isLiked ?
                        <Icon 
                        size={27}
                        name='thumb-up-off-alt'
                        color='rgba(53, 174, 146, 1)' />:
                        <Icon 
                        size={27}
                        name='thumb-up-off-alt'
                        color='white' />
                    }
                </Pressable>
            </View>
            <View style={[styles.actionIcon, styles.actionComment]}>
                <Icon 
                    size={25.5}
                    name='question-answer'
                    color='white'
                />
            </View>
            {(route.name === 'MilestonePage')?
                (index !== undefined)?
                <View style={{flexDirection:"row", 
                alignSelf:"center", justifyContent:"space-around",
                 minWidth:windowW*(43/windowW), marginLeft:(windowW > 400)?windowW*0.1875:windowW*0.145}}> 
                    {(count > 1)&&
                    <View style={[styles.postIndex, {backgroundColor:(index == 0)?"rgba(53, 174, 146, 1)":"#D9D9D9"}]}/>}
                    {(count > 1)&&
                    <View style={[styles.postIndex, {backgroundColor:(index == 1)?"rgba(53, 174, 146, 1)":"#D9D9D9"}]}/>}
                    {(count > 2)&&
                    <View style={[styles.postIndex, {backgroundColor:(index >= 2)?"rgba(53, 174, 146, 1)":"#D9D9D9"}]}/>}
                </View>:null
            :
            <Pressable onPress={()=> navigation.navigate("Post", {item:data})}>
                <View style={[styles.actionIcon]}>
                    <Image
                        style={styles.milebookImage}
                        resizeMode="contain"
                        source={require("../assets/milebook-logo.png")} 
                    />
                </View>
            </Pressable>
            }
        </View>
        <View style={[styles.commentsContainer, {minHeight:(route.name === 'MilestonePage')?50:80}]}>
            <Text style={[styles.commentsContent]}>{caption}</Text>
            {(route.name === "MilestonePage")?null:
            <Text style={[styles.viewPostLink]}>View Milestones {'&'} Groups</Text>}
        </View>
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
    actionIcon: {
        marginLeft:32,
    },
    actionThumbsUp: {
        marginTop:1,
        marginRight:2,
        marginLeft:20
    },
    actionComment: {
        marginTop:3,
        marginRight:4
    },
    milebookImage: {
        maxHeight:26,
        maxWidth:26
    },
    feedSpace: {
        marginTop:44, 
    },
    footerSpace: {
        marginTop:10,
        backgroundColor:"rgba(28, 28, 28, 1)"
    },
    postWrapper: {
        height:windowH*(266/windowH),
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
        color:"white",
        bottom:-1,
        fontSize:11
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