import  React, {useState, useEffect, useContext, useRef} from "react";
import { Text, StyleSheet, View, Image, FlatList, Pressable, TextInput, ScrollView, Dimensions, Animated} from "react-native";
import { Icon } from 'react-native-elements'
import { useNavigation, useRoute } from "@react-navigation/native";
import Footer from './Footer'
import MilestoneTag from "./MilestoneTag";
import GroupTag from "./GroupTag";
import userContext from '../contexts/userContext'
import axios from 'axios'

const windowW = Dimensions.get('window').width
const windowH = Dimensions.get('window').height

const ProfileInfo = ({name, milestones, groups, friends}) => {
    return (
        <View style={[styles.profileInfoContainer]}>
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
                        <Text style={[styles.milestoneInsightText]}>GROUPS</Text>
                        <Text style={[styles.milestoneInsightItem]}>{groups}</Text>
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
    const page = useRoute()
    const [profilePic, setProfilePic] = useState()
    const [userid, setUserid] = useState(route.params.id)
    const [owner, setOwner] = useState(route.params.id === user.userId)
    const [userData, setUserData] = useState()
    const [loading, setLoading] = useState(true)
    const [requested, setRequested] = useState(false)
    const [milestones, setMilestones] = useState([])
    const [favorite, setFavorite] = useState(1)
    const [milestoneCount, setMilestoneCount] = useState(0)
    const milestoneData = require('../data/Milestones.json')
    const navigation = useNavigation()
    var fileExt = (user.image !== undefined)?user.image.toString().split('.').pop():'png';
    const animatedvalue = useRef(new Animated.Value(0)).current;

    useEffect(()=> {
        axios.get(`http://${user.network}:19001/api/getmilestones`)
        .then((response)=> {
            // use this to display how many milestones the user owns in their insights
            setMilestones(response.data.filter((item)=> item.idmilestones === favorite))
            setMilestoneCount(response.data.filter((item)=>item.ownerId === userid).length)
        })
    }, [favorite])
    useEffect(()=> {
        axios.get(`http://${user.network}:19001/api/getusers`)
        .then((response)=> {
            setProfilePic(response.data.filter((item)=>item.id === userid)[0].src)
            setUserData(response.data.filter((item)=> item.id === userid)[0])
            setFavorite(response.data.filter((item)=> item.id === userid)[0].favoriteid)
        })
     }, [route])
    const renderMilestone = ({ item }) => {
        return (
            <MilestoneTag title={item.title} streak={item.streak} img={item.src} id={item.idmilestones} isLast={false}/>
        )
    }
    function handleRequest() {
        setRequested(!requested)
        if (!requested) {
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
            }).start()
        }
    }
    function handleTest() {
       // console.log(userid)
       // console.log(userData)
       // console.log(fileExt)
       console.log(user)
    }
    function handlePress() {
        navigation.navigate("Settings")
    }
    return (
        <View style={[styles.profilePage]}>
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

            </View>
            <View style={[styles.userInfoContainer, {marginBottom:windowH*0.0175}]}>
                    <Pressable onPress={handleTest}>
                        <Image
                        style={{width:windowW*(60/windowW), height:windowH*(60/windowH), alignSelf:"center", borderRadius:60}}
                        resizeMode="contain"
                        defaultSource={require("../assets/profile-pic-empty.png")}
                        source={(!owner)?
                        {uri:profilePic}:{uri:user.image}}
                        />
                     </Pressable>
                <View style={styles.userDetails}>
                    <Text style={styles.usernameText}>@{(!owner && userData !== undefined)?userData.name:
                    user.username?user.username:"ajiaron"}</Text>
                    <Text style={styles.userFullName}>{(!owner && userData !== undefined)?userData.fullname:user.fullname?user.fullname:"Johnny Appleseed"}</Text>
                    <Text style={[styles.userBlurb, {minWidth:windowW*0.8, marginTop:(!owner&&windowW<400)?6.5:4}]}>{(userData !== undefined)?userData.blurb:'Im about writing apps and running laps'}</Text>
                </View>
                {(owner)?
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
                    <Pressable 
                        style={{marginRight:(windowW>400)?14.5:11.5, marginTop:(windowW>400)?5.5:3.5, height:windowH*(26/windowH)}}
                        onPress={handleRequest}>
                        <Animated.View style={[styles.addFriendContainer, 
                            {backgroundColor:animatedvalue.interpolate({inputRange:[0,100], outputRange:["rgba(0, 82, 63, 1)","#565454"]})
                            }]}>
                            <Animated.Text style={[styles.addFriendText, 
                                {fontSize:(windowW>400)?12.5:12.5, 
                                 color:animatedvalue.interpolate({inputRange:[0,100], outputRange:["white","rgba(10,10,10,1)"]})
                                }]}>
                                {(requested)?"Requested":'Request'}
                            </Animated.Text>
                        </Animated.View>
                    </Pressable>
                }
            </View>

            <ProfileInfo name={(!owner && userData !== undefined)?userData.fullname:
                user.fullname?user.fullname:"Johnny Appleseed"} milestones={milestoneCount} groups={3} friends={13} />
            <View style={[styles.profileTagContainer]}>
                <View style={[styles.milestoneHeaderContainer]}>
                    <Text style={[styles.milestoneHeader]}>
                        Personal Milestones
                    </Text>
                    <Pressable onPress={()=> {navigation.navigate("MilestoneList")}}>
                        <Icon 
                        name='navigate-next' 
                        size={30} 
                        color="rgba(53, 174, 146, 1)" 
                        style={{bottom:4.5, left:4}}/>
                    </Pressable>
                </View>
                <FlatList 
                    scrollEnabled={false}
                    style={[styles.milestoneList]} 
                    data={milestones} 
                    renderItem={renderMilestone} 
                    keyExtractor={(item)=>item.idmilestones.toString()}>
                </FlatList>  
                <View style={[styles.groupHeaderContainer]}>
                    <Text style={[styles.groupHeader]}>
                        Groups
                    </Text>
                </View>
                <View style={[styles.groupTagList]}>
                    <GroupTag title={"Gym Grind"} users={['hzenry', 'antruong']} img={require("../assets/dumbbell.png")}/>
                    <GroupTag title={"Diversity Hires"} users={['antruong','timwang']} img={require("../assets/money.png")}/>
                    <GroupTag title={"Guitar Gang"} users={['jdason', 'hzenry']} img={require("../assets/guitar.png")}/>
                </View>
            </View>
            <Footer/>
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
        width:windowW*0.8,
        height: windowH*0.185,
        borderRadius:15,
        top:windowH*0.2125,
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
        left:3,
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
        top:15,
        width:windowW*0.8,
        alignSelf:"center",
        maxHeight:92,
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
        bottom:windowH*(30/windowH) + 4
    },
    userInfoContainer: {
        top:"24.5%",
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
    }
})
export default Profile