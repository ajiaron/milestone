import React, { useState, useEffect, useCallback, useContext } from "react"
import { FlatList, StyleSheet, Text, View, Button } from 'react-native';
import 'react-native-gesture-handler'
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useFonts } from 'expo-font'
import userContext from './contexts/userContext'
import Landing from './components/Landing'
import Login from './components/Login'
import Register from './components/Register'
import ConfirmAccount from './components/ConfirmAccount'
import Feed from './components/Feed'
import Post from './components/Post'
import Profile from './components/Profile'
import Archive from './components/Archive'
import Settings from './components/Settings'
import CreatePost from './components/CreatePost'
import EditPost from './components/EditPost'
import TakePost from './components/TakePost'
import Notifications from "./components/Notifications";
import CreateMilestone from './components/CreateMilestone'
import EditMilestone from './components/EditMilestone'
import MilestonePage from './components/MilestonePage'
import MilestoneList from './components/MilestoneList'
import UserProvider from "./contexts/UserProvider";
import Friends from './components/Friends'
import MilestoneFeed from './components/MilestoneFeed'
import { Amplify, Storage } from 'aws-amplify';
import awsconfig from './src/aws-exports';
import PushProvider from "./contexts/PushProvider";
Amplify.configure(awsconfig);

const Stack = createNativeStackNavigator()
function App() {
  const user = useContext(userContext)
  const [loaded] = useFonts({
    Inter: require('./assets/fonts/Inter-Medium.otf'),
    InterBold: require('./assets/fonts/Inter-SemiBold.otf'),
    InterLight: require('./assets/fonts/Inter-Light.otf'),
    InterSemiLight: require('./assets/fonts/Inter-Regular.otf'),
  })
  if (!loaded) {
    return null
  }
  return (
    <UserProvider>
        <PushProvider>
        <NavigationContainer>
          <Stack.Navigator screenOptions={{headerShown:false}} initialRouteName={"Landing"}>
            <Stack.Screen name="Landing" component={Landing} />
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="Register" component={Register} />
            <Stack.Screen name="ConfirmAccount" component={ConfirmAccount} />
            <Stack.Screen name="Feed" component={Feed} options={{gestureEnabled: false}} />
            <Stack.Screen name="Notifications" component={Notifications} />
            <Stack.Screen name="Post" component={Post} />
            <Stack.Screen name="Profile" component={Profile}/>
            <Stack.Screen name="Archive" component={Archive} />
            <Stack.Screen name="Settings" component={Settings} />
            <Stack.Screen name="MilestoneList" component={MilestoneList} />
            <Stack.Screen name="TakePost" component={TakePost} />
            <Stack.Screen name="CreatePost" component={CreatePost} />
            <Stack.Screen name="EditPost" component={EditPost} />
            <Stack.Screen name="Friends" component={Friends} />
            <Stack.Screen name="CreateMilestone" component={CreateMilestone} />
            <Stack.Screen name="EditMilestone" component={EditMilestone} />
            <Stack.Screen name="MilestonePage" component={MilestonePage} />
            <Stack.Screen name="MilestoneFeed" component={MilestoneFeed} />
          </Stack.Navigator>
        </NavigationContainer>
        </PushProvider>
      </UserProvider>
    );
  }

const styles = StyleSheet.create({
  container: {
    flex:'1',
    backgroundColor: '#1f1e1e',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily:"Inter"
  },
});

export default App;