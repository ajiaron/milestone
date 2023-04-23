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

const MilestoneReel = () => {
    const user = useContext(userContext)
    const animatedvalue = useRef(new Animated.Value(0)).current;
    const [selected, setSelected] = useState(false)
    const [recentMilestones, setRecentMilestones] = useState([])
    useEffect(()=> {
        axios.get(`http://${user.network}:19001/api/getrecentupdates/${user.userId}`) 
        .then((response)=>{ 
            setRecentMilestones([...response.data].reverse())
        })
        .catch((error) => console.log(error))
    }, [])
    const renderMilestone = ({item}) => {
        return (
            <View style={{height:40, width:40, marginLeft:(windowH>900)?26:22}}>
                <View>
                    <Pressable onPress={()=> setSelected(!selected)}>
                        <View style={[styles.reelItemContainer]}>
                            {
                                (!user.isExpo && 
                                (item.mileImage.toString().split('.').pop() === 'jpg' 
                                || item.mileImage.toString().split('.').pop() === 'png'))?
                                <FastImage
                                    style={[styles.reelItem,
                                        {borderWidth:(item.mileImage === 'campfire')?0:3, 
                                        borderColor:(item.ownerid === user.userId && item.mileOwner === user.userId)?'rgba(48, 174, 146, 1)':'#3583AE'}
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
                                        {borderWidth:(item.mileImage === 'campfire')?0:3, 
                                        borderColor:(item.ownerid === user.userId && item.mileOwner === user.userId)?'rgba(48, 174, 146, 1)':'#3583AE'}
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
            </View>
        )
    }
    return (
        <View style={[styles.reelContainer]}>
            <View style={[styles.reelContent]}>
                <Pressable onPress={()=>console.log(recentMilestones)} style={{paddingRight:40}}>
                    <Icon
                        name={'add'}
                        size={28}
                        style={{top:1, paddingLeft:28}}
                        color={'rgba(48, 174, 146, 1)'}
                    />
                 </Pressable>
                <FlatList
                    data={recentMilestones}
                    renderItem={renderMilestone}
                    showsHorizontalScrollIndicator={false}
                    horizontal
                    style={{minWidth:windowW}}
                />
            </View>
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
        paddingLeft:32,

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
export default MilestoneReel