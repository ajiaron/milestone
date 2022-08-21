import React, { useState, useEffect } from "react"
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import Loading from './pages/Loading'
import './Newlanding.css'




function Newlanding() {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setTimeout(() => setLoading(false),2000)
  }, [])

  return (
      <>
    <motion.div className='container'initial={{width:0}} animate={{width:'100vw'}} exit={{x:window.innerWidth, transition:{duration:.25}}}>
    {loading === false ? (
    <div className="content clip-contents">
       <div className="logo-wrapper flex-col">
        <img
          src="https://firebasestorage.googleapis.com/v0/b/unify-bc2ad.appspot.com/o/iw5qo0r7qvg-91%3A10?alt=media&token=7b928b8d-d9bd-4c63-93c1-8d073ee65bc2"
          alt="Not Found"
          className="logo-book-icon"
        />
        <Link to='/newfeed' className='title-link-placeholder'>
        <p className="logo-title-text">milestone</p>
        </Link>
      </div>
      <div className="frame-for-buttons flex-col-hend-vstart">
        <Link className="button-for-create" to='/register'>
          <p className="txt-163">Create an account</p>
        </Link>
        <Link to='/login' className="button-for-login">     
          <p className="txt-163">Login</p>
        </Link>
      </div>
      <div className="middle-wrapper">
        <p className="middle-text flex-hcenter">already have an account?</p>
      </div>
      <div className="description-for-text">
        <p className="instructions-text">
          Just fill out some stuff for us real quick and we’ll get you on your
          way! Welcome to the <span className="brand-text">milestone</span>{" "}
          community.
        </p>
      </div>
      <img
        src="https://firebasestorage.googleapis.com/v0/b/unify-bc2ad.appspot.com/o/z3yaq0tblw-86%3A11?alt=media&token=fad25db6-1669-4871-9fa8-b9ec0c10200b"
        alt="Not Found"
        className="background-vector-top"
      />
      <img
        src="https://firebasestorage.googleapis.com/v0/b/unify-bc2ad.appspot.com/o/z3yaq0tblw-86%3A9?alt=media&token=323048d9-4e3e-4bd6-8bda-ae827d0ba755"
        alt="Not Found"
        className="background-vector-bottom"
      />
    </div>
    ):(<Loading/>)}
    </motion.div>
    </>
  )
}

export default Newlanding