import './Posts.css'
import Post from './Post'
import React, { useState, useEffect, useCallback, useContext } from 'react' 
import { LoginContext } from '../../UserContext'
import {useParams, useLocation} from 'react-router-dom'
import Navbar from '../Navbar'
import Footer from '../Footer'
import {motion} from 'framer-motion'
import Axios from 'axios'

function Posts(props) {
  let { id } = useParams();
  const {state} = useLocation()
  const {username} = useContext(LoginContext)
  
  const commentHistory = state && state.comments
  const commentLog = (commentHistory)?state.comments:[]
  const serverState = (state && state.server)?true:false
 
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
    if (serverState) {
      Axios.get('http://localhost:3000/newfeed/newposts')
    .then((response)=> {
      setCurrentPost(response.data.find(e => parseInt(id) === e.id))
    })  
    } else {
      console.log('server not fetching post')
      fetchPost()
    }
  }, [fetchPost, serverState, id])
 
  
  return (
    <motion.div className='postitem' initial={{width:0}} animate={{width:'100vw'}} exit={{x:window.innerWidth, transition:{duration:.3}}}>
      <div className='post-content'>
      <Navbar/>
        <section className='top-space-standalone'>{''}</section>
        <div className='post-item-container'>
        <Post key={currentPost.id} 
              myKey={currentPost.id}
              username={currentPost.username} 
              text={currentPost.text} 
              time={new Date().toLocaleString("en-US", {month:"short"})+' '+new Date().toLocaleString("en-US", { day : '2-digit'})} 
              context={currentPost.context} 
              comments={commentLog}
              likes={currentPost.likes}
              currentUser={username}
              serverState={serverState}
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