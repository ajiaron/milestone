import  React, {useState, useEffect, useContext, useCallback, useRef} from "react";
import {Animated, Text, ActivityIndicator, StyleSheet, View, Image, Pressable, ScrollView, FlatList, Dimensions, RefreshControl, NativeModules} from "react-native";
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
import SharedGroupPreferences from 'react-native-shared-group-preferences';
import RNFS from 'react-native-fs'
import RNFetchBlob from 'rn-fetch-blob'
import Constants from 'expo-constants';
import ImgToBase64 from 'react-native-image-base64';


const windowW = Dimensions.get('window').width
const windowH = Dimensions.get('window').height
const PAGE_SIZE = 10;
const group = `group.${Constants.manifest.ios.bundleIdentifier}`

const Feed = ({route}) => {
    const push = useContext(pushContext)
    const user = useContext(userContext)
    const navigation = useNavigation()
    const postData = require('../data/PostData.json')
    const [postFeed, setPostFeed]= useState([])
    const [refreshing, setRefreshing] = useState(false)
    const [isViewable, setIsViewable] = useState([0])
    const [loading, setLoading] = useState(true)
    const [notification, setNotification] = useState(false)
    const [currentPage, setCurrentPage] = useState(1)
    const [isFetched, setIsFetched] = useState(false)
    const notificationListener = useRef();
    const responseListener = useRef();
    const isFocused = useIsFocused()
    const scrollRef = useRef()
    const scrollY = useRef(new Animated.Value(0)).current
    const animatedvalue = useRef(new Animated.Value(0)).current
    const [widgetPost, setWidgetPost] = useState()
    const [widgetText, setWidgetText] = useState('')
    const [widgetImage, setWidgetImage] = useState()
    const [timestamp, setTimestamp] = useState('now')
    const [rendered, setRendered] = useState(false)
    const fetchContent = async (imageUrl) => {
        if (imageUrl) {
            try {
                const response = await RNFetchBlob.config({ fileCache: true }).fetch('GET', encodeURI(imageUrl));
                const base64Data = await response.base64();
                return base64Data
              } catch (error) {
                console.log('Error fetching and converting image:', error);
              }
        }
     };
    const handleWidget = async () => {
        const photoPromise = fetchContent(widgetImage)
        const timePromise = handleDate(timestamp)
        var fileExt = (widgetImage !== undefined)?widgetImage.toString().split('.').pop():'jpg'
        const time = await timePromise
        const photo = await photoPromise

        const widgetData = {
            text: `${widgetText} posted ${time === 'now'? time:time + ' ago.'}`
        }
        const widgetPhoto = {
            data:`data:image/${fileExt};base64,${photo}`
        }
        try {
            await SharedGroupPreferences.setItem("widgetKey", widgetData, group)
            await SharedGroupPreferences.setItem("widgetImage", widgetPhoto, group)
            console.log("data sent")
        } catch (error) {
            console.log("didnt work")
        }
    }
    const handleDate = (date) => {
        if (date) {
            const postDate = new Date(date)
            const newDate = new Date()
            if ((Math.abs(newDate-postDate)/1000) < 60) {
                return 'now'
            }
            else if ((Math.abs(newDate-postDate)/60000) <= 60) {
                return Math.round(Math.abs(newDate-postDate)/60000)<=1?
                '1 min':Math.round(Math.abs(newDate-postDate)/60000).toString()+' mins'
            }
            else if ((Math.abs(newDate-postDate)/3600000) <= 24) {
                return Math.round(Math.abs(newDate-postDate)/3600000)<=1?
                '1 hour':Math.round(Math.abs(newDate-postDate)/3600000).toString()+' hours'
            }
            else if ((Math.abs(newDate-postDate)/86400000) <= 7) {
                return Math.round(Math.abs(newDate-postDate)/86400000)<=1?
                'yesterday':Math.round(Math.abs(newDate-postDate)/86400000).toString()+' days'
            }
            else if ((Math.abs(newDate-postDate)/86400000) <= 30) {
                return Math.round(Math.round(Math.abs(newDate-postDate)/86400000)/7)<=1?
                '1 week':Math.round(Math.round(Math.abs(newDate-postDate)/86400000)/7).toString()+' weeks'
            }
            else if ((Math.abs(newDate-postDate)/2592000000) <= 12) {
                return Math.round(Math.abs(newDate-postDate)/2592000000)<=1?
                "1 month":Math.round(Math.abs(newDate-postDate)/2592000000).toString()+' months'
            } else {
                return Math.round(Math.abs(newDate-postDate)/31536000000).toString()+' years'
            }
        } else {
            console.log('hey',date)
        }
    }
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
        itemVisiblePercentThreshold:80 // lower this to make videos render sooner when on screen
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
        if (rendered) {
            handleWidget()
        }
    },[rendered])
    useEffect(()=> {
        axios.get(`http://${user.network}:19001/api/getwidgetpost/${user.userId}`)    // write request to fetch latest post that isn't your own
        .then((response)=> {
            setWidgetImage(response.data[0].src)
            setWidgetText(response.data[0].username)
            setTimestamp(response.data[0].date)
        })
        .then(()=> {
            setRendered(true)
        })
        .catch(error => console.log(error))
    }, [])
    useEffect(()=> {
        if (!isFetched) {
            setLoading(true)
            axios.get(`http://${user.network}:19001/api/paginateposts/${user.userId}/${PAGE_SIZE}/${(currentPage-1)*PAGE_SIZE}`) 
            .then((response)=> {
                setPostFeed([...postFeed, ...response.data.filter((item)=>(item.public === 1)||(item.public=== 0 && item.ownerid === user.userId))])
                setIsFetched(true)
            }).catch(error => console.log(error))
            .then(()=>slideUp())
        }
    }, [route, refreshing, currentPage, isFetched])
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
    const handleLoad = () => {
        if (!loading) {
            setCurrentPage(currentPage => currentPage + 1)
            setIsFetched(false)
        }
    }
    const renderPost = ({ item, index }) => {
      return (
        <>
        {
            (index === 0
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
              isViewable={isViewable.indexOf(postFeed.indexOf(item))>=0}
          />
          {(index === postFeed.length-1) && 
            <View style={{paddingTop:96}}>
            </View>
          }
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
                data={postFeed} 
                renderItem={renderPost} 
                onEndReachedThreshold={0.25}
                onEndReached={handleLoad}
                ListFooterComponent={
                  <Animated.View 
                    style={{ backgroundColor:'rgba(28,28,28,1)',bottom:94,
                    zIndex:999, width:"100%", alignItems:"center", justifyContent:"center",
                    minHeight:windowH*0.035, height:animatedvalue.interpolate({inputRange:[0,100], outputRange:[windowH*0.035, 0]})}}>
                     <ActivityIndicator size="small" color="#FFFFFF"/>
                  </Animated.View>}
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