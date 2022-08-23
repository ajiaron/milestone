import React, {useState, useEffect, useCallback, useContext} from 'react'
import { useParams } from 'react-router-dom'
import Navbar from '../Navbar'
import Footer from '../Footer'
import {motion} from 'framer-motion'
import './Profile.css'
import {LoginContext} from  '../../UserContext'
import Axios from 'axios'
import Milestones from '../interactions/Milestones'
import Grouptag from '../interactions/Grouptag'


function Profile() {
  let [milestones, setMilestones] = useState([])
  const {username, userData} = useContext(LoginContext) 
  let [groups, setGroups] = useState([])
  let [limit, setLimit] = useState(true)
  const fetchStones = useCallback(()=> {
    fetch('../sample.json', {
      method:'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
     }
    })
    .then(response => response.json())
    .then(data => {
      setMilestones(data)
    }) 
  }, [])
  const fetchGroups = useCallback(()=> {
    fetch('../testgroups.json', {
      method:'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
     }
    })
    .then(response => response.json())
    .then(data => {
      setGroups(data)
    }) 
  }, [])
  useEffect(() => {
    fetchStones()
    fetchGroups()
  }, [fetchStones, fetchGroups])

  return (
    <motion.div className='postitem' initial={{width:0}} animate={{width:'100vw'}} exit={{x:window.innerWidth, transition:{duration:.3}}}>
      <div className='profile-page'>
      <Navbar title='My Profile'/>
      <div className="profile-container flex-col-hcenter">
        <div className="profile-stats flex-col">
          <div className="profile-page-header flex-row">
            <img
              src="https://firebasestorage.googleapis.com/v0/b/unify-bc2ad.appspot.com/o/h1b9t5cw8uj-152%3A3?alt=media&token=00d30aad-2cb8-45e6-805a-380273c20a6e"
              alt="profilepicture"
              className="profile-main-pic"
            />
            <div className="profile-user-wrapper flex-col">
              <p className="profile-handle">@{userData?username:'testguy'}</p>
              <p className="profile-fullname">{userData?userData.fullname:'Testley Guyverson'}</p>
              <p className="profile-blurb">{userData? userData.blurb:'gym, running, and coding.'}</p>
            </div>
            <div className='settings-wrapper'>
            <img
              src="https://firebasestorage.googleapis.com/v0/b/unify-bc2ad.appspot.com/o/h1b9t5cw8uj-153%3A16?alt=media&token=207b8217-0873-4d5a-81e6-2f7a3fcf9e9b"
              alt="Not Found"
              className="settings-logo"
            />
            <div className='settings-notification-icon'/>
            </div>
          </div>
          <div className="milestone-container flex-col">
            <p className="profile-milestone-name">{userData?userData.fullname:'Testley Guyverson'}</p>
            <div className="profile-milestone-insights flex-col-hend">
              <div className="milestone-insights-headers flex-row-vstart-hstart">
                <p className="milestone-insights-text">MILESTONES</p>
                <p className="milestone-insights-text">GROUPS</p>
                <p className="milestone-insights-friends">FRIENDS</p>
              </div>
              <div className="profile-socials flex-row">
                <p className="personal-milestone-count">4</p>
                <p className="personal-group-count">3</p>
                <p className="personal-friends-count">13</p>
              </div>
            </div>
          </div>
          <p className="text-header-milestones">Personal Milestones</p>
          <ul className='personal-milestone-list'>
            {milestones.map(stone => (
               <Milestones key={stone.id} title={stone.title} entries={stone.entries} streak={stone.streak} src={stone.src} from={limit}/>
            ))}
             </ul>
          <p className="text-header-groups">Groups</p>
          <ul className='milestone-group-list'>
            {groups.map(group=> (
               <Grouptag key={group.id} title={group.title} members={group.members} membercount={group.membercount} image={group.image}/>
            ))}
          </ul>
        </div>
      </div>
      <div className='bottom-space'> {' '} </div>
        <div className='post-footer'> 
       
        <Footer logged={true}/> 
        </div>
      </div>
      </motion.div>
  )
}

export default Profile