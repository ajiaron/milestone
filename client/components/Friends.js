import  React, {useState, useEffect, useContext, useRef, useCallback} from "react";
import { Animated, ActivityIndicator, Text, StyleSheet, View, Image, FlatList, Pressable, TextInput, Dimensions, RefreshControl } from "react-native";
import { Icon } from 'react-native-elements'
import { useNavigation, useRoute } from "@react-navigation/native";
import Navbar from "./Navbar";
import Footer from './Footer'
import MilestoneTag from "./MilestoneTag";
import GroupTag from "./GroupTag";
import FriendTag from "./FriendTag";
import userContext from '../contexts/userContext'
import axios from 'axios'

const windowW = Dimensions.get('window').width 
const windowH = Dimensions.get('window').height    
PAGE_SIZE = 7

function Friends(){
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(true)
    const user = useContext(userContext)
    const route = useRoute()
    const [friends, setFriends] = useState([])
    const [milestoneList, setMilestoneList] = useState([]) 
    const animatedvalue = useRef(new Animated.Value(0)).current
    const animatedcolor = useRef(new Animated.Value(0)).current
    const [query, setQuery] = useState('')
    const scrollY = useRef(new Animated.Value(0)).current
    const [refreshing, setRefreshing] = useState(false)
    const [friendsList, setFriendsList] = useState([])
    const [filtered, setFiltered] = useState([])
    const [userToggle, setUserToggle] = useState(false)
    const [userFullList, setUserFullList] = useState([])
    const [currentPage, setCurrentPage] = useState(1)
    const handleLoad = () => {
        if (!loading) {
            setCurrentPage(currentPage=>currentPage+1)
        }
    }
    const onRefresh = useCallback(() => {
        setRefreshing(true);
        setTimeout(() => {
            setRefreshing(false);
        }, 800);
    }, []);
    function handleTest() {
        console.log(filtered)
    }
    const slideUp = () =>{
        Animated.timing(animatedvalue,{
            toValue:100,
            delay:100,
            duration:500,
            useNativeDriver:false,
        }).start(()=>setLoading(false))
    }
    function toggleColorOn(){
        Animated.timing(animatedcolor,{
            toValue:0,
            duration:250,
            useNativeDriver:false,
        }).start()
    }
    function toggleColorOff() {
        Animated.timing(animatedcolor,{
            toValue:100,
            duration:250,
            useNativeDriver:false,
        }).start()
    }
    useEffect(()=> {
        if (query.length > 0) {
           // if (!userToggle) {
           //     setFiltered(friendsList.filter((item)=>item.name.toLowerCase().includes(query.toLowerCase())))
           // }
           // else {
                setFiltered(users.filter((item)=>item.name.toLowerCase().includes(query.toLowerCase())))
           // }
           // onRefresh
        } else {
           // if (!userToggle) {
                setFiltered(users)
            }
           // else {
           //     setFiltered(friendsList)
           // }
       // }
       //query, userToggle, currentPage, refreshing]
    }, [query, userToggle])
    useEffect(()=> {
        axios.get(`http://${user.network}:19001/api/getrequests`) 
        .then((response)=>{ 
            setFriends(response.data.filter((item)=>(item.requesterId === user.userId || item.recipientId === user.userId)))   // get friends from database
        })
    },[refreshing])
    useEffect(()=> {
        setLoading(true)
        setQuery('')
       // axios.get(`http://${user.network}:19001/api/paginateusers/${PAGE_SIZE}/${(currentPage-1)*PAGE_SIZE}`) 
       axios.get(`http://${user.network}:19001/api/getusers`) 
        .then((response)=> {
            if (userToggle) {
                //setUsers([...users.filter(item=>response.data.map(item=>item.id).indexOf(item.id) == -1), ...response.data.filter((item)=> item.public == true)])
                setUsers(response.data.filter((item)=> item.public == true))
                slideUp()
                toggleColorOff()
            }
            else {
                setUsers(response.data.filter((item)=>(
                    (friends.map((val)=>val.requesterId).indexOf(item.id) > -1)  // match users to requests
                    ||(friends.map((val)=> val.recipientId).indexOf(item.id) > -1)) && item.id !== user.userId))
               // setFriendsList([...friendsList.filter(item=>response.data.map(item=>item.id).indexOf(item.id) == -1)
               // ,...response.data.filter((item)=>(
               // (friends.map((val)=>val.requesterId).indexOf(item.id) > -1)  // match users to requests
               // ||(friends.map((val)=> val.recipientId).indexOf(item.id) > -1)) && item.id !== user.userId)])
                slideUp()
                toggleColorOn()
            }
        })
        .catch((error)=> console.log(error))
        //[friends, route, userToggle, currentPage, refreshing]
    }, [friends, route, userToggle])
    const renderFriend = ({ item }) => {
        return (
            <FriendTag 
                id = {item.id}
                username = {item.name}
                img = {item.src}
                token = {item.pushtoken}
            />
        )
    }
    return (
        <View style={styles.friendsPage}>
            <Navbar title={'milestone'} scrollY={scrollY}/>
            {(loading)&&
                <Animated.View style={{zIndex:999,alignSelf:"center",width:"100%",top:"50%", height:animatedvalue.interpolate({inputRange:[0,100], outputRange:[windowH, 0]})}}>
                    <ActivityIndicator size="large" color="#FFFFFF" style={{alignSelf:"center", top:"50%", position:"absolute"}}/>
                </Animated.View>
            }
            <View style={styles.friendsWrapper}>
          
                <View style={{flexDirection:"row", justifyContent:'space-between', width:windowW*.775, alignSelf:"center"}}> 
                    {(userToggle)?
                    <Pressable onPress={()=> setUserToggle(!userToggle)}>
                        <Animated.Text style={[styles.friendsHeader, {color:
                            animatedcolor.interpolate({inputRange:[0,100], outputRange:['rgba(63,184,156,1)','#fff']}),top:(windowH * -0.0125)}]}>
                            Your Friends
                        </Animated.Text>
                    </Pressable>:
                    <Animated.Text style={[styles.friendsHeader, {color:
                    animatedcolor.interpolate({inputRange:[0,100], outputRange:['rgba(63,184,156,1)','#fff']}),top:(windowH * -0.0125)}]}>
                        Your Friends
                    </Animated.Text>
                    }
                    {(!userToggle)?
                    <Pressable onPress={()=> setUserToggle(!userToggle)}>
                        <Animated.Text style={[styles.friendsHeader, {color:
                            animatedcolor.interpolate({inputRange:[0,100], outputRange:['#fff','rgba(63,184,156,1)']}),top:(windowH * -0.0125), right:4}]}>
                            All Users
                        </Animated.Text>
                    </Pressable>:
                     <Animated.Text style={[styles.friendsHeader, {color:
                        animatedcolor.interpolate({inputRange:[0,100], outputRange:['#fff','rgba(63,184,156,1)']}),top:(windowH * -0.0125), right:4}]}>
                        All Users
                    </Animated.Text>

                    }
                </View>
            
                <View style={[styles.userInfoContainer]}>
                    <TextInput 
                        style={styles.userInfoInput}
                        onChangeText={(e)=>setQuery(e)}
                        placeholder={'Search a user...'}
                        placeholderTextColor={'rgba(221, 221, 221, 1)'}
                        value={query}/>
                </View>
  
            {!loading &&
                <View style={(windowH > 900)?styles.postTagContainerLarge:styles.postTagContainer}>
                <FlatList 
                    snapToAlignment="start"
                    decelerationRate={"fast"}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                    }
                    style=
                    {{maxHeight:(windowH > 900)?((windowH*0.0952)-14)*8:((windowH*0.0952)-12)*7}}
                    snapToInterval={(windowH*0.075)+16}
                    maxToRenderPerBatch={10}
                    //onEndReachedThreshold={0}
                    //onEndReached={handleLoad}
                    showsVerticalScrollIndicator={false}
                    data={(query.length > 0)?filtered:users}
                    //data={(query.length > 0)?filtered:(userToggle)?users:friendsList}
                    renderItem={renderFriend} 
                    keyExtractor={(item)=>(milestoneList.length>0)?item.idmilestones.toString():item.id.toString()}
                    >
                </FlatList> 
                </View>
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
    top:(windowH>900)?(windowH*0.145):(windowH*0.165)
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
userInfoContainer: {
    width:windowW * 0.8,
    alignSelf:"center",
    justifyContent:"flex-start",
    marginBottom:windowH*(16/windowH),
},
userInfoHeader: {
    left:0,
    alignSelf:"flex-start",
    alignItems:"flex-start",
    marginBottom:windowH*(4/windowH),
    width:windowW * (288/windowW),
},
userInfoHeaderText: {
    fontSize:12,
    color:"rgba(191, 191, 191, 1)",
    fontFamily:"InterBold"
},
userInfoInput: {
    minWidth:'100%',
    minHeight: windowH * (36/windowH),
    backgroundColor:"rgba(10, 10, 10, 1)",
    paddingTop:1,
    paddingLeft:windowW * (16/windowW),
    paddingRight:windowW * (16/windowW),
    borderRadius:10,
    textAlign:"left",
    alignItems:"center",
    justifyContent:"center",
    fontSize:12,
    color:"white"
},
postTagContainerLarge: {
    minWidth:windowW * 0.8,
    height:windowH * 0.645,
    alignSelf:"center",

},
postTagContainer: {
    minWidth:windowW * 0.8,
    maxHeight:windowH * 0.665,
    alignSelf:"center",

},


})

export default Friends
