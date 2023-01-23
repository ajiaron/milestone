import  React, {useState, useEffect, useRef} from "react";
import { Text, StyleSheet, View, Animated, Image, Pressable, PixelRatio, TouchableOpacity, Dimensions, Easing } from "react-native";
import Icons from '../data/Icons.js'
import { Icon } from 'react-native-elements'
import AppLoading from 'expo-app-loading'
import { useNavigation, useRoute, NavigationActions } from "@react-navigation/native";
import GlobalStyles from "../styles/GlobalStyles";

const windowW= Dimensions.get('window').width
const windowH = Dimensions.get('window').height
const scale = windowW / 375

function normalize(size) {           /* normalizes font size to screen size */
    const newSize = size * scale
    if (Platform.OS === 'ios') {
        return Math.round(PixelRatio.roundToNearestPixel(newSize))
      } else {
        return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2
      }
}

const MilestoneTag = ({title, streak, img, id, isLast, description, onSelectMilestone, onRemoveMilestone}) => {
    const navigation = useNavigation();
    const [isSelected, setIsSelected] = useState(false)
    const route = useRoute();
    const milestoneData = {
        id:0,
        title:"",
        streak:0,
        img:"",
    }
    function sendMilestone() {
        milestoneData.id = id
        milestoneData.title = title
        milestoneData.streak = streak
        milestoneData.img = img
    }
    function handlePress(){  
        sendMilestone()
        if (route.name === "CreatePost") {
            if (!isSelected) {
                onSelectMilestone(milestoneData)
            }
            else {
                onRemoveMilestone(milestoneData)
            }
        } else if (route.name === "Profile" || route.name === 'MilestoneList' || route.name === 'Post') {
            console.log(milestoneData)
            navigation.reset({
                index: 0,
                routes: [{name: 'MilestonePage'}],
              });
            navigation.navigate("MilestonePage", {milestone:milestoneData})
        }
        
        setIsSelected(!isSelected)
    }
    useEffect(()=> {        /* clear selected milestones if screen changes */
        const deselect = navigation.addListener('focus', ()=> {
            setIsSelected(false)
            if (route.name === "CreatePost") {
                onRemoveMilestone(milestoneData)
            }
        })
        return deselect
    }, [navigation])
    return (
        <Pressable onPress={handlePress} 
        activeOpacity={0.2}
        style={({pressed}) =>
        [(isSelected && route.name=="CreatePost")?
            ((isLast)?styles.selectedContainerLast:styles.selectedContainer):
            (isLast)?styles.milestoneContainerLast:styles.milestoneContainer
        ]}>
            <View style={[styles.milestoneContentContainer]}>  
            <View style={[styles.milestoneIconContainer]}>
                <Image
                        style={styles.milestoneIcon}
                        resizeMode="cover"
                        source={Icons[img]}/>
            </View>
                <View style={[styles.milestoneContext]}>
                    <Text style={[styles.milestoneTitle]}>
                        {title}
                    </Text>
                    <Text style={[(isSelected)?styles.milestoneStreak:styles.milestoneStreak]}>
                        {streak}{' '}days<Text style={[(isSelected)?styles.milestoneStreakContext:styles.milestoneStreakContext]}> in a row</Text>
                    </Text>
                </View>
            </View>
        </Pressable>

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
    selectedContainer: {
        alignItems:"center",
        paddingTop:(windowH*0.0185)-2,
        backgroudColor: "rgba(10, 10, 10, 1)",
        borderColor:"rgba(53, 174, 146, 1)",
        borderStyle:"dashed",
        borderWidth:2,
        width:(windowW*0.800),
        height: (windowH*0.0756),
        borderRadius: 8,
        marginBottom:16,
        alignSelf:"center"
    },
    selectedContainerLast: {
        alignItems:"center",
        paddingTop:(windowH*0.0185)-2,
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
        alignItems:"left",
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
        textAlign:"left",
        width:windowW*0.52,
        paddingTop:4,
  
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