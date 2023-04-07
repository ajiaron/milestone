import React, { useState, useEffect, useContext } from "react";
import { StyleSheet, View, Text, Pressable, Image, Dimensions, Alert } from "react-native";
import { useNavigation, useRoute, useIsFocused } from "@react-navigation/native";
import { NativeModules } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import userContext from '../contexts/userContext'
import GlobalStyles from "../styles/GlobalStyles";
import RadialGradient from 'react-native-radial-gradient';
import { useFonts, Inter_400Black } from '@expo-google-fonts/inter';
import * as Network from 'expo-network'
import Constants, {ExecutionEnvironment} from 'expo-constants';
import axios from 'axios'
import { Amplify, Auth } from 'aws-amplify';
import awsconfig from '../src/aws-exports';
Amplify.configure(awsconfig);

const windowW= Dimensions.get('window').width
const windowH = Dimensions.get('window').height

const LogoGradient = () => {
  return (
    <View style={styles.logoContainer}>
      <Image
      style={styles.logoGradient}
      resizeMode="contain"
      source={require("../assets/logo-gradient.png")}/>
       <Image
        style={[styles.logo,{ aspectRatio: 1, width:111, height:111, borderRadius:111}]}
       
        resizeMode="contain"
        source={require("../assets/landingbook7.png")}
      />
    </View> 
  )
}

const Landing = () => {
  const navigation = useNavigation();
  const user = useContext(userContext);
  const isFocused = useIsFocused();
  const [username, setUsername] = useState()
  const [password, setPassword] = useState()
  const [loading, setLoading] = useState(false)
  const [confirmed, setConfirmed] = useState(true)
  const [userPassword, setUserPassword] = useState('')
  const onSignIn = async () => {
    if (loading) { 
      return
    }
    setLoading(true)
    try {
      // set user context
      axios.get(`http://${user.network}:19001/api/getusers`)  
      .then((response)=> {
          if (username !== undefined && username.length > 0) {
            user.setUsername(username)
            user.setUserId(response.data.filter((item)=> item.name === username)[0].id)
            user.setFullname(response.data.filter((item)=> item.name === username)[0].fullname)
            user.setImage(response.data.filter((item)=> item.name === username)[0].src)
            setConfirmed(response.data.filter((item)=> item.name === username)[0].confirmed)
            setUserPassword(response.data.filter((item)=> item.name === username)[0].password)
          }
      })
      .catch(error => console.log(error.message))
      // authenticate using aws amplify
      await Auth.signIn(username, password);
      user.setLogged(true)
      navigation.navigate("Feed")
    } catch(e) {
        // redirect unconfirmed users to verify email
        if (!confirmed && password === userPassword) {
          navigation.navigate("ConfirmAccount", {username:username})
        } else {
          Alert.alert("Please try again.", e.message)
        } 
      }
    setLoading(false)
  }

  function handleLogin() {
    if ((username && username.length > 0) && (password && password.length > 0)) {
      onSignIn()
    } else {
      navigation.navigate("Login")
    }
  }

  const switchAccount = async() => {
    try {
      await AsyncStorage.removeItem('username')
      await AsyncStorage.removeItem('password')
      setUsername(null)
      setPassword(null)
      await Auth.signOut()
      navigation.navigate("Login")
    } catch(e) {
      Alert.alert("An error occured", e.message)
    }
  }
  // determine user's connection
  useEffect(()=> {
    axios.get(`http://ec2-13-52-215-193.us-west-1.compute.amazonaws.com:19001/api/testconnect`)  // ec2 connection
    .then((response)=> {
      if (response) {
        user.setNetwork('ec2-13-52-215-193.us-west-1.compute.amazonaws.com')
      }
    }).catch(()=>
     user.setNetwork(Constants.expoConfig.hostUri.substring(0,Constants.expoConfig.hostUri.indexOf(':'))))  // local connection
  }, [])

  // determine if app is running on Expo or actual build
  useEffect(()=> {
    if (Constants.appOwnership === 'expo' || Constants.executionEnvironment === ExecutionEnvironment.StoreClient) {  
      user.setIsExpo(true)
    } else {
      user.setIsExpo(false)
    }
  }, [])

  // remember user's login info
  useEffect(()=> {
    const handleSignIn = async() => {
      try {
        const name = await AsyncStorage.getItem('username')
        setUsername(name)
        const pass = await AsyncStorage.getItem('password')
        setPassword(pass)
      } catch(e) {
        Alert.alert("An error occured", e.message)
      }
    }
    if (isFocused) {
      handleSignIn()
    }
  }, [isFocused])
  
  return (
    <View style={styles.landingPage}>
      <View style={[styles.headerBorder, styles.backgroundIconPosition]} />
      <View style={styles.landingContent}>
        <View style={styles.frameForButtons}>
        <View style={styles.createLayout}>
        <Pressable
          onPress={() => navigation.navigate("Register")}
        >
          <View style={[styles.createAnAccountBox, styles.createLayout]} />
          <Text
            style={[styles.createAnAccountText, styles.textTypo1, styles.textTypo2]}
          >
            Create an account
          </Text>
          </Pressable>
        </View>
        <Pressable
          style={[styles.createLayout, styles.mt38]}
          onPress={handleLogin}
        >
          <View style={[styles.createAnAccountBox, styles.createLayout]} />
          <Text style={[styles.loginText, styles.textTypo1, styles.textTypo2]}>
            {(loading)?'Loading...':
              (username && username.length > 0)?`Continue as ${username}`:'Login'
            }
          </Text>
        </Pressable>
      </View>
      <View style={styles.alreadyHaveAnAccount}>
      <View style={{flex:1, height: 1, backgroundColor: 'white'}} />
      <Pressable onPress={switchAccount}>
        <Text style={[styles.alrdyHaveAnAccText, styles.textTypo]}>
          {(username && username.length > 0)?
          'using a different account?':'already have an account?'
          }
        </Text>
      </Pressable>
        <View style={{flex:1, height: 1, backgroundColor: 'white'}} />
      </View>
      <View style={[styles.descriptionForText, styles.descriptionLayout]}>
        <Text style={[styles.descriptionText, styles.descriptionLayout, styles.textTypo]}>
          {`Just fill out some stuff for us real quick and we’ll get you on your way! Welcome to the `}
          <Text style={{fontWeight:'600'}}>{`milestone `}</Text>
          {`community.`}
        </Text>
      </View>
      <Pressable onPress={()=>console.log(username)}>
        <LogoGradient/>
      </Pressable>
      <Text style={[styles.logoText]}>milestone</Text>
      </View>
      <Image
        style={[styles.backgroundVectorIcon, styles.backgroundIconPosition]}
        resizeMode="contain"
        source={require("../assets/top-background-vector.png")}
      />
      <Image
        style={[styles.backgroundVectorIcon1, styles.backgroundIconPosition]}
        resizeMode="cover"
        source={require("../assets/bottom-background-vector.png")}
      />
    </View>
  );
}


const styles = StyleSheet.create({
  mt38: {
    marginTop: 38,
  },
  backgroundIconPosition: {
    minWidth: "100%",
    left: 0,
    position: "absolute",
  },
  createLayout: {
    height: windowH * (26/windowH),
    width: windowW * (252/windowW),
    position:'relative',
  },
  textTypo1: {
    alignSelf: "center",
    justifyContent:'center',
    textAlign:'center',
    color: GlobalStyles.Color.white,
    fontFamily: "InterBold",
    fontWeight: "600",
    position: "absolute",
  },
  textTypo2: {
    fontSize: GlobalStyles.FontSize.size_lg,
    top: 6,
    color: GlobalStyles.Color.white,
  },
  textTypo: {
    textAlign: "center",
    fontSize: GlobalStyles.FontSize.size_base,
    color: GlobalStyles.Color.white,
  },

  descriptionLayout: {
    width: 254,
    justifyContent:'center',
    alignContent:'center',
    alignSelf:'center',
  
  },
  headerBorder: {
    backgroundColor: "#000",
    height: 64,
    display: "none",
    top: 0,
  },
  createAnAccountBox: {
    borderRadius: GlobalStyles.Border.br_sm,
    backgroundColor: GlobalStyles.Color.teal,
    position: "relative",
  },

  frameForButtons: {
    alignSelf:'center',
    alignItems: "flex-end",
    justifyContent:'center',
    position: "absolute",
    top:500
  },
  alrdyHaveAnAccText: {
    fontFamily: "Inter",
    position: "relative",
    fontSize: 10,
    marginLeft:12,
    marginRight:12
  },

  alreadyHaveAnAccount: {
    alignSelf:'center',
    alignItems:'center',
    display:'flex',
    flexDirection:'row',
    top:539,
    position: "relative",
    lineHeight:12,
    width: 252
  },
  descriptionForText: {
    top:434,
    alignSelf:'center',
    position:'relative'
  },
  backgroundVectorIcon: {
    height:"30%",
    width:"100%",
    top:0,
    zIndex:-1
  },
  backgroundVectorIcon1: {
    bottom:0,
    height:"30%",
    width:"100%",
  
    position:"absolute",
  },
  logoContainer: {
    zIndex:-1
  },
  logo: {
    alignSelf:"center",
    top:"-14%"
  },
  logoText: {
    alignSelf:'center',
    top:"-7%",
    fontFamily:'InterBold',

    justifyContent:'center',
    textAlign:'center',
    color: GlobalStyles.Color.white,
    fontSize: GlobalStyles.FontSize.size_2xl,
  },
  landingContent: {
    zIndex:1,
    alignItems:"center",
    position:"relative",
    alignSelf:"center",
    top:"-22%",
  },
  landingPage: {
    backgroundColor: GlobalStyles.Color.gray_300,
    flex: 1,
    minWidth: windowW,
    minHeight: windowH,
    overflow: "hidden",
    alignItems:"center",
    justifyContent:"center"
  },
  logoGradient: {
    zIndex:-1,
    alignSelf:"center",
    top:"37%",
  }
});

export default Landing;
