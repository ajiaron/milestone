import './CreatePost.css'
import React, { useState, useEffect, useContext, useCallback } from 'react'
import {useParams, useLocation} from 'react-router-dom'
import Navbar from '../Navbar'
import Footer from '../Footer'
import Milestones from '../interactions/Milestones'
import { LoginContext } from '../../UserContext'
import Axios from 'axios'
import {motion} from 'framer-motion'


function CreatePost() {
  const {state} = useLocation()
  const lastpost = (state && state.lastpost)?state.lastpost:1
  const [limit, setLimit] = useState(false)
  const {username, userData} = useContext(LoginContext) 
  let [milestones, setMilestones] = useState([])
  const [server, setServer] = useState(false)

  const postInfo = {
    id: lastpost + 1,
    username: username,
    text: 'Add a description...',
    context: 'Currently developing a post...',
    date:new Date().toISOString().slice(0, 19).replace('T', ' '),
    likes:0
  }
  const [postData, setPostData] = useState(postInfo)

  function postDataPublish(e) {
    console.log(lastpost)
    Axios.post('http://localhost:3000/createpost/newpost', 
    {id:postData.id, username:username, text:postData.text, context:postData.context, date: postData.date, likes:postData.likes})
    .then(() => {console.log('new user posted')})
  }

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

    function handleClick() {
      console.log(postData)
    }

    useEffect(()=> {
      if (!server) {
        console.log('server not on')
        fetchStones()
      } else {
        console.log('server is on')
      }
    }, [server, fetchStones])

    return (  
        <motion.div initial={{width:0}} animate={{width:'100vw'}} exit={{x:window.innerWidth, transition:{duration:.25}}}>
        <div className='create-post-content'>
        <Navbar title='Create Post'/>



        <div className="post-description-container flex-col">
          <p className="description-text">DESCRIPTION</p>
          <div className="post-description-wrapper flex-row">
            <div className="description-input-area">
              <textarea className="description-input" placeholder='Add a desciption...'
              onChange={(event)=>{setPostData({...postData, text:event.target.value})}}
               ></textarea>
            </div>
            <img
              src="https://firebasestorage.googleapis.com/v0/b/unify-bc2ad.appspot.com/o/vl0mb6lpx3-208%3A3147?alt=media&token=fa86e560-22c7-4a9e-9811-7bdbe66b3938"
              alt="Not Found"
              className="post-image-preview"
            />
          </div>
        </div>
        <div className='select-milestone-container'>
        <p className="select-milestone-text">SELECT A MILESTONE</p>
        <div className='select-milestone-wrapper'>
            <ul className='select-milestone-log'>
            {milestones.map(stone => (
               <Milestones key={stone.id} title={stone.title} entries={stone.entries} streak={stone.streak} src={stone.src} from={limit}/>
            ))}
            </ul>
        </div>
        </div>

        <div className='toggle-switch-container'>
        <div className="comment-switch-wrapper">
            <p className="switch-label">Comments</p>
            <img
            src="https://firebasestorage.googleapis.com/v0/b/unify-bc2ad.appspot.com/o/7rwd65eiz57-208%3A3176?alt=media&token=73634f95-4dff-4c4a-8f86-9158cdbf2cc3"
            alt="slider"
            className="switch-toggle"
            />
        </div>
        <div className="likes-switch-wrapper">
            <p className="switch-label">Likes</p>
            <img
            src="https://firebasestorage.googleapis.com/v0/b/unify-bc2ad.appspot.com/o/7rwd65eiz57-208%3A3176?alt=media&token=73634f95-4dff-4c4a-8f86-9158cdbf2cc3"
            alt="slider"
            className="switch-toggle"
            />
        </div>
        <div className="link-switch-wrapper">
            <p className="link-sharing-label">Link Sharing</p>
            <img
            src="https://firebasestorage.googleapis.com/v0/b/unify-bc2ad.appspot.com/o/7rwd65eiz57-208%3A3176?alt=media&token=73634f95-4dff-4c4a-8f86-9158cdbf2cc3"
            alt="slider"
            className="switch-toggle"
            />
        </div>
        </div>
        <div className="publish-save-container flex-col-hstart-vstart">
            <button className="save-button" onClick={()=>handleClick()}>
                <div className='save-button-container'>
              <p className="save-text">Save</p>
              </div>
            </button>
            <button className="publish-button" onClick={()=>postDataPublish()}>
                <div className='publish-button-container'>
              <p className="publish-text">Publish</p>
              </div>
            </button>
          </div>
       

          <Footer logged={true}/> 
        </div>
    </motion.div>
      )
}

export default CreatePost
