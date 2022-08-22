import './Friends.css'
import React, { useState, useEffect, useCallback, useContext } from 'react'
import Navbar from '../Navbar'
import Footer from '../Footer'
import { LoginContext } from '../../UserContext'
import Axios from 'axios'
import {motion} from 'framer-motion'

function Friends() {
    return (
        <motion.div className='container'initial={{width:0}} animate={{width:'100vw'}} exit={{x:window.innerWidth, transition:{duration:.25}}}>
            <div className='friends-list-content'>
            <Navbar title='Friends'/>
            <Footer logged={true} />
            </div>
        </motion.div>
      )
}

export default Friends