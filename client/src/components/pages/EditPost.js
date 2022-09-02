import './CreatePost.css'
import './EditPost.css'
import React, { useState, useEffect, useContext, useCallback } from 'react'
import {Link, useParams, useLocation} from 'react-router-dom'
import Navbar from '../Navbar'
import Footer from '../Footer'
import Milestones from '../interactions/Milestones'
import { LoginContext } from '../../UserContext'
import Axios from 'axios'
import {motion} from 'framer-motion'

function EditPost() {
  const {postid} = useParams()
  const [milestoneTags, setMilestoneTags] = useState([])
  const [postOwner, setPostOwner] = useState({})
  const [latestPost, setLatestPost] = useState(0)
  const [deleteForm, setDeleteForm] = useState([])
  const [limit, setLimit] = useState('edit')
  const {username, userData, userId} = useContext(LoginContext) 
  let [milestones, setMilestones] = useState([])
  const [milestoneForm, setMilestoneForm] = useState([])
  const [server, setServer] = useState(false)
  let [currentPost, setCurrentPost] = useState([])
  const {state} = useLocation()
  const previousPage = (state && state.from)?state.from:'/newfeed'
  
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
      console.log(parseInt(postid))
      setCurrentPost(data.find(e => parseInt(postid) === parseInt(e.id)))
    });
  }, [postid])

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
    console.log(milestoneTags)
    console.log(deleteForm)
 //   Axios.delete(`http://localhost:3000/editpost/${postid}/removelinked`) removes all linked milestones
 //   .then((response)=> {
 //      console.log(response.data)
 //   })
  }
  function addMilestone(selected) {
    setDeleteForm(deleteForm.filter(e=> e !== selected.id))
    setMilestoneForm(milestoneForm.filter(e=>e.milestoneid !== selected.id))
    setMilestoneForm([...milestoneForm, selected])
  }
  function deleteMilestone(selected) {
    setMilestoneForm(milestoneForm.filter(e=>e.key !== selected))
    setMilestoneTags(milestoneTags.filter(e=>e !== selected))
    setDeleteForm([...deleteForm, selected])
  }

  function postDataUpdate(e) {
    deleteForm.map((item) => {
      Axios.delete(`http://localhost:3000/editpost/${postid}/removelinktag`, {data: {milestoneid:item}})
      .then((response)=> console.log(response.data))
    })
    Axios.put('http://localhost:3000/editpost/:postid/updatepost', 
    {postid:parseInt(postid), text:currentPost.text})
    .then(console.log('post caption updated'))
    milestoneForm.map((tag)=> {
      Axios.post('http://localhost:3000/editpost/:postid/linkmilestone',
      {milestoneid:tag.key, postid:parseInt(postid), ownerID:postOwner?postOwner.id:0, ownerName:postOwner?postOwner.name:'testguy', milestoneTitle:tag.title})
      .then(()=> console.log('updated post linked to milestone'))
    })
  }
  
  useEffect(()=> {
    Axios.get('http://localhost:3000/editpost/:postid/getlinked')
      .then((response) => {
        setMilestoneTags(response.data.filter((e)=> e.postid === parseInt(postid)).map(stone=>stone.milestoneid))
      })
    Axios.get('http://localhost:3000/editpost/:postid/showmilestones')
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
  }, [server, fetchStones, postid])

  useEffect(()=> {
    Axios.get('http://localhost:3000/editpost/:postid/getusers')
    .then((response)=> {
      setPostOwner(currentPost?response.data.find(e => currentPost.username === e.name):'testguy')
    })
    .catch((e)=> {console.log(e.message + (' (server not running)'))})
 
  }, [currentPost])

  useEffect(()=> {
    Axios.get('http://localhost:3000/editpost/:postid/getposts')
    .then((response)=> {
      setCurrentPost(response.data.find(e => parseInt(postid) === e.id))
    })
    .catch((e)=> {console.log(e.message + (' (server not running)'))})
    if (!server) {
      fetchPost()
    }
  }, [server, fetchPost, postid])

    return (  
        <motion.div initial={{width:0}} animate={{width:'100vw'}} exit={{x:window.innerWidth, transition:{duration:.25}}}>
        <div className='create-post-content'>
        <Navbar title='Edit Post' from={previousPage}/>
        <div className="post-description-container flex-col">
          <p className="description-text">DESCRIPTION</p>
          <div className="post-description-wrapper flex-row">
            <div className="description-input-area">
              <textarea className="description-input" placeholder={currentPost.text?currentPost.text:'Add a desciption...'}
              onChange={(event)=>{setCurrentPost({...currentPost, text:event.target.value})}}
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
               <Milestones key={server?stone.idmilestones:stone.id} myKey={server?stone.idmilestones:stone.id}
               title={stone.title} entries={stone.entries} 
               streak={stone.streak} src={stone.src} from={limit} milestoneList={milestoneTags}
               onSendMilestone={selected => addMilestone(selected)} 
               onDeleteMilestone={selected => deleteMilestone(selected.id)}
               post={latestPost} 
               />
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
            <button className="delete-post-button" onClick={()=>handleClick()}>
                <div className='save-button-container'>
              <p className="save-text">Delete</p>
              </div>
            </button>
            <Link to ='/newfeed'>
            <button className="update-post-button" onClick={()=>postDataUpdate()}>
                <div className='update-button-container'>
              <p className="update-text">Update</p>
              </div>
            </button>
            </Link>
          </div>
          <Footer logged={true} /> 
        </div>
    </motion.div>
      )
}


export default EditPost