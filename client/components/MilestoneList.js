import  React, {useState, useEffect, useContext} from "react";
import { Text, StyleSheet, View, Image, FlatList, Pressable, TextInput, ScrollView, Dimensions } from "react-native";
import { Icon } from 'react-native-elements'
import { useNavigation } from "@react-navigation/native";
import Footer from './Footer'
import MilestoneTag from "./MilestoneTag";
import GroupTag from "./GroupTag";
import userContext from '../contexts/userContext'
import axios from 'axios'

const windowW = Dimensions.get('window').width
const windowH = Dimensions.get('window').height

const MilestoneList = () => {
    const milestoneData = require('../data/Milestones.json')
    const user = useContext(userContext)
    const [milestoneList, setMilestoneList] = useState([])
    {/* 
         useEffect(()=> {
            milestoneData.map((item)=> {
            axios.post('http://10.0.0.160:19001/api/postmilestones', 
            {title:item.title, src:item.img, streak:item.streak, description:'New start, new milestone!', ownerid:user.userId})
            .then(() => {console.log('personal milestone posted')})
            })
            .catch((error)=> {console.log(error)})
        })
    */}
    useEffect(()=> {
        axios.get(`http://${user.network}:19001/api/getmilestones`)
        .then((response)=> {
            setMilestoneList(response.data)})
        .catch((error)=> console.log(error))
    })
   
    const renderMilestone = ({ item }) => {
        return (
            <MilestoneTag 
                title={item.title} 
                streak={item.streak} 
                img={milestoneList.length>0?item.src:item.img} 
                id={milestoneList.length>0?item.idmilestones:item.id} 
                isLast={item.id == milestoneData.length}
            />
        )
    }
    return (
        <View style={styles.milestoneListPage}>
              <View style={[styles.milestoneHeaderContainer, {top:(windowH > 900)?windowH * 0.095:windowH*0.135}]}>
                    <Text style={[styles.milestoneHeader]}>
                        Your Milestones
                    </Text>
                    <Pressable onPress={()=> {navigation.navigate("MilestoneList")}}>
                        <Icon 
                        name='navigate-next' 
                        size={30} 
                        color="rgba(53, 174, 146, 1)" 
                        style={{bottom:2, left:0}}/>
                    </Pressable>
                    
                </View>
             <View style={(windowH > 900)?styles.postTagContainerLarge:styles.postTagContainer}>
                    <FlatList 
                        snapToAlignment="start"
                        decelerationRate={"fast"}
                        snapToInterval={(windowH*0.0755)+16}
                        showsVerticalScrollIndicator={false}
                        style={[styles.milestoneList]} 
                        data={milestoneList.length>0?milestoneList:milestoneData} 
                        renderItem={renderMilestone} 
                        keyExtractor={(item)=>(milestoneList.length>0)?item.idmilestones.toString():item.id.toString()}>
                    </FlatList> 
                </View>   
                <View style={{position:"absolute", bottom:0}}>
                    <Footer/>
                </View>
        </View>
    )
}
const styles = StyleSheet.create({
    milestoneListPage: {
        backgroundColor:"rgba(28, 28, 28, 1)",
        flex: 1,
        minWidth: "100%",
        minHeight: "100%",
        overflow: "hidden",
    },
    postTagContainerLarge: {
        minWidth:windowW * 0.8,
        maxHeight:windowH * 0.737,
        alignSelf:"center",
        top: windowH * 0.12
    },
    postTagContainer: {
        minWidth:windowW * 0.8,
        maxHeight:windowH * 0.665,
        alignSelf:"center",
        top: windowH * 0.16
    },
    milestoneList: {
        minWidth:windowW*0.8,
        alignSelf:"center",
        borderRadius: 8,
    },
    milestoneHeaderContainer: {
        alignSelf:"center",
        minWidth:windowW*0.8,
        flexDirection:"row",
        left:4,
        maxHeight:22,
    },
    milestoneHeader: {
        fontFamily:"Inter",
        fontSize: 20,
        color:"white",
    }
   

})
export default MilestoneList