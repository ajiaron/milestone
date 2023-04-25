import  React, {useState, useEffect, useRef, useContext} from "react";
import { Text, StyleSheet, View, Image, Pressable, Dimensions, Animated, FlatList } from "react-native";
import Icons from '../data/Icons.js'
import { Icon } from 'react-native-elements'
import { useNavigation, useRoute, useIsFocused} from "@react-navigation/native";
import userContext from '../contexts/userContext'
import axios from 'axios'
import FastImage from "react-native-fast-image";

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
            console.log('nah')
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
    return (
        <View style={{paddingTop:(windowH>900)?6:8}}>
        <View style={{height:40, width:40, marginLeft:(windowH>900)?26:22}}>
            <Pressable onPress={handleNavigate}>
                <View style={[styles.reelItemContainer]}>
                    {
                        (!user.isExpo && 
                        (item.mileImage.toString().split('.').pop() === 'jpg' 
                        || item.mileImage.toString().split('.').pop() === 'png'))?
                        <FastImage
                            style={[styles.reelItem,
                                {borderWidth:3.25, 
                                borderColor:(item.mileOwner === user.userId)?
                                (updateOwner)?  // adjust darkness of colored border based on how many posts in the week
                                (postCount < 5)?`rgba(${48-((postCount-1)*10)}, ${174-((postCount-1)*10)}, ${146-((postCount-1)*10)}, 1)`
                                :`rgba(8, 134, 106, 1)`:
                                (postCount < 5)?`rgba(${230-((postCount-1)*10)}, ${120-((postCount-1)*10)}, ${120-((postCount-1)*10)}, 1)`
                                :`rgba(190, 80, 80, 1)`                  
                                :                                             
                                (updateOwner)?                             
                                (postCount < 5)?`rgba(${48-((postCount-1)*10)}, ${174-((postCount-1)*10)}, ${146-((postCount-1)*10)}, 1)`
                                :`rgba(8, 134, 106, 1)`:
                                (postCount < 5)?`rgba(${53-((postCount-1)*10)}, ${131-((postCount-1)*10)}, ${174-((postCount-1)*10)}, 1)`
                                :`rgba(13, 91, 134, 1)`}
                            ]}
                            resizeMode={FastImage.resizeMode.cover}
                            source={{
                                uri: item.mileImage,
                                priority: FastImage.priority.normal
                            }}
                        />
                        :
                        <Image
                            style={[styles.reelItem,
                                {borderWidth:3.25, 
                                borderColor:(item.mileOwner === user.userId)?
                                (updateOwner)?
                                (postCount < 5)?`rgba(${48-((postCount-1)*10)}, ${174-((postCount-1)*10)}, ${146-((postCount-1)*10)}, 1)`:`rgba(8, 134, 106, 1)`:
                                (postCount < 5)?`rgba(${230-((postCount-1)*10)}, ${120-((postCount-1)*10)}, ${120-((postCount-1)*10)}, 1)`:`rgba(190, 80, 80, 1)`                  
                                :                                             
                                (updateOwner)?                             
                                (postCount < 5)?`rgba(${48-((postCount-1)*10)}, ${174-((postCount-1)*10)}, ${146-((postCount-1)*10)}, 1)`:`rgba(8, 134, 106, 1)`:
                                (postCount < 5)?`rgba(${53-((postCount-1)*10)}, ${131-((postCount-1)*10)}, ${174-((postCount-1)*10)}, 1)`:`rgba(13, 91, 134, 1)`}
                            ]}
                            resizeMode="cover"
                            source={(item.mileImage.toString().split('.').pop() === 'jpg' 
                            || item.mileImage.toString().split('.').pop() === 'png')?
                            {uri: item.mileImage}:Icons[item.mileImage]}
                        /> 
                    }
                </View>
            </Pressable>
        </View>
                 <Text style={{fontFamily:"Inter", color:'rgba(180,180,180,1)', fontSize:10.5, marginLeft:(windowH>900)?26:22, alignSelf:"center", marginTop:2}}>
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
        alignItems:"center",

        justifyContent:"center"
    },
    reelContent: {
        minWidth:windowW,
        flexDirection:"row",
        alignItems:"center",
        justifyContent:"space-evenly",
        flex:1,
        alignSelf:"center",
        narginLeft:32,

    },
    reelItem: {
        alignSelf:"center",
        width:40,
        height:40,
        borderRadius:5,
    },
    reelItemContainer: {
        width:40,
        height:40,
        alignItems:"center",
        justifyContent:"center",
        backgroundColor: "rgba(214, 214, 214, 1)",
        borderRadius:5,
    },
    settingsNotification: {
        backgroundColor:"rgba(238, 64, 64, 1)",
        width:8,
        height:8,
        borderRadius:4,
        right:-16,
        top:9,
        zIndex:999
    },
})
export default MilestoneStory