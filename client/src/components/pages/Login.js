import React, { useState, useContext } from 'react'
import { LoginContext } from '../../UserContext'
import './Login.css'
import {Link} from 'react-router-dom'
import Axios from 'axios'
import { motion } from 'framer-motion'
import { useAuth0 } from '@auth0/auth0-react'

function Login() {
    const {loginWithRedirect, logout, user, isLoading} = useAuth0()
    const [password, setPassword] = useState('')
    const [checked, setChecked] = useState(false)
    const {username, setUsername,userId, setUserId, userData, setUserData, clearData} = useContext(LoginContext)
    const [serverState, setServerState] = useState(false)

    const getUsers = () => {    /* gets data when server is running */
      setUserData(clearData)
      Axios.get('http://localhost:3000/login/account')
      .then((response)=> {
        setUserId(response.data.find(e => e.email === (user?user.email:username+'@gmail.com')).id)
        setUserData(response.data.find(e => e.email === (user?user.email:username+'@gmail.com')))
        setServerState(true)
      })
    }

    function handleLogin() {
      getUsers()
      if (!isLoading && !user) {
        loginWithRedirect()
      } 
      if (userData.src !== user.picture) {
        Axios.put('http://localhost:3000/login/updateuser', 
      {id:userId, fullname:user.name, src:(user.picture)})
      .then(console.log('user info updated'))
      } else {
        console.log('user info up to date')
      }
      setUserData({...userData, id:userId, name: user.nickname, email:user.email, fullname:user.name, password:password})
    }
    function handleLogout() {
      if (!isLoading && user) {
        logout()
      }
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
                  <p className="txt-332">Username</p>
                  <div className="group-875 flex-row">
                    <input className={user?"username-input-logged flex-hcenter":"username-input flex-hcenter"}
                    placeholder={user?user.nickname:"Type your name here"}
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
                    <input className={user?"userpass-input-logged":"userpass-input flex-hcenter"} 
                    placeholder='&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;'
                    type='password' name='pass' id ='pass' 
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
              <div className='login-button-container'>

           
              <Link to={user?'/newfeed':'#'} className='login-feed-link'>
              <button className="btn--login" onClick={handleLogin}>
                <p className="btn--text">Login</p>
              </button>
              </Link>
              {user?         
              <Link to={'#'} className='login-feed-link'>
               <button className="btn--logout" onClick={handleLogout}>
               <p className="btn--text">Logout</p>
             </button>
             </Link> 
              :""}
            </div>
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