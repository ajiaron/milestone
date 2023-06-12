import React, { useState, useEffect, useContext, useRef, useCallback } from "react";
import { Animated, Text, StyleSheet, View, Image, FlatList, Pressable, TextInput, Switch, Dimensions, ActivityIndicator, TouchableOpacity } from "react-native";
import * as Device from 'expo-device'
import { Icon } from 'react-native-elements'
import { useNavigation, useRoute } from "@react-navigation/native";
import Navbar from "./Navbar";
import Footer from './Footer'
import MilestoneTag from "./MilestoneTag";
import Icons from '../data/Icons.js'
import userContext from '../contexts/userContext'
import pushContext from "../contexts/pushContext.js";
import axios from 'axios'
import { ScrollView } from "react-native-gesture-handler";

const windowW = Dimensions.get('window').width
const windowH = Dimensions.get('window').height

const MilestoneExplore = () => {
    const user = useContext(userContext)
    const push = useContext(pushContext)
    const navigation = useNavigation()
    const scrollY = useRef(new Animated.Value(0)).current
    const animatedvalue = useRef(new Animated.Value(0)).current
    const [loading, setLoading] = useState(true)
    const [milestones, setMilestones] = useState([])
    const [query, setQuery] = useState()
    const onRefresh = useCallback(() => {
        setRefreshing(true);
        setTimeout(() => {
            setRefreshing(false);
        }, 800);
    }, []);
    const slideUp = () =>{
        Animated.timing(animatedvalue,{
            toValue:100,
            delay:100,
            duration:500,
            useNativeDriver:false,
        }).start(()=>setLoading(false))
    }
    useEffect(()=> {
        axios.get(`http://${user.network}:19001/api/getmilestones`)
        .then((response)=> {
            setMilestones(response.data)})
        .catch((error)=> console.log(error))
        slideUp()
    }, [])
    return (
        <View style={[styles.milestoneExplorePage]}>
            <Navbar title={'milestone'} scrollY={scrollY}/>
            {(loading)&&
                <Animated.View style={{zIndex:999,alignSelf:"center",width:"100%",top:"50%", height:animatedvalue.interpolate({inputRange:[0,100], outputRange:[windowH, 0]})}}>
                    <ActivityIndicator size="large" color="#FFFFFF" style={{top:"50%", position:"absolute", alignSelf:"center"}}/>
                </Animated.View>
            }
            <View style={[styles.milestoneExploreContent]}>
                <Pressable onPress={()=>navigation.navigate("CreateMilestone", {from:'explore'})}>
                    <View style={[styles.milestoneEmptyContainer]}>
                        <View style={{alignItems:"center",alignSelf:"center", justifyContent:"space-evenly"}}>
                            <Icon
                            name = {'add-to-photos'}
                            color="rgba(58, 184, 156, 1)"
                            size={(windowH>900)?27.5:26}
                            />
                            <Text style={{fontFamily:"Inter", color:"rgba(58, 184, 156, 1)", 
                            fontSize:(windowH>900)?12:11, paddingTop:6}}>Add a new milestone...</Text>
                        </View>
                    </View>
                </Pressable>
                <View style={[styles.userInfoContainer]}>
                    <TextInput 
                        style={styles.userInfoInput}
                        onChangeText={(e)=>setQuery(e)}
                        placeholder={'Search a milestone...'}
                        placeholderTextColor={'rgba(221, 221, 221, 1)'}
                        value={query}>
                     
                    </TextInput>
                    <Icon
                        name='search'
                        size={20}
                        color={'rgba(160,160,160,1)'}
                        style={{zIndex:10, paddingTop:0.5}}
                    />
                </View>
            </View>
          
            <View style={{bottom:0, position:"absolute"}}>
                <Footer/>
            </View>
        </View>
    )
}
const styles = StyleSheet.create({
    milestoneExplorePage: {
        backgroundColor: "rgba(28, 28, 28, 1)",
        width:windowW,
        height:windowH,
        overflow:"scroll",
    },
    milestoneExploreContent: {
        height:windowH,
        width:windowW*0.8,
        alignItems:"center",
        paddingTop:(windowH>900)?windowH*0.125:windowH*0.1375,
        alignSelf:"center",
    },
    milestoneEmptyContainer: {
        alignItems:"center",
        padding:(windowH*0.0185)-2.25,
        width:windowW*0.8,
        height: windowH*0.0756,
        backgroundColor: "rgba(28, 28, 28, 1)",
        borderColor:"rgba(58, 184, 156, 1)",
        borderRadius: 8,
        borderWidth:2.25,
        borderStyle:"dashed",
        marginBottom:16,
        shadowColor: '#000',
        shadowOffset: {
        width: 0,
        height: 2,
        },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        alignSelf:"center"
    },
    userInfoContainer: {
        width:(windowW * 0.8) + 4.5,
        alignSelf:"center",
        maxHeight: windowH * (36/windowH),
        justifyContent:"flex-start",
        borderRadius:10,
        backgroundColor:"rgba(10, 10, 10, 1)",
        flex:1,
        alignItems:"center",
        flexDirection:"row"
    },
    userInfoInput: {
        width:'90%',
        minHeight: windowH * (36/windowH),
        paddingTop:1,
        paddingLeft:windowW * (16/windowW),
        paddingRight:windowW * (16/windowW),
        borderRadius:10,
        textAlign:"left",
        alignItems:"center",
        justifyContent:"center",
        fontSize:12,
        color:"white"
    },
})
export default MilestoneExplore