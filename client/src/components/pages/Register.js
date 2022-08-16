import './Register.css'
import React from 'react'
import {motion} from 'framer-motion'
import {Link} from 'react-router-dom'

function Register() {
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
              <input className="name-input flex-hcenter" placeholder='Type your name here'></input>
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
              <input className="email-input flex-hcenter" placeholder='Johnny Appleseed'></input>
              <img
                src="https://firebasestorage.googleapis.com/v0/b/unify-bc2ad.appspot.com/o/vz2epq3egce-86%3A66?alt=media&token=ebb2e6d9-e7b8-4572-9fcd-719001b66abc"
                alt="Not Found"
                className="vector"
              />
            </div>
          </div>
          <div className="password flex-col">
            <p className="user-input">Password</p>
            <div className="pass-input-wrapper flex-row">
              <input className="pass-input flex-hcenter" placeholder='*************'></input>
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
        <Link to='/' className='return-link'>
        <div className="button-for-create">
          <p className="create-account-text">Create an account</p>
        </div>
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