import  React, {useState, useEffect, useContext} from "react";
import { Text, StyleSheet, View, Image, FlatList, Pressable, TextInput, ScrollView, Dimensions } from "react-native";
import { Icon } from 'react-native-elements'
import AppLoading from 'expo-app-loading'
import { useNavigation } from "@react-navigation/native";
import Footer from './Footer'
import MilestoneTag from "./MilestoneTag";
import GroupTag from "./GroupTag";
import userContext from '../contexts/userContext'

const windowW= Dimensions.get('window').width
const windowH = Dimensions.get('window').height

const ProfileInfo = ({name, milestones, groups, friends}) => {
    return (
        <View style={[styles.profileInfoContainer]}>
            <View style={[styles.profileNameWrapper]}>
               <Text style={[styles.profileInfoName]}>{name}</Text>
            </View>
            <View style={[styles.profileInsights]}>
                <View style={[styles.milestoneInsightsHeader]}>

                    <View style={[styles.milestoneInsightWrapper]}>
                        <Text style={[styles.milestoneInsightText]}>MILESTONES</Text>
                        <Text style={[styles.milestoneInsightItem]}>{milestones}</Text>
                    </View>

                    <View style={[styles.milestoneInsightWrapper]}>
                        <Text style={[styles.milestoneInsightText]}>GROUPS</Text>
                        <Text style={[styles.milestoneInsightItem]}>{groups}</Text>
                    </View>

                    <View style={[styles.milestoneInsightWrapper]}>
                        <Text style={[styles.milestoneInsightText]}>FRIENDS</Text>
                        <Text style={[styles.milestoneInsightItem]}>{friends}</Text>
                    </View>

                </View>
            </View>
        </View>
    )
}

const Profile = () => {
    const [loading, setLoading] = useState(true)
    const [milestones, setMilestones] = useState([])
    const milestoneData = require('../data/Milestones.json')
    const user = useContext(userContext)

    const renderMilestone = ({ item }) => {
        return (
            (item.id == 1) ?
            <MilestoneTag title={item.title} streak={item.streak} img={item.img}/>: null
        )
    }
    function handlePress() {
        console.log(user.username)
    }

    return (
        <View style={[styles.profilePage]}>
            <View style={[styles.userInfoContainer]}>
                <View styles={styles.profileIcon}>
                    <Image
                    style={styles.profilePic}
                    resizeMode="contain"
                    source={require("../assets/profile-pic-empty.png")}/>
                </View>
                <View style={styles.userDetails}>
                    <Text style={styles.usernameText}>@{user.username?user.username:"ajiaron"}</Text>
                    <Text style={styles.userFullName}>Aaron Jiang</Text>
                    <Text style={styles.userBlurb}>I'm about writing apps and running laps</Text>
                </View>
                <View style={styles.settingsIcon}>
                    <Pressable onPress={handlePress}>
                    <View style={styles.settingsNotification}/>
                    <Icon 
                        name='settings'
                        type='material'
                        color='white'
                        size={26}
                    />
                    </Pressable>
                </View>
            </View>
            <ProfileInfo name="Aaron Jiang" milestones={4} groups={3} friends={13} />
            {/* replace with flatlist */}
            <View style={[styles.profileTagContainer]}>
                <View style={[styles.milestoneHeaderContainer]}>
                    <Text style={[styles.milestoneHeader]}>
                        Personal Milestones
                    </Text>
                </View>
                {
            /*  <View style={[styles.milestoneTagList]}>
                  <MilestoneTag title={"Learning Piano"} streak={16} img={require("../assets/music-notes.png")}/>
                </View> 
                {/* */}
                <FlatList 
                    style={[styles.milestoneList]} 
                    data={milestoneData} 
                    renderItem={renderMilestone} 
                    keyExtractor={(item)=>item.id.toString()}>
                </FlatList>  
                <View style={[styles.groupHeaderContainer]}>
                    <Text style={[styles.groupHeader]}>
                        Groups
                    </Text>
                </View>
                <View style={[styles.groupTagList]}>
                    <GroupTag title={"Gym Grind"} users={['hzenry', 'antruong']} img={require("../assets/dumbbell.png")}/>
                    <GroupTag title={"Diversity Hires"} users={['tnompson', 'timwang']} img={require("../assets/money.png")}/>
                    <GroupTag title={"Guitar Gang"} users={['jdason', 'hzenry']} img={require("../assets/guitar.png")}/>
                </View>
            </View>
            <Footer/>
        </View>
    )
}
const styles = StyleSheet.create({
    profilePage: {
        backgroundColor: "rgba(28, 28, 28, 1)",
        minWidth:windowW,
        minHeight:windowH,
        overflow:"scroll",
    },
    profileInfoContainer: {
        width:windowW*0.8,
        height: windowH*0.185,
        borderRadius:15,
        top:windowH*0.2125,
        position:"absolute",

        alignSelf:"center",
        backgroundColor:"rgba(10, 10, 10, 1)"
    },
    profileNameWrapper: {
     
        alignItems:"left",
        textAlign:"left",
        borderRadius:15,
        backgroundColor:"rgba(10, 10, 10, 1);",
        width:windowW*0.8,
        paddingBottom:windowH*0.0238,
        paddingTop:windowH*0.0238,
    },
    profileInfoName: {
        fontSize:20,
        fontFamily:"InterBold",
        color:"white",
        left:"10%"
    },
    profileInsights: {
        width:windowW*0.6785,

        justifyContent:"space-around",
        height:windowH*0.076,
        borderRadius:10,
        alignSelf:"center",
        backgroundColor: "rgba(28, 28, 28, 1)",
        zIndex:1
    },
    milestoneHeaderContainer: {
        alignSelf:"center",
        minWidth:windowW*0.8,
   
        flexDirection:"row",
        position:"relative",
        maxHeight:22,
    },
    groupHeaderContainer: {
        alignSelf:"center",
        minWidth:windowW*0.8,
     
        flexDirection:"row",
        position:"relative",
        maxHeight:22,
        marginTop:16
     
    },
    milestoneInsightsHeader: {
        flex:1,
        flexDirection:"row",
        alignItems:"center",
    },
    milestoneInsightWrapper: {
        flex: 1,
        flexDirection: "column",
        alignItems:"center",
  
        justifyContent:"center"
    },
    milestoneInsightText: {
        fontSize: 9,
        fontFamily: "Inter",
        color:"rgba(195, 191, 191, 1)",
        marginBottom:8,
    },
    milestoneInsightItem: {
        fontFamily:"InterBold",
        fontSize: 18,
        color:"white"
    },
    milestoneHeader: {
        fontFamily:"Inter",
        fontSize: 20,
        color:"white",
        left:3,
        alignSelf:"center",
        top:-2
    },
    groupHeader: {
        fontFamily:"Inter",
        fontSize: 20,
        color:"white",
        left:3,
        alignSelf:"center",
    },
    milestoneHeaderIcon: {
        left:10,
        top:1
    },
    groupHeaderIcon: {
        left:10,
        top:1
    },
    milestoneTagList: {
        top:16,
        width:windowW*0.8,
        alignSelf:"center",

        borderRadius: 8,
    },
    milestoneList: {
        top:16,
        width:windowW*0.8,
        alignSelf:"center",
        maxHeight:92,
        borderRadius: 8,
    },
    groupTagList: {
        top:16,
        position:"relative"
    },
    profileTagContainer: {
        flex: 1,
        width: 336,
        alignSelf:"center",
        position:"relative",
        bottom:30

    },
    userInfoContainer: {
        top:"22%",
        left:2,
        alignSelf:"center",
        maxWidth:windowW*0.8275,
        flex:1,
        flexDirection:"row",
  
    },
    userDetails: {
        flex:1,
        textAlign:"left",
        alignItems:"left",
        left:14,   
        top:1
    },
    usernameText: {
        fontFamily:"InterBold",
        fontSize:18,
        color:"white",
    },
    userFullName: {
        fontFamily:"Inter",
        fontSize:11,
        color:"rgba(170, 170, 170, 1)",
        marginTop:4,
    },
    userBlurb: {
        fontFamily:"Inter",
        fontSize:11,
        color:"white",
        marginTop:4,
    },
    settingsIcon: {    
        right:10,
        top:-8
    },
    settingsNotification: {
        backgroundColor:"rgba(238, 64, 64, 1)",
        width:8.5,
        height:8.5,
        borderRadius:4,
        right:-16,
        top:9,
        zIndex:1
    },
    
})
export default Profile