import React from 'react'
import './Newfeed.css'
import Post from './Post'
import Navbar from '../Navbar'
import Footer from '../Footer'
import { useState, useEffect, useCallback, useContext } from 'react'
import { LoginContext } from '../../UserContext'
import Axios from 'axios'
import {motion} from 'framer-motion'

export default function Newfeed(props) {
    let [feedList, setFeedList] = useState([])
    const {username, userId, userData} = useContext(LoginContext) 
    const [server, setServer] = useState(false)

    const getPosts = () => {    /* gets data when server is running */
      Axios.get('http://localhost:3000/newfeed/newposts')
      .then((response)=> {
        setFeedList(response.data)
        setServer(true)
      })
      .catch((e)=> {console.log(e.message + (' (server not running)'))})
    }

    const [postComments, setPostComments] = useState([])
    const [postTime, setPostTime] = useState(
      new Date().toLocaleString("en-US", {month:"short"})+' '+new Date().toLocaleString("en-US", { day : '2-digit'})
    )
    
    const fetchData = useCallback(()=> {     /* gets data when server is not running */
        fetch('../data.json', {
          method:'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
         },
        })
        .then(response => response.json())
        .then(data => {
          setFeedList(data)
        }) 
      }, [])

      useEffect(() =>{
        getPosts()
        if (!server) {
          fetchData()
        } 
      }, [fetchData,server])

    return (
      <motion.div className='feed' initial={{width:0}} animate={{width:'100vw'}} exit={{x:window.innerWidth, transition:{duration:.3}}}>
        <div className="content">
        <Navbar/>
        <div className='feed-container'>
            <div className='feed-wrapper'>
                <ul className='feed-items'>
                    {feedList.map(post => (
                        <Post key={post.id} 
                        myKey={post.id}
                        username={post.username} 
                        text={post.text} 
                        time={postTime} 
                        context={post.context} 
                        comments={postComments}    /* might want to get rid of this */
                        likes={post.likes}
                        currentUser={username}
                        serverState={server}
                        from={'/newfeed'}
                        />
                    ))}
                </ul>
            </div>
            </div>
            <div className='bottom-space'>{''}</div>
            <Footer logged={false} lastpost={feedList.length} onSendPost={(post)=> setFeedList([...feedList, post])} />
        </div> 
         </motion.div>
    );
    };