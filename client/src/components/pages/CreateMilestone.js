import './CreateMilestone.css'
import Navbar from '../Navbar'
import Footer from '../Footer'
import React, { useState, useEffect, useCallback, useContext } from 'react'
import { LoginContext } from '../../UserContext'
import Axios from 'axios'
import {motion} from 'framer-motion'

function CreateMilestone() {
  return (
    <motion.div className='container'initial={{width:0}} animate={{width:'100vw'}} exit={{x:window.innerWidth, transition:{duration:.25}}}>
        <div className='create-milestone-content'>
        <Navbar title='Create Milestone Habit'/>
        <Footer logged={true} />
        </div>
    </motion.div>
  )
}

export default CreateMilestone