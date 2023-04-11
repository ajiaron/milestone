import  React, {useState, useEffect, useContext, useCallback, useRef} from "react";
import {Animated, Text, ActivityIndicator, StyleSheet, View, Image, Pressable, ScrollView, FlatList, Dimensions, RefreshControl, Alert} from "react-native";
import { Icon } from 'react-native-elements'
import { useNavigation } from "@react-navigation/native";
import Footer from './Footer'
import PostItem from './PostItem'
import axios from 'axios'
import userContext from '../contexts/userContext'

const windowW = Dimensions.get('window').width
const windowH = Dimensions.get('window').height

const Navbar = ({scrollY}) => {
    const headerHeight = 96;
    const [scrollDirection, setScrollDirection] = useState("start");
    const prevScrollY = useRef(0);
    const animatedoffset = useRef(new Animated.Value(0)).current
   // console.log(scrollY)

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
            paddingLeft:(windowH>900)?135:115}}>
                <Text style={{fontFamily:"InterBold", color:"#fff", fontSize:(windowH>900)?21:20, alignSelf:"center"}}>
                    milestone
                </Text>
                <Animated.View style={{position:"relative", paddingLeft:(windowH>900)?108.5:90}}>
                    <Pressable onPress={()=>Alert.alert("Check again later!", "coming soon i swear")}>
                        <View style={styles.settingsNotification}/>
                        <Icon
                            name='notifications'
                            size={(windowH>900)?26.5:25}
                            color='white'
                            style={{color:"#fff",
                            paddingBottom:8}}
                        />
                    </Pressable>
                </Animated.View>
            </Animated.View>
        </Animated.View>
    )
}
const Feed = ({route}) => {
    const user = useContext(userContext)
    const postData = require('../data/PostData.json')
    const [postFeed, setPostFeed]= useState(postData)
    const [refreshing, setRefreshing] = useState(false)
    const [isViewable, setIsViewable] = useState([0])
    const [loading, setLoading] = useState(true)
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
        axios.get(`http://ec2-13-52-215-193.us-west-1.compute.amazonaws.com:19001/api/getposts`)  // if this throws an error, replace 10.0.0.160 with localhost
        .then((response)=> {
            setPostFeed(response.data)
        }).catch(error => console.log(error))
        .then(()=>slideUp())
        console.log()
    }, [route, refreshing])
    const renderPost = ({ item }) => {
      return (
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
              isViewable={isViewable.indexOf([...postFeed].reverse().indexOf(item))>=0}
          />
      )
  }
    return (
      <View style={styles.feedPage}>
         
           {(loading)&&
            <Animated.View style={{zIndex:999,width:"100%", height:animatedvalue.interpolate({inputRange:[0,100], outputRange:[windowH, 0]})}}>
             <ActivityIndicator size="large" color="#FFFFFF" style={{top:"50%", position:"absolute", alignSelf:"center"}}/>
            </Animated.View>
          }
          <Navbar scrollY={scrollY}/>
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
                style={{paddingTop:98}}
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