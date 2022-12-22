import React, {useState, useEffect, useCallback, useContext} from 'react'
import { Link, useParams } from 'react-router-dom'
import Navbar from '../Navbar'
import Footer from '../Footer'
import {motion} from 'framer-motion'
import './Profile.css'
import {LoginContext} from  '../../UserContext'
import Axios from 'axios'
import Milestones from '../interactions/Milestones'
import Grouptag from '../interactions/Grouptag'
import { useAuth0 } from '@auth0/auth0-react'


function Profile() {
  const {user} = useAuth0()
  let {name} = useParams()
  let [groupData, setGroupData]  = useState([]) // for server
  const [members, setMembers] = useState([])      // for server
  let [milestones, setMilestones] = useState([])
  const {username, userData} = useContext(LoginContext) 
  let [groups, setGroups] = useState([])
  const [server, setServer] = useState(false)
  const showmilestones = `http://localhost:3000/profile/${user?user.nickname:name}/showmilestones`
  const showgroups = `http://localhost:3000/profile/${user?user.nickname:name}/showgroups`
  const showmembers = `http://localhost:3000/profile/${user?user.nickname:name}/showmembers`
  const [self, setSelf] = useState(false)
  const [requested, setRequested] = useState(false)
  const [isFriend, setIsFriend] = useState(false)
  let [limit, setLimit] = useState(`/profile/${(user&&self)?user.nickname:name}`)
  

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
  function requestFriend() {
    setRequested(!requested)
  }
  
  useEffect(()=> {
    if (userData.name === name) {
      setSelf(true)
    } else {
      setSelf(false)
    }
  }, [userData.name, name])

  useEffect(() => {
    Axios.get(showmilestones)
    .then((response)=> {
      setMilestones(response.data)
      console.log('fetched milestones from server')
      setServer(true)
    })
    if (!server){
      fetchGroups()
      fetchStones()
  }
}, [fetchStones, fetchGroups, showmilestones])

  useEffect(()=> {
    Axios.get(showgroups)
    .then((response)=> {
      setGroupData(response.data)
      console.log('fetched groups from server')
    })
  }, [showgroups, server])


  useEffect(()=> {
    Axios.get(showmembers)
    .then((response)=> {
      setMembers(response.data)
      console.log('fetched group members from server')
    })
  }, [showmembers])

  
  

  return (
    <motion.div className='postitem' initial={{width:0}} animate={{width:'100vw'}} exit={{x:window.innerWidth, transition:{duration:.3}}}>
      <div className='profile-page'>
      <Navbar title={`${(user && self)?'My Profile':(name)?name:'Profile'}`}/>
      <div className="profile-container flex-col-hcenter">
        <div className="profile-stats flex-col">
          <div className="profile-page-header flex-row">
            <img
              src={`${(user && self)?user.picture:'https://firebasestorage.googleapis.com/v0/b/unify-bc2ad.appspot.com/o/h1b9t5cw8uj-152%3A3?alt=media&token=00d30aad-2cb8-45e6-805a-380273c20a6e'}`}
              alt="profilepicture"
              className="profile-main-pic"
            />
            <div className="profile-user-wrapper flex-col">
              <p className="profile-handle">@{(user && self)?userData.name:(name)?name:'testguy'}</p>
              <p className="profile-fullname">{(user && self)?userData.fullname:(name)?'Full Name':'Testley Guyverson'}</p>
              <p className="profile-blurb">{(userData)? userData.blurb:'gym, running, and coding.'}</p>
            </div>
            {(user && self)?
            <div className='settings-wrapper'>
            <Link to={'/settings'} className='settings-link'>
              <img
                src="https://firebasestorage.googleapis.com/v0/b/unify-bc2ad.appspot.com/o/h1b9t5cw8uj-153%3A16?alt=media&token=207b8217-0873-4d5a-81e6-2f7a3fcf9e9b"
                alt="Not Found"
                className="settings-logo"
              />
              <div className='settings-notification-icon'/>
            </Link>
            </div>:
            <button className={(requested)?'request-button-toggled':'request-button'} onClick={requestFriend}>
              <p className={(requested)?"request-button-text-toggled":"request-button-text"}>{(requested)?'Requested':'Request'}</p>
            </button>
            }
          </div>
          <div className="milestone-container flex-col">
            <p className="profile-milestone-name">{(user && self)?user.name:(name)?'Full Name':'Testley Guyverson'}</p>
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
          <div className='milestone-text-wrapper'>
          <p className="text-header-milestones">Personal Milestones</p>
          <Link to={`/${(user&&self)?user.nickname:(name)?name:'testguy'}/milestonelist`} className='milestone-list-link'>
          <p className='milestone-list-expand'>+{milestones.length - 1} more</p>
          </Link>
          </div>
          <ul className='personal-milestone-list'>
            {milestones.map(stone => (
               <Milestones key={stone.idmilestones} myKey={stone.idmilestones} title={stone.title} entries={stone.entries} streak={stone.streak} src={stone.src} from={limit} milestoneList={[]} expand={false}/>
            ))}
             </ul>
          <p className="text-header-groups">Groups</p>
          <ul className='milestone-group-list'>
            {server?
             groupData.map(data=> (
              <Grouptag key={data.idgroups} title={data.groupname} 
               members={members.filter(e=>e.idgroups === data.idgroups).map((item) => item.membername)}
               membercount={data.membercount} image={data.src} name={name} server={server}/>
            )) 
            : groups.map(group=> (
              <Grouptag key={group.id} title={group.title} 
               members={group.members} membercount={group.membercount} image={group.image} name={name} server={server}/>
            ))
            }
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