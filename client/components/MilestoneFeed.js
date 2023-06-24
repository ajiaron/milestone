import  React, {useState, useEffect, useContext, useCallback, useRef} from "react";
import {Animated, Text, ActivityIndicator, StyleSheet, View, Image, Pressable, ScrollView, FlatList, Dimensions, RefreshControl} from "react-native";
import { Icon } from 'react-native-elements'
import { useNavigation } from "@react-navigation/native";
import Footer from './Footer'
import Navbar from "./Navbar";
import FastImage from "react-native-fast-image";
import { Video } from 'expo-av'
import PostItem from './PostItem'
import axios from 'axios'
import userContext from '../contexts/userContext'

const windowW = Dimensions.get('window').width
const windowH = Dimensions.get('window').height

const MilestoneFeed = ({route}) => {
    const user = useContext(userContext)
    const navigation = useNavigation()
    const [postFeed, setPostFeed]= useState(route.params?[...route.params.postFeed].reverse().filter((item)=>(item.public === 1)||(item.ownerid === user.userId)):[])
    const routes = navigation.getState()?.routes;
    const prevRoute = routes[routes.length - 2]
    const [refreshing, setRefreshing] = useState(false);
    const [isViewable, setIsViewable] = useState([0])
    const [loading, setLoading] = useState(true)
    const [startDate, setStartDate] = useState()
    const [postCount, setPostCount] = useState(0)
    const [displayList, setDisplayList] = useState(true)
    const [gridCount, setGridCount] = useState(route.params?Math.ceil((route.params.postFeed.length)/3):0)
    const scrollRef = useRef()
    const animatedvalue = useRef(new Animated.Value(0)).current;
    const scrollY = useRef(new Animated.Value(0)).current
    const AnimatedVideo = Animated.createAnimatedComponent(Video);
    const slideUp=() =>{
        Animated.timing(animatedvalue,{
            toValue:100,
            delay:50,
            duration:300,
            useNativeDriver:false,
        }).start(()=>setLoading(false))
    }
    function toggleDisplay() {
        setDisplayList(!displayList)
    }
    function handleTest() {
     //  console.log(route.params)
        console.log(gridCount, postFeed.length)
        console.log(postFeed[5])
    }
    const onRefresh = useCallback(() => {
        if (user.quality) {
            setPostFeed([]) 
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
        itemVisiblePercentThreshold:(user.quality)?90:70 // lower this to make videos render sooner when on screen
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
        axios.get(`http://${user.network}:19001/api/getmilestones`)
        .then((response)=> {
            setStartDate(new Date(response.data.filter((item)=> item.idmilestones === route.params?.id).map((item)=>
            item.date)[0]).toLocaleDateString("en-US", {month:"short", day:"numeric", year:"numeric"}))
        })
        .catch((error)=> console.log(error))
    }, [])
    useEffect(()=> {
        axios.get(`http://${user.network}:19001/api/getlinkedmilestones`)
        .then((response)=> {
            setPostCount(response.data.filter((item)=> item.milestoneid === route.params?.id).length)
        })
    },[])
    useEffect(()=> {
        onRefresh
    }, [displayList])
    useEffect(()=> {
        if ((postFeed.length === 0 || postFeed[0].idmilestones !== route.params?.id) && prevRoute.name !== 'MilestonePage') {
            axios.get(`http://${user.network}:19001/api/getrecentposts/${route.params?.id}`) 
            .then((response)=>{ 
                setPostFeed(response.data)
                slideUp()
            })
            .catch((error) => console.log(error))
        }
        else {
            slideUp()
        }
        
    }, [refreshing])

    const PostImage = ({ item, index }) => {   // for grid view
        const user = useContext(userContext)
        const navigation = useNavigation()
        const data = {
            postId:item.idposts,
            username:item.username,
            src:item.profilepic,
            image:item.src,
            caption:item.caption, 
            ownerId:item.ownerid,
            isPublic:item.public,
            date:item.date
        }
        var fileExt = (item.src !== undefined)?item.src.toString().split('.').pop():'png'
        function navigatePost() {
            navigation.navigate("Post", {item:data, comments:false})
        }
        return (
            <Pressable style={{borderWidth:.25, borderColor:'rgba(28,28,28,1)',
                minWidth:windowW/3, minHeight:windowW/3}} onPress={navigatePost}>
            {
            (fileExt ==='jpg' || fileExt==='png')?
                (!user.isExpo)?
                <FastImage
                    style={[styles.postGridItem]}
                    resizeMode={FastImage.resizeMode.cover}
                    source={{
                            uri: (fileExt==='jpg' || fileExt==='png')&&item.src,
                            priority: FastImage.priority.normal
                    }}/>
                :
                <Image
                    style={styles.postGridItem}
                    resizeMode="cover"
                    source={{uri:(fileExt==='jpg' || fileExt==='png')&&item.src}}/>
                :
                (fileExt === 'mov' || fileExt === 'mp4')?
                    <Video
                        shouldPlay={false}
                        isMuted={true}
                        resizeMode={'cover'}
                        style={{height:"100%", width:"100%"}}
                        source={{uri:item.src}}
                    />
               :null
            }
            </Pressable>
        )
    }
    const renderGrid = ({ item, index }) => {
        return (
            <View style={{width:windowW, height:windowW/3, flex:1, flexDirection:"row", justifyContent:"flex-start"}}>
                {(postFeed[index*3] !== undefined)&&
                <PostImage item={postFeed[index*3]} index={index} />
                }
                {(postFeed[(index*3)+1] !== undefined)&&
                <PostImage item={postFeed[(index*3)+1]} index={index} />
                }
                {(postFeed[(index*3)+2] !== undefined)&&
                <PostImage item={postFeed[(index*3)+2]} index={index} />
                }
            </View>
        )
    }
    const renderPost = ({ item }) => {  // for list view
        return (
            <PostItem 
                key={item.idposts}
                username={item.username}
                caption={item.caption}
                src={item.profilepic} 
                image={item.src}
                postId={item.idposts}
                isLast={item.idposts == 1}
                milestones={[]}
                ownerId={item.ownerid}
                isPublic={item.public}
                date={item.date}
                isViewable={isViewable.indexOf(postFeed.indexOf(item))>=0}
            />
        )
    }
    return (
        <View style={[styles.feedPage]}>
          <Navbar title={route.params.title} id={route.params?.id} date={startDate} count={postCount} scrollY={scrollY}/>
            <View style={[styles.feedContainer,]}>
                {(postFeed.filter((item)=>(item.public === 1)||(item.ownerid === user.userId)).length === 0)?
                <Pressable onPress={handleTest}>
                    <Text style={{fontFamily:"Inter", color:"rgba(180,180,180,1)", fontSize:16,alignItems:"center", alignSelf:"center"}}>
                         Private posts won't be listed here!
                    </Text>
                </Pressable>
                :
                <View>
                    {(loading)&&
                        <Animated.View style={{zIndex:999,width:"100%", height:animatedvalue.interpolate({inputRange:[0,100], outputRange:[windowH, 0]})}}>
                        </Animated.View>
                    }
                    <FlatList 
                        ref={scrollRef}
                        refreshControl={
                            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                        }
                        viewabilityConfigCallbackPairs={viewabilityConfigCallbackPairs.current}
                        removeClippedSubviews
                        initialNumToRender={3}
                        maxToRenderPerBatch={3}
                        snapToAlignment="start"
                        showsVerticalScrollIndicator={false}
                        data={(!displayList)?Array.apply(null, Array(gridCount)).map(function () {}):
                        prevRoute.name === 'MilestonePage'?postFeed:
                        postFeed.filter((item)=>(item.public === 1)||(item.ownerid === user.userId))} 
                        renderItem={(!displayList)?renderGrid:renderPost} 
                        keyExtractor={(item, index)=>index}
                    />
                    {(prevRoute.name === 'MilestonePage')&&
                    <Pressable style={[styles.toggleViewContainer]} onPress={toggleDisplay}>
                        <Icon
                            name={(displayList)?'grid-on':'view-headline'}
                            size={32}
                            color='#1d7560'
                        />
                    </Pressable>
                    }
                </View>
            }
        </View>
        <Footer onPressTouch={onPressTouch}/>
        </View>
    )
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
        marginTop:94,
        alignSelf:"center"
    },
    feedPage: {
        backgroundColor:"rgba(28, 28, 28, 1)",

        flex: 1,
        minWidth: "100%",
        minHeight: "100%",
   
    },
    headerNavTitle: {
        fontFamily:"Inter",
        fontSize:14,
        color:"rgba(160,160,160,1)",
    },
    toggleViewContainer: {
        ///backgroundColor:"#1d7560", 
        backgroundColor:"#efefef",
        width:48, 
        height:48, 
        borderRadius:48,
        position:"absolute", 
        bottom:windowH*0.025,
        right:windowW*0.0425,
        shadowColor: '#000',
        shadowOffset: {
        width: 4,
        height: 4,
        },
        shadowOpacity: 0.4,
        shadowRadius: 4,
        alignItems:"center",
        justifyContent:"center"
    },
    postGridItem: {
        width:"100%",
        height:"100%",
        alignItems:"center",
        justifyContent:"center",
        alignSelf:"center"
    },
})
export default MilestoneFeed