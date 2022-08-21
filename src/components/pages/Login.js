import React, { useState, useContext } from 'react'
import { LoginContext } from '../../UserContext'
import './Login.css'
import {Link} from 'react-router-dom'
import { motion } from 'framer-motion'

function Login() {
    const [password, setPassword] = useState('')
    const [checked, setChecked] = useState(false)
    const {username, setUsername} = useContext(LoginContext)
  
    function handleClick() {
      console.log(username)
      /* handle authentication here; checks when clicking submit-button */
    }

    return (
      <>
      <motion.div className='login-container' initial={{width:0}} animate={{width:'100vw'}} exit={{x:window.innerWidth, transition:{duration:.3}}}>
        <div className="login-page-content flex-col-hstart-vstart clip-contents">
          <div className="password flex-col">
            <Link className='return-link' to='/'>
            <img
              src="https://firebasestorage.googleapis.com/v0/b/unify-bc2ad.appspot.com/o/j2pfzeam6qs-91%3A4?alt=media&token=946b8e0b-e09c-4e87-80bd-54b48926b2d0"
              alt="Not Found"
              className="back-arrow"
            />
            </Link>
            <div className='login-contents'>
            <p className="txt-322">Login</p>
            <div className="group-995 flex-col">
              <div className="sign-up-credentials flex-col-hend-vstart">
                <div className="full-name flex-col">
                  <p className="txt-332">Full name</p>
                  <div className="group-875 flex-row">
                    <input className="username-input flex-hcenter"
                    placeholder="Type your name here"
                    type='text' name='username' id='username' 
                    onChange={(event)=>{setUsername(event.target.value)}}
                    >
                    </input>
                    <img
                      src="https://firebasestorage.googleapis.com/v0/b/unify-bc2ad.appspot.com/o/j2pfzeam6qs-87%3A13?alt=media&token=318639b8-9762-4dab-8dcb-49c9c6faf9db"
                      alt="Not Found"
                      className="name-logo"
                    />
                  </div>
                </div>
                <div className="password flex-col">
                  <p className="txt-332">Password</p>
                  <div className="group-433 flex-row">
                    {/* type = {hidden ? 'text':'password'} */}
                    <input className="userpass-input flex-hcenter" placeholder='*************' 
                    type='text' name='pass' id ='pass'
                    onChange={(event)=> setPassword(event.target.value)}
                    ></input>
                    <img
                      src="https://firebasestorage.googleapis.com/v0/b/unify-bc2ad.appspot.com/o/j2pfzeam6qs-87%3A23?alt=media&token=1d5cfc98-a8f9-4da6-9d34-b5eb61a9dff4"
                      alt="Not Found"
                      className="email-at-icon"
                    />
                  </div>
                </div>
              </div>
              <div className="remember-my-account-box flex-row">
                <input className="pass-checkbox" type='checkbox' onChange={()=>setChecked(!checked)} checked={checked}/>
                <p className="txt-754">remember my account</p>
              </div>
              <Link to='/newfeed' className='login-feed-link'>
              <button className="btn--login" onClick={handleClick}>
                <p className="txt-1109">Login</p>
              </button>
              </Link>
            </div>
            <p className="txt-890">
              don’t have an account? 
              <Link className="swtich-register-link" to='/register'> create an account </Link>
            </p>
            </div>
          </div>
        </div>
        </motion.div>
      </>
    )
}

export default Login