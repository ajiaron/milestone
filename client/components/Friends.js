import  React, {useState, useEffect, useContext} from "react";
import { Text, StyleSheet, View, Image, FlatList, Pressable, TextInput, ScrollView, Dimensions } from "react-native";
import { Icon } from 'react-native-elements'
import { useNavigation } from "@react-navigation/native";
import Footer from './Footer'
import MilestoneTag from "./MilestoneTag";
import GroupTag from "./GroupTag";
import FriendTag from "./FriendTag";
import userContext from '../contexts/userContext'
import axios from 'axios'

const windowW = Dimensions.get('window').width      // get screen width
const windowH = Dimensions.get('window').height     // get screen height

/*
frontend:
    - fetch list of users and display
    - search friends
    - display list of added friends
        - link to their profile
    - display list on unadded friends
        - display button to add friend
backend:
    - friends & requests (table)
        - add request
database:
*/

function Friends(){
    const [users, setUsers] = useState([])
    const user = useContext(userContext)
    const [milestoneList, setMilestoneList] = useState([]) // initializes array

    useEffect(()=> {
        axios.get(`http://${user.network}:19001/api/getmilestones`) 
        .then((response)=> {
            setMilestoneList(response.data)})
        .catch((error)=> console.log(error))
    },[])
    const renderMilestone = ({ item }) => {
        return (
            <MilestoneTag 
                title={item.title} 
                streak={item.streak} 
                img={milestoneList.length>0?item.src:item.img} 
                id={milestoneList.length>0?item.idmilestones:item.id} 
                isLast={false}
            />
        )
    }
    return (
        <View style={styles.friendsPage}>
                <View style={styles.friendsWrapper}>
                <Text style={[styles.friendsHeader, {top:(windowH > 900)?windowH *  0.005:windowH*0.135}]}>Your Friends</Text>
                    <View style={styles.friendsHeaderContainer}>
                    </View>
                    <FlatList 
                        //snapToAlignment="start"
                        //decelerationRate={"fast"}
                        //snapToInterval={(windowH*0.0755)+16}
                        //showsVerticalScrollIndicator={false}
                        style={[styles.milestoneList]} 
                        data={milestoneList} 
                        renderItem={renderMilestone} 
                        //keyExtractor={(item)=>(milestoneList.length>0)?item.idmilestones.toString():item.id.toString()}
                        >
                    </FlatList> 
                    <View style={[styles.groupTagList]}>
                        <FriendTag username={"Gym Grind"} img={require("../assets/dumbbell.png")}/>
                        <FriendTag username={"Diversity Hires"} img={require("../assets/money.png")}/>
                        <FriendTag username={"Guitar Gang"} img={require("../assets/guitar.png")}/>
                    </View>
                </View>

            <View style={{bottom:0, position:"absolute"}}>
                <Footer/>
            </View>
        </View>
    )
}

//this will be 'css' portion
//no css, everything is an object
const styles = StyleSheet.create({
 friendsPage: {
    backgroundColor:"rgba(28,28,28,1)",
    minWidth: windowW,
    flex:1,
    minHeight: windowH,
    overflow: "scroll",
},
friendsWrapper: {
    alignSelf:"center",
    maxHeight:windowH * 0.665,
    maxWidth:windowW*0.8,
    top:windowH*0.12,
},
friendsWrapperLarge: {
    minWidth:windowW * 0.8,
    maxHeight:windowH * 0.737,
    alignSelf:"center",
    top: windowH * 0.16
},
friendsList: {
    minWidth:windowW*0.8,
    alignSelf:"center",
    borderRadius: 8,
},
friendsHeader: {
    fontFamily:"Inter",
    fontSize: 20,
    color:"white",
},
friendsHeaderContainer: {
    alignSelf:"center",
    minWidth:windowW*0.8,
    flexDirection:"row",
    left:4,
    maxHeight:22,
},
milestoneList:{
    top: windowH * .025,
},
groupTagList: {
    top:22,
    position:"relative"
},

})

export default Friends