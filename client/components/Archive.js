import  React, {useState, useEffect, useContext, useCallback, useRef} from "react";
import {Animated, Text, ActivityIndicator, StyleSheet, View, Image, Pressable, ScrollView, FlatList, Dimensions, RefreshControl} from "react-native";
import { Icon } from 'react-native-elements'
import { useNavigation } from "@react-navigation/native";
import Footer from './Footer'
import PostItem from './PostItem'
import FastImage from "react-native-fast-image";
import { Video } from 'expo-av'
import axios from 'axios'
import userContext from '../contexts/userContext'

const windowW = Dimensions.get('window').width
const windowH = Dimensions.get('window').height

const Archive = ({route}) => {
    const user = useContext(userContext)
    const navigation = useNavigation()
    const postData = require('../data/PostData.json')
    const [postFeed, setPostFeed]= useState(postData)

    const [refreshing, setRefreshing] = useState(false);
    const [isViewable, setIsViewable] = useState([0])
    const [loading, setLoading] = useState(true)
    const [displayList, setDisplayList] = useState(true)
    const [gridCount, setGridCount] = useState(0)
    const scrollRef = useRef()
    const animatedvalue = useRef(new Animated.Value(0)).current;
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
    const onRefresh = useCallback(() => {
        if (user.quality) {
            setPostFeed([]) // lazy loading
        }
        setRefreshing(true);
        setTimeout(() => {
        setRefreshing(false);
        }, 800);
    }, [user]);
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
        function handlePost() {
            console.log(item.src.toString().substring(0,4))
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
            <>
            {(postFeed[index*3] !== undefined && postFeed[index*3].src.toString().substring(0,4) !== 'file')&&
            <View style={{width:windowW, height:windowW/3, flex:1, flexDirection:"row", justifyContent:"flex-start"}}>
                {(postFeed[index*3] !== undefined && postFeed[index*3].src.toString().substring(0,4) !== 'file')&&
                <PostImage item={postFeed[index*3]} index={index} />
                }
                {(postFeed[(index*3)+1] !== undefined && postFeed[(index*3)+1].src.toString().substring(0,4) !== 'file')&&
                <PostImage item={postFeed[(index*3)+1]} index={index} />
                }
                {(postFeed[(index*3)+2] !== undefined && postFeed[(index*3)+2].src.toString().substring(0,4) !== 'file')&&
                <PostImage item={postFeed[(index*3)+2]} index={index} />
                }
            </View>
            }
            </>
        )
    }
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
        axios.get(`http://ec2-13-52-215-193.us-west-1.compute.amazonaws.com:19001/api/getposts`)
        .then((response)=> {
            setPostFeed(response.data.filter((item)=> (item.ownerid === route.params.id)
             && (item.public === 1 || (item.public === 0 && item.ownerid === user.userId))).reverse())
            setGridCount(Math.ceil((response.data.filter((item)=> (item.ownerid === route.params.id)
            && (item.public === 1 || (item.public === 0 && item.ownerid === user.userId))).length)/3))
        }).catch(error => console.log(error))
        .then(()=>slideUp())
    }, [route, refreshing])
    const renderPost = ({ item }) => {
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
      <View style={styles.feedPage}>
          <View style={{flex:1,flexDirection:"row", maxHeight:76, position:"relative", backgroundColor:"#151515",
            top:0, alignSelf:"center", width:'100%', justifyContent:"space-around", alignItems:"flex-end", 
            paddingBottom:(windowH>900)?10:8}}>
                <View>
                    <Text style={[styles.headerNavTitle, {alignSelf:"center",
                      color:(route.name==="Archive")?"rgba(210,210,210,1)":"rgba(160,160,160,1)",
                      fontFamily:(route.name === "Archive")?"InterBold":"Inter"}]}>Archive</Text>
                </View>
                <Pressable onPress={()=>navigation.navigate("Profile", {id:route.params.id})}>
                    <Text style={[styles.headerNavTitle, {alignSelf:"center",
                    color:(route.name==="Profile")?"rgba(210,210,210,1)":"rgba(160,160,160,1)",
                    fontFamily:(route.name==="Profile")?"InterBold":"Inter"}]}>Profile</Text>
                </Pressable>
            </View>
          <View style={[styles.feedContainer,]}>
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
                data={(!displayList)?Array.apply(null, Array(gridCount)).map(function () {}):postFeed} 
                renderItem={(!displayList)?renderGrid:renderPost} 
                keyExtractor={(item, index)=>index}>
            </FlatList> 
            <Pressable style={[styles.toggleViewContainer]} onPress={toggleDisplay}>
                <Icon
                    name={(displayList)?'grid-on':'view-headline'}
                    size={32}
                    color='#1d7560'
                />
            </Pressable>
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



export default Archive;