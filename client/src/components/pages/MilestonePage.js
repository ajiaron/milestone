import './MilestonePage.css'
import React, { useState, useEffect, useContext, useCallback } from 'react'
import {Link, useParams, useLocation} from 'react-router-dom'
import Navbar from '../Navbar'
import Footer from '../Footer'
import Post from './Post'
import Milestones from '../interactions/Milestones'
import { LoginContext } from '../../UserContext'
import Axios from 'axios'
import {motion} from 'framer-motion'
import {MdInsertLink} from 'react-icons/md'

function MilestonePage() {
  const [milestones, setMilestones] = useState([])
  const [postComments, setPostComments] = useState([])
  const [feedList, setFeedList] = useState([])
  const [latestPost, setLatestPost] = useState({})
  const [server, setServer] = useState(false)
  const [currentStone, setCurrentStone] = useState({})
  let {milestoneid} = useParams();
  const {state} = useLocation();
  const milestoneName = (state && state.name)?state.name:'Milestone';
  const {username} = useContext(LoginContext);
  const [postTime, setPostTime] = useState(
    new Date().toLocaleString("en-US", {month:"short"})+' '+new Date().toLocaleString("en-US", { day : '2-digit'})
  )
  function getDaysInMonth(year, month) {
    return new Date(year, month, 0).getDate();
  }
  function getDays() {
    return [...Array(daysInCurrentMonth)].map((e,i)=> {
        return <div className='grid-calender-item' key={i}>{i}</div>
    }
    )
  }

  const date = new Date();
  const currentYear = date.getFullYear();
  const currentMonth = date.getMonth() + 1; 
  const daysInCurrentMonth = getDaysInMonth(currentYear, currentMonth);
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
    setLatestPost(data.find(e=>e.username==='hzenry'))
  }) 
}, [])
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
      setCurrentStone(data.find(e=>e.idmilestones === parseInt(milestoneid)))
      console.log('fetched from local')
    }) 
  }, [])

  function handleClick() {
    console.log(latestPost)
    console.log(daysInCurrentMonth);
  }
  useEffect(()=> {

    fetchData()
    fetchStones()
  }, [fetchStones, fetchData])

  return (
    <motion.div initial={{width:0}} animate={{width:'100vw'}} exit={{x:window.innerWidth, transition:{duration:.25}}}>
        <div className='milestone-page-content'>
            <Navbar title={milestoneName}/>
            <div className="milestone-standalone-container">
           
            <img
              src={currentStone.src}
              alt="Not Found"
              className="milestone-image"
            />
            <div className='milestone-info-context'>
              <p className="milestone-info-title">{milestoneName}</p>
              <MdInsertLink className='link-icon'/>
              </div>                          
                <button className="milestone-standalone-button" onClick={handleClick}>
                 <p className="standalone-button-text">Delete</p>
                </button>
            </div>
            <div className='milestone-standalone-caption'> {/* placeholder text */}
                <p className='standalone-caption-text'>Re-Learning piano. 
                <br/>Currently trying to learn Fantasie Impromptu.<br/>
                <br/>🔥 Follow me on my journey!</p>
            </div>
            <div className='recent-milestone-wrapper'>
            <p className='recent-milestone-header'>🌟 Today&lsquo;s Milestone</p>
            </div>
            <div className='milestone-posts-container'>
            
            <ul className='milestone-posts-list'>
            <Post key={latestPost.id} 
                myKey={latestPost.id}
                username={latestPost.username} 
                src={'https://firebasestorage.googleapis.com/v0/b/unify-bc2ad.appspot.com/o/m4w03pjdyc-198%3A1972?alt=media&token=94965a23-2236-483f-9a04-63b3c4c25ff6'}
                text={'This triplet melody getting hard to play...'} 
                time={postTime} 
                context={latestPost.context} 
                comments={postComments}    
                likes={latestPost.likes}
                currentUser={username}
                serverState={server}
                from={`/milestone/${milestoneid}`}/>
             </ul>
             </div>
             <div className='milestone-timeline-container'> 
             
             <p className='recent-milestone-header'>⚡ Milestone Progress</p>
             <p className='milestone-timestamp'>Aug, 2022</p>
             
           
             </div>
             <div className='grid-calender-container'>
               {Array(daysInCurrentMonth).map((e,i)=> {
                <div className='grid-calender-item' key={i}>{i}</div>
               })}
                <div className='grid-calender-item'>1</div>
                <div className='grid-calender-item'>2</div>
                <div className='grid-calender-item'>3</div>
                <div className='grid-calender-item'>4</div>
                <div className='grid-calender-item'>5</div>
                <div className='grid-calender-item'>6</div>
                <div className='grid-calender-item'>7</div>
                <div className='grid-calender-item'>8</div>
                <div className='grid-calender-item'>9</div>
                <div className='grid-calender-item'>10</div>
                <div className='grid-calender-item'>11</div>
                <div className='grid-calender-item'>12</div>
                <div className='grid-calender-item'>13</div>
                <div className='grid-calender-item'>14</div>
                <div className='grid-calender-item'>15</div>
                <div className='grid-calender-item'>16</div>
                <div className='grid-calender-item'>17</div>
                <div className='grid-calender-item'>18</div>
                <div className='grid-calender-item'>19</div>
                <div className='grid-calender-item'>20</div>
                <div className='grid-calender-item'>21</div>
                <div className='grid-calender-item'>22</div>
                <div className='grid-calender-item'>23</div>
                <div className='grid-calender-item'>24</div>
                <div className='grid-calender-item'>25</div>
                <div className='grid-calender-item'>26</div>
                <div className='grid-calender-item'>27</div>
                <div className='grid-calender-item'>28</div>
             </div>
            <Footer logged={true}/>
        </div>
    </motion.div>
  )
}

export default MilestonePage