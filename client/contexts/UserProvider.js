import React, {useState} from "react";
import userContext from './userContext'

const UserProvider = ({children}) => {
    const [username, setUsername] = useState("")
    const [userId, setUserId] = useState(0)
    const [image, setImage] = useState()
    const [fullname, setFullname] = useState('Johnny Appleseed')
    const [network, setNetwork] = useState()
    const [isExpo, setIsExpo] = useState()
    const [quality, setQuality] = useState(false)
    const [logged, setLogged] = useState(false)

    return (
        <userContext.Provider value = {{username:username, 
        setUsername:setUsername, userId:userId, 
        setUserId:setUserId, image:image, setImage:setImage,
        fullname:fullname, setFullname:setFullname,
        network:network, setNetwork:setNetwork,
        isExpo:isExpo, setIsExpo:setIsExpo,
        quality:quality, setQuality:setQuality,
        logged:logged, setLogged:setLogged
        }}>
          {children}
        </userContext.Provider>
    )
}
export default UserProvider
