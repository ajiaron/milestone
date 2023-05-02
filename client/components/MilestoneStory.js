import  React, {useState, useEffect, useRef, useContext} from "react";
import { Text, StyleSheet, View, Image, Pressable, Dimensions, Animated, FlatList } from "react-native";
import Icons from '../data/Icons.js'
import { Icon } from 'react-native-elements'
import { useNavigation, useRoute, useIsFocused} from "@react-navigation/native";
import userContext from '../contexts/userContext'
import axios from 'axios'
import FastImage from "react-native-fast-image";
import LinearGradient from 'react-native-linear-gradient';

const windowW = Dimensions.get('window').width
const windowH = Dimensions.get('window').height

const MilestoneStory = ({item, refresh, focus, ascending}) => {
    const user = useContext(userContext)
    const isFocused = useIsFocused()
    const navigation = useNavigation()
    const route = useRoute()
    const [selected, setSelected] = useState(false)
    const [latest, setLatest] = useState()
    const [postList, setPostList] = useState([])
    const [isActive, setIsActive] = useState(false) // does nothing for now
    const [updateOwner, setUpdateOwner] = useState(false)
    const [postCount, setPostCount] = useState(1)
    function handleTest() {
        console.log(postList)
    }
    function handleNavigate() {
        setIsActive(!isActive)
        navigation.navigate("MilestoneFeed", {title:item.title, postFeed:postList, id:item.idmilestones})
    }
    useEffect(()=> {
        axios.get(`http://${user.network}:19001/api/getrecentposts/${item.idmilestones}`) 
        .then((response)=>{ 
            setPostList(response.data)
            setPostCount(response.data.length)
            setUpdateOwner(response.data[0].ownerid === user.userId)
            const newDate = new Date()
            const postDate = new Date(response.data[0].date)
            if (new Date(response.data[0].date).toLocaleString("en-US", {day: "numeric"}) === 
            new Date().toLocaleString("en-US", {day: "numeric"})) {
                setLatest('Today')
            }
            else {
                setLatest(new Date(response.data[0].date).toLocaleString("en-US", {month: "short", day:"numeric"}))
            }
        })
        .catch((error) => console.log(error))
    }, [refresh, focus, route, ascending])

    function getColors(val) {   // adjust val to get darker or lighter
        return ( (item.mileOwner === user.userId)?
        (updateOwner)?          // adjust brightness based on how many posts in the week
        (postCount < 5)?`rgba(${58-((postCount-1)*10)-val}, ${184-((postCount-1)*10)-val}, ${156-((postCount-1)*10)-val}, 1)`
        :`rgba(${8-val}, ${134-val}, ${106-val}, 1)`:
        (postCount < 5)?`rgba(${230-((postCount-1)*10)-val}, ${120-((postCount-1)*10)-val}, ${120-((postCount-1)*10)-val}, 1)`
        :`rgba(${190-val}, ${80-val}, ${80-val}, 1)`                  
        :                                             
        (updateOwner)?                             
        (postCount < 5)?`rgba(${58-((postCount-1)*10)-val}, ${184-((postCount-1)*10)-val}, ${156-((postCount-1)*10)-val}, 1)`
        :`rgba(${8-val}, ${134-val}, ${106-val}, 1)`:
        (postCount < 5)?`rgba(${63-((postCount-1)*10)-val}, ${141-((postCount-1)*10)-val}, ${184-((postCount-1)*10)-val}, 1)`
        :`rgba(${13-val}, ${91-val}, ${134-val}, 1)`)
    }
    return (
        <View style={{paddingTop:(windowH>900)?6:8, overflow:"visible", borderRadius:5}}>
        {(!user.isExpo)?
        <View style={{marginLeft:(windowH>900)?30:28}}>
            <LinearGradient style={[styles.reelBackContent]} start={{x:0,y:0}} end={{x:1,y:0.5}}
            colors={[getColors(0),getColors(50)]}/> 
            <Pressable onPress={handleNavigate}>
                <View style={[styles.reelItemContainer, {top:-36,left:6,}]}>
                {
                    (!user.isExpo && 
                    (item.mileImage.toString().split('.').pop() === 'jpg' 
                    || item.mileImage.toString().split('.').pop() === 'png'))?
                    <FastImage
                        style={[styles.reelItem,]}
                        resizeMode={FastImage.resizeMode.cover}
                        source={{
                            uri: item.mileImage,
                            priority: FastImage.priority.normal
                        }}
                    />
                    :
                    <Image
                        style={[styles.reelItem,]}
                        resizeMode="cover"
                        source={(item.mileImage.toString().split('.').pop() === 'jpg' 
                        || item.mileImage.toString().split('.').pop() === 'png')?
                        {uri: item.mileImage}:Icons[item.mileImage]}
                    /> 
                }
                </View>
            </Pressable>
        </View>

        :
        <View style={[styles.reelBackContent, {
            backgroundColor:getColors(10), marginLeft:(windowH>900)?30:28}]}> 
        <Pressable onPress={handleNavigate}>
            <View style={[styles.reelItemContainer, {transform:[{rotate:'5deg'}]}]}>
            {
                (!user.isExpo && 
                (item.mileImage.toString().split('.').pop() === 'jpg' 
                || item.mileImage.toString().split('.').pop() === 'png'))?
                <FastImage
                    style={[styles.reelItem,]}
                    resizeMode={FastImage.resizeMode.cover}
                    source={{
                        uri: item.mileImage,
                        priority: FastImage.priority.normal
                    }}
                />
                :
                <Image
                    style={[styles.reelItem,]}
                    resizeMode="cover"
                    source={(item.mileImage.toString().split('.').pop() === 'jpg' 
                    || item.mileImage.toString().split('.').pop() === 'png')?
                    {uri: item.mileImage}:Icons[item.mileImage]}
                /> 
            }
            </View>
        </Pressable>
    </View>

        }
            <Text style={[styles.reelItemText]}>
                {latest}
            </Text>
        </View>
    )
}
const styles = StyleSheet.create({
    reelContainer: {
        backgroundColor:'#1c1c1c',
        width:windowW,
        borderColor:"rgba(28, 28, 28, 1)",
        height:windowH*0.0725,
        flex:1,
        borderRadius:5,
        alignItems:"center",
        justifyContent:"center",
        overflow:"visible"
    },
    reelContent: {
        minWidth:windowW,
        flexDirection:"row",
        alignItems:"center",
        justifyContent:"space-evenly",
        flex:1,
        alignSelf:"center",
        borderRadius:5,
        overflow:"visible",
        narginLeft:32,
    },
    reelBackContent: {
        height:(windowH>900)?42:41,
        width:(windowH>900)?42:41, 
        backgroundColor:'transparent',
        borderRadius:5,
        zIndex:-1,
        transform:[{rotate:'-5deg'}],
        alignSelf:"center",

    },
    reelItem: {
        alignSelf:"center",
        height:(windowH>900)?42:41,
        width:(windowH>900)?42:41, 
        borderRadius:5,
    },
    reelItemContainer: {
        height:(windowH>900)?42:41,
        width:(windowH>900)?42:41, 
        position:"absolute",
       
        alignItems:"center",
        justifyContent:"center",
        backgroundColor: "rgba(214, 214, 214, 1)",
        borderRadius:5,
        alignSelf:"center",
        zIndex:999,

        shadowColor: '#000',
        shadowOffset: {
        width: -3,
        height: -3,
        },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        top:6,
        left:6,
    },
    reelItemText: {
        fontFamily:"Inter", 
        color:'rgba(180,180,180,1)', 
        fontSize:(windowH>900)?11:10.5, 
        marginLeft:(windowH>900)?30:28, 
        alignSelf:"center", 
        marginTop:9,
        left:6

    },
    settingsNotification: {
        backgroundColor:"rgba(238, 64, 64, 1)",
        width:8,
        height:8,
        borderRadius:8,
        right:-16,
        top:9,
        zIndex:999
    },
})
export default MilestoneStory