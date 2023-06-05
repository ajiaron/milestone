import React, {useState, useRef, useContext} from "react";
import pushContext from './pushContext'
import * as Device from 'expo-device'
import * as Notifications from 'expo-notifications';
import axios from "axios";
import userContext from "./userContext";

const PushProvider = ({children}) => {
    const user = useContext(userContext)
    const [expoPushToken, setExpoPushToken] = useState('');
    const [pushNotification, setPushNotification] = useState(false);
    const notificationListener = useRef();
    const responseListener = useRef();
      
    const registerForPushNotificationsAsync = async () => {
        let token;
        if (Device.isDevice) {
            const { status: existingStatus } = await Notifications.getPermissionsAsync();
            let finalStatus = existingStatus;

            if (existingStatus !== 'granted') {
                const { status } = await Notifications.requestPermissionsAsync();
                finalStatus = status;
            }
            if (finalStatus !== 'granted') {
                Alert.alert('An error occured.','Permission to send push notifications denied.');
                return;
            }
            // Save the token to backend server for later use
            token = (await Notifications.getExpoPushTokenAsync({projectId:"b1f4661a-752e-4c66-b266-dadb2d4c2214"})).data;
            axios.put(`http://${user.network}:19001/api/updatetoken`, 
            {id:user.userId, token:token.substring(18,token.length-1)})
       //   .then(() => {
       //       console.log('token updated: ', token.substring(18,token.length-1))
       //   })
        }
        else {
            console.log('An error occured.','A physical device is required for push notifications.')
        }
        return token
    };
    const sendPushNotification = async (expoPushToken, message) => {
        axios.post(`http://${user.network}:19001/api/send-push-notification`,{expoPushToken:expoPushToken, message:message})
        .then(response => {
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
