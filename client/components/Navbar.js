import  React, {useState, useEffect, useContext, useCallback, useRef} from "react";
import {Animated, Text, ActivityIndicator, StyleSheet, View, Image, Alert, Pressable, ScrollView, FlatList, Dimensions, RefreshControl} from "react-native";
import { Icon } from 'react-native-elements'
import { useNavigation, useRoute } from "@react-navigation/native";
import axios from 'axios'
import userContext from '../contexts/userContext'

const windowW = Dimensions.get('window').width
const windowH = Dimensions.get('window').height

const Navbar = ({title, scrollY, newNotification, onClearNotifications}) => {
    const navigation = useNavigation()
    const user = useContext(userContext)
    const route = useRoute()
    const routes = navigation.getState()?.routes;
    const prevRoute = routes[routes.length - 2]
    const headerHeight = 96;
    const [scrollDirection, setScrollDirection] = useState("start");
    const prevScrollY = useRef(0);
    const animatedoffset = useRef(new Animated.Value(0)).current
    const DeleteAlert = () => {
        return new Promise((resolve, reject) => {
            Alert.alert('Clear notifications?', 'You won\'t be able to restore them after this.', [{
                text:'Cancel',
                onPress: () => resolve(false),
                style: 'cancel'
            },
            {
                text:"Delete",
                onPress: () => resolve(true),
                style:{fontFamily:"Inter", color:"red"}
            }
            ], {cancelable:false})
        })
    }
    function navigateBack() {
        navigation.goBack()
    }
    function clearNotifications() {
        DeleteAlert().then((resolve)=> {
            if (resolve) {
                  onClearNotifications()
            }}
        )
    }
    const slideIn = () =>{
        Animated.timing(animatedoffset,{
            toValue:100,
            delay:0,
            duration:200,
            useNativeDriver:true,
            extrapolate:"clamp"
        }).start()
    }
    const slideOut = ()=> {
        Animated.timing(animatedoffset,{
            toValue:0,
            delay:0,
            duration:200,
            useNativeDriver:true,
            extrapolate:"clamp"
        }).start()
    }
    useEffect(()=> {
        if (scrollDirection === 'down') {
            slideOut()
        }
        else {
            if (scrollDirection === 'up' || scrollDirection ==='start') {
                slideIn()
            }
        }
    }, [scrollDirection])
    useEffect(()=> {
        const listener = scrollY.addListener((value) => {
            setScrollDirection((value.value - prevScrollY.current === 0)?'none':
            ((value.value <= prevScrollY.current) || (value.value <= 0))
            ? 'up' : 'down')
            prevScrollY.current = value.value;
          });
          return () => {
            scrollY.removeListener(listener);
          };
    }, [scrollY])

    return (
        <Animated.View 
        style={{width:windowW, height:94, transform:[{translateY: animatedoffset.interpolate(({inputRange:[0,100], outputRange:[-94,0]}))}],
        backgroundColor:"#141414", flexDirection:"row", alignItems:"center", justifyContent:"center", 
        paddingTop:(windowH>900)?36:38,
        zIndex:999, position:"absolute", top:0}}>
            <Animated.View style={{flexDirection:"row", width:"100%", alignItems:"center",justifyContent:"center",
            paddingLeft:(route.name==='Notifications')?0:
            (route.name !== "Feed" && route.name !== "Notifications")?13.5:
            (windowH>900)?135:115, 
            paddingRight:(route.name==='Notifications')?(windowH>900)?125:105:0}}>
                {(route.name !== 'Feed') &&
                    <Animated.View style={
                        {paddingRight:(windowH>900)?103:83}}>
                        <Pressable onPress={navigateBack}>
                            <Icon 
                                style={
                                    {paddingTop:(route.name === "Post")?4:3, transform:[{scaleY:0.9},]}}
                                name='arrow-back-ios'
                                color='white'
                                size={22}
                            />
                        </Pressable>
                    </Animated.View> 
                }
                <Pressable onPress={()=>console.log(routes)}>
                    <Text style={{fontFamily:"InterBold", color:"#fff", 
                    fontSize:(windowH>900)?21:20, alignSelf:"center",
                    paddingRight:(route.name !== "Feed" && route.name !== "Notifications")?(windowH>900)?152:132:0,
                    paddingLeft:(route.name !== "Feed" && route.name !== "Notifications")?13.5:0
                    }}>
                        {title}
                    </Text>
                </Pressable>
                {(route.name==='Feed') ?
                <Animated.View style={{position:"relative", paddingLeft:(windowH>900)?108.5:90}}>
                    <Pressable onPress={()=>navigation.navigate("Notifications")}>
                        {(newNotification)?
                        <View style={styles.settingsNotification}/>:null
                        }
                        <Icon
                            name='notifications'
                            size={(windowH>900)?26.5:25}
                            color='white'
                            style={{color:"#fff",
                            paddingBottom:(newNotification)?8:0,
                            paddingTop:(newNotification)?0:1
                        }}
                        />
                    </Pressable>
                </Animated.View>:
                (route.name === 'Notifications') &&
                <Animated.View style={{position:"absolute", right:16}}>
                    <Pressable onPress={clearNotifications}>
                        <Icon
                            name='delete'
                            size={27}
                            color='white'
                            style={{paddingTop:1}}
                        />
                    </Pressable>
                </Animated.View>
                }
            </Animated.View>
        </Animated.View>
    )
}
const styles=StyleSheet.create({
    settingsNotification: {
        backgroundColor:"rgba(238, 64, 64, 1)",
        width:8.5,
        height:8.5,
        borderRadius:4,
        right:-16,
        top:9,
        zIndex:999
    },
})
export default Navbar
