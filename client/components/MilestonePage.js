import React, { useState, useEffect, useContext, useRef } from "react";
import { Animated, Text, StyleSheet, View, Image, FlatList, Pressable, TextInput, Switch, Dimensions, TouchableOpacity } from "react-native";
import * as Device from 'expo-device'
import { Icon } from 'react-native-elements'
import { useNavigation } from "@react-navigation/native";
import Footer from './Footer'
import PostItem from "./PostItem";
import Icons from '../data/Icons.js'
import userContext from '../contexts/userContext'
import axios from 'axios'
import { ScrollView } from "react-native-gesture-handler";

const windowW = Dimensions.get('window').width
const windowH = Dimensions.get('window').height

const ProgressView = () => {
    const renderItem = ({item}) => {
        return (
            <View style={styles.gridRow}>
                <TouchableOpacity style={[styles.gridItem, {backgroundColor:(item === 1)?"#696969":(item === 2)?"rgba(53, 174, 146, 1)":"rgb(37, 124, 103)"}]}/>
                <TouchableOpacity style={[styles.gridItem, {backgroundColor:(item === 1)?"#696969":(item === 3)?"rgba(53, 174, 146, 1)":"rgb(37, 124, 103)"}]}/>
                <TouchableOpacity style={[styles.gridItem, {backgroundColor:(item === 2)?"#rgba(53, 174, 146, 1)":"rgb(37, 124, 103)"}]}/>
                <TouchableOpacity style={[styles.gridItem, {backgroundColor:(item === 1)?"rgba(53, 174, 146, 1)":"rgb(37, 124, 103)"}]}/>
                <TouchableOpacity style={[styles.gridItem, {backgroundColor:(item === 3)?"#696969":(item === 4)?"rgba(53, 174, 146, 1)":"rgb(37, 124, 103)"}]}/>
                <TouchableOpacity style={[styles.gridItem,  {backgroundColor:(item === 2)?"rgba(53, 174, 146, 1)":"rgb(37, 124, 103)"}]}/>
                <TouchableOpacity style={[styles.gridItem, {backgroundColor:(item === 4)?"rgba(53, 174, 146, 1)":(item === 2)?"#696969":"rgb(37, 124, 103)"}]}/>
            </View>
        )
    }
    return (
        <ScrollView horizontal={true} scrollEnabled={false} style={{alignSelf:"center"}}>
            <View style={styles.gridView}>
                <FlatList
                scrollEnabled={false}
                renderItem={renderItem}
                data={[1,2,3,4]}
                />
            </View>
        </ScrollView>
    )
}

const MilestonePage = ({route}) => {
    const year = new Date().getFullYear()
    const month = new Date().toLocaleString("en-US", { month: "short" })
    const day = new Date().getDate()
    const postdate = month + ' ' + day
    const user = useContext(userContext)
    const navigation = useNavigation()
    const [postIdList, setPostIdList] = useState([])
    const [postList, setPostList] = useState([])
    const [milestoneId, setMilestoneId] = useState(0)
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('New start, new milestone! 👋') // add description to milestone object
    const [image, setImage] = useState('calender')
    const [streak, setStreak] = useState(0)
    const [isViewable, setIsViewable] = useState(0)
    
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
    function handlePress() {
        console.log(title, image, streak, milestoneId, description,fileExt)
    }
    useEffect(()=> {
        if (route) {
            setMilestoneId(route.params.milestone.id)
        }
        axios.get('http://10.0.0.160:19001/api/getmilestones')  // if this throws an error, replace 10.0.0.160 with localhost
        .then((response)=> {
            setTitle(response.data.filter((item)=> item.idmilestones === route.params.milestone.id)[0].title)
            setImage(response.data.filter((item)=> item.idmilestones === route.params.milestone.id)[0].src)
            setStreak(response.data.filter((item)=> item.idmilestones === route.params.milestone.id)[0].streak)
            setDescription(response.data.filter((item)=> item.idmilestones === route.params.milestone.id)[0].description)
        }).catch(error => console.log(error))
    }, [])
    useEffect(()=> {
        axios.get('http://10.0.0.160:19001/api/getlinkedmilestones')  // if this throws an error, replace 10.0.0.160 with localhost
        .then((response)=> {
            setPostIdList(response.data.filter((item)=>item.milestoneid === route.params.milestone.id).map((item)=>item.postid))
        }).catch(error => console.log(error))
    }, [])
    useEffect(()=> {
        axios.get('http://10.0.0.160:19001/api/getposts')
        .then((response)=> {
            setPostList(response.data.filter((item)=> postIdList.indexOf(item.idposts)>= 0))
        })
    }, [postIdList])
    var fileExt = (image !== undefined)?image.toString().split('.').pop():'calender'
    const renderPost = ({item}) => {
        return (
            <Pressable onPress={()=>console.log(postList.indexOf(item))}>
                <View style={{maxWidth:windowW}}>
                    <PostItem
                    key={item.idposts}
                    username={item.username}
                    caption={item.caption}
                    src={item.profilepic}
                    image={item.src}
                    postId={item.idposts}
                    index = {postList.indexOf(item)}
                    count = {postList.length}
                    isViewable= {postList.indexOf(item)===isViewable}
                    />
                </View>
            </Pressable>
        )
    }
    return (
        <View style={styles.milestonePage}>
            <ScrollView nestedScrollEnabled={true} showsVerticalScrollIndicator={false}>
                <View style={[styles.headerContent, {marginTop:windowH*((windowH>900?70:76)/windowH)}]}>
                    <View style={styles.headerContentWrapper}>
                        <View style={[styles.milestoneIconContainer, {alignSelf:"center"}]}>
                            <Image
                                style={styles.milestoneIcon}
                                resizeMode="cover"
                                source={(fileExt==='jpg' || fileExt==='png')?{uri:image}:Icons[image]}/>
                        </View>
                        <Text style={styles.milestoneTitle}>{title}</Text>
                        <Pressable onPress={handlePress}>
                            <Icon 
                                style={{transform:[{rotate:"-45deg"}], top:-0.5, alignSelf:"center"}}
                                name='insert-link'
                                type='material'
                                color='rgba(178, 178, 178, 1)'
                                size={21}/>
                        </Pressable>
                    </View>
                    <View style={styles.descriptionContainer}>
                        <Text style={[styles.descriptionText, {fontSize:(windowH>900)?13:12.5}]}>
                            {(description)?description:
                            `Re-learning piano.\nCurrently trying to learn: Fantasie Impromptu\n\n🔥 Follow me on my journey!`}
                        </Text>
                    </View>
                </View>
                <View style={styles.todaysHeaderContainer}>
                    <Text style={styles.todaysMilestoneHeader}>
                        {`🌟 Today’s Milestone`}
                    </Text>
                </View>
                <View style={[(postList.length > 0)?styles.postContainerScroll:styles.postContainer,]}>
                    {(postList.length > 0)?
                     <FlatList horizontal 
                     viewabilityConfigCallbackPairs={viewabilityConfigCallbackPairs.current}
                     viewabilityConfig={viewabilityConfig}
                     decelerationRate={"fast"}
                     snapToInterval={windowW}
                     initialNumToRender={3}
                     maxToRenderPerBatch={3}
                     snapToAlignment="start"
                     showsHorizontalScrollIndicator={false}
                     data={postList}
                     style={[styles.postListView, {minWidth:375}]}
                     renderItem={renderPost}
                     keyExtractor={(item, index)=>index}/>
                    : 
                    <PostItem username={user.username?user.username:'ajiaron'} caption={'This triplet melody is getting hard to play..'} 
                    src={'defaultpic'} image={'defaultpost'} postId={0} liked={false} isLast={false} date={postdate}/>}
                </View>
                <View style={styles.milestoneDatesContainer}>
                    <View style={styles.milestoneDatesHeader}>
                        <Text style={styles.todaysMilestoneHeader}>
                            {`⚡ Milestone Progress`}   
                        </Text>
                        <Text style={(windowW>400)?styles.milestoneDateLarge:styles.milestoneDate}>
                                {month}, {year}
                        </Text>
                    </View>
                </View>
                <ProgressView/>
            </ScrollView>
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
        width: windowW * .8,
        height: windowH * (30/windowH),
        alignSelf:"center",
        flexDirection:"row",
        alignItems:"center",
        marginBottom: windowH * (18/windowH),
        marginLeft:6
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
        textAlign:"left",
        alignItems:"left"   
    },
    descriptionText: {
        fontFamily:"Inter",
        fontSize:12,
        lineHeight:16,
        color:"white",
        textAlign:"left"
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
        fontSize: 19,
        color:"white",
        width:windowW*0.6,
        left:2,
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
        position:"relative",
        right:4
    },
    milestoneDate: {
        fontFamily: "Inter",
        fontSize: 16.5, 
        top:1.25,
        color:"white",
        alignSelf:"center",
    },
    milestoneDateLarge: {
        fontFamily: "Inter",
        fontSize: 18.5, 
        top:1.25,
        color:"white",
        alignSelf:"center",
    },
    gridView: {
        width:windowW*0.85,
        marginBottom:windowH*0.04,
        alignSelf:"center",
    },
    gridRow: {
        width: windowW * 0.85,
        height: windowH * 0.044,
        flexDirection:"row",
        justifyContent:"space-evenly",
        alignSelf:"center",
        marginTop:windowH * (5/windowH),
        marginBottom:windowH * (5/windowH),
    },
    gridRowLarge: {
        width: windowW * 0.85,
        height: windowH * 0.043,
        flexDirection:"row",
        justifyContent:"space-evenly",
        alignSelf:"center",
        marginTop:windowH * (5/windowH),
        marginBottom:windowH * (5/windowH),
    },
    gridItem: {
        width: (windowW * 0.093)+2,
        height: (windowH * 0.044)+2,
        backgroundColor:"rgb(37, 124, 103)",
        borderRadius:4,
        alignSelf:"center",
        shadowColor: '#000',
        shadowOffset: {
        width: 0,
        height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
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
    }
})
export default MilestonePage