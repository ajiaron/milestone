import React, { useState, createContext } from 'react'
import {App} from './App'
import AnimatedRoutes from './components/AnimatedRoutes';

export const LoginContext = createContext();

function UserContext() {

    return (
        <>
        <LoginContext.Provider >
            <AnimatedRoutes/>
        </LoginContext.Provider>
        </>
    );
}
export default UserContext;