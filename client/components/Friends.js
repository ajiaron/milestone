import  React, {useState, useEffect, useContext, useRef} from "react";
import { Animated, ActivityIndicator, Text, StyleSheet, View, Image, FlatList, Pressable, TextInput, ScrollView, Dimensions } from "react-native";
import { Icon } from 'react-native-elements'
import { useNavigation, useRoute } from "@react-navigation/native";
import Footer from './Footer'
import MilestoneTag from "./MilestoneTag";
import GroupTag from "./GroupTag";
import FriendTag from "./FriendTag";
import userContext from '../contexts/userContext'
import axios from 'axios'

const windowW = Dimensions.get('window').width      // get screen width
const windowH = Dimensions.get('window').height     // get screen height

/*
frontend:
    - fetch list of users and display
    - search friends
    - display list of added friends
        - link to their profile
    - display list on unadded friends
        - display button to add friend
backend:
    - friends & requests (table)
        - add request
database:
*/

function Friends(){
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(true)
    const user = useContext(userContext)
    const route = useRoute()
    const [friends, setFriends] = useState([])
    const [milestoneList, setMilestoneList] = useState([]) // initializes array
    const animatedvalue = useRef(new Animated.Value(0)).current;
    const [refresh, setRefresh] = useState(false)
    const slideUp=() =>{
        Animated.timing(animatedvalue,{
            toValue:100,
            delay:100,
            duration:500,
            useNativeDriver:false,
        }).start(()=>setLoading(false))
    }
    useEffect(()=> {
        setLoading(true)
        axios.get(`http://${user.network}:19001/api/getrequests`) 
        .then((response)=>{ 
            setFriends(response.data.filter((item)=>(item.requesterId === user.userId || item.recipientId === user.userId)))   // get friends from database
            console.log('ayo:',response.data.filter((item)=>(item.requesterId === user.userId)||(item.recipientId === user.userId)))
        })
    },[])
    useEffect(()=> {
        axios.get(`http://${user.network}:19001/api/getusers`) 
        .then((response)=> {
            setUsers(response.data.filter((item)=>((friends.map((val)=>val.requesterId).indexOf(item.id) > -1)  // match users to requests
            ||(friends.map((val)=> val.recipientId).indexOf(item.id) > -1)) && item.id !== user.userId))
            slideUp()
        })
        .catch((error)=> console.log(error))
    }, [friends, route])
    const renderMilestone = ({ item }) => {
        return (
            <FriendTag 
                id = {item.id}
                username = {item.name}
                img = {item.src}
    
            />
        )
    }
    return (
        <View style={styles.friendsPage}>
            {(loading)&&
                <Animated.View style={{zIndex:999,alignSelf:"center",width:"100%",top:"50%", height:animatedvalue.interpolate({inputRange:[0,100], outputRange:[windowH, 0]})}}>
                    <ActivityIndicator size="large" color="#FFFFFF" style={{top:"50%", position:"absolute", alignSelf:"center"}}/>
                </Animated.View>
            }
            <View style={styles.friendsWrapper}>
            <Text style={[styles.friendsHeader, {top:(windowH * -0.020)}]}>Your Friends</Text>
                <View style={styles.friendsHeaderContainer}>
                </View>
                {!loading &&
                <FlatList 
                    snapToAlignment="start"
                    decelerationRate={"fast"}
                    snapToInterval={(windowH*0.0755)+16}
                    showsVerticalScrollIndicator={false}
                    data={users}
                    renderItem={renderMilestone} 
                    keyExtractor={(item)=>(milestoneList.length>0)?item.idmilestones.toString():item.id.toString()}
                    >
                </FlatList> 
                }
            </View>
            <View style={{bottom:0, position:"absolute"}}>
                <Footer/>
            </View>
        </View>
    )
}

//this will be 'css' portion
//no css, everything is an object
const styles = StyleSheet.create({
 friendsPage: {
    backgroundColor:"rgba(28,28,28,1)",
    minWidth: windowW,
    flex:1,
    minHeight: windowH,
    overflow: "scroll",
},
friendsWrapper: {
    alignSelf:"center",
    maxHeight:windowH * 0.665,
    maxWidth:windowW*0.8,
    top:windowH*0.12,
},
friendsWrapperLarge: {
    minWidth:windowW * 0.8,
    maxHeight:windowH * 0.737,
    alignSelf:"center",
    top: windowH * 0.16
},
friendsList: {
    minWidth:windowW*0.8,
    alignSelf:"center",
    borderRadius: 8,
},
friendsHeader: {
    fontFamily:"Inter",
    fontSize: 20,
    color:"white",
},
friendsHeaderContainer: {
    alignSelf:"center",
    minWidth:windowW*0.8,
    flexDirection:"row",
    left:4,
    maxHeight:22,
},
milestoneList:{
    top: windowH * .025,
},
groupTagList: {
    top:22,
    position:"relative"
},

})

export default Friends
