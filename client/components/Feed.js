import  React, {useState, useEffect, useContext} from "react";
import { Text, StyleSheet, View, Image, Pressable, TextInput, ScrollView, FlatList, Dimensions} from "react-native";
import { Icon } from 'react-native-elements'
import AppLoading from 'expo-app-loading'
import { useNavigation } from "@react-navigation/native";
import GlobalStyles from "../styles/GlobalStyles";
import Footer from './Footer'
import PostItem from './PostItem'
import userContext from '../contexts/userContext'


const windowW = Dimensions.get('window').width
const windowH = Dimensions.get('window').height
const Feed = ({route}) => {
    const user = useContext(userContext)
    const postData = require('../data/PostData.json')
    const [newPost, setNewPost] = useState(null)
    const [milestones, setMilestones] = useState([])
    const [postList, setPostList] = useState([])
    useEffect(()=> {
      if (route.params) {
        setNewPost(route.params.post)
        setMilestones(route.params.milestones)
        setPostList([newPost, ...postData])
      }
      console.log(postList)
    }, [route])
    const renderPost = ({ item }) => {
      return (
          <PostItem 
              username={item.username}
              caption={item.caption}
              src={item.profilePic}
              postId={item.id}
              isLast={item.id == postData.length}
              milestones={[]}
          />
      )
  }
    return (
      <View style={styles.feedPage}>
          <View style={styles.feedContainer}>
               <FlatList 
                style={{paddingTop:48}}
                snapToAlignment="start"
                showsVerticalScrollIndicator={false}
                data={postData} 
                renderItem={renderPost} 
                keyExtractor={(item)=>item.id}>
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