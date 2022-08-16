import React from 'react'
import './Newfeed.css'
import Post from './Post'
import Navbar from '../Navbar'
import Footer from '../Footer'
import { useState, useEffect, useCallback, useContext } from 'react'
import { LoginContext } from '../../UserContext'
import {useLocation} from 'react-router-dom'
import Axios from 'axios'
import {motion} from 'framer-motion'

export default function Newfeed(props) {
    let [feedList, setFeedList] = useState([])


    const {username} = useContext(LoginContext) 
    console.log(username)

    
    const [owner, setOwner] = useState('')
    const [postId, setPostId] = useState(0)
    const [caption, setCaption] = useState('')
    const [blurb, setBlurb] = useState('')
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
         }
        })
        .then(response => response.json())
        .then(data => {
          setFeedList(data)
        });
      }, [])

      useEffect(() =>{
        fetchData()
      }, [fetchData])
      console.log(feedList)
      
    return (
      <motion.div className='feed' initial={{width:0}} animate={{width:'100vw'}} exit={{x:window.innerWidth, transition:{duration:.3}}}>
        <div className="content">
        <Navbar/>
        <section className='top-space'>{''}</section>
        <div className='feed-container'>
            <div className='feed-wrapper'>
                <ul className='feed-items'>
                    {feedList.map(post => (
                        <Post key={post.id} 
                        myKey={post.id}
                        username={post.username} 
                        text={post.text} 
                        time={post.time} 
                        context={post.context} 
                        comments={post.comments}
                        likes={post.likes}
                        currentUser={username}
                        />
                    ))}
                </ul>
            </div>
            </div>
            <Footer logged={false}/>
        </div> 
         </motion.div>
    );
    };