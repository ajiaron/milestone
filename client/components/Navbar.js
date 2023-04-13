import  React, {useState, useEffect, useContext, useCallback, useRef} from "react";
import {Animated, Text, ActivityIndicator, StyleSheet, View, Image, Alert, Pressable, ScrollView, FlatList, Dimensions, RefreshControl} from "react-native";
import { Icon } from 'react-native-elements'
import { useNavigation, useRoute } from "@react-navigation/native";
import Footer from './Footer'
import PostItem from './PostItem'
import axios from 'axios'
import userContext from '../contexts/userContext'

const windowW = Dimensions.get('window').width
const windowH = Dimensions.get('window').height

const Navbar = ({title, scrollY, onClearNotifications}) => {
    const navigation = useNavigation()
    const route = useRoute()
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
            paddingLeft:(title==='notifications')?0:(windowH>900)?135:115, 
            paddingRight:(title==='notifications')?(windowH>900)?125:105:0}}>
                {(title === 'notifications') &&
                    <Animated.View style={{paddingRight:(windowH>900)?103:83}}>
                        <Pressable onPress={()=>navigation.goBack()}>
                            <Icon 
                                style={{paddingTop:3, transform:[{scaleY:0.9}]}}
                                name='arrow-back-ios'
                                color='white'
                                size={22}
                            />
                        </Pressable>
                    </Animated.View> 
                }
                <Text style={{fontFamily:"InterBold", color:"#fff", fontSize:(windowH>900)?21:20, alignSelf:"center"}}>
                    {title}
                </Text>
          
                {(title==='milestone') ?
                <Animated.View style={{position:"relative", paddingLeft:(windowH>900)?108.5:90}}>
                    <Pressable onPress={()=>navigation.navigate("Notifications")}>
                        <View style={styles.settingsNotification}/>
                        <Icon
                            name='notifications'
                            size={(windowH>900)?26.5:25}
                            color='white'
                            style={{color:"#fff",
                            paddingBottom:8}}
                        />
                    </Pressable>
                </Animated.View>:
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
