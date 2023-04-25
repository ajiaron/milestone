import React, {useState, useEffect, useContext, useRef, useCallback} from "react";
import { Text, Animated, StyleSheet, View, Image, FlatList, Pressable, TextInput, Switch, Dimensions } from "react-native";
import * as Device from 'expo-device'
import { Icon } from 'react-native-elements'
import { useNavigation, useRoute, useIsFocused} from "@react-navigation/native";
import Footer from './Footer'
import MilestoneTag from "./MilestoneTag";
import userContext from '../contexts/userContext'
import axios from 'axios'
import FastImage from "react-native-fast-image";
import uuid from 'react-native-uuid';
import { Video } from 'expo-av'
import { Amplify, Storage } from 'aws-amplify';
import awsconfig from '../src/aws-exports';
Amplify.configure(awsconfig);

const windowW = Dimensions.get('window').width
const windowH = Dimensions.get('window').height

const CreatePost = ({route}) => {
    const img = (route.params.uri !== undefined)?route.params.uri:require('../assets/samplepostwide.png')
    const imgType = (route.params.type !== undefined)?route.params.type:"back"
    const asset = (route.params.asset !== undefined)?route.params.asset:'image'
    var fileExt = (route.params.uri !== undefined)?route.params.uri.toString().split('.').pop():'png';
    const date = new Date().toISOString().slice(0, 19).replace('T', ' ')
    const [commmentsEnabled, setCommentsEnabled] = useState(true)
    const toggleComments = () => setCommentsEnabled(previousState => !previousState)
    const [likesEnabled, setLikesEnabled] = useState(true)
    const toggleLikes = () => setLikesEnabled(previousState => !previousState)
    const [sharingEnabled, setSharingEnabled] = useState(true)
    const toggleSharing = () => setSharingEnabled(previousState => !previousState)
    const [caption, setCaption] = useState('')
    const [milestoneList, setMilestoneList] = useState([])
    const milestoneData = require('../data/Milestones.json')
    const [milestones, setMilestones] = useState([])
    const navigation = useNavigation()
    const user = useContext(userContext)
    const isFocused = useIsFocused()
    const [postId, setPostId] = useState(0)
    const [file, setFile] = useState()
    const [personalMilestones,setPersonalMilestones] = useState([])
    const [loading, setLoading] = useState(false)
    const [progress, setProgress] = useState(0)
    const [isPersonal, setIsPersonal] = useState(true)
    const animatedvalue = useRef(new Animated.Value(0)).current;

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
    useEffect(()=> {
        axios.get(`http://${user.network}:19001/api/getposts`)
        .then((response)=> {
            setPostId(uuid.v4())
        })
        .catch((error)=> console.log(error))
    }, [])
    useEffect(()=> {
        axios.get(`http://${user.network}:19001/api/getmilestones`)
        .then((response)=> {
            setPersonalMilestones(response.data.filter((item)=>item.ownerId === user.userId))
            setMilestoneList(response.data.filter((item)=>item.postable === "Everyone"))
        })
        .catch((error)=> console.log(error))
    },[isFocused])
    const postData = {
        id:0,
        img:require('../assets/samplepost.png'),
        caption:'',
        profilePic:'defaultpic',
        username:user.username?user.username:'ajiaron',
        src:'defaultpost'
    }
    const fetchContent = async (uri) => {
        setLoading(true)
        const response = await fetch(uri)
        const blob = await response.blob()
        return blob
    }
    const uploadContent = async (uri) => {
        const content = await fetchContent(uri)
        return Storage.put(`post-content-${Math.random()}.${fileExt}`, content, {
            level:'public',
            contentType: asset,
            progressCallback(uploadProgress) {
                setProgress(Math.round((uploadProgress.loaded/uploadProgress.total)*100))
                console.log('progress --',uploadProgress.loaded+'/'+uploadProgress.total)
            }
        })
        .then((res)=> {
            setFile(`https://d2g0fzf6hn8q6g.cloudfront.net/public/${res.key}`)
            console.log('result ---',`https://d2g0fzf6hn8q6g.cloudfront.net/public/${res.key}`)
            axios.post(`http://${user.network}:19001/api/pushposts`, 
            {idposts: postId,username:user.username?user.username:'ajiaron', caption:caption, 
            profilepic:(user.image !== undefined)?user.image:'defaultpic', 
            src:`https://d2g0fzf6hn8q6g.cloudfront.net/public/${res.key}`, date: date, ownerid:user.userId,
            likes:likesEnabled, comments:commmentsEnabled, public:sharingEnabled
        })
            .then(() => {
                console.log('new post saved')
                setLoading(false)
                navigation.navigate("Feed", {post: postData, milestones:milestones})
            })
            .catch((error)=> console.log(error))
        })
        .catch((e)=>console.log(e))
    }
    function handleUpload() {
       // console.log('comments:',commmentsEnabled)
       // console.log('likes:',likesEnabled)
       // console.log('public:',sharingEnabled)
       // console.log(postId)
        console.log(milestoneList.filter((item)=>item.ownerId === user.userId).length )
    }
    function handlePress() {
        uploadContent(img)
        milestones.map((item)=>{
            // check owner of each milestone and send notification of post to milestone owners
            axios.post(`http://${user.network}:19001/api/linkmilestones`, 
            {postid:postId,milestoneid:item.id})
            .then(() => {
                console.log('milestones linked')
            })    
            .catch((error)=> console.log(error))
            if (item.ownerid !== user.userId) {
                axios.post(`http://${user.network}:19001/api/postnotification`,
                {requesterId:user.userId, recipientId:item.ownerid, type:'post', postId:postId, milestoneId:item.id})
                .then(() => {
                    console.log('post notified')
                }) 
                .catch((error)=> console.log(error))
            }
        })
    }
    function submitPost() {
        handlePress()
    }
    const renderMilestone = ({ item }) => {
        return (
            <MilestoneTag 
                title={item.title} 
                streak={item.streak} 
                img={milestoneList.length>0?item.src:item.img} 
                id={milestoneList.length>0?item.idmilestones:item.id} 
                ownerid={milestoneList.length>0?item.ownerId:0}
                isLast={milestoneList.map(item=>item.idmilestones).indexOf(item.idmilestones) === milestoneList.length-1}
                isEmpty={isPersonal && milestoneList.filter((val)=>val.ownerId === user.userId).indexOf(item) === 
                    milestoneList.filter((val)=>val.ownerId === user.userId).length-1}
                date={item.date}
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
                        <Video isLooping shouldPlay isMuted={true}
                        style={(imgType==="front")?[styles.newPostImageContainer, {transform:[{rotateY:'180deg'}]}]:styles.newPostImageContainer}
                        resizeMode="cover"
                        source={{uri:img}}/>
                        :
                        (!user.isExpo)?
                        <FastImage
                        style={(imgType==="front")?[styles.newPostImageContainer, {transform:[{rotateY:'180deg'}]}]:styles.newPostImageContainer}
                        resizeMode={FastImage.resizeMode.cover}
                        source={route.params.uri?{
                            uri:img,
                            priority:FastImage.priority.normal
                        }:require('../assets/samplepost.png')}
                        />
                        :
                        <Image 
                        style={(imgType==="front")?[styles.newPostImageContainer, {transform:[{rotateY:'180deg'}]}]:styles.newPostImageContainer}
                        resizeMode="cover"
                        source={route.params.uri?{uri:img}:require('../assets/samplepost.png')}
                    />
                    }
       
                </View>
                <View style={styles.milestoneListHeader}>
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
                         <Pressable onPress={()=>navigation.navigate("CreateMilestone", {from:'create'})} style={{top:14, marginBottom:232}}>
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
                        initialNumToRender={0}
                        maxToRenderPerBatch={4}
                        snapToInterval={(windowH*0.0756)+16}
                        showsVerticalScrollIndicator={false}
                        style={[styles.milestoneList]} 
                        data={isPersonal?[...milestoneList.filter((item)=>item.ownerId === user.userId)].reverse():milestoneList} 
                        renderItem={renderMilestone} 
                        keyExtractor={(item)=>item.idmilestones.toString()}>
                    </FlatList> }
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
                    <Pressable onPress={handleUpload}>
                        <View style={styles.savePostButtonContainer}>
                            <Text style={styles.savePostButtonText}>Archive</Text>
                        </View>
                    </Pressable>
                    <Pressable onPress={submitPost} disabled={loading}>
                    <View style={styles.publishPostButtonContainer}>
                        <Text style={styles.publishPostButtonText}>{(loading)?`Loading... ${progress}%`:"Publish"}</Text>
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
        paddingBottom:16,
        borderRadius: 8,
    },
    PostTagContainer: {
        flex: 1,
        minWidth:windowW * 0.8,
        maxHeight:windowH * 0.367,
        alignSelf:"center",
        bottom:26
    },
    milestoneListHeader: {
        maxWidth:windowW * 0.8,
        height: windowH * 0.052,
        flex:1,
        flexDirection:"row",
        justifyContent:"space-between"
    },
    milestoneHeaderEndText: {
        fontFamily:"InterBold",
        fontSize:11,
        right:2,
        alignSelf:"flex-start",
        color:"rgba(195, 191, 191, 1)",
    },
    milestoneHeaderText: {
        fontFamily:"InterBold",
        fontSize:11,
        left:2,
        color:"rgba(195, 191, 191, 1)",
        alignSelf:"flex-start"
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
        color:"white",
        bottom:0.25,
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
        width:windowW * 0.804,
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
        width:windowW * 0.8,
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

export default CreatePost