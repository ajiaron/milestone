import './Settings.css'
import Navbar from '../Navbar'
import Footer from '../Footer'
import React, { useState, useEffect, useContext, useRef } from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import { Link } from 'react-router-dom'
import { LoginContext } from '../../UserContext'
import Axios from 'axios'
import { motion } from 'framer-motion'
import {MdInsertLink} from 'react-icons/md'
import Iconmenu from './Iconmenu'
import NewToggleSwitch from '../interactions/NewToggleSwitch'

function Settings() {
  const {user} = useAuth0()
  const {userData, setUserData} = useContext(LoginContext)
  const [newUsername, setNewUsername] = useState((user)?userData.name:'')
  const [newFullname, setNewFullname] = useState((user)?userData.fullname:'')
  const [newDescription, setNewDescription] = useState((user)?userData.blurb:'Gym, running, and coding.')
  const [newEmail, setNewEmail] = useState((user)?user.email:'')
  const [newsrc, setNewsrc] = useState('https://firebasestorage.googleapis.com/v0/b/unify-bc2ad.appspot.com/o/dyozelg1xtu-153%3A115?alt=media&token=7c1ba9f6-1b0a-45cf-9aff-fa8854d671b8')
  const [isPublic, setIsPublic] = useState((userData.public))

  const userDetails = {
    username:(user?user.nickname:'testguy'),
    fullname:(user?user.name:'Johnny Appleseed'),
    description:'Gym, running, and coding.',
    email:(user?user.email:'johnnyappleseed@gmail.com'),
    src: 'https://firebasestorage.googleapis.com/v0/b/unify-bc2ad.appspot.com/o/dyozelg1xtu-153%3A115?alt=media&token=7c1ba9f6-1b0a-45cf-9aff-fa8854d671b8',
    public:isPublic
  }
  function handleClick() {
    Axios.put('http://localhost:3000/settings/updateinfo', 
    {id:userData.id, username:newUsername, description:newDescription, email:newEmail, fullname:newFullname, src:(user.picture), isPublic:(isPublic?1:0)})
    .then(console.log('user info updated'))
    setUserData({...userData, name:newUsername, blurb:newDescription, email:newEmail, fullname:newFullname, src:user.picture, public:(isPublic?1:0)})
  }
  return (
    <motion.div className='container'initial={{width:0}} animate={{width:'100vw'}} exit={{x:window.innerWidth, transition:{duration:.25}}}>
    <div className='settings-page-content'>
    <Navbar title='Settings' from={user?`/profile/${userData.name}`:`/profile/testguy`}/>
    <div className='profile-wrapper'>
      <img
        src={user?user.picture:`https://firebasestorage.googleapis.com/v0/b/unify-bc2ad.appspot.com/o/dyozelg1xtu-153%3A115?alt=media&token=7c1ba9f6-1b0a-45cf-9aff-fa8854d671b8`}
        alt="profilepic"
        className="profile-settings-pic"
       />
      <p className="edit-image-text">Change Profile Picture</p>
    </div>
    <div className='user-settings-wrapper'>

    <div className='username-settings-wrapper'>
      <p className="user-settings-header">USERNAME</p>
      <div className="username-settings-input"> {/* input tag here */}
        <input className="username-settings-context" placeholder={`${(user)?userData.name:'testguy'}`} onChange={e=>setNewUsername(e.target.value)}/>
      </div>
      <p className="user-settings-header">NAME</p>
      <div className="username-settings-input"> {/* input tag here */}
        <input className="username-settings-context" placeholder={`${(user)?user.name:'Johnny Appleseed'}`} onChange={e=>setNewFullname(e.target.value)}/>
      </div>
      <p className="description-settings-header">DESCRIPTION</p>
      <div className="username-settings-input"> {/* input tag here */}
        <input className="username-settings-context" placeholder={`${userData.blurb}`} onChange={e=>setNewDescription(e.target.value)}/>
      </div>
      <p className="description-settings-header">EMAIL ADDRESS</p>
      <div className="username-settings-input"> {/* input tag here */}
        <input className="username-settings-context" placeholder={`${(user)?user.email:'johnnyappleseed@gmail.com'}`} onChange={e=>setNewEmail(e.target.value)}/>
      </div>

      <div className="public-switch-wrapper">
              <p className="public-settings-header">PUBLIC ACCOUNT</p>
              <NewToggleSwitch label={"Public"} onToggleSwitch={toggle=>setIsPublic(toggle)} isPublic={isPublic}/>
        </div>
      <Link to='#' className='reset-password-link'>
            <button className="reset-password-button" onClick={handleClick}>
                <div className='reset-password-container'>
              <p className="reset-password-text">Reset Password</p>
              </div>
            </button>
        </Link>
        <div className='profile-link-wrapper'>
        <MdInsertLink className='link-profile-icon'/>
        <Link to={`/profile/${(user)?userData.name:'testguy'}`} className='user-settings-link'>
            <p className='profile-link-text'>{`milestone.com/${(user)?userData.name:'testguy'}`}</p>
        </Link>
        </div>
    </div>
    </div>
    <Footer logged={true} />
    </div>
    </motion.div>
  )
}

export default Settings