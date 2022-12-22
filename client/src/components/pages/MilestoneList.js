import './MilestoneList.css'
import React, { useState, useEffect, useCallback, useContext } from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import { useParams } from 'react-router-dom'
import Navbar from '../Navbar'
import Footer from '../Footer'
import { LoginContext } from '../../UserContext'
import {AiOutlinePlusCircle} from 'react-icons/ai'
import Axios from 'axios'
import Milestones from '../interactions/Milestones'
import {motion} from 'framer-motion'
import {BiSearch} from 'react-icons/bi'


function MilestoneList() {
    let {name} = useParams()
    const {user} = useAuth0()
    const [milestones, setMilestones] = useState([])
    const [server, setServer] = useState(false)
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
    function getStones() {
        Axios.get(`/${name}/milestonelist/showmilestones`)
        .then((response)=> {
            setMilestones(response.data)
            setServer(true)
        })
        .catch((err)=> console.log(err.message))
    }
    useEffect(()=> {
        getStones()
        if (!server) {
            fetchStones()
        }
    }, [server, fetchStones])

    return (
        <motion.div className='container'initial={{width:0}} animate={{width:'100vw'}} exit={{x:window.innerWidth, transition:{duration:.25}}}>
            <div className='milestone-list-content'>
            <Navbar title='Your Milestones' from={`/profile/${name}`}/>
            
            <div className='milestone-list-wrapper'>
            <div className="milestone-search-input"> {/* input tag here */}
                  <input className="milestone-search-context" placeholder='Search a milestone...'></input>
                  <BiSearch className='search-icon'/>
            </div>
            <ul className='milestone-list'> 
            {milestones.reverse().map((stone, i)=> (
             <Milestones key={i} myKey={stone.idmilestones} title={stone.title} entries={stone.entries} streak={stone.streak} src={stone.src} from={`/${name}/milestonelist`} milestoneList={[]} expand={false}/>
            ))}
            </ul>
            </div>
     
            <Footer logged={true} />
            </div>
        </motion.div>
      )
}

export default MilestoneList