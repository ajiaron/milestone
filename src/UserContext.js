import React, { useState, createContext } from 'react'
import {App} from './App'
import AnimatedRoutes from './components/AnimatedRoutes';

export const LoginContext = createContext();

function UserContext() {
    const [user, setUser] = useState('testguy')
    console.log(user)
    return (
        <>
        <LoginContext.Provider value={user}>
            <AnimatedRoutes/>
        </LoginContext.Provider>
        </>
    );
}
export default UserContext;