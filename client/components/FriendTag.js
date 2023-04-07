import  React, {useState, useEffect, useRef, useContext} from "react";
import { Text, StyleSheet, View, Image, Pressable, PixelRatio, TouchableOpacity, Dimensions, Animated } from "react-native";
import Icons from '../data/Icons.js'
import { Icon } from 'react-native-elements'
import { useNavigation, useRoute, NavigationActions } from "@react-navigation/native";
import GlobalStyles from "../styles/GlobalStyles";
import userContext from '../contexts/userContext'
import axios from 'axios'

const windowW= Dimensions.get('window').width
const windowH = Dimensions.get('window').height

const FriendTag = ({id, username, img}) => {
    const navigation= useNavigation()
    const user = useContext(userContext)
    const [friends, setFriends] = useState([])
    const [approval, setApproval] = useState(false)
    const [isFriend, setIsFriend] = useState(false)
    const [pending, setPending] = useState(false)
    function acceptFriend() {
        axios.put(`http://${user.network}:19001/api/acceptfriend`, 
        {requesterid:id,recipientid:user.userId})
        .then(() => {
            setIsFriend(true)
            console.log('friend accepted')
        })
    }
    function deleteFriend() {
        axios.delete(`http://${user.network}:19001/api/deletefriend`, {data: {requesterid:user.userId, recipientid:id}})
        .then((response)=> console.log("requester deleted"))
        .catch(error=>console.log(error))
        axios.delete(`http://${user.network}:19001/api/deletefriend`, {data: {requesterid:id, recipientid:user.userId}})
        .then((response)=>  setPending(false))
        .catch(error=>console.log(error))
    }
    function handleTest() {
        console.log('friend:',isFriend)
        console.log('pending:',pending)
        console.log('approval:',approval)
    }
    useEffect(()=> {
        axios.get(`http://${user.network}:19001/api/getrequests`) 
        .then((response)=>{ 
            setFriends(response.data.filter((item)=>(item.requesterId === id)||(item.recipientId === id))[0])   // get friends from database
            setIsFriend(response.data.filter((item)=>(item.requesterId === id)||(item.recipientId === id))[0].approved)
            setPending(response.data.filter((item)=> (item.requesterId === user.userId) && (item.recipientId === id) && (!item.approved)).length > 0)
            setApproval(response.data.filter((item)=> (item.requesterId === id) && (item.recipientId === user.userId) && (!item.approved)).length > 0)
        })
    }, [])
    return (
        <View style={[styles.friendContainer]}>
            <View style={[styles.friendContentContainer]}>  
                <View style={[styles.friendIconContainer]}>
                    <Pressable onPress={()=>navigation.navigate("Profile",{id:id})}>
                    <Image
                            style={styles.friendIcon}
                            resizeMode="cover"
                            // require() is for fake images, {uri: } is for real ones
                            source={(img.length === 0 || img === undefined)?Icons['doggo']:{uri: img}}/> 
                    </Pressable>
                </View>
                <View style={[styles.friendContext]}>
                    <Pressable onPress={()=>navigation.navigate("Profile",{id:id})}>

                    
                        <Text style={[styles.friendTitle]}>
                            {username}
                        </Text>
                    </Pressable>
                </View>

                <View style = {[styles.requestIcon]}>
                    {(isFriend)?
                    <Pressable 
                         style={{marginRight:(windowW>400)?14.5:11.5, marginTop:(windowW>400)?5.5:3.5, height:windowH*(26/windowH)}}
                         //onPress={deleteFriend}
                    >
                         <View style={[styles.addFriendContainer, {backgroundColor:"rgba(0, 82, 63, 1)"}]}>
                             <Text style={[styles.addFriendText, {fontSize:12.5, color:"rgba(255,255,255,1)"}]}>
                                 Friends
                             </Text>

                         </View>
                     </Pressable>:
                    (!isFriend && approval)?
                    <View style={{flexDirection:"row"}}>
                        <Pressable onPress={acceptFriend} style={{right:windowW*0.065,}}>
                            <Icon 
                                name='check-circle'
                                color="rgba(53, 174, 146, 1)"
                                size={32}
                            />
                        </Pressable>
                        <Pressable onPress={deleteFriend} style={{right:windowW*0.065,}}>
                            <Icon   
                                name='cancel'
                                color="#9c3153"
                                size={32}
                            />
                        </Pressable>
                    </View>:
                    (!isFriend && pending)?
                     <Pressable 
                     style={{marginRight:(windowW>400)?14.5:11.5, marginTop:(windowW>400)?5.5:3.5, height:windowH*(26/windowH)}}
                     onPress={deleteFriend}
                >
                     <View style={[styles.addFriendContainer, {backgroundColor:"#565656"}]}>
                         <Text style={[styles.addFriendText, {fontSize:12.5, color:"rgba(8,8,8,1)"}]}>
                             Pending
                         </Text>
                     </View>
                 </Pressable>:null
                    }
                </View>
            </View>
        </View>
    )
}
const styles = StyleSheet.create({
    friendContainer: {
        alignItems:"center",
        width:windowW*0.800,
        height: windowH*0.0756,
        backgroundColor: "rgba(10, 10, 10, 1)",
        borderRadius: 8,
        marginBottom:16,
        alignSelf:"center",
        shadowColor: '#000',
        shadowOffset: {
        width: 0,
        height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
    },
    friendContentContainer: {
        width:(windowW*0.8)*0.875,
        height:(windowH*0.0756)*0.4285,
        flex:1,
        flexDirection:"row",
        alignItems:"center",
        //paddingRight: 100,
    },
    friendIconContainer: {
        width:(windowW*0.082),
        height:(windowH*0.0378),
        backgroundColor: "rgba(214, 214, 214, 1)",
        borderRadius:5,
        justifyContent:"center",
    },
    requestIcon: {
       // right: (windowW*0.800)*0.055,
        flexDirection:"row",
        alignItems:"center",
        justifyContent:"center",
        alignSelf:"center",
  
    },
    friendIcon: {
        width:"100%",
        height:"100%",
        alignItems:"center",
        borderRadius:5,
        justifyContent:"center",
        alignSelf:"center"
    },
    friendContext: {
        left:0,
        width:windowW*0.52,
        alignSelf:"center",
        justifyContent:"center",
    },
    friendTitle: {
        fontFamily:"InterBold",
        fontSize:16, 
        color:"white",
        left:windowW*0.0385,
    },
    addFriendContainer: {
        minWidth:windowW *0.2,
        height: windowH * (26/windowH),
        borderRadius:4,
        right:windowW*0.1,
        bottom:1.5,
        alignSelf:"center",
        justifyContent:"center"
    },
    addFriendText: {
        fontFamily:"InterBold",
        alignSelf:"center"
    },
})
export default FriendTag