import React, { useState,useEffect} from 'react'
import './Feed.css'
import './Post.css'
import Axios from 'axios'
import {BiMessageSquareEdit} from 'react-icons/bi'
import ActionBar from '../tests/ActionBar'
import {Link} from 'react-router-dom'

export default function Post(props) {
  const [userComments, setUserComments] = useState([])
  const [serverState, setServerState] = useState(props.serverState)
  
  useEffect(() =>{
    if (props.from.includes('/milestone')) {
      console.log('true')
    } else {
      console.log('false')
    }
    if (serverState) {
     Axios.get('http://localhost:3000/newfeed/getcomments')
    .then((response)=> {
      setUserComments(response.data.filter(e => (props.myKey === e.postid)))
    })
   } 
  }, [props.myKey, userComments, serverState])
  
    return (
        <>
        <li className={props.from.includes('/milestone')?'mile-post-item':`post-item`}>
        <div className="post-profile-wrapper">
          <img
            src="https://firebasestorage.googleapis.com/v0/b/unify-bc2ad.appspot.com/o/k7zqsjrs1ks-21%3A12?alt=media&token=bb4da667-8c03-4f1a-a6c8-5792831ebbea"
            alt="profilepic"
            className="profile-pic"
          />
          <div className="image-frames flex-col-hstart-vstart">
            <p className="user-name">{props.username}</p>
            <p className="post-date">Today at {props.time}</p>  {/* date == currentDate ? ('Today' : {props.date}) */}
          </div>
          <Link to={`/editpost/${props.myKey}`} state={{from:props.from}} className='edit-post-link'>
        <button className='edit-post-button'>
          <BiMessageSquareEdit className='edit-post-icon'/>
          </button>
          </Link>
        </div>
        <div className='image-container'>
            <div className={props.src?'sample-image-wrapper':`image-wrapper`}>
              {props.src? <img src={props.src} alt='samplepost' className='milestone-post-image'/>:''}
              </div>   {/* change to figure and insert img */}
        </div>
        <div className='actionbar-wrapper'>   
        <ActionBar comments={serverState?userComments:props.comments} 
          currentuser={props.currentUser}
          postOwner={props.username}
          postId={props.myKey} 
          likes={props.likes}
          serverState={serverState}
          />
      </div>
      <div className="caption-frame">
       
        <p className="caption-header">{props.text}</p>
        {(props.from.includes('/milestone'))?'':
        <Link to={`/posts/${props.myKey}`} className="caption-context">View Milestones &amp; Groups</Link>
    }
      </div>
        </li>
 </>
    )
}
