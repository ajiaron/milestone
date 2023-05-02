import React, { useState, useEffect, useContext, useRef } from "react";
import { Animated, ActivityIndicator, Text, StyleSheet, View, Image, FlatList, Pressable, TextInput, Switch, Dimensions, TouchableOpacity } from "react-native";
import * as Device from 'expo-device'
import { Icon } from 'react-native-elements'
import { useNavigation } from "@react-navigation/native";
import Footer from './Footer'
import PostItem from "./PostItem";
import FastImage from "react-native-fast-image";
import Navbar from "./Navbar";
import Icons from '../data/Icons.js'
import userContext from '../contexts/userContext'
import axios from 'axios'

const windowW = Dimensions.get('window').width
const windowH = Dimensions.get('window').height

const ProgressView = ({count, postlist, month, monthname, monthnumber, year}) => {
    const [selected, setSelected] = useState(false)
    const currentDate =  new Date().toLocaleDateString("en-US",{month:"long", day:"numeric",year:"numeric"})
    function pressDate(val) {     // print associated posts
        //console.log(val)
        console.log(Math.abs(new Date(val) - new Date(currentDate))/86400000)   // difference in days
        if (selected === val) {
            setSelected(false)
        }
        else {
            setSelected(val)
        }
        //console.log(postlist.filter(item=>
        //    new Date(item.date).toLocaleDateString("en-US",{month:"long", day:"numeric",year:"numeric"}) === val
        //).length)
    }
    function getActivity(val) {   // determines color of square
        return (
            postlist.filter(item=>
                new Date(item.date).toLocaleDateString("en-US",{month:"long", day:"numeric",year:"numeric"}) === val
            ).length
        )
    }
    function getDaysInWeek(month, year, day) {      // generates squares
        var date = new Date(year, month, (day*7)+1);
        var days = [];
        var counter = 0
        while (date.getMonth() == month && counter < 7) {
          days.push(monthname + ' ' + date.getDate()+', ' + year);
          date.setDate(date.getDate() + 1);
          counter = counter + 1
        }
        return days;
    }
    const renderItem = ({item}) => {
        return (
            <View style={(windowH>900)?styles.gridRowLarge:styles.gridRow}>
                {getDaysInWeek(parseInt(monthnumber)-1, year, item).map((val, i) => 
                 <Pressable key={i} onPress={()=>pressDate(val)}
                    style={[(windowH>900)?styles.gridItemLarge:styles.gridItem, 
                    {   
                        backgroundColor:(getActivity(val)===0)?"#696969":
                        `rgba(${44-(getActivity(val)*8)}, ${124-(getActivity(val)*8)}, ${104-(getActivity(val)*8)}, 1)`}]}>   
                    <Text style={{  // color current day yellow
                        color:(new Date().toLocaleDateString("en-US",{month:"long", day:"numeric",year:"numeric"}) === val)?
                        "rgb(248, 210, 57)":"white",
                        fontFamily:"InterBold", alignSelf:"flex-end",fontSize:(windowH>900)?12:11}}>
                        {7*(item)+i+1}
                    </Text>   
                </Pressable>
                )}
            </View>
        )
    }
    return (
        <View style={{flex:1, paddingLeft:windowW*0.075, paddingRight:windowW*0.075, marginTop:windowH*0.02}}>
            <View style={styles.milestoneDatesHeader}>
                    <Text style={[styles.todaysMilestoneHeader]}>
                        {`⚡ Milestone Progress`}   
                    </Text>
                    <Text style={(windowW>400)?styles.milestoneDateLarge:styles.milestoneDate}>
                        {month}, {year}
                    </Text>
                </View>
            <View style={styles.gridView}>
                <FlatList
                scrollEnabled={false}
                renderItem={renderItem}
                data={(count % 7 === 0)?[0,1,2,3]:[0,1,2,3,4]}
                />
            </View>
        </View>
    )
}

const MilestonePage = ({route}) => {
    const now = new Date()
    const year = new Date().getFullYear()
    const month = new Date().toLocaleString("en-US", { month: "short" })
    const day = new Date().getDate()
    const postdate = month + ' ' + day
    const user = useContext(userContext)
    const navigation = useNavigation()
    const [postList, setPostList] = useState([])
    const [ownerId, setOwnerId] = useState(0)
    const [milestoneId, setMilestoneId] = useState(0)
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('New start, new milestone! 👋') // add description to milestone object
    const [image, setImage] = useState('calender')
    const routes = navigation.getState()?.routes;
    const [streak, setStreak] = useState(0)
    const [isViewable, setIsViewable] = useState(0)
    const [favorite, setFavorite] = useState(false)
    const [loading, setLoading] = useState(true)
    const [postPermission, setPostPermission] = useState('Everyone')
    const [viewPermission, setViewPermission] = useState('Everyone')
    const [timestamp, setTimestamp] = useState()
    const scrollY = useRef(new Animated.Value(0)).current;
    const animatedvalue = useRef(new Animated.Value(0)).current;
    var fileExt = (image !== undefined)?image.toString().split('.').pop():'calender'
    const viewabilityConfig = {
        itemVisiblePercentThreshold:30
    }
    const onViewableItemsChanged = ({
        viewableItems
      }) => {
        if (viewableItems.length > 0) {
            setIsViewable(viewableItems[0].index)
        }
      };
    const viewabilityConfigCallbackPairs = useRef([{ viewabilityConfig, onViewableItemsChanged }])
    function getMonths() {
        let months = []
        var current = new Date(year, 0)
        while (current.getFullYear() === year) {
            let temp = {
                monthnumber:current.getMonth(), 
                short:new Date(year, current.getMonth()).toLocaleString("en-US", {month: "short"}),
                long:new Date(year, current.getMonth()).toLocaleString("en-US", {month: "long"}),
                count:new Date(current.getFullYear(), current.getMonth()+1, 0).getDate(),
            }
            months.push(temp)
            current.setMonth(current.getMonth()+1)
        }
        return months
    }
    const [monthList, setMonthList] = useState(getMonths())
    function pressShare() {
       console.log(route.params)
    }
    useEffect(()=> {
        const newDate = new Date()
        const postDate = new Date(route.params.date)
        if ((Math.abs(newDate-postDate)/3600000) < 24) {
            setTimestamp(' Today')
        }
        else if ((Math.abs(newDate-postDate)/86400000) < 7) {
            setTimestamp((Math.floor(Math.abs(newDate-postDate)/86400000) <= 2)?
                Math.floor(Math.abs(newDate-postDate)/86400000).toString()+
                ' Day': Math.floor(Math.abs(newDate-postDate)/86400000).toString()+' Days')
        }
        else if ((Math.abs(newDate-postDate)/86400000) <= 30) {
            setTimestamp((Math.floor(Math.floor(Math.abs(newDate-postDate)/86400000)/7) <= 2)?
                Math.floor(Math.floor(Math.abs(newDate-postDate)/86400000)/7).toString()+
                ' Week':Math.floor(Math.floor(Math.abs(newDate-postDate)/86400000)/7).toString()+' Weeks')
        }
        else if ((Math.abs(newDate-postDate)/2592000000) <= 12) {
            setTimestamp((Math.floor(Math.abs(newDate-postDate)/2592000000) <= 2)?
                Math.floor(Math.abs(newDate-postDate)/2592000000).toString()+
                ' Month': Math.floor(Math.abs(newDate-postDate)/2592000000).toString()+' Months')
        } else {
            setTimestamp((Math.floor(Math.abs(newDate-postDate)/31536000000)<= 2)?
                Math.floor(Math.abs(newDate-postDate)/31536000000).toString()+
                ' Year':Math.floor(Math.abs(newDate-postDate)/31536000000).toString()+' Years')
        }
    }, [])
    function handlePress() {
        navigation.navigate("EditMilestone", {id:route.params.milestone.id, title:title, description:description, src:image,
        postable:postPermission, viewable:viewPermission})
    }
    function handleFavorite() {
        setFavorite(!favorite)
        if (!favorite) {
            axios.put(`http://${user.network}:19001/api/favoritemilestone`, 
            {milestoneid: milestoneId, userid:user.userId})
            .then(() => {console.log('favorite updated')})
            .catch((error)=> console.log(error))
        }
    }
    const slideUp=() =>{
        Animated.timing(animatedvalue,{
            toValue:100,
            duration:300,
            delay:50,
            useNativeDriver:false,
        }).start(()=>setLoading(false))
    }
    function handleTest() {
        console.log('Posts:', postPermission)
        console.log('Views:', viewPermission)
        console.log(timestamp)
    }
    useEffect(()=> {
        if (route) {
            setMilestoneId(route.params.milestone.id)
        }
        axios.get(`http://${user.network}:19001/api/getmilestones`)  // combine these states using useReducer or some object
        .then((response)=> {
            setTitle(response.data.filter((item)=> item.idmilestones === route.params.milestone.id)[0].title)
            setImage(response.data.filter((item)=> item.idmilestones === route.params.milestone.id)[0].src)
            setStreak(response.data.filter((item)=> item.idmilestones === route.params.milestone.id)[0].streak)
            setDescription(response.data.filter((item)=> item.idmilestones === route.params.milestone.id)[0].description)
            setOwnerId(response.data.filter((item)=> item.idmilestones === route.params.milestone.id)[0].ownerId)
            setPostPermission(response.data.filter((item)=> item.idmilestones === route.params.milestone.id)[0].postable)
            setViewPermission(response.data.filter((item)=> item.idmilestones === route.params.milestone.id)[0].viewable)
        })
        .then(()=>slideUp())
        .catch(error => console.log(error))
    }, [])
    useEffect(()=> {
        axios.get(`http://${user.network}:19001/api/getlinkedposts/${route.params.milestone.id}`)
        .then((response) => {
            setPostList(response.data)
        }).catch(error=>console.log(error))
    }, [])
    useEffect(()=> {
        axios.get(`http://${user.network}:19001/api/getusers`)
        .then((response)=> {
            setFavorite(response.data.filter((item)=> item.id === user.userId)[0].favoriteid === route.params.milestone.id)
        })
     }, [])
    const renderGrid = ({item}) => {
        return (
            <ProgressView count={item.count} 
                postlist={postList}
                month={item.short}
                monthnumber={item.monthnumber+1}
                monthname={item.long}
                year={year}
                />
        )
    }
    const renderPost = ({item}) => {
        return (
            <Pressable onPress={()=>console.log(item.date)}>
                <View style={{maxWidth:windowW}}>
                    <PostItem
                    key={item.idposts}
                    username={item.username}
                    caption={item.caption}
                    src={item.profilepic}
                    image={item.src}
                    postId={item.idposts}
                    ownerId={item.ownerid}
                    date={item.date}
                    isPublic={item.public}
                    index = {[...postList].reverse().indexOf(item)}
                    count = {postList.length}
                    isViewable= {[...postList].reverse().indexOf(item)===isViewable}
                    />
                </View>
            </Pressable>
        )
    }
    return (
        <View style={[styles.milestonePage]}>
            {(loading)&&
            <Animated.View style={{width:"100%", height:animatedvalue.interpolate({inputRange:[0,100], outputRange:[windowH-94, 0]})}}>
             <ActivityIndicator size="large" color="#FFFFFF" style={{top:"50%", position:"absolute", alignSelf:"center"}}/>
            </Animated.View>
            }            
            <Navbar title={"milestone"} scrollY={scrollY} />
            <Animated.ScrollView nestedScrollEnabled={true} showsVerticalScrollIndicator={false}
             style={{ marginTop:windowH*0.0525,height:animatedvalue.interpolate({inputRange:[0,100], outputRange:[0, windowH-94]})}}>
                <View style={[styles.headerContent, {marginTop:windowH*((windowH>900?70:76)/windowH)}]}>
                  
                        <View style={styles.headerContentWrapper}>
                            <View style={[styles.milestoneIconContainer, {alignSelf:"center"}]}>
                            <Pressable onPress={handleTest}>
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
                            <Text style={styles.milestoneTitle}>{title}</Text>
                            <Pressable onPress={pressShare}>
                                <Icon 
                                    style={{transform:[{rotate:"-45deg"}], top:-0.5, alignSelf:"center", marginRight:10}}
                                    name='insert-link'
                                    type='material'
                                    color='rgba(178, 178, 178, 1)'
                                    size={21}/>
                            </Pressable>
                        {(ownerId===user.userId)?
                        <TouchableOpacity onPress={handleFavorite}>
                            <Icon 
                                style={{top:-0.75}}
                                name='auto-awesome'
                                type='material'
                                color={(favorite)?"rgb(248, 210, 57)":'rgba(178, 178, 178, 1)'}
                                size={23}/>
                        </TouchableOpacity>:null
                        }
                    </View>
                    <View style={styles.descriptionContainer}>
                        <Text style={[styles.descriptionText, {fontSize:(windowH>900)?13:12.5}]}>
                            {(description)?description:
                            `Re-learning piano.\nCurrently trying to learn: Fantasie Impromptu\n\n🔥 Follow me on my journey!`}
                        </Text>
                    </View>
                </View>
                <View style={styles.todaysHeaderContainer}>
                    <Text style={[styles.todaysMilestoneHeader, {fontSize:(route.params.count === 0 || windowH>900)?19:18.5}]}>
                  {/* {`🌟 Today’s Milestone`} */}
                    {(route.params.count === 0)?
                    `🌟 Today’s Milestone`:
                     `🌟 ${route.params.count} ${(route.params.count>1)?'Posts':'Post'}${(timestamp === " Today"?'':' in ')}${timestamp}`
                    }
                    </Text>
                </View>
                <View style={[(postList.length > 0)?styles.postContainerScroll:styles.postContainer,{marginTop:windowH*0.015}]}>
                    {(postList.length > 0)?
                     <FlatList horizontal 
                     viewabilityConfigCallbackPairs={viewabilityConfigCallbackPairs.current}
                     viewabilityConfig={viewabilityConfig}
                     decelerationRate={"fast"}
                     removeClippedSubviews
                     snapToInterval={windowW}
                     initialNumToRender={3}
                     maxToRenderPerBatch={3}
                     snapToAlignment="start"
                     showsHorizontalScrollIndicator={false}
                     data={[...postList].reverse()}
                     style={[styles.postListView, {minWidth:375}]}
                     renderItem={renderPost}
                     keyExtractor={(item, index)=>index}/>
                    : 
                    <View style={{width:320, height:320, backgroundColor:'rgba(28,28,28,1)', alignSelf:"center"}}>
                        
                        <View style={{alignSelf:"center", alignItems:"center", justifyContent:"center", flex:1}}>
                            <Pressable onPress={()=>navigation.navigate("TakePost", {
                            previous_screen: routes[routes.length - 1]
                            })} style={{marginBottom:windowH*0.025}}>
                                <Icon 
                                    name='loupe'
                                    style={{backgroundColor:'#33917a', alignSelf:"center", borderRadius:80}}
                                    size={80}
                                />
                            </Pressable>
                            <Text style={{fontSize:15, fontFamily:"Inter", color:"white", alignSelf:"center"}}>
                                Add a post to this milestone!
                            </Text>
                        </View>
                    </View>  
                  }
                </View>
                 <FlatList horizontal 
                     initialNumToRender={3}
                     maxToRenderPerBatch={3}
                     initialScrollIndex={now.getMonth()}
                     decelerationRate={"fast"}
                     snapToInterval={windowW}
                     removeClippedSubviews
                     showsHorizontalScrollIndicator={false}
                     data={monthList}
                     style={{ flexGrow: 1, flexDirection:"row", alignSelf:"center",marginTop:(windowH>900)?6:8}}
                     renderItem={renderGrid}
                     getItemLayout={(_,index) => ({
                        length: (windowW*0.85) + ((windowW*0.075)*2),
                        offset: ((windowW*0.85) + ((windowW*0.075)*2)) * index,
                        index:index
                     })}
                     keyExtractor={(item, index)=>index}/>
                {
                    (ownerId===user.userId)?    
                        <Pressable onPress={handlePress} style={[styles.buttonContainer]}>
                        <View style={[styles.deletePostButtonContainer, {minHeight:(windowH>900)?windowH*0.035: windowH * 0.0375}]}>
                            <Text style={[styles.deletePostButtonText, {fontSize:(windowW > 400)?14.5:13.5}]}>Edit Milestone</Text>
                        </View>
                    </Pressable>:null
                }
            </Animated.ScrollView>   
            <Footer/>
        </View>
    )
}
const styles = StyleSheet.create({
    milestonePage: {
        backgroundColor: "rgba(28, 28, 28, 1)",
        width:windowW,
        height:windowH+300,
        overflow:"scroll",
        paddingBottom:300,
    },
    headerContent: {
        marginTop: windowH * (76/windowH),
    },
    headerContentWrapper: {
        maxWidth: windowW * .8,
        height: windowH * (30/windowH),
        alignSelf:"flex-start",
        flex:1,
 
        flexDirection:"row",
        alignItems:"center",
        marginBottom: windowH * (18/windowH),
        marginLeft:windowW * .105
    },
    milestoneIconContainer: {
        width:(windowW*0.082),
        height:(windowH*0.0378),
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
        marginLeft:windowW*(16/windowW),
        marginRight:windowW*(9/windowW),
    },
    descriptionContainer: {
        width: windowW * .8,
        height: windowH * (120/ windowH),
        alignSelf:"center",
        backgroundColor:"rgba(10,10,10,1)",
        alignItems:"flex-start",
        shadowColor: '#000',
        shadowOffset: {
        width: 0,
        height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        flexDirection:"row",
        borderRadius:10,
        paddingTop:22,
        paddingLeft:22,
        paddingBottom:18,
        paddingRight:22,
    },
    descriptionText: {
        fontFamily:"Inter",
        fontSize:12,
        lineHeight:16,
        color:"white",
        left:0
    },
    todaysHeaderContainer: {
        alignSelf:"center",
        width:windowW*0.8,
        marginTop: windowH * (20/926),
        marginBottom: windowH * (10/926),
        flexDirection:"row",
        position:"relative",
    },
    todaysMilestoneHeader: {
        fontFamily:"Inter",
        color:"white",
        width:windowW*0.6,
        left:2,
        fontSize:19,
        alignSelf:"center",
        top:0
    },
    postContainer: {
        justifyContent:"center",
        flex:1,
        alignItems:"center",
        alignSelf:"center",
    },
    postContainerScroll: {
        flex:1,
        maxWidth:375
    },
    milestoneDatesContainer: {
        width: windowW * .8,
        alignSelf:"center",
        marginTop:4,
    },
    milestoneDatesHeader: {
        width:windowW*0.8,
        marginBottom: windowH * (14/926),
        flexDirection:"row",
        alignSelf:"center",
        position:"relative",
        right:6.5
    },
    milestoneDate: {
        fontFamily: "Inter",
        fontSize: 16.5, 
        top:1.5,
        color:"white",
        alignSelf:"center",
    },
    milestoneDateLarge: {
        fontFamily: "Inter",
        fontSize: 18.5, 
        top:1.5,
        color:"white",
        alignSelf:"center",
    },
    gridView: {
        width:windowW*0.85,
        marginBottom:windowH*0.035,
        alignSelf:"center",
    },
    gridRow: {
        width: windowW * 0.85,
        height: windowH * 0.044,
        flexDirection:"row",
        justifyContent:"flex-start",
        alignSelf:"center",
        marginTop:windowH * (5/windowH),
        marginBottom:windowH * (5/windowH),
    },
    gridRowLarge: {
        width: windowW * 0.85,
        height: windowH * 0.043,
        flexDirection:"row",
        justifyContent:"flex-start",

        alignSelf:"center",
        marginTop:windowH * (5/windowH),
        marginBottom:windowH * (5/windowH),
    },
    gridItemLarge: {
        width: (windowW * 0.093)+2,
        height: (windowH * 0.044)+2,
        backgroundColor:"rgb(37, 124, 103)",
        borderRadius:4,
        alignSelf:"flex-start",
        shadowColor: '#000',
        shadowOffset: {
        width: 0,
        height: 2,
        },
        paddingTop:26,
        paddingRight:5,
        marginLeft:windowW*(9/windowW),
        shadowOpacity: 0.25,
        shadowRadius: 4,
  
    },
    gridItem: {
        width: (windowW * 0.093)+2,
        height: (windowH * 0.044)+2,
        backgroundColor:"rgb(37, 124, 103)",
        borderRadius:4,
        alignSelf:"flex-start",
        shadowColor: '#000',
        shadowOffset: {
        width: 0,
        height: 2,
        },
        marginLeft:windowW*(8/windowW),
        shadowOpacity: 0.25,
        shadowRadius: 4,
        paddingTop:windowH*(22/windowH),
        paddingRight:windowW*(5.5/windowW),
    
    },
    postIndicator: {
        backgroundColor:"rgba(238, 64, 64, 1)",
        width:8.5,
        height:8.5,
        borderRadius:4,
        right:-16,
        top:9,
        zIndex:1
    },
    postListView: {
        minHeight: windowH * (392/windowH),
        width:windowW,
        flex:1,
        overflow:"scroll",
    },
    buttonContainer: {
        alignItems:"center",
        alignSelf:"center",
        justifyContent:"space-between",
        minHeight:windowH*0.075,
        minWidth: windowW*0.85,
    },
    deletePostButtonContainer: {
        shadowColor: '#000',
        shadowOffset: {
        width: 0,
        height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        minWidth:windowW * 0.8,
        backgroundColor:"#1c6654",
        borderRadius:4,
        justifyContent:"center",
        alignSelf:"center",
    },
    deletePostButtonText: {
        fontFamily:"InterBold",
        top:.5,
        color:"white",
        alignSelf:"center"
    },
})
export default MilestonePage