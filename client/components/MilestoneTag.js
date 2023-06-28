import  React, {useState, useEffect, useRef, useContext} from "react";
import { Text, StyleSheet, View, Image, Pressable, PixelRatio, TouchableOpacity, Dimensions, Animated } from "react-native";
import Icons from '../data/Icons.js'
import { Icon } from 'react-native-elements'
import { useNavigation, useRoute, useIsFocused } from "@react-navigation/native";
import GlobalStyles from "../styles/GlobalStyles";
import userContext from '../contexts/userContext'
import FastImage from "react-native-fast-image";
import axios from 'axios'

const windowW= Dimensions.get('window').width
const windowH = Dimensions.get('window').height

const MilestoneTag = ({title, streak, img, id, ownerid, isLast, description, selected, isEmpty, date, onSelectMilestone, onRemoveMilestone}) => {
    const navigation = useNavigation();
    const animatedvalue = useRef(new Animated.Value(0)).current;
    const [tagDate, setTagDate] = useState(date !== undefined?new Date(date).toLocaleDateString("en-US", {month:"short", day:"numeric"}):false)
    const [isSelected, setIsSelected] = useState(selected===undefined||!selected?false:selected)
    const route = useRoute();
    const [posts, setPosts] = useState()
    const [startDate, setStartDate] = useState()
    const [fullDate, setFullDate] = useState()
    const [isLoading, setIsLoading] = useState(false)
    const [token, setToken] = useState()
    const [duration, setDuration] = useState(null)
    var fileExt = (img !== undefined)?img.toString().split('.').pop():'money'
    const user = useContext(userContext)
    const milestoneData = {
        id:id,
        title:title,
        streak:streak,
        img:img,
        ownerid:ownerid,
    }
    const autoSelect = () => {
        if (selected) {
            Animated.timing(animatedvalue,{
                toValue:100,
                duration:250,
                useNativeDriver:false,
            }).start()
        } else {
            Animated.timing(animatedvalue,{
                toValue:0,
                duration:200,
                useNativeDriver:false,
            }).start()
        }
    }
   
    const toggleSelect = () => {
        setIsSelected(!isSelected)
        if (selected) {
            if (isSelected) {
                Animated.timing(animatedvalue,{
                    toValue:100,
                    duration:250,
                    useNativeDriver:false,
                }).start()
            } else {
                Animated.timing(animatedvalue,{
                    toValue:0,
                    duration:200,
                    useNativeDriver:false,
                }).start()
            }
        }
        else {
            if (!isSelected) {
                Animated.timing(animatedvalue,{
                    toValue:100,
                    duration:250,
                    useNativeDriver:false,
                }).start()
            } else {
                Animated.timing(animatedvalue,{
                    toValue:0,
                    duration:200,
                    useNativeDriver:false,
                }).start()
            }
        }
    }
    function sendPost() {
        milestoneData.idmilestones = id
        milestoneData.title = title
        milestoneData.streak = streak
        milestoneData.img = img
        milestoneData.ownerid = ownerid
        milestoneData.date = fullDate
        milestoneData.count = posts
        milestoneData.token = token
    }
    function checkDate() {
        if ((new Date(duration)- new Date())/86400000 < 0 && duration !== null) {
            return true
        } 
        return false
    }
    function handlePress(){  
        sendPost()
        if (route.name === "CreatePost" || route.name === 'EditPost') {
            if (!isSelected) {
                onSelectMilestone(milestoneData)
            }
            else {
                onRemoveMilestone(milestoneData)
            }
            toggleSelect()
       
        } else if (route.name === "Profile" || route.name === 'MilestoneList' || route.name === 'Post') {
            navigation.reset({
                index: 0,
                routes: [{name: 'MilestonePage'}],
              });
            navigation.push("MilestonePage", {milestone:milestoneData, date:fullDate, count:posts})
        }
    }
    useEffect(()=> {
        if (route.name === "CreatePost") {
            axios.get(`http://${user.network}:19001/api/getusertoken/${ownerid}`)
            .then((response)=> {
                setToken(response.data[0].pushtoken)
            })
        }
    }, [])
    useEffect(()=> {
        axios.get(`http://${user.network}:19001/api/getlinkedposts/${id}`)
        .then((response)=> {
            setPosts(response.data.length)
        })
        .catch((error)=> console.log(error))
    },[isEmpty])
    useEffect(()=> {
        axios.get(`http://${user.network}:19001/api/getmilestones`)
        .then((response)=> {
            setStartDate(new Date(response.data.filter((item)=> item.idmilestones == id).map((item)=>
            item.date)[0]).toLocaleDateString("en-US", {month:"short", day:"numeric"}))
            setFullDate(new Date(response.data.filter((item)=> item.idmilestones == id).map((item)=>
            item.date)[0]).toLocaleDateString("en-US", {month:"short", day:"numeric", year:"numeric"}))
            setDuration(response.data.filter((item)=> item.idmilestones == id)[0].duration)
        })
        .catch((error)=> console.log(error))
    }, [])

    useEffect(()=> {
        if (route.name === 'EditPost') {
            setIsSelected(selected)
            sendPost()
        }
    }, [selected, navigation])
    useEffect(()=> {
        if (route.name === 'EditPost' && !selected) {
            autoSelect()
        }
    }, [navigation])
    /*
    useEffect(()=> {
        clear selected milestones if screen changes 
        const deselect = navigation.addListener('focus', ()=> {
            setIsSelected(false)
            if ((route.name === "CreatePost" || route.name === "EditPost")) {
                onRemoveMilestone(milestoneData)
            }
        })
        return deselect
        setIsLoading(false)
    }, [navigation])
    */
    return (
    <View>
        {((route.name === 'EditPost' || route.name === 'CreatePost')&&isEmpty)&&
        <Pressable onPress={()=>navigation.navigate("CreateMilestone", {from:'create'})}>
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
        </Pressable>}
        
        <Pressable onPress={handlePress} activeOpacity={0.2}>
         <Animated.View style={[((isSelected)&& (route.name=="CreatePost" || route.name=='EditPost'))?
                ((isLast)?styles.highlightContainerLast:styles.highlightContainer):
                (isLast)?styles.milestoneContainerLast:styles.milestoneContainer, 
                {backgroundColor:animatedvalue.interpolate({inputRange: [0,100], outputRange:selected?
                    ["#35AE92","rgba(10, 10, 10, 1)"]:["rgba(10, 10, 10, 1)","#35AE92"]})},
                {borderColor:animatedvalue.interpolate({inputRange: [0,100], outputRange: selected?
                    ["#00523F","rgba(10, 10, 10, 1)"]:["rgba(10, 10, 10, 1)", "#00523F"]})},
                {borderWidth:animatedvalue.interpolate({inputRange: [0,100], outputRange: selected?[4,0]:[0,4]})},
                {paddingTop:animatedvalue.interpolate({inputRange: [0,100], outputRange: selected?
                    [(windowH*0.0185)-4,(windowH*0.0185)]:[(windowH*0.0185),(windowH*0.0185)-4]})}
                ]}>    
                <View style={[styles.milestoneContentContainer]}>  
                <View style={[styles.milestoneIconContainer]}>
                    <Image
                        style={styles.milestoneIcon}
                        resizeMode="cover"
                        source={(fileExt ==='jpg'||fileExt ==='png')?{uri:img}:Icons[img]}/>
                </View>
                    <View style={[styles.milestoneContext]}>
                        <Text style={[styles.milestoneTitle]}>
                            {title}
                        </Text>
                        <Animated.Text style={[styles.milestoneStreak,
                            {color:animatedvalue.interpolate({inputRange: [0,100], outputRange: selected?
                            ["rgb(248, 210, 57)","rgba(53, 174, 146, 1)"]
                            :["rgba(53, 174, 146, 1)", "rgb(248, 210, 57)"]})}]}>
                            
                            {(!isLoading)&&posts}{' '}posts{' '}
                    
                            <Animated.Text style={[styles.milestoneStreakContext,
                            {color:animatedvalue.interpolate({inputRange: [0,100], outputRange: selected?
                                ["#FFF","rgba(180, 180, 180, 1)"]:["rgba(180, 180, 180, 1)", "#FFF"]})}]}>
                                since{' '}{(route.name ==="EditPost"|| route.name ==='CreatePost')?tagDate:startDate}
                            </Animated.Text>
                        </Animated.Text>
                    </View>
                    {

                    }
                    {(checkDate())&&
                    <View style={{top:1, left:8, alignSelf:"flex-start", marginBottom:'auto'}}>
                        <Icon 
                            name='check-circle'
                            color="rgba(43, 164, 136, 1)"
                            size={(windowH>900)?32:30}
                        />
                    </View>
                    }
                </View>
            </Animated.View>
        </Pressable>
    </View>
    )
}
const styles = StyleSheet.create({  
    milestoneContainer: {
        alignItems:"center",
        paddingTop:windowH*0.0185,
        width:windowW*0.800,
        height: windowH*0.0756,
        backgroundColor: "rgba(10, 10, 10, 1)",
        borderRadius: 8,
        marginBottom:16,
        shadowColor: '#000',
        shadowOffset: {
        width: 0,
        height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        alignSelf:"center"
    },
    milestoneEmptyContainer: {
        alignItems:"center",
        padding:(windowH*0.0185)-2.25,
        width:windowW*0.800,
        height: windowH*0.0756,
        backgroundColor: "rgba(28, 28, 28, 1)",
        borderColor:"rgba(58, 184, 156, 1)",
        borderRadius: 8,
        borderWidth:2.25,
        borderStyle:"dashed",
        marginBottom:16,
        shadowColor: '#000',
        shadowOffset: {
        width: 0,
        height: 2,
        },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        alignSelf:"center"
    },
    highlightContainer: {
        alignItems:"center",
        shadowColor: '#000',
        shadowOffset: {
        width: 0,
        height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        padding:(windowH*0.0185)-4,
        width:(windowW*0.800),
        height: (windowH*0.0756),
        borderRadius: 8,
        marginBottom:16,
        alignSelf:"center"
    },
    highlightContainerLast: {
        alignItems:"center",
        shadowColor: '#000',
        shadowOffset: {
        width: 0,
        height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        padding:(windowH*0.0185)-4,
        width:(windowW*0.800),
        height: (windowH*0.0756),

        borderRadius: 8,
        alignSelf:"center"
    },
    selectedContainer: {
        alignItems:"center",
        paddingTop:(windowH*0.0185)-2,
        shadowColor: '#000',
        shadowOffset: {
        width: 0,
        height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        backgroundColor: "rgba(10, 10, 10, 1)",
        borderColor:"rgba(53, 174, 146, 1)",
        borderStyle:"dashed",
        borderWidth:2,
        width:(windowW*0.800),
        height: (windowH*0.0756),
        borderRadius: 8,
        marginBottom:8,
        alignSelf:"center"
    },
    selectedContainerLast: {
        alignItems:"center",
        paddingTop:(windowH*0.0185)-2,
        shadowColor: '#000',
        shadowOffset: {
        width: 0,
        height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        backgroundColor: "rgba(28, 28, 28, 1)",
        borderColor: "rgba(53, 174, 146, 1)",
        borderWidth:2,
        borderStyle:"dashed",
        width:(windowW*0.800),
        height: (windowH*0.0756),
        borderRadius: 8,
        alignSelf:"center"
    },
    milestoneContainerLast: {
        alignItems:"center",
        paddingTop:windowH*0.0185,
        marginBottom:8,
        width:windowW*0.800,
        height: windowH*0.0756,
        backgroundColor: "rgba(10, 10, 10, 1)",
        borderRadius: 8,
        alignSelf:"center"
    },
    milestoneContentContainer: {
        width:(windowW*0.8)*0.875,
        height:(windowH*0.0756)*0.4285,
        flex:1,
        flexDirection:"row",
        alignItems:"flex-start",
    },
    milestoneIconContainer: {
        width:(windowW*0.082),
        height:(windowH*0.0378),
        backgroundColor: "rgba(214, 214, 214, 1)",
        borderRadius:5,
        justifyContent:"center",
    },
    milestoneIcon: {
        width:"100%",
        height:"100%",
        alignItems:"center",
        borderRadius:5,
        justifyContent:"center",
        alignSelf:"center"
    },
    milestoneContext: {
        left:0,
        width:windowW*0.52,
        paddingTop:3,
  
        justifyContent:"center",
        height:(windowH*0.0756)*0.4285,
    },
    milestoneTitle: {
        fontFamily:"InterBold",
        fontSize:16,
        color:"white",
        left:windowW*0.0385,
    },
    milestoneStreak: {
        fontFamily:"InterBold",
        top:0.5,
        fontSize:11,
        left:windowW*0.0385,
        color:"rgba(53, 174, 146, 1)",
    },
    selectedMilestoneStreak : {
        fontFamily:"InterBold",
        fontSize:11,
        left:windowW*0.0385,
        color:"rgba(240, 210, 60, 1)",
    },
    milestoneStreakContext: {
        fontFamily:"Inter",
        fontSize:11,
        height:12,
        color:"rgba(180, 180, 180, 1)",
    },
    selectedStreakContext: {
        fontFamily:"Inter",
        fontSize:11,
        height:12,
        color:"rgba(255, 255, 255, 1)",
    }

})


export default MilestoneTag