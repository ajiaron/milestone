import './Friends.css'
import React, { useState, useEffect, useCallback, useContext } from 'react'
import Navbar from '../Navbar'
import Footer from '../Footer'
import { LoginContext } from '../../UserContext'
import {AiOutlinePlusCircle} from 'react-icons/ai'
import Axios from 'axios'
import Friendtag from '../interactions/Friendtag'
import {motion} from 'framer-motion'
import {BiSearch} from 'react-icons/bi'

function Friends() {
    const [users, setUsers] = useState([])
    const [milestones, setMilestones] = useState([])
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
          console.log(data)
        })
      }, [])
    function getUsers() {
        Axios.get('http://localhost:3000/friends/getfriends')
        .then((response)=> {
            setUsers(response.data)
            console.log(response.data)
        })
    }
    useEffect(()=> {
        getUsers()
        fetchStones()
    }, [])

    return (
        <motion.div className='container'initial={{width:0}} animate={{width:'100vw'}} exit={{x:window.innerWidth, transition:{duration:.25}}}>
            <div className='friends-list-content'>
            <Navbar title='Friends'/>
            <div className='friends-list-wrapper'>
            <div className="friend-search-input"> {/* input tag here */}
                  <input className="friend-search-context" placeholder='Search a friend...'></input>
                  <BiSearch className='search-icon'/>
            </div>
            <ul className='friends-list'> 
            {users.map((user, i)=> (
             <Friendtag key={i} name={user.name} />
            ))}
            </ul>
            </div>
     
            <Footer logged={true} />
            </div>
        </motion.div>
      )
}

export default Friends