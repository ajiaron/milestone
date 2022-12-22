import './CreatePost.css'
import React, { useState, useEffect, useContext, useCallback } from 'react'
import {Link, useParams, useLocation} from 'react-router-dom'
import Navbar from '../Navbar'
import Footer from '../Footer'
import Milestones from '../interactions/Milestones'
import { LoginContext } from '../../UserContext'
import Axios from 'axios'
import {motion} from 'framer-motion'
import {BsChevronDown} from 'react-icons/bs'
import ToggleSwitch from '../interactions/ToggleSwitch'


function CreatePost() {
  const {state} = useLocation()
  const lastpost = (state && state.lastpost)?state.lastpost:1
  const [latestPost, setLatestPost] = useState(0)
  const [feedList, setFeedList] = useState([])  // temp; only for non-server
  const [limit, setLimit] = useState('create')
  const {username, userData, userId} = useContext(LoginContext) 
  let [milestones, setMilestones] = useState([])
  const [milestoneForm, setMilestoneForm] = useState([])
  const [server, setServer] = useState(false)
  const [commentToggle, setCommentToggle] = useState(true)
  const [likesToggle, setLikesToggle] = useState(true)
  const [linksToggle, setLinksToggle] = useState(true)
  const [expand, setExpand] = useState(false)
  const postInfo = {
    id: latestPost,
    username: username,
    text: 'Add a description...',
    context: 'Currently developing a post...',
    date:new Date().toISOString().slice(0, 19).replace('T', ' '), 
    likes:0
  }
  const [postData, setPostData] = useState(postInfo)

  function toggleExpand() {
    setExpand(!expand)
    console.log(expand)
  }
  function postDataPublish(e) {
    Axios.post('http://localhost:3000/createpost/newpost', 
    {id:latestPost, username:username, text:postData.text, context:postData.context, date: postData.date, likes:postData.likes})
    .then(() => {console.log('new user posted')})
    milestoneForm.map((tag)=> {
      Axios.post('http://localhost:3000/createpost/linkmilestone',
      {milestoneid:tag.key, postid:postData.id, ownerID:userId, ownerName:username, milestoneTitle:tag.title})
      .then(()=> console.log('post linked to milestone'))
    })
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
        console.log('fetched from local')
      }) 
    }, [])

  function handleClick() {
    console.log(milestoneForm)
    console.log(postData)
  }
  const fetchPosts = useCallback(()=> {     /* gets data when server is not running */
        fetch('../data.json', {
          method:'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
         },
        })
        .then(response => response.json())
        .then(data => {
          setPostData({...postData, id:parseInt(data.reduce((prev,curr) => (parseInt(prev.id) > parseInt(curr.id)) ? prev : curr).id) + 1})

        }) 
      }, [])

  useEffect(()=> {
    Axios.get('http://localhost:3000/createpost/showmilestones')
      .then((response)=> {
        setMilestones(response.data)
        console.log('milestones retrieved')
      })
      .catch((err) => {
        console.log(err)
      })
      .then(setServer(true))
     if (!server) {
      fetchStones()
    } 
  }, [server, fetchStones])

  useEffect(()=> {
    Axios.get('http://localhost:3000/createpost/getposts')
    .then((response)=> {
      setLatestPost(parseInt(response.data.reduce((prev,curr) => (parseInt(prev.id) > parseInt(curr.id)) ? prev : curr).id) + 1)
      setPostData({...postData, id:response.data.reduce((prev,curr) => (parseInt(prev.id) > parseInt(curr.id)) ? prev : curr).id + 1 })
    })
    .catch((e)=> {console.log(e.message + (' (server not running)'))})
    if (!server) {
      fetchPosts()
    }
  }, [server, fetchPosts])

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
          <div className='expand-select-milestone'>
            <p className="select-milestone-text">SELECT A MILESTONE</p>
            <button className='down-arrow-button' onClick={toggleExpand}>
            <BsChevronDown className={(expand)?'down-arrow-toggled':'down-arrow'}/>
            </button>
          </div>
  
        <div className='select-milestone-wrapper'>
            <ul className='select-milestone-log'>
            {[...milestones].reverse().map(stone => (
               <Milestones key={server?stone.idmilestones:stone.id} myKey={server?stone.idmilestones:stone.id}
               title={stone.title} entries={stone.entries} 
               streak={stone.streak} src={stone.src} from={limit} milestoneList={milestoneForm}
               onSendMilestone={selected=>setMilestoneForm([...milestoneForm, selected])} 
               onDeleteMilestone={selected=>setMilestoneForm(milestoneForm.filter(e=>e.id !== selected.id))}
               post={latestPost} expand={expand}
               />
            ))}
            </ul>
          
            
        </div>
        </div>
        <div className='toggle-switch-container'>
      
          <div className="comment-switch-wrapper">
              <p className="switch-label">Comments</p>
              <ToggleSwitch label={"Comments"} onToggleSwitch={toggle=>setCommentToggle(toggle)}/>
          </div>
          <div className="likes-switch-wrapper">
              <p className="switch-label">Likes</p>
              <ToggleSwitch label={"Likes"} onToggleSwitch={toggle=>setLikesToggle(toggle)}/>
          </div>
          <div className="link-switch-wrapper">
              <p className="link-sharing-label">Link Sharing</p>
              <ToggleSwitch label={"Link Sharing"} onToggleSwitch={toggle=>setLinksToggle(toggle)}/>
          </div>

        </div>
        <div className="publish-save-container flex-col-hstart-vstart">
            <button className="save-button" onClick={()=>handleClick()}>
                <div className='save-button-container'>
              <p className="save-text">Save</p>
              </div>
            </button>
            <Link to='/newfeed'>

            
            <button className="publish-button" onClick={()=>postDataPublish()}>
                <div className='publish-button-container'>
              <p className="publish-text">Publish</p>
              </div>
            </button>
            </Link>
          </div>
       

          <Footer logged={true} /> 
        </div>
    </motion.div>
      )
}

export default CreatePost
