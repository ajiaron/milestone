import  React, {useState, useEffect, useContext, useCallback, useRef} from "react";
import {Animated, Text, ActivityIndicator, StyleSheet, View, Image, Pressable, ScrollView, FlatList, Dimensions, RefreshControl} from "react-native";
import { Icon } from 'react-native-elements'
import { useNavigation } from "@react-navigation/native";
import Footer from './Footer'
import Navbar from "./Navbar";
import PostItem from './PostItem'
import axios from 'axios'
import userContext from '../contexts/userContext'

const windowW = Dimensions.get('window').width
const windowH = Dimensions.get('window').height

const MilestoneFeed = ({route}) => {
    const user = useContext(userContext)
    const navigation = useNavigation()
    const [postFeed, setPostFeed]= useState(route.params?route.params.postFeed:[])
    const [refreshing, setRefreshing] = useState(false);
    const [isViewable, setIsViewable] = useState([0])
    const [loading, setLoading] = useState(true)
    const scrollRef = useRef()
    const animatedvalue = useRef(new Animated.Value(0)).current;
    const scrollY = useRef(new Animated.Value(0)).current
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
        if (postFeed.length === 0 || postFeed[0].idmilestones !== route.params?.id) {
            axios.get(`http://${user.network}:19001/api/getrecentposts/${route.params?.id}`) 
            .then((response)=>{ 
                setPostFeed(response.data)
            })
            .catch((error) => console.log(error))
        }
    }, [refreshing])
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
                isPublic={item.public}
                date={item.date}
                isViewable={isViewable.indexOf([...postFeed].reverse().indexOf(item))>=0}
            />
        )
    }
    return (
        <View style={[styles.feedPage]}>
          <Navbar title={route.params.title} scrollY={scrollY}/>
            <View style={[styles.feedContainer,]}>
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
                data={postFeed.filter((item)=>(item.public === 1)||(item.ownerid === user.userId))} 
                renderItem={renderPost} 
                keyExtractor={(item, index)=>index}>
            </FlatList> 
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
        marginTop:98,
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
export default MilestoneFeed