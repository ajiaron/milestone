import  React, {useState, useEffect, useContext, useRef} from "react";
import { Text, StyleSheet, View, Image, FlatList, Pressable, ScrollView, Dimensions, Animated } from "react-native";
import { Icon } from 'react-native-elements'
import { useNavigation } from "@react-navigation/native";
import Footer from './Footer'
import MilestoneTag from "./MilestoneTag";
import Navbar from "./Navbar";
import userContext from '../contexts/userContext'
import axios from 'axios'

const windowW = Dimensions.get('window').width
const windowH = Dimensions.get('window').height

const MilestoneList = ({route}) => {
    const milestoneData = require('../data/Milestones.json')
    const user = useContext(userContext)
    const [userid, setUserid] = useState(route.params?route.params.id:user.userId)
    const [username, setUsername] = useState(route.params?route.params.username:user.username)
    const [milestoneList, setMilestoneList] = useState([])
    const navigation = useNavigation()
    const scrollY = useRef(new Animated.Value(0)).current;
    useEffect(()=> {
        axios.get(`http://${user.network}:19001/api/getusermilestones/${(userid)}`)
        .then((response)=> {
            setMilestoneList(response.data)})
        .catch((error)=> console.log(error))
    }, [])
   
    const renderMilestone = ({ item }) => {
        return (
            <MilestoneTag 
                title={item.title} 
                streak={item.streak} 
                img={milestoneList.length>0?item.src:item.img} 
                id={milestoneList.length>0?item.idmilestones:item.id} 
                isLast={milestoneList.map(item=>item.idmilestones).indexOf(item.idmilestones) === milestoneList.length-1}
            />
        )
    }
    return (
        <View style={styles.milestoneListPage}>
            <Navbar title={'milestone'} scrollY={scrollY} />
              <View style={[styles.milestoneHeaderContainer, {top:windowH*0.1525}]}>
                    <Text style={[styles.milestoneHeader]}>
                        {(user.userId === userid)?`Your Milestones`:`${username}'s Milestones`}
                    </Text>
                    <Pressable onPress={()=> {console.log(milestoneList)}}>
                        <Icon 
                        name='navigate-next' 
                        size={30} 
                        color="rgba(53, 174, 146, 1)" 
                        style={{bottom:2, left:0}}/>
                    </Pressable>
                    
                </View>
             <View style={(windowH > 900)?styles.postTagContainerLarge:styles.postTagContainer}>
                {(milestoneList.length>0)?
                    <FlatList 
                        snapToAlignment="start"
                        decelerationRate={"fast"}
                        snapToInterval={(windowH*0.0756)+16}
                        showsVerticalScrollIndicator={false}
                        style={[styles.milestoneList]} 
                        data={milestoneList} 
                        renderItem={renderMilestone} 
                        keyExtractor={(item)=>(milestoneList.length>0)?item.idmilestones.toString():item.id.toString()}>
                    </FlatList> :(userid === user.userId)?
                    <Pressable onPress={()=>navigation.navigate("CreateMilestone", {from:'explore'}) }>
                        <View style={[styles.milestoneEmptyContainer]}>
                            <View style={{alignItems:"center",alignSelf:"center", justifyContent:"space-evenly"}}>
                                <Icon
                                name = {'add-to-photos'}
                                color="rgba(58, 184, 156, 1)"
                                size={(windowH>900)?27.5:26}
                                />
                                <Text style={{fontFamily:"Inter", color:"rgba(58, 184, 156, 1)", 
                                fontSize:(windowH>900)?12:11, paddingTop:6}}>Add a new milestone...</Text>
                            </View>
                        </View>
                    </Pressable>:null
                }
                </View>   

                <View style={{position:"absolute", bottom:0}}>
                    <Footer/>
                </View>
        </View>
    )
}
const styles = StyleSheet.create({
    milestoneListPage: {
        backgroundColor:"rgba(28, 28, 28, 1)",
        flex: 1,
        minWidth: "100%",
        minHeight: "100%",
        overflow: "hidden",
    },
    postTagContainerLarge: {
        minWidth:windowW * 0.8,
        maxHeight:windowH * (0.737 - .0941),
        alignSelf:"center",
        top: windowH * 0.175
    },
    postTagContainer: {
        minWidth:windowW * 0.8,
        maxHeight:windowH * 0.665,
        alignSelf:"center",
        top: windowH * 0.175
    },
    milestoneList: {
        minWidth:windowW*0.8,
        alignSelf:"center",
        maxHeight:(((windowH*0.0756)+16)*7)-4,
        borderRadius: 8,
    },
    milestoneHeaderContainer: {
        alignSelf:"center",
        minWidth:windowW*0.8,
        flexDirection:"row",
        left:4,
        maxHeight:22,
    },
    milestoneHeader: {
        fontFamily:"Inter",
        fontSize: 20,
        color:"white",
    },
    milestoneEmptyContainer: {
        alignItems:"center",
        padding:(windowH*0.0185)-2.25,
        width:windowW*0.8,
        height: windowH*0.0756,
        backgroundColor: "rgba(28, 28, 28, 1)",
        borderColor:"rgba(58, 184, 156, 1)",
        borderRadius: 8,
        borderWidth:2.25,
        borderStyle:"dashed",
        marginBottom:20,
        shadowColor: '#000',
        shadowOffset: {
        width: 0,
        height: 2,
        },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        alignSelf:"center"
    },

})
export default MilestoneList