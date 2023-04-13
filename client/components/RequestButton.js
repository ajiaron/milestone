import  React, {useState, useEffect, useContext, useRef} from "react";
import { Text, StyleSheet, View, Image, Pressable, Dimensions, Animated } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import axios from 'axios'
import userContext from '../contexts/userContext'

const windowW = Dimensions.get('window').width
const windowH = Dimensions.get('window').height

const RequestButton = ({id}) => {
    const user = useContext(userContext)
    const [requested, setRequested] = useState(false)
    const [approval, setApproval] = useState(false)
    const [isFriend, setIsFriend] = useState(false)
    const [loading, setLoading] = useState(true)
    const animatedcolor = useRef(new Animated.Value(0)).current;
    function acceptFriend() {
        axios.put(`http://${user.network}:19001/api/acceptfriend`, 
        {requesterid:id,recipientid:user.userId})
        .then(() => {
            setIsFriend(true)
            setRequested(false)
            setApproval(false)
            console.log('friend accepted')
        })
        axios.post(`http://${user.network}:19001/api/acceptnotification`, 
        {requesterId:user.userId,recipientId:id, type:'accept'})
        .then(() => {
            console.log('acceptance notified')
        })
        .catch((error)=> console.log(error))
    }
    function requestFriend() {
        axios.post(`http://${user.network}:19001/api/requestfriend`, 
        {requesterid:user.userId,recipientid:id, approved:false})
        .then(() => {
            console.log('requested')
            setRequested(true)
            handleRequest()
        })
        .catch((error)=> console.log(error))

        axios.post(`http://${user.network}:19001/api/friendnotification`, 
        {requesterId:user.userId, recipientId:id, type:'friend'})
        .then(() => {
            console.log('friend request notified')
        })
        .catch((error)=> console.log(error))
    }
    function deleteFriend() {
        axios.delete(`http://${user.network}:19001/api/deletefriend`, {data: {requesterid:user.userId, recipientid:id}})
        .then((response)=> console.log("requester deleted"))
        .catch(error=>console.log(error))
        axios.delete(`http://${user.network}:19001/api/deletefriend`, {data: {requesterid:id, recipientid:user.userId}})
        .then((response)=>  setRequested(false))
        .catch(error=>console.log(error))
        setIsFriend(false)
        setRequested(false)
        setApproval(false)
    }
    function handleTest() {
        console.log('friend:',isFriend)
        console.log('requested:',requested)
        console.log('approval:',approval)
    }
    function handleRequest() {
        if (requested) {
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
    useEffect(()=> {
        handleRequest()
    }, [requested])
    useEffect(()=> {
        axios.get(`http://${user.network}:19001/api/getrequests`) 
        .then((response)=>{ 
            setIsFriend(response.data.filter((item)=>((item.requesterId === id)||(item.recipientId === id))&&
            ((item.requesterId === user.userId) || (item.recipientId === user.userId))).length > 0?
            response.data.filter((item)=>((item.requesterId === id)||(item.recipientId === id))&&
            ((item.requesterId === user.userId) || (item.recipientId === user.userId)))[0].approved:false)
            setRequested(response.data.filter((item)=> (item.requesterId === user.userId) && (item.recipientId === id) && (!item.approved)).length > 0)
            setApproval(response.data.filter((item)=> (item.requesterId === id) && (item.recipientId === user.userId) && (!item.approved)).length > 0)
           // console.log(response.data.filter((item)=>(item.requesterId === id)||(item.recipientId === id)))
            setLoading(false)
        })
    }, [])
    return (
        <Pressable 
            style={{right:(windowW>400)?0:0, alignSelf:"center", height:windowH*(26/windowH)}}
            onPress={(!isFriend)?(approval)?acceptFriend:(!requested)?requestFriend:deleteFriend:null}>
            <Animated.View style={[styles.addFriendContainer, 
                {backgroundColor:animatedcolor.interpolate({inputRange:[0,100], outputRange:["rgba(0, 82, 63, 1)","#565454"]})
            }]}>
                <Animated.Text style={[styles.addFriendText, 
                    {fontSize:12, 
                    color:animatedcolor.interpolate({inputRange:[0,100], outputRange:["white","rgba(10,10,10,1)"]})
                }]}>
                    {(loading)?"Loading...":
                    (isFriend)?"Friends":
                    (!isFriend && approval)?"Accept":
                    (!isFriend && requested)?"Requested":'Request'
                    }
                </Animated.Text>
            </Animated.View>
        </Pressable>
    )
}
const styles = StyleSheet.create({
    addFriendContainer: {
        minWidth:windowW * (88/windowW),
        height: windowH * (24/windowH),
        borderRadius:4,
        justifyContent:"center"
    },
    addFriendText: {
        fontFamily:"InterBold",
        alignSelf:"center"
    },
})
export default RequestButton;