import  React, {useState, useContext} from "react";
import { Text, StyleSheet, View, Image, Pressable, TextInput, useColorScheme, Dimensions, Alert} from "react-native";
import { CheckBox } from "react-native-elements";
import { useNavigation } from "@react-navigation/native";
import GlobalStyles from "../styles/GlobalStyles";
import { Icon } from 'react-native-elements';
import axios from 'axios';
import userContext from '../contexts/userContext';
import { Amplify, Auth } from 'aws-amplify';
import awsconfig from '../src/aws-exports';
Amplify.configure(awsconfig);

const windowW = Dimensions.get('window').width
const windowH = Dimensions.get('window').height

const Login = () => {
  const navigation = useNavigation();
  const [userData, setUserData] = useState({username:'', password:''})
  const [loading, setLoading] = useState(false)
  const [checked, setChecked] = useState(false)
  const user = useContext(userContext)
  function handlePress() { 
    axios.get(`http://${user.network}:19001/api/getusers`)  // for testing without auth
    .then((response)=> {
        if (userData.username !== undefined && userData.username.length > 0) {
          user.setUsername(userData.username)
          user.setUserId(response.data.filter((item)=> item.name === userData.username)[0].id)
          user.setFullname(response.data.filter((item)=> item.name === userData.username)[0].fullname)
          user.setImage(response.data.filter((item)=> item.name === userData.username)[0].src)
        }
    })
    .catch(error => console.log(error))
    navigation.navigate("Feed")
    // authenticate here
  }
  const onSignIn = async () => {
    if (loading) { 
      return
    }
    setLoading(true)
    try {
      const response = await Auth.signIn(userData.username, userData.password);
      console.log(response)
      axios.get(`http://${user.network}:19001/api/getusers`)  
      .then((response)=> {
          if (userData.username !== undefined && userData.username.length > 0) {
            user.setUsername(userData.username)
            user.setUserId(response.data.filter((item)=> item.name === userData.username)[0].id)
            user.setFullname(response.data.filter((item)=> item.name === userData.username)[0].fullname)
            user.setImage(response.data.filter((item)=> item.name === userData.username)[0].src)
          }
      })
      .catch(error => console.log(error))
      navigation.navigate("Feed")
    } catch(e) {
        Alert.alert("Please try again.", e.message)
    }
    setLoading(false)
  }
  return (
    <View style={styles.loginPage}>
      <View style={{flexDirection:"row", alignItems:"center"}}>
        <Pressable style={{left:0.085*windowW, top:0.0675*windowH}} onPress={()=>navigation.navigate("Landing")}>
        <Icon 
            style={[styles.backButton ]}
            name='arrow-back-ios'
            color='white'
            size={22.5}
        />
        </Pressable>
      </View>
      <View style={styles.loginFrame}>
      <Text style={[styles.loginHeader, styles.loginText]}>Login</Text>
          <View style={styles.signUpCredentials}>
            <View style={styles.fullName}>
              <View style={[styles.fullNameTextBox, styles.textPosition]} />
              <Text style={[styles.fullNameHeader, styles.headerTypo]}>
                Username
              </Text>
                <TextInput  style={[
                  styles.fullNameFiller,
                  styles.fillerTypo,
                  styles.fillerTypo1,
                ]}
                onChangeText={(e)=>setUserData({...userData, username:e})}
                placeholder={"Type your name here"}
                placeholderTextColor={'rgba(130, 130, 130, 1)'}
                value={userData.username}/>
              
            </View>
            <View style={[styles.password, styles.mt13]}>
              <View style={[styles.boxLayout, styles.textPosition]} />
              <Text style={[styles.passwordHeader, styles.headerTypo]}>
                Password
              </Text>
                <TextInput  style={[
                  styles.passwordInput,
                  styles.fillerTypo,
                  styles.fillerTypo1,
                ]}
                secureTextEntry={true}
                onChangeText={(e)=>setUserData({...userData, password:e})}
                placeholder={"*************"}
                placeholderTextColor={'rgba(130, 130, 130, 1)'}
                value={userData.password}/>
            </View>
          </View>
          <View style={[styles.rememberMyAccountBox,{ paddingTop:8, alignItems:"center", paddingBottom:2}]}>
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
              onPress={()=>onSignIn()}
              disabled={loading}
          >
              <Text style={[{alignSelf:"center",color:"#FFF", fontFamily:"Inter", fontSize:12, textAlign:"center", top:0.25}]}>
                {(loading)?'Loading...':
                'Login with AWS'
                }
              </Text>
          </Pressable>
          <Text style={styles.newAccountText}>don't have an account? 
          <Pressable
            style={[styles.newAccountTextButton]}
            onPress={()=> navigation.navigate("Register")}
          >
            <Text style={styles.newAccountTextBold}> create an acount</Text>
          </Pressable>
        </Text>
        <Pressable
            style={[styles.newAccountTextButton, styles.forgotPassword]}
            onPress={()=> navigation.navigate("Register")}
        >
          <Text style={styles.forgotPasswordText}> Forgot password?</Text>
        </Pressable>
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
    top:"30%",
    justifyContent:"center",
    borderRadius: GlobalStyles.Border.br_lg,
    backgroundColor: GlobalStyles.Color.gray_500,
    minWidth: 321,
    height: 290,
    paddingTop:24,
    alignSelf:"center",
    position: "relative",
  },
  rememberAccountText: {
    marginLeft:10,
    fontSize: 11,
    color: GlobalStyles.Color.white,
    fontFamily: "Inter",
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
    left: 34,
    top:6,
    flexDirection:"row"
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
    bottom:-44,
    fontSize:12
  },
  forgotPassword: {
    fontFamily: "Inter",
    color:"white",
    alignSelf:"center",
    bottom:-48,
    fontSize:12
  },
  forgotPasswordText: {
    fontFamily: "InterBold",
    color:"gray",
    fontSize:12.5,
    top:3.25,  
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
