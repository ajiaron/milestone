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
    const {username} = useContext(LoginContext) 

    const getPosts = () => {  
      Axios.get('http://localhost:3000/newfeed/newposts')
      .then((response)=> {
        setFeedList(response.data)
      })
    }

    const [postComments, setPostComments] = useState([])
    const [postTime, setPostTime] = useState(
      new Date().toLocaleString("en-US", {month:"short"})+' '+new Date().toLocaleString("en-US", { day : '2-digit'})
    )
    
    const fetchData = useCallback(()=> {
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
        fetchData()   /* replace with getPosts() when server is running */
      }, [fetchData])

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
                        comments={postComments}
                        likes={post.likes}
                        currentUser={username}
                        />
                    ))}
                </ul>
            </div>
            </div>
            <div className='bottom-space'>{''}</div>
            <Footer logged={false} />
        </div> 
         </motion.div>
    );
    };