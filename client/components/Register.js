import  React, {useState, useEffect, useRef, useContext} from "react";
import { Animated, Text, StyleSheet, View, Image, Pressable, TextInput, Dimensions} from "react-native";
import userContext from '../contexts/userContext'
import { useFonts, Inter_400Black } from '@expo-google-fonts/inter';
import { useNavigation } from "@react-navigation/native";
import GlobalStyles from "../styles/GlobalStyles";
import axios from 'axios'
import { Icon } from 'react-native-elements'
import * as Network from 'expo-network'
import Constants from 'expo-constants';

const windowW = Dimensions.get('window').width
const windowH = Dimensions.get('window').height

const Register = () => {
  const navigation = useNavigation();
  const user = useContext(userContext)
  const [checked, setChecked] = useState(false)
  const animatedvalue = useRef(new Animated.Value(0)).current;
  const animatedfull = useRef(new Animated.Value(0)).current;
  const animatedemail = useRef(new Animated.Value(0)).current;
  const animatedpass = useRef(new Animated.Value(0)).current;
  const [username, setUsername] = useState("")
  const [fullname, setFullname] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const defaultData = {
    name:username,
    milestones:0,
    blurb:'nothing just yet!',
    password:password,
    friends:0,
    groupcount:0,
    email:email,
    fullname:fullname,
    src:'https://firebasestorage.googleapis.com/v0/b/unify-bc2ad.appspot.com/o/dyozelg1xtu-153%3A115?alt=media&token=7c1ba9f6-1b0a-45cf-9aff-fa8854d671b8',
    public:1,
    favoriteid:1,
  }
  function shakeTextLeft(value) {
    Animated.timing(value,{
      toValue:100,
      duration:200,
      useNativeDriver:false,
    }).start(()=> shakeTextRight(value))
 
  }
  function shakeTextRight(value) {
    Animated.timing(value,{
      toValue:0,
      duration:0,
      useNativeDriver:false,
  }).start()
}
  function handlePress() {
    console.log(username, fullname, email, password)
    console.log(animatedvalue)
    if (username.length <= 0) {
      shakeTextLeft(animatedvalue)
    }
    if (fullname.length <= 0) {
      shakeTextLeft(animatedfull)
    }
    if (email.length <= 0) {
      shakeTextLeft(animatedemail)
    }
    if (password.length <= 0) {
      shakeTextLeft(animatedpass)
    }
    if (username.length >0 && fullname.length >0 && email.length >0 && password.length >0) {
      axios.post(`http://${user.network}:19001/api/registeruser`, 
      {username:username, milestones:defaultData.milestones, blurb:defaultData.blurb, 
      password:password, friends:0, groupcount:0, email:email, fullname:fullname, 
      src:defaultData.src, public:1, favoriteid:1})
      .then(() => {
        user.setUsername(username)
        user.setEmail(email)
        user.setFullname(fullname)
        user.setPassword(password)
      })
      .catch((error)=> console.log(error))
      navigation.navigate("Login")
    } // todo: if username already exists
  }


  return (
    <View style={styles.loginPage}>
        <View style={{flexDirection:"row", alignItems:"center"}}>
        <Pressable style={{left:0.085*windowW, top:0.0675*windowH}} onPress={()=>navigation.navigate("Landing")}>
        <Icon 
            style={styles.backButton}
            name='arrow-back-ios'
            color='white'
            size={22}
        />
        </Pressable>
      </View>
      <View style={styles.loginFrame}>
      <Text style={[styles.loginHeader, styles.loginText]}>Create an account</Text>
          <View style={styles.signUpCredentials}>
          <View style={[styles.fullName]}>
            <Animated.Text style={[styles.fullNameHeader, styles.headerTypo, 
            {left:animatedvalue.interpolate({inputRange:[0,33,66,100], outputRange:[0,-6,6,0]})}]}>
                Username
             </Animated.Text>
              <View style={[styles.fullNameTextBox, styles.textPosition]} />
                <TextInput  style={[
                  styles.fullNameFiller,
                  styles.fillerTypo,
                  styles.fillerTypo1,
                ]}
                onChangeText={(e)=>setUsername(e)}
                placeholder={"Type your name here"}
                placeholderTextColor={'rgba(120, 120, 120, 1)'}
                value={username}/>
            </View>

            <View style={[styles.fullName, {marginTop:13}]}>
            <Animated.Text style={[styles.fullNameHeader, styles.headerTypo, 
              {left:animatedfull.interpolate({inputRange:[0,33,66,100], outputRange:[0,-6,6,0]})}]}>
                Full name
             </Animated.Text>
              <View style={[styles.fullNameTextBox, styles.textPosition]} />
                <TextInput  style={[
                  styles.fullNameFiller,
                  styles.fillerTypo,
                  styles.fillerTypo1,
                ]}
                onChangeText={(e)=>setFullname(e)}
                placeholder={"Type your name here"}
                placeholderTextColor={'rgba(120, 120, 120, 1)'}
                value={fullname}/>
            </View>

            <View style={styles.emailAddress}>
              <View style={[styles.fullNameTextBox, styles.textPosition]} />
                <Animated.Text style={[styles.emailHeader, styles.headerTypo, {left:animatedemail.interpolate({inputRange:[0,33,66,100], outputRange:[0,-6,6,0]})}]}>
                  Email Address
                </Animated.Text>
                <TextInput  style={[
                  styles.fullNameFiller,
                  styles.fillerTypo,
                  styles.fillerTypo1,
                ]}
                onChangeText={(e)=>setEmail(e)}
                placeholder={"Johnny Appleseed"}
                placeholderTextColor={'rgba(120, 120, 120, 1)'}
                value={email}/>
            </View>

            <View style={[styles.password]}>
              <View style={[styles.boxLayout, styles.textPosition]} />
                <Animated.Text style={[styles.passwordHeader, styles.headerTypo, {left:animatedpass.interpolate({inputRange:[0,33,66,100], outputRange:[0,-6,6,0]})}]}>
                  Password
                </Animated.Text>
                <TextInput  style={[
                  styles.passwordInput,
                  styles.fillerTypo,
                  styles.fillerTypo1,
                ]}
                secureTextEntry={true}
                onChangeText={(e)=>setPassword(e)}
                placeholder={"*************"}
                placeholderTextColor={'rgba(120, 120, 120, 1)'}
                value={password}/>
            </View>
          </View>
          <View style={[styles.rememberMyAccountBox, {flexDirection:"row"}]}>


            <Pressable onPress={()=>setChecked(!checked)}>
                {(checked)?
                    <Icon
                    name={'check-box'}
                    size={15}
                    color={'rgba(53, 174, 146, 1)'}
                    />
                  :
                    <Icon
                    name={'check-box-outline-blank'}
                    size={15}
                    color={'#fff'}
                    />}
              </Pressable>
    
             <Text style={styles.rememberAccountText}>remember my account</Text>
   


          </View>
          <Pressable
            style={[styles.registerButton, styles.boxLayout]}
            onPress={handlePress}
          >
            <View style={[styles.createAnAccountBox, styles.boxLayout]} />
            <Text style={[styles.createAnAccountText1, styles.loginText]}>
              Create an account
            </Text>
          </Pressable>
          <Text style={styles.newAccountText}>already have an account?
          <Pressable
            style={[styles.loginTextButton]}
            onPress={()=> navigation.navigate("Login")}
          >
          <Text style={styles.loginTextBold}> log in</Text>
          </Pressable>
        </Text>
        </View>
    </View>
   );
}


const styles = StyleSheet.create({
  mt13: {
    marginTop: GlobalStyles.Margin.margin_md,
  },
  loginText: {
    color: GlobalStyles.Color.white,
    fontFamily: "InterBold",
  },
  textPosition: {
    backgroundColor: GlobalStyles.Color.gray_200,
    top: 29,
    borderRadius: GlobalStyles.Border.br_sm,
  },
  fillerTypo: {
    color: "white",
    fontSize:12,
    maxWidth:"100%",
    position: "absolute",
  },
  passwordInput: {
    top:"65%",
    width:"100%"
  },
  fillerTypo1: {
    color: "white",
    fontWeight: "500",
    left:10,
    fontFamily: "Inter",
  },
  headerTypo: {
    fontSize: GlobalStyles.FontSize.size_xl,
    top: 0,
    color: GlobalStyles.Color.white,
    fontFamily: "InterBold",
    position: "absolute",
  },
  iconLayout: {
    maxHeight: "100%",
    maxWidth: "100%",
    right: "3.97%",
    position: "absolute",
    overflow: "hidden",
  },
  boxLayout: {
    height: 26,
    width: 252,
    position: "relative",
  },
  loginHeader: {
    position:"relative",
    fontSize: GlobalStyles.FontSize.size_2xl,
    top: -40,
    left:4
  },
  loginFrame: {
    top:"25%",
    justifyContent:"center",
    borderRadius: GlobalStyles.Border.br_lg,
    backgroundColor: GlobalStyles.Color.gray_500,
    minWidth: 321,
    minHeight: 238,
    alignSelf:"center",
    position: "relative",
  },
  rememberAccountText: {
    marginLeft:10,
    fontSize: 11,
    textAlign: "left",
    color: GlobalStyles.Color.white,
    fontFamily: "Inter",
  
  },
  rememberMyAccountBoxChild: {
    borderRadius: GlobalStyles.Border.br_xs,
    backgroundColor: GlobalStyles.Color.gray_100,
    width: 9,
    height: 9,

  },
  rememberMyAccountBox: {
    minWidth: 124,
    minHeight: 12,
    left: 36,
    alignItems:"center",
    top:9
  },
  emailTextBox: {
    minHeight: 30,
    minWidth: 252,
  },
  fullNameTextBox: {
    minHeight: 30,
    minWidth: 252,
  },
  fullNameFiller: {
    top: 37, 

    width: "100%",

  },
  fullNameHeader: {
 
  },
  emailHeader: {
    
  },
  nameLogoIcon: {
    height: "20.34%",
    width: "5.16%",
    top: "64.41%",
    bottom: "15.25%",
    left: "90.87%",
  },
  fullName: {
    height: 60,
    width: 252,
  },
  emailAddress: {
    height: 59,
    width: 252,
    marginTop:16
  },
  passwordFiller: {
    top: 36,
    left: 9,
    width: 73,
  },
  passwordHeader: {

  },
  vectorIcon: {
    height: "21.82%",
    width: "3.97%",
    top: "65.45%",
    bottom: "12.73%",
    left: "92.06%",
  },
  password: {
    height: 56,
    width: 252,
    marginTop: GlobalStyles.Margin.margin_md,

  },
  signUpCredentials: {
    alignItems: "flex-end",
    alignSelf:"center",
    bottom:4,
    position: "relative",
  },
  createAnAccountBox: {
    backgroundColor: GlobalStyles.Color.teal,
    borderRadius: GlobalStyles.Border.br_sm,
    height: 26,
    left: 0,
    top: 6,
    position:"relative",
    alignSelf:"center",

  },
  createAnAccountText1: {
    alignSelf:"center",
    fontFamily:"InterBold",
    top:-14,
    lineHeight:14,
    fontSize: GlobalStyles.FontSize.size_lg,
  },
  registerButton: {
    alignSelf:"center",
    marginTop:18,
    marginBottom:13
 
  },
  backArrowIcon: {
    top: 49,
    left: 51,
    width: 12,
    height: 16,
    position: "absolute",
  },
  loginTextButton: {
    fontFamily: "InterBold",
    color:"white",
    top:10
  
  },
  newAccountText: {
    fontFamily: "Inter",
    color:"white",
    alignSelf:"center",
    bottom:-30,
    fontSize:12
  },
  loginTextBold: {
    fontFamily: "InterBold",
    color:"white",
    position:"relative",
    top:3.35,
    fontSize:12.5
  },
  alrdyHaveAnAccText: {
    top: 570,
    left: 55,
    width: 315,
    textAlign: "center",
    color: GlobalStyles.Color.white,
  },
  loginPage: {
    backgroundColor: GlobalStyles.Color.gray_300,
    flex: 1,
    minWidth: "100%",
    minHeight: "100%",
    overflow: "hidden",
  },
});

export default Register;

