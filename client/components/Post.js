import  React, {useState} from "react";
import { Text, StyleSheet, View, Image, Pressable, TextInput, ScrollView, FlatList, Dimensions } from "react-native";
import { Icon } from 'react-native-elements'
import AppLoading from 'expo-app-loading'
import { useNavigation } from "@react-navigation/native";
import GlobalStyles from "../styles/GlobalStyles";
import Footer from './Footer'
import PostItem from "./PostItem";
import MilestoneTag from "./MilestoneTag";

const windowW = Dimensions.get('window').width
const windowH = Dimensions.get('window').height
const Post = ({navigation, route}) => {
    const milestoneData = require('../data/Milestones.json')
    const [hasMilestones, setHasMilestones] = useState(route.params.item.milestones.length > 0)
    const renderMilestone = ({ item }) => {
        return (
            <MilestoneTag 
                title={item.title} 
                streak={item.streak} 
                img={item.img} 
                id={item.id} 
                isLast={item.id == milestoneData.length}
            />
        )
    }
    return (
        <View style={[styles.postPage]}>
            <View style={[styles.feedSpace]}/>
            <View style={[styles.postContainer]}>
                <PostItem username={route.params.item.username} caption={route.params.item.caption} 
                src={route.params.item.src} postId={route.params.item.postId} liked={route.params.item.liked} isLast={false}/>
            </View>
            {hasMilestones?
            <View>
                 <Text style={(windowH>900)?styles.milestoneHeaderLarge:styles.milestoneHeader}>
                     Posted Milestones
                </Text>
                <View style={(windowH>900)?styles.PostTagContainerLarge:styles.PostTagContainer}>
                    <FlatList 
                        snapToAlignment="start"
                        decelerationRate={"fast"}
                        snapToInterval={(windowH*0.0756)+16}
                        showsVerticalScrollIndicator={false}
                        style={[styles.milestoneList]} 
                        data={milestoneData} // replace with route.params.item.milestones
                        renderItem={renderMilestone} 
                        keyExtractor={(item)=>item.id.toString()}>
                    </FlatList>
                </View>
            </View> : null}
            <View style={[styles.footerSpace]}/>
            <View style={[styles.footerPosition]}>
                <Footer/>
            </View>
     
        </View>
    )
}

const styles = StyleSheet.create({
    postPage: {
        backgroundColor:"rgba(28, 28, 28, 1)",
        flex: 1,
        minWidth: "100%",
        minHeight: "100%",
        overflow: "hidden",
    },
    postContainer: {
        justifyContent:"center",
        flex:1,
        alignItems:"center",
        alignSelf:"center"
    },
    feedSpace: {
        marginTop:48, 
    },
    postSpace: {
        top:48
    },
    milestoneList: {
        minWidth:windowW*0.8,

        borderRadius: 8,
    },
    PostTagContainer: {
        minWidth:windowW * 0.8,
        maxHeight:windowH * 0.175,     
        bottom:windowH*(128/812),
        position:"absolute",
        alignSelf:"center"
    },
    PostTagContainerLarge: {
        minWidth:windowW * 0.8,
        maxHeight:windowH * 0.275,     
        bottom:windowH*(122/926),
        position:"absolute",
        alignSelf:"center"
    },
    milestoneHeader: {
        fontFamily:"Inter",
        fontSize: 20,
        color:"white",

        bottom:windowH*(284/812),
        left:windowW*(40/375),
        position:"absolute"
    },
    milestoneHeaderLarge: {
        fontFamily:"Inter",
        fontSize: 20,
        color:"white",
        left:windowW*(40/375),
        bottom:windowH*(392/926),
        position:"absolute"
    },
    footerPosition: {
        position:"absolute",
        bottom:0
    },
    footerSpace: {
        marginTop:10,
        backgroundColor:"rgba(28, 28, 28, 1)"
    },
    
})
export default Post