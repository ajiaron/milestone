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
    const [milestoneId, setMilestoneId] = useState(0)
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('New start, new milestone! 👋') // add description to milestone object
    const [image, setImage] = useState('calender')
    const [streak, setStreak] = useState(0)
    function handlePress() {
        console.log(postdate)
        console.log(title, image, streak, milestoneId)
    }
    useEffect(()=> {
        if (route) {
            setMilestoneId(route.params.milestone.id)
            setTitle(route.params.milestone.title)
            setImage(route.params.milestone.img)
            setStreak(route.params.milestone.streak)
        }
    }, [])
    return (
        <View style={styles.milestonePage}>
            <ScrollView nestedScrollEnabled={true} showsVerticalScrollIndicator={false}>
                <View style={styles.headerContent}>
                    <View style={styles.headerContentWrapper}>
                        <View style={[styles.milestoneIconContainer, {alignSelf:"center"}]}>
                            <Image
                                style={styles.milestoneIcon}
                                resizeMode="cover"
                                source={Icons['music']}/>
                        </View>
                        <Text style={styles.milestoneTitle}>Learning Piano</Text>
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
                        <Text style={styles.descriptionText}>
                            {`Re-learning piano.\nCurrently trying to learn: Fantasie Impromptu\n\n🔥Follow me on my journey!`}
                        </Text>
                    </View>
                </View>
                <View style={styles.todaysHeaderContainer}>
                    <Text style={styles.todaysMilestoneHeader}>
                        {`🌟 Today’s Milestone`}
                    </Text>
                   
                </View>
                <View style={styles.postContainer}>
                    <PostItem username={user.username?user.username:'ajiaron'} caption={'This triplet melody is getting hard to play..'} 
                    src={'defaultpic'} image={'defaultpost'} postId={0} liked={false} isLast={false} date={postdate}/>
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
        marginTop: windowH * (80/windowH),
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
        paddingTop:24,
        paddingLeft:20,
        paddingBottom:18,
        paddingRight:20,
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
    }
})
export default MilestonePage