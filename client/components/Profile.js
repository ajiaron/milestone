import  React, {useState, useEffect, useContext, useRef} from "react";
import { Text, StyleSheet, View, Image, FlatList, Pressable, TextInput, ScrollView, Dimensions, Animated, NativeModules} from "react-native";
import { Icon } from 'react-native-elements'
import { useNavigation, useRoute } from "@react-navigation/native";
import Footer from './Footer'
import MilestoneTag from "./MilestoneTag";
import Navbar from "./Navbar";
import FastImage from 'react-native-fast-image'
import pushContext from "../contexts/pushContext";
import userContext from '../contexts/userContext'
import SharedGroupPreferences from 'react-native-shared-group-preferences';
import Constants from "expo-constants";
import axios from 'axios'

const windowW = Dimensions.get('window').width
const windowH = Dimensions.get('window').height
const group = `group.${Constants.manifest.ios.bundleIdentifier}`

const ProfileInfo = ({name, milestones, count, friends, owner}) => {
    return (
        <View style={[styles.profileInfoContainer, {top:(owner)?windowH*0.23:windowH*0.2385}]}>
            <View style={[styles.profileNameWrapper]}>
               <Text style={[styles.profileInfoName]}>{name}</Text>
            </View>
            <View style={[styles.profileInsights]}>
                <View style={[styles.milestoneInsightsHeader]}>

                    <View style={[styles.milestoneInsightWrapper]}>
                        <Text style={[styles.milestoneInsightText]}>MILESTONES</Text>
                        <Text style={[styles.milestoneInsightItem]}>{milestones}</Text>
                    </View>

                    <View style={[styles.milestoneInsightWrapper]}>
                        <Text style={[styles.milestoneInsightText]}>POSTS</Text>
                        <Text style={[styles.milestoneInsightItem]}>{count}</Text>
                    </View>

                    <View style={[styles.milestoneInsightWrapper]}>
                        <Text style={[styles.milestoneInsightText]}>FRIENDS</Text>
                        <Text style={[styles.milestoneInsightItem]}>{friends}</Text>
                    </View>

                </View>
            </View>
        </View>
    )
}

const Profile = ({route}) => {
    const user = useContext(userContext)
    const push = useContext(pushContext)
    const page = useRoute()
    const [profilePic, setProfilePic] = useState()
    const [userid, setUserid] = useState(route.params.id)
    const [owner, setOwner] = useState(route.params.id === user.userId)
    const [userData, setUserData] = useState()
    const [postCount, setPostCount] = useState(0)
    const [loading, setLoading] = useState(true)
    const [requested, setRequested] = useState(false)
    const [milestones, setMilestones] = useState([])
    const [favorite, setFavorite] = useState(1)
    const [milestoneCount, setMilestoneCount] = useState(0)
    const navigation = useNavigation()
    var fileExt = (user.image !== undefined)?user.image.toString().split('.').pop():'png';
    const animatedvalue = useRef(new Animated.Value(0)).current;
    const scrollY = useRef(new Animated.Value(0)).current;
    const [accept, setAccept] = useState(false)
    const [isFriend, setIsFriend] = useState(false)
    const [userToken, setUserToken] = useState()
    const [friends, setFriends] = useState([])
    const { SharedContainer } = NativeModules;

    const friendMessage = {
        to: userToken,
        sound: 'default',
        title: 'Milestone',
        body: `${user.username} sent you a friend request.`,  
        data: { route: "Friends" },
    };
    useEffect(()=> {    // set displayed milestone to the favorited one
        axios.get(`http://${user.network}:19001/api/getjoinedmilestones/${(owner)?user.userId:userid}`)
        .then((response)=> {
            setMilestones(response.data)
            setMilestoneCount(response.data.length)
        })
    }, [favorite])
    useEffect(()=> {
        axios.get(`http://${user.network}:19001/api/getuserdetails/${userid}`)
        .then((response)=> {
            setProfilePic(response.data[0].src)
            setUserData(response.data[0])
            setPostCount(response.data[0].count)
            setFavorite(response.data[0].favoriteid)
            setUserToken(response.data[0].pushtoken?
            `ExponentPushToken[${response.data.filter((item)=> item.id === userid)[0].pushtoken}]`:null)
        })
        axios.get(`http://${user.network}:19001/api/getrequests`)
        .then((response)=> {
            setFriends(response.data.filter((item)=> (item.requesterId === userid || item.recipientId === userid) && item.approved).length)
            if (response.data.filter((item)=> (item.requesterId === user.userId || item.recipientId === user.userId)).length > 0) {
                setIsFriend(response.data.filter((item)=>((item.requesterId === userid)||(item.recipientId === userid))&&
                ((item.requesterId === user.userId) || (item.recipientId === user.userId))).length > 0?
                response.data.filter((item)=>((item.requesterId === userid)||(item.recipientId === userid))&&
                ((item.requesterId === user.userId) || (item.recipientId === user.userId)))[0].approved:false)
                setRequested(response.data.filter((item)=> item.requesterId === user.userId).map((val)=> val.recipientId).indexOf(userid) > -1)
                setAccept(response.data.filter((item)=> item.recipientId === user.userId).map((val)=> val.requesterId).indexOf(userid) > -1)
            }   
        })
     }, [route])
     useEffect(()=> {
        handleRequest()
     }, [requested])
    const renderMilestone = ({ item, index }) => {
        return (
            <MilestoneTag title={item.title} streak={item.streak} img={item.src} id={item.idmilestones} isLast={index === milestones.length - 1} />
        )
    }
    function requestFriend() {
        axios.post(`http://${user.network}:19001/api/requestfriend`, 
        {requesterid:user.userId,recipientid:userid, approved:false})
        .then(() => {
            console.log('requested')
            setRequested(true)
        })
        .catch((error)=> console.log(error))
        axios.post(`http://${user.network}:19001/api/friendnotification`, 
        {requesterId:user.userId, recipientId:userid, type:'friend'})
        .then(() => {
            console.log('friend request notified')
        })
        .catch((error)=> console.log(error))
        if (userToken) {    // must be using a physical device to send push notifications
            const sendPush = async() => {
                friendMessage.body = `${user.username} sent you a friend request.`
                await push.sendPushNotification(userToken, friendMessage)
            }
            sendPush()
        }
    }
    function acceptFriend() {
        axios.put(`http://${user.network}:19001/api/acceptfriend`, 
        {requesterid:userid,recipientid:user.userId})
        .then(() => {
            setIsFriend(true)
        })
        axios.post(`http://${user.network}:19001/api/acceptnotification`, 
        {requesterId:user.userId,recipientId:userid, type:'accept'})
        .then(() => {
            console.log('acceptance notified')
        })
        .catch((error)=> console.log(error))
        if (userToken) {    // must be using a physical device to send push notifications
            const sendPush = async() => {
                friendMessage.body = `${user.username} accepted your friend request!`
                await push.sendPushNotification(userToken, friendMessage)
            }
            sendPush()
        }
    }
    function deleteFriend() {
        axios.delete(`http://${user.network}:19001/api/deletefriend`, {data: {requesterid:user.userId, recipientid:userid}})
        .then((response)=> console.log("requester deleted"))
        .catch(error=>console.log(error))
        axios.delete(`http://${user.network}:19001/api/deletefriend`, {data: {requesterid:userid, recipientid:user.userId}})
        .then((response)=>  setRequested(false))
        .catch(error=>console.log(error))
    }
    function handleRequest() {
        if (requested) {
            Animated.timing(animatedvalue,{
                toValue:100,
                duration:150,
                useNativeDriver:false,
            }).start()
        } else {
            Animated.timing(animatedvalue,{
                toValue:0,
                duration:150,
                useNativeDriver:false,
            }).start(()=>requestFriend)
        }
        // handle friend request here
    }
    const testWidget = async () => {

        try {
            const widgetData = await SharedGroupPreferences.getItem("widgetKey", group)
            const widgetImage = await SharedGroupPreferences.getItem("widgetImage", group)
            const widgetPath = await SharedGroupPreferences.getItem("widgetDataKey", group)
            if (widgetData && widgetImage && widgetPath) {
                console.log(widgetData)
                console.log(widgetImage.data.length)
                console.log(widgetPath)
            }
            else {
                console.log("data not found")
            }
        } catch (error) {
            console.log(error)
        }
    }
    const testModule = async() => {
        try {
            const sharedPath = await SharedContainer.getSharedContainerPath()
            console.log(sharedPath)
        } catch(error) {
            console.log(error)
        }
    }
    function handleTest() {
        testModule()
    }

    function handlePress() {
        navigation.navigate("Settings")
    }
    return (
        <View style={[styles.profilePage]}>
            {(owner)?
            <View style={{flex:1,flexDirection:"row", height:76, position:"absolute", backgroundColor:"#171717",
            top:0, alignSelf:"center", width:'100%', justifyContent:"space-around", alignItems:"flex-end", 
            paddingBottom:(windowH>900)?10:8, borderBottomLeftRadius:15, borderBottomRightRadius:15}}>
                <Pressable onPress={()=>navigation.navigate("Archive",{id:route.params.id})}>
                    <Text style={[styles.headerNavTitle, {alignSelf:"center",
                      color:(route.name==="Archive")?"rgba(210,210,210,1)":"rgba(160,160,160,1)",
                      fontFamily:(route.name === "Archive")?"InterBold":"Inter"}]}>Archive</Text>
                </Pressable>
                <View>
                    <Text style={[styles.headerNavTitle, {alignSelf:"center",
                    color:(route.name==="Profile")?"rgba(210,210,210,1)":"rgba(160,160,160,1)",
                    fontFamily:(route.name==="Profile")?"InterBold":"Inter"}]}>Profile</Text>
                </View>

            </View>:
            <Navbar title={'milestone'} scrollY={scrollY} />
            }
            <View style={[styles.userInfoContainer, {top:(owner)?"27.5%":"30.5%",
                marginBottom:(owner)?windowH*0.0175:windowH*0.025}]}>
                    <Pressable onPress={handleTest}>
                        {
                        (!user.isExpo)?
                        <FastImage
                            style={{width:windowW*(60/windowW), height:windowH*(60/windowH), alignSelf:"center", borderRadius:60}}
                            resizeMode={FastImage.resizeMode.contain}
                            defaultSource={require("../assets/profile-pic-empty.png")}
                            source={{
                                uri:(!owner)?profilePic:user.image,
                                priority: FastImage.priority.normal
                            }}
                        />
                        :
                        <Image
                            style={{width:windowW*(60/windowW), height:windowH*(60/windowH), alignSelf:"center", borderRadius:60}}
                            resizeMode="contain"
                            defaultSource={require("../assets/profile-pic-empty.png")}
                            source={(!owner)?
                            {uri:profilePic}:{uri:user.image}}
                        />
                        }
                     </Pressable>
                <View style={styles.userDetails}>
                    <Text style={styles.usernameText}>@{(!owner && userData !== undefined)?userData.name:
                    user.username?user.username:"ajiaron"}</Text>
                    <Text style={styles.userFullName}>{(!owner && userData !== undefined)?userData.fullname:user.fullname?user.fullname:"Johnny Appleseed"}</Text>
                    <Text style={[styles.userBlurb, {minWidth:windowW*0.8, marginTop:(!owner&&windowW<400)?6.5:4}]}>{(userData !== undefined)?userData.blurb:'Im about writing apps and running laps'}</Text>
                </View>
                {(owner)?
                // render settings button if this page is your profile
                <View style={styles.settingsIcon}>
                    <Pressable onPress={handlePress}>
                        <View style={styles.settingsNotification}/>
                        <Icon 
                            name='settings'
                            type='material'
                            color='white'
                            size={26}
                        />
                    </Pressable>
                </View>:
                // render friend button if this page is not your profile
                <Pressable 
                    style={{marginRight:(windowW>400)?14.5:11.5, marginTop:(windowW>400)?5.5:3.5, height:windowH*(26/windowH)}}
                    onPress={(isFriend)?null:(requested)?deleteFriend:(accept)?acceptFriend:requestFriend}>
                    <Animated.View style={[styles.addFriendContainer, 
                        {backgroundColor:(requested)?"#565454":animatedvalue.interpolate({inputRange:[0,100], outputRange:["rgba(0, 82, 63, 1)","#565454"]})
                        }]}>
                        <Animated.Text style={[styles.addFriendText, 
                            {fontSize:(windowW>400)?12.5:12.5, 
                                color:(requested)?"rgba(10,10,10,1)":
                                animatedvalue.interpolate({inputRange:[0,100], outputRange:["white","rgba(10,10,10,1)"]})
                            }]}>
                            {(isFriend)?"Friends":(requested)?"Requested":(accept)?'Accept':'Request'}
                        </Animated.Text>
                    </Animated.View>
                </Pressable>
                }
            </View>

            <ProfileInfo name={(!owner && userData !== undefined)?userData.fullname:
                user.fullname?user.fullname:"Johnny Appleseed"} milestones={milestones.length} count={postCount} friends={friends}
                owner={owner} />
            <View style={[styles.profileTagContainer]}>
                <View style={[styles.milestoneHeaderContainer]}>
                    <Text style={[styles.milestoneHeader]}>
                        {`Personal Milestones`}
                    </Text>
                    {(milestones.length>4 || owner)&&
                    <Pressable onPress={()=> {navigation.navigate("MilestoneList",
                    {id:(owner)?user.userId:userid, username:(owner)?user.username:userData.name})}}>
                        <Icon 
                        name='navigate-next' 
                        size={30} 
                        color="rgba(53, 174, 146, 1)" 
                        style={{bottom:4, left:5}}/>
                    </Pressable>
                    }
                </View>
                {(milestones.length>0)?
                <FlatList 
                    scrollEnabled={(milestones.length>4)?true:false}
                    style={[styles.milestoneList, {maxHeight:(((windowH*0.0756)+16)*4)-4}]} 
                    data={milestones} 
                    showsVerticalScrollIndicator={false}
                    renderItem={renderMilestone} 
                    snapToInterval={(windowH*0.0756)+16}
                    snapToAlignment="start"
                    decelerationRate={"fast"}
                    keyExtractor={(item, index)=> index}>
                </FlatList>:
                (owner)?
                <Pressable onPress={()=>navigation.navigate("CreateMilestone", {from:'explore'})} 
                   style={{top:18}} >
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
                </Pressable>:
                <View style={{width:windowW*0.8, alignSelf:"center", paddingLeft:4, paddingTop:10}}>
                    <Text style={{fontSize:14.5, fontFamily:"Inter", color:"#aaa" }}>   
                        Nothing just yet!
                    </Text>
                </View>
                }
               
            </View>
            <Footer id={userid}/>
        </View>
    )
}

const styles = StyleSheet.create({
    profilePage: {
        backgroundColor: "rgba(28, 28, 28, 1)",
        minWidth:windowW,
        minHeight:windowH,
        overflow:"scroll",
    },
    profileInfoContainer: {
        width:windowW*0.80,
        height: windowH*0.185,
        borderRadius:15,
        top:windowH*0.23,
        position:"absolute",
        shadowColor: '#000',
        shadowOffset: {
        width: 0,
        height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        alignSelf:"center",
        backgroundColor:"rgba(10, 10, 10, 1)"
    },
    profileNameWrapper: {
        alignItems:"flex-start",
        borderRadius:15,
        backgroundColor:"rgba(10, 10, 10, 1);",
        width:windowW*0.8,
        paddingBottom:windowH*0.0238,
        paddingTop:windowH*0.0238,
    },
    profileInfoName: {
        fontSize:20,
        fontFamily:"InterBold",
        color:"white",
        left:"10%"
    },
    profileInsights: {
        width:windowW*0.6785,
        justifyContent:"space-around",
        height:windowH*0.076,
        borderRadius:10,
        alignSelf:"center",
        backgroundColor: "rgba(28, 28, 28, 1)",
        zIndex:1
    },
    milestoneHeaderContainer: {
        alignSelf:"center",
        minWidth:windowW*0.8,
        flexDirection:"row",
        position:"relative",
        maxHeight:22,
    },
    groupHeaderContainer: {
        alignSelf:"center",
        minWidth:windowW*0.8,
        flexDirection:"row",
        position:"relative",
        maxHeight:22,
        marginTop:windowH*(18/windowH)
    },
    milestoneInsightsHeader: {
        flex:1,
        flexDirection:"row",
        alignItems:"center",
    },
    milestoneInsightWrapper: {
        flex: 1,
        flexDirection: "column",
        alignItems:"center",
        justifyContent:"center"
    },
    milestoneInsightText: {
        fontSize: 9,
        fontFamily: "Inter",
        color:"rgba(195, 191, 191, 1)",
        marginBottom:8,
    },
    milestoneInsightItem: {
        fontFamily:"InterBold",
        fontSize: 18,
        color:"white"
    },
    milestoneHeader: {
        fontFamily:"Inter",
        fontSize: 20,
        color:"white",
        left:4,
        alignSelf:"center",
        top:-2
    },
    groupHeader: {
        fontFamily:"Inter",
        fontSize: 20,
        color:"white",
        top:6,
        left:3,
        alignSelf:"center",
    },
    milestoneHeaderIcon: {
        left:10,
        top:1
    },
    groupHeaderIcon: {
        left:10,
        top:1
    },
    milestoneTagList: {
        top:16,
        width:windowW*0.8,
        alignSelf:"center",

        borderRadius: 8,
    },
    milestoneList: {
        top:18,
        width:windowW*0.8,
        alignSelf:"center",
        borderRadius: 8,
    },
    groupTagList: {
        top:22,
        position:"relative"
    },
    profileTagContainer: {
        flex: 1,
        width: 336,
        alignSelf:"center",
        position:"relative",
        bottom:windowH*(12/windowH) 
    },
    userInfoContainer: {
        top:"27.5%",
        left:2,
        alignSelf:"center",
        maxWidth:windowW*0.8275,
        flex:1,
        flexDirection:"row",
    },
    userDetails: {
        flex:1,
        alignItems:"flex-start",
        left:14,   
        top:1
    },
    usernameText: {
        fontFamily:"InterBold",
        fontSize:18,
        color:"white",
    },
    userFullName: {
        fontFamily:"Inter",
        fontSize:11,
        color:"rgba(170, 170, 170, 1)",
        marginTop:4,
    },
    userBlurb: {
        fontFamily:"Inter",
        fontSize:11,
        color:"white",
        marginTop:4,
    },
    settingsIcon: {    
        right:10,
        top:-8
    },
    settingsNotification: {
        backgroundColor:"rgba(238, 64, 64, 1)",
        width:8.5,
        height:8.5,
        borderRadius:4,
        right:-16,
        top:9,
        zIndex:1
    },
    addFriendContainer: {
        minWidth:windowW * (98/windowW),
        height: windowH * (26/windowH),
        borderRadius:4,
        justifyContent:"center"
    },
    addFriendText: {
        fontFamily:"InterBold",
        alignSelf:"center"
    },
    headerNavTitle: {
        fontFamily:"Inter",
        fontSize:14,
        color:"rgba(160,160,160,1)",
    },
    milestoneEmptyContainer: {
        alignItems:"center",
        padding:(windowH*0.0185)-2.25,
        width:windowW*0.8 - 2.25,
        height: windowH*0.0756,
        backgroundColor: "rgba(28, 28, 28, 1)",
        borderColor:"rgba(58, 184, 156, 1)",
        borderRadius: 8,
        borderWidth:2.25,
        borderStyle:"dashed",
        alignSelf:"center",
        marginBottom:20,
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
export default Profile