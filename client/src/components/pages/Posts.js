import './Posts.css'
import Post from './Post'
import React, { useState, useEffect, useCallback, useContext } from 'react' 
import { LoginContext } from '../../UserContext'
import {useParams, useLocation} from 'react-router-dom'
import Navbar from '../Navbar'
import Footer from '../Footer'
import {motion} from 'framer-motion'

function Posts(props) {
  /* gotta hash the post IDs once we have enough sample data, it's just 0,1,2,3... right now */
  let { id } = useParams();
  const {state} = useLocation()
  const {username} = useContext(LoginContext)
  
  const commentHistory = state && state.comments
  const commentLog = (commentHistory)?state.comments:[]
 
  let [currentPost, setCurrentPost] = useState([])
  
  const fetchPost = useCallback(()=> {
    fetch('../data.json', {
      method:'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
     }
    })
    .then(response => response.json())
    .then(data => {
      setCurrentPost(data.find(e => id === e.id))
    });
  }, [id])
  useEffect(() =>{
    fetchPost()
  }, [fetchPost])
 
  
  return (
    <motion.div className='postitem' initial={{width:0}} animate={{width:'100vw'}} exit={{x:window.innerWidth, transition:{duration:.3}}}>
      <div className='post-content'>
      <Navbar/>
        <section className='top-space'>{''}</section>
        <div className='post-item-container'>
        <Post key={currentPost.id} 
              myKey={currentPost.id}
              username={currentPost.username} 
              text={currentPost.text} 
              time={currentPost.time} 
              context={currentPost.context} 
              comments={commentLog}
              likes={currentPost.likes}
              currentUser={username}
          />
        </div>
        <div className='post-footer'> 
        <Footer logged={true}/> 
        </div>
      </div>
      </motion.div>
  )
}

export default Posts