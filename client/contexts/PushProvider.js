import React, {useState, useRef, useContext} from "react";
import {Alert} from 'react-native'
import pushContext from './pushContext'
import * as Device from 'expo-device'
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import axios from "axios";
import userContext from "./userContext";

const PushProvider = ({children}) => {
    const user = useContext(userContext)
    const [expoPushToken, setExpoPushToken] = useState('');
    const [pushNotification, setPushNotification] = useState(false);
    const notificationListener = useRef();
    const responseListener = useRef();
      
    const registerForPushNotificationsAsync = async (route) => {
        let token;
        if (Device.isDevice) {
            const { status: existingStatus } = await Notifications.getPermissionsAsync();
            let finalStatus = existingStatus;
            console.log(existingStatus)
            if (existingStatus !== 'granted') {
                const { status } = await Notifications.requestPermissionsAsync();
                user.setNotifications(false)
                finalStatus = status;
            }
            if (finalStatus !== 'granted') {
                if (await AsyncStorage.getItem('notificationPrompt') !== 'confirmed') {
                    Alert.alert('Configure Settings','You can re-enable push notifications on your profile settings.');
                    await AsyncStorage.setItem('notificationPrompt', 'confirmed')
                }
                if (route === "Settings") {
                    Alert.alert("Enable Notifications", 'Go to Settings > Milestone > Tap Notifications > Allow Notifications')
                }
                
                user.setNotifications(false)
                axios.put(`http://${user.network}:19001/api/updatetoken`, 
                {id:user.userId, token:null})
                .then(() => {
                    console.log('token deleted')
                })
                return;
            }
            // Save the token to backend server for later use
            if (finalStatus === 'granted') {
                user.setNotifications(true)
                token = (await Notifications.getExpoPushTokenAsync({projectId:"b1f4661a-752e-4c66-b266-dadb2d4c2214"})).data;
                axios.put(`http://${user.network}:19001/api/updatetoken`, 
                {id:user.userId, token:token.substring(18,token.length-1)})
                .then(() => {
                    console.log('token updated: ', token.substring(18,token.length-1))
                })
            }
        }
        else {
            console.log('An error occured.','A physical device is required for push notifications.')
        }
        return token
    };
    const sendPushNotification = async (expoPushToken, message) => {
        axios.post(`http://${user.network}:19001/api/send-push-notification`,{expoPushToken:expoPushToken, message:message})
        .then(response => {
            const tickets = [response.data]
            console.log(tickets)
            tickets.filter((item)=>item.pushTickets.status !== 'ok').map((item)=> {
                console.log(item.pushTickets)
                if (item.pushTickets.details.error === 'DeviceNotRegistered') {
                    axios.put(`http://${user.network}:19001/api/cleartoken`, {token:expoPushToken})
                    .then(()=> {
                        console.log("Removed invalid expo token")
                    })
                }
            })
            axios.post(`http://${user.network}:19001/api/get-push-receipts`,{ids:tickets.map((item)=>item.pushTickets.id), expoPushToken:expoPushToken})
            .then(response => {
                const receipts = response.data
                if (Object.keys(receipts.pushReceipts).length > 0) {     // corresponding ticket is found
                    if (receipts.pushReceipts[Object.keys(receipts.pushReceipts)].status === 'error') {
                        axios.put(`http://${user.network}:19001/api/cleartoken`, {token:expoPushToken})
                        .then(()=> {
                            console.log("Removed invalid expo token")
                        })
                    }
                    console.log(receipts.pushReceipts[Object.keys(receipts.pushReceipts)].status, Object.keys(receipts.pushReceipts))
                }
            })
            .catch(error => {
                console.log(error)
            })
            if (response.status === 200) {
                console.log('notification sent successfully.')
            } else {
                console.log('Error: notification unsuccessful.')
            }
        })
        .catch(error => {
            console.log('Error:',error)
        })
    };
    async function schedulePushNotification(date, milestone, id) {       // route this to new CreateMilestone page
        const scheduledNotification = await Notifications.scheduleNotificationAsync({
          content: {
            title: "Milestone",
            body: `${milestone} is set to expire tomorrow! ⏰`,
            data: { route: 'Feed' },                                // attach a key here to fetch from database, then get identifier
          },
          trigger: { 
            date: new Date(date)
         },
        });
        axios.put(`http://${user.network}:19001/api/updatemilestonetoken`, 
        {id:id, token:scheduledNotification})
        .then(()=>{
            console.log('milestone token saved')
        })
        console.log(scheduledNotification)
      }
    async function getScheduledNotifications() {
        try {
            const triggers = await Notifications.getAllScheduledNotificationsAsync()
            console.log(triggers)
        }
        catch (e) {
            console.log(e)
        }
    }
    const cancelScheduledNotification = async (notificationId) => {
        await Notifications.cancelScheduledNotificationAsync(notificationId);
    };      
    const cancelAllScheduled = async() => {
        try {
            await Notifications.cancelAllScheduledNotificationsAsync()
            console.log('scheduled notifications deleted')
        }
        catch (e) {
            console.log('error:', e)
        }

        
    }
    return (
        <pushContext.Provider value = {{
            expoPushToken:expoPushToken, setExpoPushToken:setExpoPushToken,
            pushNotification:pushNotification, setPushNotification:setPushNotification,
            notificationListener:notificationListener, responseListener:responseListener,
            registerForPushNotificationsAsync:registerForPushNotificationsAsync,
            sendPushNotification:sendPushNotification, schedulePushNotification,
            getScheduledNotifications:getScheduledNotifications,
            cancelScheduledNotification:cancelScheduledNotification,
            cancelAllScheduled:cancelAllScheduled
        }}>
          {children}
        </pushContext.Provider>
    )
}
export default PushProvider
