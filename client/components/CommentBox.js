import  React, {useState, useEffect, useContext, useRef, useCallback} from "react";
import { Text, StyleSheet, View, Image, Pressable, TextInput, ScrollView, FlatList, Dimensions, Animated, RefreshControl, ActivityIndicator } from "react-native";
import { Icon } from 'react-native-elements'
import { useNavigation, useRoute } from "@react-navigation/native";
import axios from 'axios'
import FastImage from "react-native-fast-image";
import userContext from '../contexts/userContext'
import RequestButton from "./RequestButton.js";

const windowW = Dimensions.get('window').width
const windowH = Dimensions.get('window').height

const CommentBox = ({postId, userId, startToggle, mediaType, likesList, commentList, onSubmitComment, onToggle, loading}) => {
    const [toggled, setToggled] = useState(false)
    const navigation = useNavigation()
    const user = useContext(userContext)
    const [comment, setComment] = useState('')
    const animatedvalue = useRef(new Animated.Value(0)).current
    const [scrollable, setScrollable] = useState(true)
    const scrollRef = useRef(null)
   
    const slideup = () => {
        setToggled(true)
        Animated.timing(animatedvalue,{
            toValue:(mediaType === 'mov')?windowH*.83:(windowH > 900)?windowH*.84:windowH*.7,
            duration:300,
            useNativeDriver:false,
        }).start()
    }
    const slidedown = () => {
        Animated.timing(animatedvalue,{
            toValue:0,
            duration:300,
            useNativeDriver:false,
        }).start(() => setToggled(false))
    }
    function handleToggle() { 
        if (!toggled) {
            slideup()
        } 
        else {
            slidedown()
        }
    }
    function handleSubmit(comment) {
        if (comment.length > 0) {
            onSubmitComment(comment)
            setComment('')
        } else if (!toggled) {
            onToggle()
        }
        slidedown()
    }
    const handleScroll = (event) => {
        const currentY = event.nativeEvent.contentOffset.y
        if (currentY < -5) {
            slidedown()
        }
    }
    useEffect(()=> {
        if (startToggle) {
            slideup()
        }
    }, [])

    
    const renderLikes = ({item}) => {
        return (
            <View style={{paddingTop:(commentList.indexOf(item) === 0)?0:8, 
                paddingBottom:(commentList.indexOf(item) === commentList.length - 1)?22:10}}>
                    <View style={{flexDirection:"row", backgroundColor:"rgba(21,21,21,1)",justifyContent:"space-between"}}>
                        <View style={{flexDirection:"row", alignItems:"center"}}>
                            <Pressable style={{flexDirection:"row", alignItems:"center"}} onPress={()=>{navigation.navigate("Profile", {id:item.userid})}}>
                                {
                                (!user.isExpo)?
                                <FastImage
                                    style={{borderRadius:23,height:23, width:23, marginRight:9}}
                                    resizeMode={FastImage.resizeMode.contain}
                                    source={{
                                        uri:item.img,
                                        priority:FastImage.priority.normal
                                    }}
                                />
                                :
                                <Image
                                    style={{borderRadius:23,height:23, width:23, marginRight:9}}
                                    resizeMode="contain"
                                    source={{uri:item.img}}
                                />
                                }
                                <Text style={{fontFamily:"InterBold", fontSize:13, color:"white", paddingBottom:3.5}}>{item.name}{'  '}</Text>
                            </Pressable>    
                        </View>
                        {(item.userid !== userId)?
                            <RequestButton id={item.userid}/>:null
                        }
                    </View>
                </View>
        )
    }
    const renderComments = ({item}) => {
        return (
            <View style={{paddingTop:(commentList.indexOf(item) === 0)?6:8, 
            paddingBottom:(commentList.indexOf(item) === commentList.length - 1)?22:8}}>
                <View style={{flexDirection:"row", backgroundColor:"rgba(21,21,21,1)"}}>
                    <View style={{flexDirection:"row", alignItems:"center", maxWidth:windowW-120}}>
                        <Pressable style={{flexDirection:"row", alignItems:"center"}} onPress={()=>{navigation.navigate("Profile", {id:item.userid})}}>
                            {
                            (!user.isExpo)?
                            <FastImage
                                style={{borderRadius:23,height:23, width:23, marginRight:9}}
                                resizeMode={FastImage.resizeMode.contain}
                                source={{
                                    uri:item.img,
                                    priority:FastImage.priority.normal
                                }}
                            />
                            :
                            <Image
                                style={{borderRadius:23,height:23, width:23, marginRight:9}}
                                resizeMode="contain"
                                source={{uri:item.img}}
                            />
                            }
                            <Text style={{fontFamily:"InterBold", fontSize:13, color:"white", paddingBottom:3.5}}>{item.name}{'  '}</Text>
                        </Pressable>
                        <Text style={{color:"white", fontFamily:"InterLight", fontSize:13, paddingBottom:3.5}}> 
                            {item.comment}
                        </Text>
                    </View>
                </View>
            </View>
        )
    }
    return (
        <ScrollView
         contentConainerStyle={[styles.commentContentContainer]} 
         ref = {scrollRef}
         showsVerticalScrollIndicator={false}
         onScroll={handleScroll}
         keyboardDismissMode={'on-drag'}
         scrollEventThrottle={0}
         removeClippedSubviews
         directionalLockEnabled
         scrollEnabled={toggled && scrollable}
        >
        <ScrollView 
        showsHorizontalScrollIndicator={false} snapToInterval={windowW} decelerationRate={"fast"} snapToAlignment={"start"}
        horizontal nestedScrollEnabled={true} directionalLockEnabled contentConainerStyle={[styles.commentContent]} scrollEnabled={toggled}>
            <ScrollView
                contentConainerStyle={[styles.commentContent]} 
                ref = {scrollRef}
                showsVerticalScrollIndicator={false}
                onScroll={handleScroll}
                keyboardDismissMode={'on-drag'}
                scrollEventThrottle={0}
                scrollEnabled={toggled && scrollable}
            > 
                <View style={{paddingBottom:(mediaType === 'mov')?(toggled)?2:16:2,
                flexDirection:"row", alignItems:"center", flex:1, paddingLeft:20, paddingRight:20, backgroundColor:"rgba(18,18,18,1)"}}>
                <TextInput style={[styles.commentText,{flex:1, bottom:(!toggled)?2:(windowH>900)?-2:-1}]} 
                scrollEnabled={true}
                readOnly={toggled}
                onPressIn={(animatedvalue === 0 || !toggled)?handleToggle:null}
                onChangeText={(e)=>setComment(e)}
                placeholder={'Add a comment...'}
                placeholderTextColor={'rgba(130, 130, 130, 1)'}
                value={comment}
                />
                <Pressable onPress={()=>handleSubmit(comment)}>  
                    <Icon 
                        style={{alignSelf:"center", right:0, bottom:(!toggled)?2:0}}
                        name={(comment.length>0)?'send':'clear'}
                        color='rgba(130, 130, 130, 1)'
                        size={(windowH>900)?22:22}
                    />
                </Pressable>
            </View>
         
            {(loading)&&    // does nothing; no animation
                <View style={{zIndex:999,alignSelf:"center",width:"100%",top:"50%", height:"100%"}}>
                    <ActivityIndicator size="large" color="#FFFFFF" style={{top:"50%", position:"absolute", alignSelf:"center"}}/>
                </View>
            }
            {(!loading)&&
                <Animated.View style={[{height:animatedvalue, borderColor:'rgba(100, 100, 100, 1)',backgroundColor:"rgba(21,21,21,1)"}]}>
                    <ScrollView horizontal={true} scrollEnabled={false}>
                        <FlatList 
                            scrollEnabled={true}
                            style={{paddingBottom:8,paddingTop:8,
                            width:windowW, paddingLeft:20, paddingRight:20, height:(windowH > 900)?windowH*(313/windowH):windowH*(261/windowH),
                            zIndex:1}}
                            decelerationRate={"fast"}
                            showsVerticalScrollIndicator={false}
                            data={commentList}
                            renderItem={renderComments} 
                            />
                    </ScrollView>
                </Animated.View>
                }
            </ScrollView>
            {/* switch from comments tab to likes tab */}
            <ScrollView 
             contentConainerStyle={[styles.commentContent]} 
             ref = {scrollRef}
             showsVerticalScrollIndicator={false}
             onScroll={handleScroll}
             keyboardDismissMode={'on-drag'}
             scrollEventThrottle={0}
             scrollEnabled={toggled && scrollable}
             > 
                <View style={{flexDirection:"row", alignItems:"center", flex:1, paddingLeft:20, paddingRight:20, backgroundColor:"rgba(18,18,18,1)"}}>                 
                    <Pressable style={{height:windowH*(48/windowH),flexDirection:"row",flex:1}} 
                    onPressIn={(animatedvalue === 0 || !toggled)?handleToggle:null}>
                        <Text style={{alignSelf:"center", fontSize:17.5,color:"white", fontFamily:"InterBold",bottom:(!toggled)?2.5:-1}}>
                            Likes and Users
                        </Text>
                    </Pressable>
                    <Pressable onPressIn={(animatedvalue === 0 || !toggled)?()=>onToggle():slidedown}>
                        <Icon 
                            style={{alignSelf:"center", right:0, bottom:(!toggled)?2.5:0}}
                            name={'clear'}
                            color='rgba(130, 130, 130, 1)'
                            size={(toggled)?(windowH>900)?22:22:(windowH>900)?22:22}
                        />
                    </Pressable>
            </View>
            {(loading)&&    // does nothing; no animation
                <View style={{zIndex:999,alignSelf:"center",width:"100%",top:"50%", height:"50%"}}>
                    <ActivityIndicator size="large" color="#FFFFFF" style={{top:"50%", position:"absolute", alignSelf:"center"}}/>
                </View>
            }
            {(!loading) &&
                <Animated.View style={[{height:animatedvalue, borderColor:'rgba(100, 100, 100, 1)',backgroundColor:"rgba(21,21,21,1)"}]}>
                    <ScrollView horizontal={true} scrollEnabled={false}>
                        <FlatList 
                            scrollEnabled={true}
                            style={{paddingBottom:8,paddingTop:8,
                            width:windowW, paddingLeft:20, paddingRight:20, height:(windowH > 900)?windowH*(313/windowH):windowH*(261/windowH),
                            zIndex:1}}
                            decelerationRate={"fast"}
                            showsVerticalScrollIndicator={false}
                            data={likesList}
                            renderItem={renderLikes} 
                            />
                    </ScrollView>
                </Animated.View>
            }
            </ScrollView>
        </ScrollView>
    </ScrollView>
    )
}
const styles= StyleSheet.create({
    commentContentContainer: {
        width:windowW,
        bottom:0,
        paddingLeft:20,
        paddingRight:20,
        backgroundColor:"rgba(21,21,21,0)",
        zIndex:-1,
        
    },
    commentContent: {
        width:windowW,
        paddingLeft:20,
        paddingRight:20,
        backgroundColor:"rgba(21,21,21,1)",
        zIndex:1,
    },
    commentContentToggled: {
        width:windowW,
        paddingLeft:20,
        paddingRight:20,
        backgroundColor:"rgba(21,21,21,1)",
        zIndex:1,
    },
    commentText: {
        width:windowW - 66,
        alignSelf:"center",
        fontFamily:"Inter",
        fontSize:13,
        color:"#FFF",
        height:windowH*(48/windowH),
    },
})
export default CommentBox