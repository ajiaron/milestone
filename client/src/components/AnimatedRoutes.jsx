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
import CreateMilestone from './pages/CreateMilestone';
import Friends from './pages/Friends'
import CreatePost from './pages/CreatePost';
import {LoginContext} from '../UserContext'


function AnimatedRoutes() {
    const location = useLocation();
    const [username, setUsername] = useState('testguy')
    const [userId, setUserId] = useState(0)
    const clearData = {
      name:'testguy',
      milestones:0,
      blurb:"i'm about testing apps and running laps >:)",
      date:new Date().toISOString().slice(0, 19).replace('T', ' '),
      password:'passwords',
      friends:0,
      groups:0,
      email:'johnnyappleseed@gmail.com',
      fullname:'Testley Guyverson'
  }
  const [userData, setUserData] = useState(clearData)    
  return (
    <AnimatePresence>
    <LoginContext.Provider value={{username, setUsername, userId, setUserId, userData, setUserData, clearData}}>
    <Routes location={location} key={location.pathname}>
    <Route exact path='/' element={<Newlanding />} />
    <Route path='/login' element={<Login />} />
    <Route path='/register' element={<Register />} />
    <Route path='/posts/:id' element={<Posts/>}/>
    <Route path='/newfeed' element={<Newfeed />}/>
    <Route path='/profile/:name' element={<Profile />}/>
    <Route path='/actionbar' element={<ActionBar/>}/>
    <Route path='/commentbox' element={<Commentbox/>}/>
    <Route path='/createpost' element={<CreatePost/>}/>
    <Route path='/createmilestone' element={<CreateMilestone/>}/>
    <Route path='/friends' element={<Friends/>}/>
    <Route element={<Loading/>} />
    </Routes>
    </LoginContext.Provider>
    </AnimatePresence>
  )
}

export default AnimatedRoutes