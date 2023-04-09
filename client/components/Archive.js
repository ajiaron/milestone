import  React, {useState, useEffect, useContext, useCallback, useRef} from "react";
import {Animated, Text, ActivityIndicator, StyleSheet, View, Image, Pressable, ScrollView, FlatList, Dimensions, RefreshControl} from "react-native";
import { Icon } from 'react-native-elements'
import { useNavigation } from "@react-navigation/native";
import Footer from './Footer'
import PostItem from './PostItem'
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
        axios.get(`http://ec2-13-52-215-193.us-west-1.compute.amazonaws.com:19001/api/getposts`)  // if this throws an error, replace 10.0.0.160 with localhost
        .then((response)=> {
            setPostFeed(response.data.filter((item)=> item.ownerid === route.params.id))
        }).catch(error => console.log(error))
        .then(()=>slideUp())
    }, [route, refreshing])
    const renderPost = ({ item }) => {
      return (
        /* render 3 of these in a row, then render each row in a grid
        <Pressable onPress={()=>navigation.navigate("Post", {data:item, comments:false})}>
            <View>
                <Image src={item.src} resizeMode="cover"
                style={{width:windowW/3,height:windowW/3}}>
                </Image>
            </View>
        </Pressable>
        */
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
             <ActivityIndicator size="large" color="#FFFFFF" style={{top:"50%", position:"absolute", alignSelf:"center"}}/>
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
                data={[...postFeed].reverse()} 
                renderItem={renderPost} 
                keyExtractor={(item, index)=>index}>
            </FlatList> 
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
    }
})



export default Archive;