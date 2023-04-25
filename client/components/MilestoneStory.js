import  React, {useState, useEffect, useRef, useContext} from "react";
import { Text, StyleSheet, View, Image, Pressable, Dimensions, Animated, FlatList } from "react-native";
import Icons from '../data/Icons.js'
import { Icon } from 'react-native-elements'
import { useNavigation, useRoute } from "@react-navigation/native";
import userContext from '../contexts/userContext'
import axios from 'axios'
import FastImage from "react-native-fast-image";

const windowW = Dimensions.get('window').width
const windowH = Dimensions.get('window').height

const MilestoneStory = ({item}) => {
    const user = useContext(userContext)
    const navigation = useNavigation()
    const route = useRoute()
    const [selected, setSelected] = useState(false)
    const [postList, setPostList] = useState([])
    function handleTest() {
        console.log(postList)
    }
    function handleNavigate() {
        navigation.navigate("MilestoneFeed", {title:item.title, postFeed:postList})
        
    }
    useEffect(()=> {
        axios.get(`http://${user.network}:19001/api/getrecentposts/${item.idmilestones}`) 
        .then((response)=>{ 
            setPostList(response.data)
        })
        .catch((error) => console.log(error))
    }, [])
    return (
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
                                    borderColor:(item.mileOwner === user.userId)?'rgba(48, 174, 146, 1)':'#3583AE'}
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
                                    borderColor:(item.mileOwner === user.userId)?'rgba(48, 174, 146, 1)':'#3583AE'}
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
    )
}
const styles = StyleSheet.create({
    reelContainer: {
        backgroundColor:'#1c1c1c',
        width:windowW,
        paddingTop:2,
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
    }
})
export default MilestoneStory