import React, {useState, useContext} from 'react'
import { Routes, Route, useLocation } from "react-router-dom";
import Post from './pages/Post'
import Posts from './pages/Posts'
import Newfeed from './pages/Newfeed'
import {AnimatePresence } from 'framer-motion'
import Loading from './pages/Loading'
import Newlanding from './Newlanding'
import Login from './pages/Login'
import Register from './pages/Register'
import Profile from './pages/Profile'
import ActionBar from './tests/ActionBar'
import Commentbox from './tests/Commentbox'
import {LoginContext} from '../UserContext'


function AnimatedRoutes() {
    const location = useLocation();
    const [username, setUsername] = useState('testguy')
    
  return (
    <AnimatePresence>
    <LoginContext.Provider value={{username, setUsername}}>
    <Routes location={location} key={location.pathname}>
    <Route exact path='/' element={<Newlanding />} />
    <Route path='/login' element={<Login />} />
    <Route path='/register' element={<Register />} />
    <Route path='/posts/:id' element={<Posts/>}/>
    <Route path='/newfeed' element={<Newfeed />}/>
    <Route path='/profile/:name' element={<Profile />}/>
    <Route path='/actionbar' element={<ActionBar/>}/>
    <Route path='/commentbox' element={<Commentbox/>}/>
    <Route element={<Loading/>} />
    </Routes>
    </LoginContext.Provider>
    </AnimatePresence>
  )
}

export default AnimatedRoutes