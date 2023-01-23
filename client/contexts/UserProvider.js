import React, {useState} from "react";
import userContext from './userContext'

const UserProvider = ({children}) => {
    const [username, setUsername] = useState("")
    const [userId, setUserId] = useState(0)
    const [image, setImage] = useState("defaultpic")

    return (
        <userContext.Provider value = {{username:username, 
        setUsername:setUsername, userId:userId, 
        setUserId:setUserId, image:image, setImage:setImage}}>
          {children}
        </userContext.Provider>
    )
}
export default UserProvider