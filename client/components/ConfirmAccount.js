import  React, {useState, useEffect, useRef, useContext} from "react";
import { Animated, Text, StyleSheet, View, Image, Pressable, TextInput, Dimensions, Alert, ScrollView, KeyboardAvoidingView} from "react-native";
import userContext from '../contexts/userContext'
import { useFonts, Inter_400Black } from '@expo-google-fonts/inter';
import { useNavigation, useRoute } from "@react-navigation/native";
import GlobalStyles from "../styles/GlobalStyles";
import axios from 'axios'
import { Icon } from 'react-native-elements'
import * as Network from 'expo-network'
import Constants from 'expo-constants';
import { Auth } from "aws-amplify";

const windowW = Dimensions.get('window').width
const windowH = Dimensions.get('window').height

function ConfirmAccount() {
    const route = useRoute()
    const navigation = useNavigation()
    const [confirmCode, setConfirmCode] = useState('')
    const [username, setUsername] = useState((route.params.username !== undefined)?route.params.username:'')
    const [active, setActive] = useState(true)

    const handleResend = async() => {
        try {
            const response = await Auth.resendSignUp(username)
            console.log(response)
            setActive(false)
            setTimeout(()=> {
                setActive(true)
            }, 500)
        } catch(e) {
            Alert.alert("Please try again.", e.message)
        }
    }

    const confirmUser = async() => {
        if (username.length === 0 || confirmCode.length === 0) {
            Alert.alert("Please try again.", "Ensure all fields are completed.")
        }
        else {
            try {
                const response = await Auth.confirmSignUp(username, confirmCode)
                console.log(response)
                navigation.navigate("Login")
            } catch (e) {
                Alert.alert("Please try again.", e.message)
            }
        }
    }
    return (
        <View style={styles.confirmAccountPage}>
        <KeyboardAvoidingView
          style={{flex:1}}
          behavior={"padding"}
          keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}>
      
            <View style={{flexDirection:"row", alignItems:"center"}}>
                <Pressable style={{left:0.08*windowW, top:0.07*windowH}} onPress={()=>navigation.goBack()}>
                    <Icon 
                        style={styles.backButton}
                        name='arrow-back-ios'
                        color='white'
                        size={22}
                    />
                </Pressable>
            </View>

            <View style={{alignSelf:"center", top:'18%'}}>
                <Text style={[styles.confirmHeader]}>Confirm Your Account</Text>
                <View style={[styles.loginFrame, {alignSelf:"center"}]}>
  
                        <Text style={[styles.fullNameHeader, styles.headerTypo]}>
                            Account Username
                        </Text>
              
                    <View style={[styles.signUpCredentials, {marginBottom:20}]}>
                        <TextInput  style={[
                            styles.inputCode,
                        ]}
                        onChangeText={(e)=>setUsername(e)}
                        placeholder={"Enter your username"}
                        placeholderTextColor={'rgba(120, 120, 120, 1)'}
                        value={username}/>
                    </View>
                    <Text style={[styles.fullNameHeader, styles.headerTypo]}>
                        Confirmation Code - Email
                    </Text>
                    <View style={styles.signUpCredentials}>
                        <TextInput  style={[
                            styles.inputCode,
                        ]}
                        keyboardType={'number-pad'}
                        returnKeyType="done"
                        onChangeText={(e)=>setConfirmCode(e)}
                        placeholder={"Enter your confirmation code..."}
                        placeholderTextColor={'rgba(120, 120, 120, 1)'}
                        value={confirmCode}/>
                    </View>
                    <View style={{width:266, flexDirection:"row", paddingLeft:2, paddingRight:2,
                    alignItems:"center", justifyContent:"space-between", alignSelf:"center", paddingTop:24}}>
                        <Pressable 
                            onPress={confirmUser}
                            style={{height:windowH*(26/windowH)}}
                        >
                            <View style={[styles.addFriendContainer, 
                                {backgroundColor:"rgba(0, 82, 63, 1)"
                                }]}>
                                <Text style={[styles.addFriendText, 
                                    {fontSize:(windowW>400)?12.5:12.5, 
                                    color:"white",
                                    }]}>
                                    Confirm
                                </Text>
                            </View>
                        </Pressable>
                        <Pressable 
                            onPress={handleResend}
                            style={{height:windowH*(26/windowH)}}
                        >
                            <View style={[styles.addFriendContainer, 
                                {backgroundColor:(active)?"rgba(19, 19, 19, 1)":"rgba(60, 60, 60, 1)", borderWidth:1, borderColor:"#eeeeee",
                                borderStyle:"dashed"
                                }]}>
                                <Text style={[styles.addFriendText, 
                                    {fontSize:(windowW>400)?12.5:12.5, 
                                    color:(active)?"white":"rgba(10,10,10,1)",
                                    }]}>
                                    Resend
                                </Text>
                            </View>
                        </Pressable>
                    </View>

            </View>
            <View style={{width:"100%", alignItems:"center", alignSelf:"center", top:120}}>
                <Text style={styles.newAccountText}>sign into a different account?
                    <Pressable
                    style={[styles.loginTextButton]}
                    onPress={()=> navigation.navigate("Login")}
                    >
                        <Text style={styles.loginTextBold}> log in</Text>
                    </Pressable>
                </Text>
                </View>
            </View>
            </KeyboardAvoidingView>
        </View>
    )
}
const styles = StyleSheet.create({
    confirmAccountPage: {
        backgroundColor: GlobalStyles.Color.gray_300,
        minWidth: windowW,
        minHeight: windowH,
        overflow: "scroll",
      },
      loginFrame: {
        top:"35%",
        justifyContent:"center",
        alignItems:"center",
        alignSelf:"center",
        borderRadius: GlobalStyles.Border.br_lg,
        backgroundColor: GlobalStyles.Color.gray_500,
        minWidth: 320,
        paddingTop:2,
        paddingBottom:4,
        minHeight: windowH*0.3,
        position: "relative",
      },
      confirmHeader: {
        position:"relative",
        fontSize: GlobalStyles.FontSize.size_2xl,
        left:4,
        color: GlobalStyles.Color.white,
        top:80,
        fontFamily: "InterBold",
      },
      signUpCredentials: {

      },
      inputCode: {
        color: "white",
        fontSize:12,
        fontWeight: "500",
        fontFamily: "Inter",
        minHeight: 36,
        minWidth: 266,
        alignSelf:"center",
        paddingLeft:12,
        alignItems:"center",
        backgroundColor: GlobalStyles.Color.gray_200,
        borderRadius: GlobalStyles.Border.br_sm,
      },
      newAccountText: {
        fontFamily: "Inter",
        color:"white",
        alignSelf:"center",
        alignItems:"center",

        fontSize:12,
      },
      loginTextBold: {
        fontFamily: "InterBold",
        color:"white",
        position:"relative",
        top:3.35,
        fontSize:12.5
      },
      loginTextButton: {
        fontFamily: "InterBold",
        color:"white",
      },
      addFriendContainer: {
        minWidth:windowW * (120/windowW),
        height: windowH * (28/windowH),
        borderRadius:4,
        justifyContent:"center",
        alignSelf:"center"
    },
    addFriendText: {
        fontFamily:"InterBold",
        alignSelf:"center"
    },
    headerTypo: {
        fontSize: GlobalStyles.FontSize.size_xl,
        textAlign: "left",
        color: GlobalStyles.Color.white,
        fontFamily: "Inter",
        marginBottom:8,
        left:27,
        alignSelf:"flex-start",
      },
})
export default ConfirmAccount