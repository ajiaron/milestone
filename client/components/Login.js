import  React, {useState, useContext} from "react";
import { Text, StyleSheet, View, Image, Pressable, TextInput, useColorScheme} from "react-native";
import { useNavigation } from "@react-navigation/native";
import GlobalStyles from "../styles/GlobalStyles";
import { CheckBox } from "react-native-elements";
import axios from 'axios'
import userContext from '../contexts/userContext'
import {
  useAuthenticator,
  Authenticator,
  useTheme,
  ThemeProvider, 
  defaultDarkModeOverride
} from '@aws-amplify/ui-react-native';
import { SignIn } from "@aws-amplify/ui-react-native/dist/Authenticator/Defaults";

const Login = () => {
  const navigation = useNavigation();
  const [userData, setUserData] = useState()
  const [passwordText, onChangePasswordText] = useState("")
  const user = useContext(userContext)
  const colorMode = useColorScheme()
  function handlePress() {
    axios.get(`http://${user.network}:19001/api/getusers`)  // if this throws an error, replace 10.0.0.160 with localhost
    .then((response)=> {
        if (user.username !== undefined && user.username.length > 0) {
          user.setUserId(response.data.filter((item)=> item.name === user.username)[0].id)
          user.setFullname(response.data.filter((item)=> item.name === user.username)[0].fullname)
          user.setImage(response.data.filter((item)=> item.name === user.username)[0].src)
        }
    })
    .catch(error => console.log(error))
    navigation.navigate("Feed")
    // authenticate here
  }

  function SignOutButton() {
    const { signOut } = useAuthenticator();
    return <Pressable onPress={()=> signOut}></Pressable>
  }
  const {
    tokens: { colors },
  } = useTheme();
  return (
    <View style={styles.loginPage}>

      <View style={styles.loginFrame}>
      <Text style={[styles.loginHeader, styles.loginText]}>Login</Text>
          <View style={styles.signUpCredentials}>
            <View style={styles.fullName}>
              <View style={[styles.fullNameTextBox, styles.textPosition]} />
                <TextInput  style={[
                  styles.fullNameFiller,
                  styles.fillerTypo,
                  styles.fillerTypo1,
                ]}
                onChangeText={(e)=>user.setUsername(e)}
                placeholder={"Type your name here"}
                placeholderTextColor={'rgba(130, 130, 130, 1)'}
                value={user.username}/>
              <Text style={[styles.fullNameHeader, styles.headerTypo]}>
                Username
              </Text>
            </View>
            <View style={[styles.password, styles.mt13]}>
              <View style={[styles.boxLayout, styles.textPosition]} />
                <TextInput  style={[
                  styles.passwordInput,
                  styles.fillerTypo,
                  styles.fillerTypo1,
                ]}
                secureTextEntry={true}
                onChangeText={onChangePasswordText}
                placeholder={"*************"}
                placeholderTextColor={'rgba(130, 130, 130, 1)'}
                value={passwordText}/>
              <Text style={[styles.passwordHeader, styles.headerTypo]}>
                Password
              </Text>
            </View>
          </View>
          <View style={[styles.rememberMyAccountBox,{ marginTop:2}]}>
            <Text style={styles.rememberAccountText}>remember my account</Text>
            <Pressable>
              <View style={styles.rememberMyAccountBoxChild} /> 
            </Pressable>
          </View>

          <Pressable
              style={[styles.loginButton, styles.boxLayout]}
              onPress={handlePress}>
              <View style={[styles.createAnAccountBox, styles.boxLayout]} />
              <Text style={[styles.createAnAccountText1, styles.loginText]}>
                Login
              </Text>
          </Pressable>
          

          <Pressable
              style={[styles.boxLayout,
              {alignSelf:'center',backgroundColor:'#101010', minHeight:27,
              justifyContent:"center", marginTop:16, borderRadius:4, borderColor:"#fff",
              borderWidth:1, borderStyle:'dashed'
            }]}
             // onPress={handlePress}
              >
              <Text style={[{alignSelf:"center",color:"#FFF", fontFamily:"Inter", fontSize:12, textAlign:"center", top:0.25}]}>
                Login with AWS
              </Text>
          </Pressable>
   


          <Text style={styles.newAccountText}>don't have an account? 
          <Pressable
            style={[styles.newAccountTextButton]}
            onPress={()=> navigation.navigate("Landing")}
          >
          <Text style={styles.newAccountTextBold}> create an acount</Text>
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
    textAlign: "left",
    color: GlobalStyles.Color.white,
    fontFamily: "InterBold",
    position: "absolute",
  },
  textPosition: {
    backgroundColor: GlobalStyles.Color.gray_200,
    top: 29,
    borderRadius: GlobalStyles.Border.br_sm,
    left: 0,
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
    textAlign: "left",
    color: GlobalStyles.Color.white,
    fontFamily: "Inter",
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
    top:"35%",
    justifyContent:"center",
    borderRadius: GlobalStyles.Border.br_lg,
    backgroundColor: GlobalStyles.Color.gray_500,
    minWidth: 321,
    height: 280,
    paddingTop:10,
    alignSelf:"center",
    position: "relative",
  },
  rememberAccountText: {
    marginLeft:18,
    fontSize: 11,
    textAlign: "left",
    color: GlobalStyles.Color.white,
    fontFamily: "Inter",
    top:11,
  },
  rememberMyAccountBoxChild: {
    borderRadius: GlobalStyles.Border.br_xs,
    backgroundColor: GlobalStyles.Color.gray_100,
    width: 9,
    height: 9,
    left: 0,
  },
  rememberMyAccountBox: {
    minWidth: 124,
    minHeight: 12,
    left: 36,
    top:2
  },
  fullNameTextBox: {
    minHeight: 30,
    minWidth: 252,
  },
  fullNameFiller: {
    top: 37, 
    left: 0,
    width: "100%",
    textAlign:"left"
  },
  fullNameHeader: {
    left: 0,
  },
  nameLogoIcon: {
    height: "20.34%",
    width: "5.16%",
    top: "64.41%",
    bottom: "15.25%",
    left: "90.87%",
  },
  fullName: {
    height: 59,
    width: 252,
  },
  passwordFiller: {
    top: 36,
    left: 9,
    width: "100%",
  },
  passwordHeader: {
    left: 1,
  },
  vectorIcon: {
    height: "21.82%",
    width: "3.97%",
    top: "65.45%",
    bottom: "12.73%",
    left: "92.06%",
  },
  password: {
    height: 55,
    width: 252,
  },
  signUpCredentials: {
    alignItems: "flex-end",
    alignSelf:"center",
    position: "relative",
  },
  createAnAccountBox: {
    backgroundColor: GlobalStyles.Color.teal,
    borderRadius: GlobalStyles.Border.br_sm,
    height: 26,
    left: 0,
    top: 0,
    position:"relative",
    alignSelf:"center"
  },
  createAnAccountText1: {
    top: 6,
    left: 110,
    fontSize: GlobalStyles.FontSize.size_lg,
  },
  newAccountTextButton: {
    fontFamily: "InterBold",
    color:"white",
  },
  loginButton: {
    alignSelf:"center",
    marginTop:18
  },
  backArrowIcon: {
    top: 49,
    left: 51,
    width: 12,
    height: 16,
    position: "absolute",
  },
  newAccountText: {
    fontFamily: "Inter",
    color:"white",
    alignSelf:"center",
    bottom:-36,
    fontSize:12
  },
  newAccountTextBold: {
    fontFamily: "InterBold",
    color:"white",
    fontSize:12.5,
    top:3.25,  
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

export default Login;
