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
import EditPost from './pages/EditPost';
import MilestonePage from './pages/MilestonePage';
import Iconmenu from './pages/Iconmenu';
import MilestoneList from './pages/MilestoneList';
import Settings from './pages/Settings';
import {LoginContext} from '../UserContext'
import AuthProvider from '../AuthProvider'

function AnimatedRoutes() {
    const location = useLocation();
    const [username, setUsername] = useState('testguy')
    const [userId, setUserId] = useState(0)
    const clearData = {
      id: userId,
      name:'testguy',
      milestones:0,
      blurb:"i'm about testing apps and running laps >:)",
      date:new Date().toISOString().slice(0, 19).replace('T', ' '),
      password:'password',
      friends:0,
      groups:0,
      email:'johnnyappleseed@gmail.com',
      fullname:'Testley Guyverson',
      public:1
  }
  const [userData, setUserData] = useState(clearData)    
  return (

    <AnimatePresence>
    <LoginContext.Provider value={{username, setUsername, userId, setUserId, userData, setUserData, clearData}}>
    <AuthProvider>
    <Routes location={location} key={location.pathname}>
    <Route exact path='/' element={<Newlanding />} />
    <Route path='/login' element={<Login />} />
    <Route path='/register' element={<Register />} />
    <Route path='/posts/:id' element={<Posts/>}/>
    <Route path='/newfeed' element={<Newfeed />}/>
    <Route path='/profile/:name' element={<Profile />}/>
    <Route path='/:name/milestonelist' element={<MilestoneList />}/>
    <Route path='/actionbar' element={<ActionBar/>}/>
    <Route path='/commentbox' element={<Commentbox/>}/>
    <Route path='/createpost' element={<CreatePost/>}/>
    <Route path='/editpost/:postid' element={<EditPost/>}/>
    <Route path='/milestone/:milestoneid' element={<MilestonePage/>}/>
    <Route path='/createmilestone' element={<CreateMilestone/>}/>
    <Route path='/friends' element={<Friends/>}/>
    <Route path='/icons' element={<Iconmenu/>}/>
    <Route path='/settings' element={<Settings/>}/>
    <Route element={<Loading/>} />
    </Routes>
    </AuthProvider>
    </LoginContext.Provider>
    </AnimatePresence>
   
  )
}

export default AnimatedRoutes