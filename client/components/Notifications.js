import  React, {useState, useEffect, useContext, useRef, useCallback} from "react";
import { Animated, ActivityIndicator, Text, StyleSheet, View, Image, FlatList, Alert, Pressable, TextInput,ScrollView, Dimensions, RefreshControl } from "react-native";
import { Icon } from 'react-native-elements'
import { useNavigation, useRoute } from "@react-navigation/native";
import Footer from './Footer'
import Navbar from "./Navbar";
import userContext from '../contexts/userContext'
import axios from 'axios'
import NotificationTag from "./NotificationTag";

const windowW = Dimensions.get('window').width      
const windowH = Dimensions.get('window').height    

const Notifications = () => {
    const scrollY = useRef(new Animated.Value(0)).current
    const navigation = useNavigation()
    const user = useContext(userContext)
    const [notifications, setNotifications] = useState([])
    const [refreshing, setRefreshing] = useState(false)
    const [loading, setLoading] = useState(true)
    const animatedvalue = useRef(new Animated.Value(0)).current
    const animatedoffset = useRef(new Animated.Value(0)).current
    const [clear, setClear] = useState(false)

    const slideUp=() =>{
        Animated.timing(animatedvalue,{
            toValue:100,
            delay:50,
            duration:400,
            useNativeDriver:false,
        }).start(()=>setLoading(false))
    }
    const onRefresh = useCallback(() => {
        setRefreshing(true);
        setTimeout(() => {
            setRefreshing(false);
        }, 800);
    }, []);
    function clearNotifications() {
      axios.delete(`http://${user.network}:19001/api/clearnotifications`, {data: {recipientId:user.userId}})
      .then((response)=> console.log("notifications cleared")).catch(error=>console.log(error))
      setClear(!clear)
    }
    useEffect(()=> {
        axios.get(`http://${user.network}:19001/api/getnotifications`) 
        .then((response)=>{ 
            setNotifications(response.data.filter((item)=> item.recipientId === user.userId))
        })
        .catch((error) => console.log(error))
        slideUp()
    }, [clear])
    const renderNotification = ({item}) => {
        return (
            <NotificationTag
                id = {item.idnotifications}
                requesterId = {item.requesterId}
                recipientId = {item.recipientId}
                type = {item.type}
                comment = {item.comment}
                postId = {item.postId}
                milestoneId = {item.milestoneId}
                date = {item.date}
                index = {notifications.indexOf(item)}
                isFirst = {notifications.length}
            />
        )
    }
    return (
        <View style={[styles.notificationsPage]}>
            {(loading)&&
            <Animated.View style={{zIndex:999,width:"100%", height:animatedvalue.interpolate({inputRange:[0,100], outputRange:[windowH, 0]})}}>
                <ActivityIndicator size="large" color="#FFFFFF" style={{top:"50%", position:"absolute", alignSelf:"center"}}/>
            </Animated.View>
            }
            <Navbar title={'notifications'} scrollY={scrollY} onClearNotifications={()=>clearNotifications()}/>
            <Animated.View style={[styles.notificationsContainer]}>
                {(notifications.length>0)?
                <Animated.FlatList
                    data={[...notifications].reverse()}
                    renderItem={renderNotification}
                    snapToAlignment="start"
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                    }
                    style={{paddingTop:94}}
                    showsVerticalScrollIndicator={false}
                    decelerationRate={"fast"}
                    //snapToInterval={windowH*0.0756}
                />:
                <Text style={{fontFamily:"Inter", color:"rgba(120,120,120,1)", alignSelf:"center"}}>Nothing to see yet!</Text>
                }
            </Animated.View>
            <View style={{position:"absolute", bottom:0}}>
                <Footer/>
            </View>
        </View>
    )
}
const styles = StyleSheet.create({
    notificationsPage: {
        backgroundColor:"rgba(28, 28, 28, 1)",
        flex: 1,
        minWidth: "100%",
        minHeight: "100%",
        overflow: "hidden",
    },
    notificationsContainer: {
        justifyContent:"center",
        flex:1,
        alignItems:"center",
        alignSelf:"center"
    }
})
export default Notifications;