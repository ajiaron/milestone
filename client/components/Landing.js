import * as React from "react";
import { StyleSheet, View, Text, Pressable, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import GlobalStyles from "../styles/GlobalStyles";
import RadialGradient from 'react-native-radial-gradient';
import { useFonts, Inter_400Black } from '@expo-google-fonts/inter';
import AppLoading from 'expo-app-loading'

const LogoGradient = () => {
  return (
    <View style={styles.logoContainer}>
      <Image
      style={styles.logoGradient}
      resizeMode="contain"
      source={require("../assets/logo-gradient.png")}/>
       <Image
        style={styles.logo}
        resizeMode="cover"
        source={require("../assets/milestone-logo.png")}
      />
    </View>
    
  )
}
const Landing = () => {
  const navigation = useNavigation();


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
          onPress={() => navigation.navigate("Login")}
        >
          <View style={[styles.createAnAccountBox, styles.createLayout]} />
          <Text style={[styles.loginText, styles.textTypo1, styles.textTypo2]}>
            Login
          </Text>
        </Pressable>
      </View>
      <View style={styles.alreadyHaveAnAccount}>
      <View style={{flex:1, height: 1, backgroundColor: 'white'}} />
        <Text style={[styles.alrdyHaveAnAccText, styles.textTypo]}>
          already have an account?
        </Text>
        <View style={{flex:1, height: 1, backgroundColor: 'white'}} />
      </View>
      <View style={[styles.descriptionForText, styles.descriptionLayout]}>
        <Text style={[styles.descriptionText, styles.descriptionLayout, styles.textTypo]}>
          {`Just fill out some stuff for us real quick and we’ll get you on your way! Welcome to the `}
          <Text style={{fontWeight:'600'}}>{`milestone `}</Text>
          {`community.`}
        </Text>
      </View>
      <LogoGradient/>
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
    height: 26,
    width: 252,
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
    textAlign:'left',
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
    minWidth: "100%",
    minHeight: "100%",
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
