import './Posts.css'
import Post from './Post'
import React, { useState, useEffect, useCallback, useContext } from 'react' 
import { LoginContext } from '../../UserContext'
import {useParams, useLocation} from 'react-router-dom'
import Navbar from '../Navbar'
import Footer from '../Footer'
import {motion} from 'framer-motion'
import Axios from 'axios'
import Milestones from '../interactions/Milestones'
import {useAuth0} from '@auth0/auth0-react'

function Posts(props) {
  let { id } = useParams()
  const {user} = useAuth0()
  const {state} = useLocation()
  const {username} = useContext(LoginContext)
  const commentHistory = state && state.comments
  const commentLog = (commentHistory)?state.comments:[]
  const serverState = (state && state.server)?state.server:false
  const from = (state && state.from)?state.from:'/newfeed'
  const [milestones, setMilestones] = useState([])
  const [stoneList, setStoneList] = useState([])

  let [currentPost, setCurrentPost] = useState([])
  
  const fetchPost = useCallback(()=> {   // serverless function for setting the current post
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

  const fetchStones = useCallback(()=> {   // unused for now, this gets the milestones if ur not on server
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
      console.log('fetched from local')
    }) 
  }, [])

  useEffect(()=> {
    if (serverState) {
      Axios.get(`http://localhost:3000/posts/${id}/showmilestones`)
      .then((response)=> {
        setStoneList(response.data)
      })
    } 
  }, [serverState, id])

  useEffect(() =>{
    if (serverState) {
      Axios.get(`http://localhost:3000/posts/${id}/getpost`)       // server function for setting the current post
    .then((response)=> {
      setCurrentPost(response.data.find(e => parseInt(id) === e.id))
      console.log(response.data)
    })
  }
},[serverState, id])

  useEffect(() =>{
    console.log(from)
    if (serverState) {
    Axios.get(`http://localhost:3000/posts/${id}/showlinked`)     // gets milestones related to post
    .then((response)=> {
      setMilestones(response.data)
    })
    } else {
      console.log('server not fetching post')
      fetchPost()
      
    }
  }, [fetchPost, serverState, id])

  
  return (
    <motion.div className='postitem' initial={{width:0}} animate={{width:'100vw'}} exit={{x:window.innerWidth, transition:{duration:.3}}}>
      <div className='post-content'>
      <Navbar title='milestone' from={from}/>
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
              currentUser={user?user.nickname:username}
              serverState={serverState}
              from={`/posts/${id}`}
          />
        </div>
        <div className='post-milestones-container'> 
          {(milestones.length > 0)?
          <p className='text-header-milestones'>🌟 Post Milestones</p>:''}
          <ul className='post-milestones-log'>
          {   /* solution is cheese; stoneList.find() renders only the milestones related to the post, theres probably a better way */
              milestones.map(stone=> ( 
                <Milestones key={stoneList.find(e=> e.idmilestones === stone.milestoneid).idmilestones} myKey={stoneList.find(e=> e.idmilestones === stone.milestoneid).idmilestones} 
                title={stoneList.find(e=> e.idmilestones === stone.milestoneid).title} entries={stoneList.find(e=> e.idmilestones === stone.milestoneid).entries} streak={stoneList.find(e=> e.idmilestones === stone.milestoneid).streak} src={stoneList.find(e=> e.idmilestones === stone.milestoneid).src} from={'post'} expand={false}
                />
              ))
              }
          </ul>
        </div>
        <div className='post-footer'> 
        <Footer logged={true}/> 
        </div>
      </div>
      </motion.div>
  )
}

export default Posts