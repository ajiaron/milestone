import React, {useState} from "react";
import userContext from './userContext'

const UserProvider = ({children}) => {
    const [username, setUsername] = useState("")
    return (
        <userContext.Provider value = {{username:username, setUsername:setUsername}}>
          {children}
        </userContext.Provider>
    )
}
export default UserProvider