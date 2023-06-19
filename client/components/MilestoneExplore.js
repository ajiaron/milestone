import React, { useState, useEffect, useContext, useRef, useCallback } from "react";
import { Animated, Text, StyleSheet, View, Image, FlatList, Pressable, TextInput, Switch, Dimensions, ActivityIndicator, RefreshControl } from "react-native";
import * as Device from 'expo-device'
import { Icon } from 'react-native-elements'
import { useNavigation, useRoute } from "@react-navigation/native";
import Navbar from "./Navbar";
import Footer from './Footer'
import FastImage from "react-native-fast-image";
import MilestoneTag from "./MilestoneTag";
import Icons from '../data/Icons.js'
import userContext from '../contexts/userContext'
import pushContext from "../contexts/pushContext.js";
import { Video } from 'expo-av'
import axios from 'axios'
import { ScrollView } from "react-native-gesture-handler";

const windowW = Dimensions.get('window').width
const windowH = Dimensions.get('window').height


const PostImage = ({item}) => {
    const user = useContext(userContext)
    const navigation = useNavigation()
    const data = {
        postId:item.idposts,
        username:item.username,
        src:item.profilepic,
        image:item.src,
        caption:item.caption, 
        ownerId:item.ownerid,
        isPublic:item.public,
        date:item.date
    }
    var fileExt = (item.src !== undefined)?item.src.toString().split('.').pop():'png'
    function navigatePost() {
        navigation.navigate("Post", {item:data, comments:false})
    }
    return (
        <Pressable onPress={navigatePost}>
            {
            (fileExt ==='jpg' || fileExt==='png')?
                (!user.isExpo)?
                <FastImage
                    style={styles.milestoneIcon}
                    resizeMode={FastImage.resizeMode.cover}
                    source={{
                            uri: (fileExt==='jpg' || fileExt==='png')&&item.src,
                            priority: FastImage.priority.normal
                    }}/>
                :
                <Image
                    style={styles.milestoneIcon}
                    resizeMode="cover"
                    source={{uri:(fileExt==='jpg' || fileExt==='png')&&item.src}}/>
                :
                (fileExt === 'mov' || fileExt === 'mp4')?
                     <Video
                        shouldPlay={false}
                        isMuted={true}
                        resizeMode={'cover'}
                        style={{height:"100%", width:"100%", opacity:1, borderRadius:5}}
                        source={{uri:item.src}}
                    />
               :null
            }
        </Pressable>
    )
}
const renderItem = ({item}) => {
    return (
        <View style={[styles.postContainer]}>
            {(item.src !== undefined) &&
                <PostImage item={item}/>
            }
        </View>
    )
}

const MilestoneTab = ({item, index}) => {
    const user = useContext(userContext)
    const navigation = useNavigation()
    var fileExt = (item.src !== undefined)?item.src.toString().split('.').pop():item.src
    const [image, setImage] = useState(item.src)
    const [postList, setPostList] = useState([])
    const [joined, setJoined] = useState(false)
    const [count, setCount] = useState(0)
    const [timestamp, setTimestamp] = useState()
    const animatedcolor = useRef(new Animated.Value(0)).current
    function handleJoin() {
        if (joined) {
            Animated.timing(animatedcolor,{
                toValue:100,
                duration:200,
                useNativeDriver:false,
            }).start()
        } else {
            Animated.timing(animatedcolor,{
                toValue:0,
                duration:200,
                useNativeDriver:false,
            }).start()
        }
    }
    function handleTest() {
        console.log(item)
    }
    function navigateMilestone() {
        item.id = item.idmilestones
        navigation.push("MilestonePage",
        { 
            milestone:item, 
            date:new Date(item.date).toLocaleDateString("en-US", {month:"short", day:"numeric", year:"numeric"}), 
            count:count
        })
    }
    function joinMilestone() {
        axios.post(`http://${user.network}:19001/api/postmember`, 
        {idmilestones:item.idmilestones, userid:user.userId})
        .then(() => {
            console.log('new member added')
            setJoined(true)
        }).catch(error=>console.log(error))
    }
    function leaveMilestone() {
        axios.delete(`http://${user.network}:19001/api/removemember`, {data: {userid:user.userId, idmilestones:item.idmilestones}})
        .then((response)=> {
            setJoined(false)
            console.log("removed member")
        }).catch(error=>console.log(error))
    }
    useEffect(()=> {
        handleJoin()
    }, [joined])

    useEffect(()=> {     // last update timeframe
        const newDate = new Date()
        const postDate = new Date((count !== 0 && postList[0].date !== undefined)?postList[0].date:new Date())
        if ((Math.abs(newDate-postDate)/3600000) < 24) {
            setTimestamp(' today')
        }
        else if ((Math.abs(newDate-postDate)/86400000) < 7) {
            setTimestamp((Math.floor(Math.abs(newDate-postDate)/86400000) < 2)?
                ' yesterday': Math.floor(Math.abs(newDate-postDate)/86400000).toString()+' days')
        }
        else if ((Math.abs(newDate-postDate)/86400000) <= 30) {
            setTimestamp((Math.floor(Math.floor(Math.abs(newDate-postDate)/86400000)/7) < 2)?
                Math.floor(Math.floor(Math.abs(newDate-postDate)/86400000)/7).toString()+
                ' week':Math.floor(Math.floor(Math.abs(newDate-postDate)/86400000)/7).toString()+' weeks')
        }
        else if ((Math.abs(newDate-postDate)/2592000000) <= 12) {
            setTimestamp((Math.floor(Math.abs(newDate-postDate)/2592000000) < 2)?
                Math.floor(Math.abs(newDate-postDate)/2592000000).toString()+
                ' month': Math.floor(Math.abs(newDate-postDate)/2592000000).toString()+' months')
        } else {
            setTimestamp((Math.floor(Math.abs(newDate-postDate)/31536000000)< 2)?
                Math.floor(Math.abs(newDate-postDate)/31536000000).toString()+
                ' year':Math.floor(Math.abs(newDate-postDate)/31536000000).toString()+' years')
        }
    }, [postList, count])
    useEffect(()=> {
        axios.get(`http://${user.network}:19001/api/getusermilestones/${user.userId}`)
        .then((response)=> {
          setJoined(response.data.filter((val)=>val.idmilestones === item.idmilestones).length > 0)
        })
        .catch((error)=> console.log(error))
    }, [])
    useEffect(()=> {    
        axios.get(`http://${user.network}:19001/api/getlinkedposts/${item.idmilestones}`)
        .then((response) => {
            setPostList([...response.data.filter((item)=> item.public === 1)].reverse().concat([0,0,0,0]).slice(0,4))
            setCount(response.data.length)
            setImage(item.src)
        }).catch(error=>console.log(error))
    }, [item])
    return (
        <>
        {(postList.filter((item)=>item !== 0).length > 0) && 
        <View style={[styles.milestoneTabContainer, {marginTop:windowH*0.0215}]}>
            <View style={styles.headerContentWrapper}>
                <View style={{flex:1, flexDirection:"row", alignItems:"center"}}>
                    <View style={[styles.milestoneIconContainer, {alignSelf:"center"}]}>
                        <Pressable onPress={navigateMilestone}>
                            {
                            (!user.isExpo)?
                            <FastImage
                                style={styles.milestoneIcon}
                                resizeMode={FastImage.resizeMode.cover}
                                source={
                                    (fileExt==='jpg' || fileExt==='png')?
                                    {
                                        uri:image,
                                        priority:FastImage.priority.normal
                                    }:
                                    Icons[image]
                                }/>
                            :
                            <Image
                                style={styles.milestoneIcon}
                                resizeMode="cover"
                                source={(fileExt==='jpg' || fileExt==='png')?{uri:image}:Icons[image]}/>
                            }
                        </Pressable>
                    </View>
        
                    <View style={{alignSelf:"center", alignItems:"center", maxWidth:(windowH>900)?windowW*0.425:windowW*0.45}}>
                        <Text style={[styles.milestoneTitle]} numberOfLines={(windowH>900)?1:2}>{item.title}</Text>
                    </View>
                    {(windowH>900)&&
                    <Pressable onPress={handleTest}>
                        <Icon 
                            style={{transform:[{rotate:"-45deg"}], alignSelf:"center"}}
                            name='insert-link'
                            type='material'
                            color='rgba(160, 160, 160, 1)'
                            size={19}/>
                    </Pressable>
                    }
                </View>
                
                {/*  replace function with backend request, put animation toggle in there */}
                {
                <Pressable onPress={(item.ownerId === user.userId)?()=>console.log('owner'):(joined)?leaveMilestone:joinMilestone}
                style={{ alignSelf:"center", height:(windowH>900)?28:26}}>
                    <Animated.View 
                    style={[styles.addMilestoneContainer, {
                    backgroundColor:animatedcolor.interpolate({inputRange:[0,100], outputRange:["rgba(0, 82, 63, 1)","#565454"]})
                    }]}>
                        <Animated.Text 
                        style={{color:animatedcolor.interpolate({inputRange:[0,100], outputRange:["white","rgba(10,10,10,1)"]}),
                         fontSize:(windowH>900)?14:12.5, fontFamily:"InterBold", alignSelf:"center"}}>
                            {(item.ownerId === user.userId)?'Owner':'Join'}
                        </Animated.Text>
                    </Animated.View>
                </Pressable>
                }
            </View>
            <View style={styles.descriptionContainer}>
                <Text style={[styles.descriptionText]} numberOfLines={2}>
                    {(item.description && item.description.length > 0)?item.description:
                    `New start, new milestone! `}
                </Text>
            </View>
            <View style={[styles.postListContainer]}>
                <FlatList
                    horizontal
                    renderItem={renderItem}
                    maxToRenderPerBatch={4}
                    contentContainerStyle={{flex:1, flexDirection:"row", justifyContent:"space-around"}}
                    showsHorizontalScrollIndicator={false}
                    scrollEnabled={false}
                    initialNumToRender={4}
                    data={postList}
                />
            </View>
            <View style={{paddingLeft:8, paddingTop:(windowH>900)?10:10}}>
                <Text style={{fontFamily:"InterBold", color:'rgba(180,180,180,1)', fontSize:(windowH>900)?13:11.5}}>
                        {`Updated ${timestamp} ${(timestamp !== "Today" && timestamp !== "Yesterday")? 'ago':''}`}
                </Text>
            </View>
        </View>
        }
        </>
    )
}

const renderTab = ({item, index}) => {
    return (
        <MilestoneTab item={item} index={index}/>
    )
}

const MilestoneExplore = () => {
    const user = useContext(userContext)
    const push = useContext(pushContext)
    const navigation = useNavigation()
    const scrollY = useRef(new Animated.Value(0)).current
    const animatedvalue = useRef(new Animated.Value(0)).current
    const [loading, setLoading] = useState(true)
    const [refreshing, setRefreshing] = useState(false)
    const [milestones, setMilestones] = useState([])
    const [query, setQuery] = useState('')
    const [filtered, setFiltered] = useState([])
    const [joinedMilestones, setJoinedMilestones] = useState([])
    const [tabCount, setTabCount] = useState(10)
    const [scrollDirection, setScrollDirection] = useState("start");
    const prevScrollY = useRef(0);
    const offsetY = useRef(new Animated.Value(0)).current
    const animatedoffset = useRef(new Animated.Value(0)).current
    const scrollRef = useRef()

    const slideIn = () =>{
        Animated.timing(animatedoffset,{
            toValue:100,
            delay:0,
            duration:200,
            useNativeDriver:true,
            extrapolate:"clamp"
        }).start()
    }
    const slideOut = ()=> {
        Animated.timing(animatedoffset,{
            toValue:0,
            delay:0,
            duration:150,
            useNativeDriver:true,
            extrapolate:"clamp"
        }).start()
    }
    useEffect(()=> {
        console.log(offsetY)
        if (scrollDirection === 'down') {
            slideOut()
        }
        else {
            if (scrollDirection === 'up' || scrollDirection ==='start') {
                slideIn()
            }
        }
    }, [scrollDirection])
    useEffect(()=> {
        const listener = offsetY.addListener((value) => {
            setScrollDirection((value.value - prevScrollY.current === 0)?'none':
            ((value.value <= prevScrollY.current) || (value.value <= 0))
            ? 'up' : 'down')
            offsetY.current = value.value;
          });
          return () => {
            offsetY.removeListener(listener);
          };
    }, [offsetY])

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        setTimeout(() => {
            setRefreshing(false);
        }, 800);
    }, [query]);
    const slideUp = () =>{
        Animated.timing(animatedvalue,{
            toValue:100,
            delay:100,
            duration:500,
            useNativeDriver:false,
        }).start(()=>setLoading(false))
    }
    useEffect(()=> {
        if (query.length > 0) {
            setFiltered(milestones.filter((item)=>item.title.toLowerCase().includes(query.toLowerCase())))
            onRefresh
        } else {
            setFiltered(milestones)
        }
    }, [query, refreshing])
    useEffect(()=> {
        setLoading(true)
        axios.get(`http://${user.network}:19001/api/getmilestones`)
            .then((response)=> {
                setMilestones(response.data.filter((item=>item.postable === "Everyone" && item.viewable === "Everyone")))
                slideUp()
            })
            .catch((error)=> console.log(error))
    }, [refreshing])

    return (
        <View style={[styles.milestoneExplorePage]}>
            <Navbar title={'milestone'} scrollY={scrollY}/>
            {(loading)&&
                <Animated.View style={{zIndex:999,alignSelf:"center",width:"100%",top:"50%", height:animatedvalue.interpolate({inputRange:[0,100], outputRange:[windowH, 0]})}}>
                </Animated.View>
            }
            <View style={[styles.milestoneExploreContent]}>
                <Animated.View style={{maxHeight:126.4, zIndex:999, position:"absolute", top:94 + ((windowH>900)?windowH*0.0235:windowH*0.022),
                    transform:[{translateY: animatedoffset.interpolate(({inputRange:[0,100], outputRange:[-162,0]}))}],}}>
                    <Pressable onPress={()=>navigation.navigate("CreateMilestone", {from:'explore'}) }>
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
                    <View style={[styles.userInfoContainer]}>
                        <TextInput 
                            style={styles.userInfoInput}
                            onChangeText={(e)=>setQuery(e)}
                            placeholder={'Search a milestone...'}
                            placeholderTextColor={'rgba(221, 221, 221, 1)'}
                            value={query}>
                        </TextInput>
                        <Icon
                            name='search'
                            size={19}
                            color={'rgba(180,180,180,1)'}
                            style={{zIndex:10, paddingTop:0}}
                        />
                    </View>
                </Animated.View>

                <Animated.View style={{marginBottom:(windowH>900)?windowH*0.085:windowH*0.095,
                     backgroundColor:'rgba(28,28,28,0)'}}>
                    <Animated.FlatList 
                        data={(query.length > 0)?filtered:milestones}
                        renderItem={renderTab}
                        maxToRenderPerBatch={10}
                        onScroll={Animated.event(
                            [{nativeEvent: 
                                {contentOffset: {y: offsetY} } 
                            }],
                            {useNativeDriver: true}
                        )}
                        ref={scrollRef}
                        contentContainerStyle={{paddingTop:126.4}}
                        refreshControl={
                            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                        }
                        showsVerticalScrollIndicator={false}
                        keyExtractor={(item, index)=> index}
                    />
                </Animated.View>
            </View>
            <View style={{bottom:0, position:"absolute"}}>
                <Footer/>
            </View>
        </View>
    )
}
const styles = StyleSheet.create({
    milestoneExplorePage: {
        backgroundColor: "rgba(28, 28, 28, 1)",
        width:windowW,
        height:windowH,
        overflow:"scroll",
    },
    milestoneExploreContent: {
        height:windowH,
        width:windowW*0.8,
        alignItems:"center",
        paddingTop:(windowH>900)?windowH*0.125:windowH*0.125,
        alignSelf:"center",
    },
    milestoneEmptyContainer: {
        alignItems:"center",
        padding:(windowH*0.0185)-2.25,
        width:windowW*0.8,
        height: windowH*0.0756,
        backgroundColor: "rgba(28, 28, 28, 1)",
        borderColor:"rgba(58, 184, 156, 1)",
        borderRadius: 8,
        borderWidth:2.25,
        borderStyle:"dashed",
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
    userInfoContainer: {
        width:(windowW * 0.8) + 4.5,
        alignSelf:"center",
        maxHeight: windowH * (36/windowH),
        justifyContent:"flex-start",
        borderRadius:10,
        backgroundColor:"rgba(10, 10, 10, 1)",
        flex:1,
        alignItems:"center",
        flexDirection:"row"
    },
    userInfoInput: {
        width:'90%',
        height: windowH * (36/windowH),
        paddingTop:1,
        paddingLeft:windowW * (16/windowW),
        paddingRight:windowW * (16/windowW),
        borderRadius:10,
        textAlign:"left",
        alignItems:"center",
        justifyContent:"center",
        fontSize:(windowH>900)?12.5:12,
        color:"white"
    },
    // tab component
    milestoneTabContainer: {
        minWidth:(windowW * 0.8),
        borderRadius:10,
        maxHeight:windowH*0.3,
        alignSelf:"center",
        paddingTop:4,
        marginBottom:(windowH*0.0215)-4,
    },
    headerContentWrapper: {
        maxHeight: (windowH*0.04),
        flex:1,
        flexDirection:"row",
        backgroundColor: "rgba(28, 28, 28, 1)",
        alignItems:"center",
        paddingLeft:6,
        paddingRight:6,
    },
    milestoneIconContainer: {
        width:(windowH*0.04),
        height:(windowH*0.04),
        backgroundColor: "rgba(214, 214, 214, 1)",
        borderRadius:5,
        justifyContent:"center",
    },
    milestoneIcon: {
        width:"100%",
        height:"100%",
        alignItems:"center",
        borderRadius:5,
        justifyContent:"center",
        alignSelf:"center"
    },
    milestoneTitle: {
        fontFamily:"InterBold",
        fontSize:(windowH>900)?20:19,
        color:"rgba(255,255,255,1)",
   
        marginBottom:2,
        marginLeft:windowW*(12/windowW),
        marginRight:windowW*(6/windowW),
    },
    addMilestoneContainer: {
        minWidth:(windowH>900)?88:82,
        height: (windowH>900)?28:26,
      //  backgroundColor:"#565454",
        backgroundColor:"rgba(0, 82, 63, 1)",
        borderRadius:4,
        justifyContent:"center",
        shadowColor: '#000',
        shadowOffset: {
        width: 0,
        height: 1,
        },
        shadowOpacity: 0.2,
        shadowRadius: 2,
    },
    descriptionContainer: {
        width: windowW * .8,
        height: windowH*0.0853,
        alignSelf:"center",
        backgroundColor:"rgba(10,10,10,1)",
        marginTop:14,
        shadowColor: '#000',
        shadowOffset: {
        width: 0,
        height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        flexDirection:"row",
        borderRadius:10,
        paddingTop:(windowH>900)?20:18,
        paddingLeft:22,
        paddingBottom:20,
        paddingRight:22,
    },
    descriptionText: {
        fontFamily:"Inter",
        fontSize:windowH>900?13.5:12,
        lineHeight:(windowH>900)?18:17,
        color:"white",
    },
    // images
    postListContainer: {
        maxHeight:windowH*0.083,
        maxWidth:windowW*0.8,
        paddingLeft:2,
        paddingRight:2,
        marginTop:15,
        alignSelf:"center",
        justifyContent:"space-around",
        alignItems:"center",
        flex:1,
        flexDirection:"row"
    },
    postContainer: {
        width:windowW*0.18,
        height:windowH*0.083,
        borderRadius:10,
        backgroundColor:'rgba(100,100,100,0.5)',
        shadowColor: '#000',
        shadowOffset: {
        width: 0,
        height: 4,
        },
        shadowOpacity: 0.25,
        shadowRadius: 10,
    }
})
export default MilestoneExplore