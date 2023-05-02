import  React, {useState, useEffect, useRef, useContext} from "react";
import { Text, StyleSheet, View, Image, Pressable, Dimensions, Animated, FlatList } from "react-native";
import Icons from '../data/Icons.js'
import { Icon } from 'react-native-elements'
import { useNavigation, useRoute, useIsFocused } from "@react-navigation/native";
import userContext from '../contexts/userContext'
import axios from 'axios'
import FastImage from "react-native-fast-image";
import MilestoneStory from "./MilestoneStory.js";

const windowW = Dimensions.get('window').width
const windowH = Dimensions.get('window').height

const MilestoneReel = ({refresh, focus, milestones}) => {
    const user = useContext(userContext)
    const isFocused = useIsFocused()
    const route = useRoute()
    const navigation = useNavigation()
    const routes = navigation.getState()?.routes;
    const animatedvalue = useRef(new Animated.Value(0)).current;
    const [selected, setSelected] = useState(false)
    const [ascending, setAscending] = useState(false)
    const [recentMilestones, setRecentMilestones] = useState([])
    function navigateCamera() {
        navigation.navigate("TakePost", {
            previous_screen: routes[routes.length - 1]
        })
    }
    function handlePress() {
       setAscending(!ascending)
    }
    useEffect(()=> {
        axios.get(`http://${user.network}:19001/api/getrecentupdates/${user.userId}`) 
        .then((response)=>{ 
            setRecentMilestones([...response.data.filter((item)=>
                item.viewable === "Everyone"|| (item.viewable === "Only You") && user.userId === item.mileOwner)].reverse())
        })
        .catch((error) => console.log(error))
    }, [refresh, focus, isFocused])
    const renderMilestone = ({item}) => {
        return (
            <MilestoneStory item={item} refresh={refresh} focus={isFocused} ascending={ascending}/>
        )
    }
    return (
        <>
        {(recentMilestones.length === 0)?null:
        <View style={[styles.reelContainer]}>
            <View style={[styles.reelContent]}>
                <Pressable onPress={handlePress} style={{paddingRight:0, marginLeft:16}}>
                    <Icon
                        name={'multiple-stop'}
                        size={28}
                        style={{top:-1.5, left:3.5}}
                        color={'rgba(48, 184, 146, 1)'}
                    />
                 </Pressable>
                <FlatList
                    data={(!ascending)?[...recentMilestones].reverse():recentMilestones}
                    renderItem={renderMilestone}
                    showsHorizontalScrollIndicator={false}
                    horizontal
                    style={{minWidth:windowW-84}}
                />
            </View>
        </View>
        }
        </>
    )
}
const styles = StyleSheet.create({
    reelContainer: {
        backgroundColor:'#1c1c1c',
        minWidth:windowW,
        paddingTop:0,
        borderColor:"rgba(28, 28, 28, 1)",
        height:(windowH*0.08)+8,
        flex:1,
        marginBottom:2,
 
        justifyContent:"center"
    },
    reelContent: {
        minWidth:windowW-84,
        flexDirection:"row",
        overflow:"scroll",
        alignItems:"center",
        justifyContent:"space-evenly",
        flex:1,
        alignSelf:"flex-start",
        paddingLeft:0,
        paddingRight:16,

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