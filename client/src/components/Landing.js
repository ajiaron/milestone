import React, {useState, useEffect} from "react"
import {Link} from 'react-router-dom'
import "./Landing.css"
import Loading from './pages/Loading'
import {motion} from 'framer-motion'

export default function Landing() {

  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setTimeout(() => setLoading(false),2000)
  }, [])
  return (
    
    <motion.div className='container'initial={{width:0}} animate={{width:'100vw'}} exit={{x:window.innerWidth, transition:{duration:.25}}}>
    {loading === false ? (
    <div className='main-content'>
    <div className="login-page-main flex-col-hstart-vstart clip-contents">
      <div className='landing-header'>   
      <img
        src="https://firebasestorage.googleapis.com/v0/b/unify-bc2ad.appspot.com/o/xqw4zn3iax-18%3A222?alt=media&token=d5d2e48b-e93c-416e-aa4e-3f0397e3e51f"
        alt="Not Found"
        className="background-vector-top"
      />
      </div>
     <div className='title-header'>
      <p className="title-text">milestone</p>
      </div>
      <div className='main-content-container'>
      <div className="main-page-elements flex-col-hcenter">
        <div className="logo-wrapper">
        <Link to='/Newlanding' className='new-landing'>
          <img
            src="https://firebasestorage.googleapis.com/v0/b/unify-bc2ad.appspot.com/o/xqw4zn3iax-21%3A59?alt=media&token=c7140599-2ea0-464b-abb7-43170116827b"
            alt="Not Found"
            className="vector"
          />
          </Link>
        </div>
        <p className="txt-61010">Welcome!</p>
        <p className="txt-1025 flex-hcenter">
          Just fill out some stuff for us real quick and we’ll get you on your
          way! Welcome to the milestone community &#60;3
        </p>
        <div className="register-container">
          <img
            src="https://firebasestorage.googleapis.com/v0/b/unify-bc2ad.appspot.com/o/xqw4zn3iax-18%3A240?alt=media&token=af4339b7-38d1-48f8-96b7-44805799200a"
            alt="Not Found"
            className="name-logo"
          />
          <img
            src="https://firebasestorage.googleapis.com/v0/b/unify-bc2ad.appspot.com/o/xqw4zn3iax-18%3A237?alt=media&token=bad49cee-dea2-4979-84b2-f2d44e291496"
            alt="Not Found"
            className="vector-3"
          />
          <img
            src="https://firebasestorage.googleapis.com/v0/b/unify-bc2ad.appspot.com/o/xqw4zn3iax-18%3A230?alt=media&token=e7db48ca-4479-43be-8753-c7b690421c4e"
            alt="Not Found"
            className="vector-4"
          />
          <div className="sign-up-credentials flex-col-hend-vstart">
            <div className="group-2 flex-col">
              <p className="txt-627">Full name</p>
              <div className="name-input">
                <input type='text' placeholder='Type your name here'className="user-fullname flex-hcenter"></input>
              </div>
            </div>
            <div className="group-2 flex-col">
              <p className="txt-627">Email Address</p>
              <div className="email-input">
                <input type='text' placeholder='Johnny Appleseed' className="user-email flex-hcenter"></input>
              </div>
            </div>
            <div className="group-3 flex-col">
              <p className="txt-627">Password</p>
              <div className="pass-input">
                <input type='text' className="user-pass flex-hcenter" placeholder='*************'></input>  
                {/* type={ (show) ? 'text':'password' } */}
              </div>
            </div>
          </div>
          <div className="sign-up flex-col">
            <div className="group-987 flex-row">
              <div className="rectangle-19" />
              <p className="txt-616">remember my account</p>
            </div>
            <Link className="btn-signup" to='/NewLandingPage'>
              <p className="txt-974">sign up</p>
            </Link>
          </div>
        </div>
      
    
        <div className='middle-wrapper'>
        <p className="middle-text flex-hcenter">already have an account?</p>
        </div>
        <div className="login-container flex-col">
          <p className="login-info">Email Address</p>
          <div className="group-7103 flex-row">
            <input type='text' className="login-input-email flex-hcenter" placeholder='Johnny Appleseed'></input>
            <img
              src="https://firebasestorage.googleapis.com/v0/b/unify-bc2ad.appspot.com/o/xqw4zn3iax-18%3A248?alt=media&token=b83304b6-73f5-49b7-a66c-7e138cdce92a"
              alt="Not Found"
              className="vector-5"
            />
          </div>
          <p className="login-info">Password</p>
          <div className="login-pass-wrapper flex-row">
            <input type='text' className="login-input-pass flex-hcenter" placeholder='*************'></input>
            <img
              src="https://firebasestorage.googleapis.com/v0/b/unify-bc2ad.appspot.com/o/xqw4zn3iax-18%3A252?alt=media&token=c2c83e18-aeb8-4c39-a9bf-fbc851fa6b3a"
              alt="Not Found"
              className="lock-logo"
            />
          </div>
          <Link className="btn-login" to='/newfeed'>
            <p className="txt-974">login</p>
          </Link>
        </div>
      </div>
      </div>

      <div className='landing-footer'>
      <img
        src="https://firebasestorage.googleapis.com/v0/b/unify-bc2ad.appspot.com/o/xqw4zn3iax-18%3A225?alt=media&token=e3178ed5-a205-4aaf-8096-d584e30f9259"
        alt="Not Found"
        className="background-vector-bottom"
      />
      </div>
    </div>
   </div>
    ):(<Loading/>)}
    </motion.div>
  )    
}

