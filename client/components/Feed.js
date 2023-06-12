import  React, {useState, useEffect, useContext, useCallback, useRef} from "react";
import {Animated, Text, ActivityIndicator, StyleSheet, View, Image, Pressable, ScrollView, FlatList, Dimensions, RefreshControl, Alert} from "react-native";
import { Icon } from 'react-native-elements'
import { useNavigation, useIsFocused } from "@react-navigation/native";
import Footer from './Footer'
import PostItem from './PostItem'
import axios from 'axios'
import MilestoneReel from "./MilestoneReel";
import Navbar from "./Navbar";
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Device from 'expo-device'
import * as Notifications from 'expo-notifications';
import userContext from '../contexts/userContext'
import pushContext from "../contexts/pushContext";

const windowW = Dimensions.get('window').width
const windowH = Dimensions.get('window').height

const Feed = ({route}) => {
    const push = useContext(pushContext)
    const user = useContext(userContext)
    const navigation = useNavigation()
    const postData = require('../data/PostData.json')
    const [postFeed, setPostFeed]= useState(postData)
    const [refreshing, setRefreshing] = useState(false)
    const [isViewable, setIsViewable] = useState([0])
    const [loading, setLoading] = useState(true)
    const [notification, setNotification] = useState(false)
    const notificationListener = useRef();
    const responseListener = useRef();
    const isFocused = useIsFocused()
    const scrollRef = useRef()
    const scrollY = useRef(new Animated.Value(0)).current
    const animatedvalue = useRef(new Animated.Value(0)).current
    const slideUp=() =>{
        Animated.timing(animatedvalue,{
            toValue:100,
            delay:50,
            duration:300,
            useNativeDriver:false,
        }).start(()=>setLoading(false))
    }
    const onRefresh = useCallback(() => {
        if (user.quality) {
            setPostFeed([]) // lazy loading
        }
        setRefreshing(true);
        setTimeout(() => {
        setRefreshing(false);
        }, 800);
    }, [user]);
    const onPressTouch = () => {
        scrollRef.current.scrollToIndex({
            index: 0,
            animated: true,
        });
    }
    const viewabilityConfig = {
        itemVisiblePercentThreshold:70 // lower this to make videos render sooner when on screen
    }
    const onViewableItemsChanged = ({
        viewableItems, changed
      }) => {
        if (viewableItems.length > 0) {
            setIsViewable(viewableItems.map((item)=>item.index))
        }
      };
    const viewabilityConfigCallbackPairs = useRef([{ viewabilityConfig, onViewableItemsChanged }])
    
    useEffect(()=> {
        axios.get(`http://ec2-13-52-215-193.us-west-1.compute.amazonaws.com:19001/api/getposts`) 
        .then((response)=> {
            setPostFeed(response.data.filter((item)=>(item.public === 1)||(item.public=== 0 && item.ownerid === user.userId)))
        }).catch(error => console.log(error))
        .then(()=>slideUp())
    }, [route, refreshing])
    useEffect(()=> {
        axios.get(`http://${user.network}:19001/api/getnotifications`) 
        .then((response)=>{ 
            setNotification(response.data.filter((item)=> item.recipientId === user.userId).length > 0)
        })
        .catch((error) => console.log(error))
    }, [isFocused])

    const message = {
        to: push.expoPushToken,
        sound: 'default',
        title: 'Milestone',
        body: 'Working on something lately?',
        data: { route: "Feed" },
    };

    // handling notifications here
    Notifications.setNotificationHandler({
        handleNotification: async () => ({
            shouldShowAlert: true,
            shouldPlaySound: true,
            shouldSetBadge: true,
        }),
    });
        
    useEffect(()=> {
        push.registerForPushNotificationsAsync("Feed").then(token => push.setExpoPushToken(token))
        notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
            push.setPushNotification(notification);
        });
        responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
            const {
                notification: {
                    request: {
                        content: {
                            data: {route, item, comments, date, count},
                        },
                    },
                },
            } = response;
            if (route) {
                if (item && route === "Post") {
                    navigation.navigate("Post", {item:item, comments:comments})
                } 
                else if (route === "MilestonePage" && date && count) {
                    navigation.navigate("MilestonePage", {milestone:item, date:date, count:count})
                }
                else {
                    navigation.navigate(route)
                }
            }
        });
        return () => {
            Notifications.removeNotificationSubscription(notificationListener.current);
            Notifications.removeNotificationSubscription(responseListener.current);
        };      
    }, [])

    const renderPost = ({ item }) => {
      return (
        <>
        {
            ([...postFeed].reverse().indexOf(item) === 0
             && <MilestoneReel refresh={refreshing} focus={isFocused}/>)
        }
          <PostItem 
              key={item.idposts}
              username={item.username}
              caption={item.caption}
              src={item.profilepic} // take this out later; always defaultpost and we fetch in postitem
              image={item.src}
              postId={item.idposts}
              isLast={item.idposts == 1}
              milestones={[]}
              ownerId={item.ownerid}
              date={item.date}
              isPublic={item.public}
              isViewable={isViewable.indexOf([...postFeed].reverse().indexOf(item))>=0}
          />
          </>
      )
  }
    return (
      <View style={styles.feedPage}>
           {(loading)&&
            <Animated.View style={{zIndex:999,width:"100%", height:animatedvalue.interpolate({inputRange:[0,100], outputRange:[windowH, 0]})}}>
             <ActivityIndicator size="large" color="#FFFFFF" style={{top:"50%", position:"absolute", alignSelf:"center"}}/>
            </Animated.View>
          }
          <Navbar title={"milestone"} scrollY={scrollY} newNotification={notification}/>
          { /*test push notifications
            Device.isDevice &&
            <Pressable onPress={async() => {
                await push.sendPushNotification(push.expoPushToken, message)
            }}
            style={{minWidth:windowW, minHeight:50, backgroundColor:'rgba(43,154,106,1)', alignItems:"center", zIndex:999, top:'12%'}}>
                <Text style={{color:'white', fontFamily:"InterBold", fontSize:16, alignSelf:"center", marginTop:16}}>
                    Test
                </Text>
            </Pressable>*/
          }
          <View style={styles.feedContainer}>
                <Animated.FlatList 
                ref={scrollRef}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
                onScroll={Animated.event(
                    [{nativeEvent: 
                        {contentOffset: {y: scrollY} } 
                    }],
                    {useNativeDriver: true}
                )}
                viewabilityConfigCallbackPairs={viewabilityConfigCallbackPairs.current}
                removeClippedSubviews
                initialNumToRender={3}
                maxToRenderPerBatch={3}
                style={{paddingTop:100}}
                snapToAlignment="start"
                showsVerticalScrollIndicator={false}
                data={[...postFeed].reverse()} 
                renderItem={renderPost} 
                keyExtractor={(item, index)=>index}>
            </Animated.FlatList> 
        </View>
        <Footer onPressTouch={onPressTouch}/>
      </View>
    );
}

const styles = StyleSheet.create({
    feedSpace: {
        marginTop:48, 
    },
    footerSpace: {
        marginTop:10,
        backgroundColor:"rgba(28, 28, 28, 1)"
    },
    feedContainer: {
        justifyContent:"center",
        flex:1,
        alignItems:"center",
        alignSelf:"center"
    },
    feedPage: {
        backgroundColor:"rgba(28, 28, 28, 1)",
        flex: 1,
        minWidth: "100%",
        minHeight: "100%",
        overflow: "hidden",
    },
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
export default Feed