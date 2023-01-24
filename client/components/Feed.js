import  React, {useState, useEffect, useContext, useCallback, useRef} from "react";
import { Text, StyleSheet, View, Image, Pressable, ScrollView, FlatList, Dimensions, RefreshControl} from "react-native";
import { Icon } from 'react-native-elements'
import { useNavigation } from "@react-navigation/native";
import Footer from './Footer'
import PostItem from './PostItem'
import axios from 'axios'
import userContext from '../contexts/userContext'

const windowW = Dimensions.get('window').width
const windowH = Dimensions.get('window').height

const Feed = ({route}) => {
    const user = useContext(userContext)
    const postData = require('../data/PostData.json')
    const [postFeed, setPostFeed]= useState(postData)
    const [refreshing, setRefreshing] = React.useState(false);
    const [isViewable, setIsViewable] = useState([0])
    const month = new Date().toLocaleString("en-US", { month: "short" })
    const day = new Date().getDate()
    const currentDate = month + ' ' + day

    const onRefresh = useCallback(() => {
        console.log(user)
        setRefreshing(true);
        setTimeout(() => {
        setRefreshing(false);
        }, 800);
    }, []);

    const viewabilityConfig = {
        itemVisiblePercentThreshold:1
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
        axios.get('http://10.0.0.160:19001/api/getposts')  // if this throws an error, replace 10.0.0.160 with localhost
        .then((response)=> {
            setPostFeed(response.data)
        }).catch(error => console.log(error))
    }, [route])

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
      
              date={new Date(item.date).toLocaleString("en-US", {month:"short"})+' '+new Date().toLocaleString("en-US", { day : '2-digit'})}
              isViewable={isViewable.indexOf([...postFeed].reverse().indexOf(item))>=0}
          />
      )
  }
    return (
      <View style={styles.feedPage}>
          <View style={styles.feedContainer}>
               <FlatList 
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            
                viewabilityConfigCallbackPairs={viewabilityConfigCallbackPairs.current}
                removeClippedSubviews
                initialNumToRender={5}
                maxToRenderPerBatch={5}
                style={{paddingTop:48}}
                snapToAlignment="start"
                showsVerticalScrollIndicator={false}
                data={[...postFeed].reverse()} 
                renderItem={renderPost} 
                keyExtractor={(item, index)=>index}>
            </FlatList> 
            </View>
        <Footer/>
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
})
export default Feed