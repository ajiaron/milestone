import React, { useState, useEffect, useContext, useRef, useCallback } from "react";
import { Animated, Text, StyleSheet, View, Image, FlatList, Pressable, TextInput, Switch, Dimensions, ActivityIndicator, TouchableOpacity } from "react-native";
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
    var fileExt = (item.src !== undefined)?item.src.toString().split('.').pop():'png'
    return (
        <Pressable onPress={()=>console.log(fileExt)}>
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

const MilestoneTab = ({item}) => {
    const user = useContext(userContext)
    var fileExt = (item.src !== undefined)?item.src.toString().split('.').pop():item.src
    const [image, setImage] = useState(item.src)
    const [postList, setPostList] = useState([])
    const [joined, setJoined] = useState(false)
    const animatedcolor = useRef(new Animated.Value(0)).current
    function handleJoin() {
        if (joined) {
            Animated.timing(animatedcolor,{
                toValue:100,
                duration:150,
                useNativeDriver:false,
            }).start()
        } else {
            Animated.timing(animatedcolor,{
                toValue:0,
                duration:150,
                useNativeDriver:false,
            }).start()
        }
    }
    function handleTest() {
        //console.log(postList.map((item)=> new Date(item.date).toLocaleDateString("en-US",{month:"long", day:"numeric",year:"numeric"})))
        console.log(postList.map((item=> (item.src !== undefined)?item.src.toString().split('.').pop():'png')))
        //console.log(postList.length)
    }
    useEffect(()=> {
        handleJoin()
    }, [joined])
    
    useEffect(()=> {    
        axios.get(`http://${user.network}:19001/api/getlinkedposts/${item.idmilestones}`)
        .then((response) => {
            setPostList([...response.data.filter((item)=> item.public === 1)].reverse().concat([0,0,0,0]).slice(0,4))
        }).catch(error=>console.log(error))
    }, [])

    return (
        <View style={[styles.milestoneTabContainer]}>
            <View style={styles.headerContentWrapper}>
                <View style={{flex:1, flexDirection:"row", alignItems:"center"}}>
                    <View style={[styles.milestoneIconContainer, {alignSelf:"center"}]}>
                        <Pressable onPress={()=>console.log('ayo')}>
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
        
                    <View style={{alignSelf:"center", alignItems:"center", maxWidth:windowW*0.45}}>
                        <Text style={[styles.milestoneTitle]} numberOfLines={1}>{item.title}</Text>
                    </View>
      
                    <Pressable onPress={handleTest}>
                        <Icon 
                            style={{transform:[{rotate:"-45deg"}], alignSelf:"center"}}
                            name='insert-link'
                            type='material'
                            color='rgba(160, 160, 160, 1)'
                            size={19}/>
                    </Pressable>
                </View>
                
                {/*  replace function with backend request, put animation toggle in there */}
                <Pressable onPress={()=>setJoined(!joined)}
                style={{ alignSelf:"center", height:windowH*(28/windowH)}}>
                    <Animated.View 
                    style={[styles.addMilestoneContainer, {
                    backgroundColor:animatedcolor.interpolate({inputRange:[0,100], outputRange:["rgba(0, 82, 63, 1)","#565454"]})
                    }]}>
                        <Animated.Text 
                        style={{color:animatedcolor.interpolate({inputRange:[0,100], outputRange:["white","rgba(10,10,10,1)"]}),
                         fontSize:(windowH>900)?14:12.5, fontFamily:"InterBold", alignSelf:"center"}}>
                            Join
                        </Animated.Text>
                    </Animated.View>
                </Pressable>
            </View>
            <View style={styles.descriptionContainer}>
                <Text style={[styles.descriptionText]}>
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
                    initialNumToRender={4}
                    data={postList}
                />
            </View>
        </View>
    )
}

const renderTab = ({item}) => {
    return (
        <MilestoneTab item={item}/>
    )
}

const MilestoneExplore = () => {
    const user = useContext(userContext)
    const push = useContext(pushContext)
    const navigation = useNavigation()
    const scrollY = useRef(new Animated.Value(0)).current
    const animatedvalue = useRef(new Animated.Value(0)).current
    const [loading, setLoading] = useState(true)
    const [milestones, setMilestones] = useState([])
    const [query, setQuery] = useState()

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        setTimeout(() => {
            setRefreshing(false);
        }, 800);
    }, []);
    const slideUp = () =>{
        Animated.timing(animatedvalue,{
            toValue:100,
            delay:100,
            duration:500,
            useNativeDriver:false,
        }).start(()=>setLoading(false))
    }
    useEffect(()=> {
        axios.get(`http://${user.network}:19001/api/getmilestones`)
        .then((response)=> {
            setMilestones(response.data.filter((item=>item.postable === "Everyone" && item.viewable === "Everyone")).slice(0,10))
        })
        .catch((error)=> console.log(error))
        slideUp()
    }, [])
    return (
        <View style={[styles.milestoneExplorePage]}>
            <Navbar title={'milestone'} scrollY={scrollY}/>
            {(loading)&&
                <Animated.View style={{zIndex:999,alignSelf:"center",width:"100%",top:"50%", height:animatedvalue.interpolate({inputRange:[0,100], outputRange:[windowH, 0]})}}>
                </Animated.View>
            }
            <View style={[styles.milestoneExploreContent]}>
                <Pressable onPress={()=>navigation.navigate("CreateMilestone", {from:'explore'})}>
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
                <View style={{paddingTop:24, paddingBottom:windowH*0.215, backgroundColor:'rgba(28,28,28,0)'}}>
                    <FlatList 
                        data={milestones}
                        renderItem={renderTab}
                        maxToRenderPerBatch={10}
                        showsVerticalScrollIndicator={false}

                    />
                </View>
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
        paddingTop:(windowH>900)?windowH*0.125:windowH*0.1375,
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
        minHeight: windowH * (36/windowH),
        justifyContent:"flex-start",
        borderRadius:10,
        backgroundColor:"rgba(10, 10, 10, 1)",
        flex:1,
        alignItems:"center",
        flexDirection:"row"
    },
    userInfoInput: {
        width:'90%',
        minHeight: windowH * (36/windowH),
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
        marginBottom:windowH*0.0425,
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
        fontSize:20,
        color:"rgba(255,255,255,1)",
        alignSelf:"center",
        marginBottom:2,
        marginLeft:windowW*(15/windowW),
        marginRight:windowW*(7/windowW),
    },
    addMilestoneContainer: {
        minWidth:windowW * (88/windowW),
        height: windowH * (28/windowH),
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
        height: windowH * (79 / windowH),
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
        paddingTop:21,
        paddingLeft:22,
        paddingBottom:20,
        paddingRight:22,
    },
    descriptionText: {
        fontFamily:"Inter",
        fontSize:windowH>900?13.5:13,
        lineHeight:18,
        color:"white",

    },
    // images
    postListContainer: {
        maxHeight:77,
        maxWidth:windowW*0.8,
        alignSelf:"center",
        justifyContent:"space-around",
        alignItems:"center",
        marginTop:13,
        flex:1,
        flexDirection:"row"
    },
    postContainer: {
        width:79,
        height:77,
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