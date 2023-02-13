import  React, {useState, useEffect, useContext, useRef} from "react";
import { Text, StyleSheet, View, Image, Pressable, TextInput, ScrollView, FlatList, Dimensions, Animated } from "react-native";
import { Icon } from 'react-native-elements'
import AppLoading from 'expo-app-loading'
import { useNavigation, useRoute } from "@react-navigation/native";
import GlobalStyles from "../styles/GlobalStyles";
import Footer from './Footer'
import axios from 'axios'
import PostItem from "./PostItem";
import userContext from '../contexts/userContext'
import MilestoneTag from "./MilestoneTag";

const windowW = Dimensions.get('window').width
const windowH = Dimensions.get('window').height

const CommentBox = ({postId, userId, commentList, onSubmitComment}) => {
    const [toggled, setToggled] = useState(false)
    const [comment, setComment] = useState('')
    const animatedvalue = useRef(new Animated.Value(0)).current;

    const slideup = () => {
        setToggled(true)
        Animated.timing(animatedvalue,{
            toValue:(windowW>400)?windowH*.62:windowH*.58,
            duration:300,
            useNativeDriver:false,
        }).start()
    }
    const slidedown = () => {
        Animated.timing(animatedvalue,{
            toValue:0,
            duration:300,
            useNativeDriver:false,
        }).start(() => setToggled(false))
    }
    function handleToggle() { 
        if (!toggled) {
            slideup()
        } else {
            slidedown()
        }
    }
    
    function handleSubmit(comment) {
        if (comment.length > 0) {
            onSubmitComment(comment)
            slidedown()
            setComment('')
        } 
    }
    const renderComments = ({item}) => {
        var fileExt = (item.img !== undefined)?item.img.toString().split('.').pop():'png'
        return (
            <View style={{marginTop:12}}>
                <View style={{flexDirection:"row", backgroundColor:"rgba(21,21,21,1)"}}>
                <View>
                    <Image
                        style={styles.profilePic}
                        resizeMode="contain"
                        source={{uri:item.img}}/>
                </View>
                <Text style={{color:"white", fontFamily:"Inter", fontSize:13}}>
                    <Text style={{fontFamily:"InterBold", fontSize:13}}>{item.name}{'  '}</Text>
                    {item.comment}
                </Text>
            </View>
            </View>
            
        )
    }
    return (
        <Animated.ScrollView
         style={[styles.commentContent]} 
         showsVerticalScrollIndicator={false}
         onScroll={(event)=>{
            const currentY = event.nativeEvent.contentOffset.y
            if (currentY < -8) {
                slidedown()
            } 
         }}
         keyboardDismissMode={'on-drag'}
         scrollEventThrottle={0}
         removeClippedSubviews
         scrollEnabled={toggled}
         >
            <View style={{flexDirection:"row", alignItems:"center", flex:"1"}}>
                <TextInput style={[styles.commentText,{flex:1, top:(!toggled)?0.5:(windowH>900)?2:2.25}]} 
                scrollEnabled={true}
                readOnly={toggled}
                onPressIn={(animatedvalue === 0 || !toggled)?handleToggle:null}
                onChangeText={(e)=>setComment(e)}
                placeholder={'Add a comment...'}
                placeholderTextColor={'rgba(130, 130, 130, 1)'}
                value={comment}
                />
                <Pressable onPress={()=>handleSubmit(comment)}>  
                    <Icon 
                        style={{alignSelf:"center", right:0, top:(!toggled)?0:(windowH>900)?1:1.25}}
                        name={(comment.length>0)?'send':'clear'}
                        color='rgba(130, 130, 130, 1)'
                        size={(windowH>900)?22:22}
                    />
                </Pressable>
            </View>
            <Animated.View style={[{height:animatedvalue, borderColor:'rgba(100, 100, 100, 1)',backgroundColor:"rgba(21,21,21,1)"}]}>
                <ScrollView horizontal={true} scrollEnabled={false}>
                    <FlatList 
                        snapToAlignment="start"
                        decelerationRate={"fast"}
                        showsVerticalScrollIndicator={false}
                        data={commentList} 
                        renderItem={renderComments} 
                        />
                </ScrollView>
            </Animated.View>
        </Animated.ScrollView>
    )
}
const Post = ({navigation, route}) => {
    const user = useContext(userContext)
    const milestoneData = require('../data/Milestones.json')
    const [commentToggle, setCommentToggle] = useState(route.params.comments?true:false)
    const [postId, setPostId] = useState(route.params.item.postId?route.params.item.postId:0)
    const [linkedMilestones, setLinkedMilestones] = useState([])
    const [milestoneList, setMilestoneList] = useState([])
    const [hasMilestones, setHasMilestones] = useState(route.params.item.milestones.length > 0)
    const [newComment, setNewComment] = useState('')
    const [commentList, setCommentList] = useState([])
    const [userList, setUserList] = useState([])
    const currentRoute = useRoute()
    function submitComment(comment) {
        console.log(user.username, comment)
        axios.post(`http://${user.network}:19001/api/postcomment`, 
            {postid:postId,userid:user.userId, comment:comment})
            .then(() => {console.log('comment posted')})
            .catch((error)=> console.log(error))
    }
    useEffect(()=> {
        axios.get(`http://${user.network}:19001/api/getcomments`)  
        .then((response)=> {
            setCommentList(response.data.filter((item)=>item.postid === postId))
        }).catch(error => console.log(error))
    }, [])
    useEffect(()=> {
        axios.get(`http://${user.network}:19001/api/getusers`)  
        .then((response)=> {
           response.data.filter((item)=>commentList.map((val)=>val.userid).indexOf(item.id) > -1).map((item)=>
                { commentList.forEach((e) => {
                    if (e.userid === item.id) {
                        e.name=item.name
                        e.img=item.src
                    }
                })
                }
            )
        }).catch(error => console.log(error))
    }, [commentList])
    useEffect(()=> {
        axios.get(`http://${user.network}:19001/api/getlinkedmilestones`)  // if this throws an error, replace 10.0.0.160 with localhost
        .then((response)=> {
            setLinkedMilestones(response.data.filter((item)=>item.postid === postId).map((item)=>item.milestoneid))
        }).catch(error => console.log(error))
    }, [])
    useEffect(()=> {
        axios.get(`http://${user.network}:19001/api/getmilestones`)
        .then((response) => {
            setMilestoneList(response.data.filter((item)=>linkedMilestones.indexOf(item.idmilestones) >= 0))
        }).catch(error=>console.log(error))
    }, [linkedMilestones])
    function handlePress() {
        console.log(commentList)
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
            <ScrollView nestedScrollEnabled={true} showsVerticalScrollIndicator={false}>
            <View style={[styles.feedSpace]}/>
            <View style={[styles.postContainer]}>
                <PostItem username={route.params.item.username} caption={route.params.item.caption} 
                src={route.params.item.src} image={route.params.item.image} postId={route.params.item.postId} 
                ownerId={route.params.item.ownerId} date={route.params.item.date}
                liked={route.params.item.liked} isLast={false} isViewable={true} onToggleComment={()=>setCommentToggle(!commentToggle)}/>
            </View>
            {milestoneList.length > 0?
            <View >
                <View style={[(windowH>900)?styles.milestoneHeaderContainerLarge:styles.milestoneHeaderContainer]}>
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
            </View> : null}
            </ScrollView>
                {(commentToggle)?
                     <CommentBox postId={route.params.item.postId} userId={user.userId} commentList={commentList} 
                     onSubmitComment={(comment)=>submitComment(comment)}/>:null
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
        overflow: "hidden",
        paddingBottom:300  
    },
    postContainer: {
        justifyContent:"center",
        flex:1,
        alignItems:"center",
        alignSelf:"center"
    },
    feedSpace: {
        marginTop:48, 
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
    commentContent: {
        width:windowW,
        paddingLeft:20,
        paddingRight:20,
        backgroundColor:"rgba(21,21,21,1)",
        zIndex:1,
    },
    commentContentToggled: {
        width:windowW,
        height:windowH*(226/windowH),
        paddingLeft:20,
        paddingRight:20,
        backgroundColor:"rgba(21,21,21,1)",
        zIndex:1,
    },
    commentText: {
        width:windowW - 66,
        alignSelf:"center",
        fontFamily:"Inter",
        fontSize:13,
        color:"#FFF",
        height:windowH*(46/windowH),
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
})
export default Post