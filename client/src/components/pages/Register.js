import './Register.css'
import React, {useState, useContext} from 'react'
import { LoginContext } from '../../UserContext'
import {motion} from 'framer-motion'
import {Link} from 'react-router-dom'
import Axios from 'axios'

function Register() {
  const clearData = {
    username:'',
    milestones:0,
    blurb:'nothing just yet!',
    date:new Date().toISOString().slice(0, 19).replace('T', ' '),
    password:'passwords',
    friends:0,
    groups:0,
    email:'johnnyappleseed@gmail.com',
    fullname:''
}

  let [formData, setFormData] = useState(clearData)

  function registerAccount (e) {
    console.log(formData)
    Axios.post('http://localhost:3000/register/account', 
    {name:formData.username, milestones:formData.milestones, blurb:formData.blurb, date:formData.date, 
    password:formData.password, friends:formData.friends, groupcount:formData.groups, email:formData.email, fullname:formData.fullname})
    .then(() => {console.log('new user posted')})
  }

  return (
    <motion.div className='container'initial={{width:0}} animate={{width:'100vw'}} exit={{x:window.innerWidth, transition:{duration:.25}}}>
    <div className="register-page-contents flex-col-hstart-vstart clip-contents">
    <div className="password flex-col">
    <Link className='back-link' to='/'>
      <img
        src="https://firebasestorage.googleapis.com/v0/b/unify-bc2ad.appspot.com/o/vz2epq3egce-91%3A2?alt=media&token=c63341be-ac75-4f56-b8e2-e65659e881e6"
        alt="Not Found"
        className="back-arrow"
      />
      </Link>
      <div className='register-contents'>
      <p className="top-text">Create an account</p>
      <div className="register-container flex-col">
        <div className="sign-up-credentials flex-col-hend-vstart">
          <div className="full-name flex-col">
            <p className="user-input">Full name</p>
            <div className="name-input-wrapper flex-row">
              <input className="name-input flex-hcenter"
                  placeholder="Type your name here"
                  type='text' name='username' id='username' 
                  onChange={(event)=>{setFormData({...formData, username:event.target.value, fullname:event.target.value})}}>     
            
                </input>
              <img
                src="https://firebasestorage.googleapis.com/v0/b/unify-bc2ad.appspot.com/o/vz2epq3egce-86%3A68?alt=media&token=cc69b697-d5e5-462b-bb84-a60156bf0f31"
                alt="Not Found"
                className="name-logo"
              />
            </div>
          </div>
          <div className="full-name flex-col">
            <p className="user-input">Email Address</p>
            <div className="email-input-wrapper flex-row">
              <input className="email-input flex-hcenter" placeholder='Johnny Appleseed'
                type='text' name='email' id ='email'
                onChange={(event)=>{setFormData({...formData, email:event.target.value})}}

                ></input>
              <img
                src="https://firebasestorage.googleapis.com/v0/b/unify-bc2ad.appspot.com/o/vz2epq3egce-86%3A66?alt=media&token=ebb2e6d9-e7b8-4572-9fcd-719001b66abc"
                alt="Not Found"
                className="email-at-icon"
              />
            </div>
          </div>
          <div className="password flex-col">
            <p className="user-input">Password</p>
            <div className="pass-input-wrapper flex-row">
              <input className="pass-input flex-hcenter" placeholder='*************' 
                type='text' name='pass' id ='pass'
                onChange={(event)=>{setFormData({...formData, password:event.target.value})}}
                ></input>
              <img
                src="https://firebasestorage.googleapis.com/v0/b/unify-bc2ad.appspot.com/o/vz2epq3egce-86%3A67?alt=media&token=30705dbf-6af7-4939-96a1-8686a086c588"
                alt="Not Found"
                className="vector-1"
              />
            </div>
          </div>
        </div>
        <div className="remember-my-account-box flex-row">
          <div className="remember-checkbox" />
          <p className="remember-account">remember my account</p>
        </div>
        <Link to='/newfeed' className='return-link'>
        <button className="button-for-create" type='submit' onClick={registerAccount}>
          <p className="create-account-text">Create an account</p>
        </button>
        </Link>
      </div>
      <p className="switch-login-text">
        already have an account? <Link to='/login' className='switch-login-link'>log in</Link>
      </p>
    </div>
    </div>
  </div>
  </motion.div>

  )
}

export default Register;