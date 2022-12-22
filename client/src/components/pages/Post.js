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
  const LatestTag = () => {
    return (
      <div className="post-tag flex-col-hcenter-vcenter">
        <div className="post-tag-content flex-row">
       
          <p className="post-tag-text">🌟 Today's Post</p>
        </div>
      </div>
    );
  }
  
  useEffect(() =>{
    if (serverState) {
     Axios.get('http://localhost:3000/newfeed/getcomments')
    .then((response)=> {
      setUserComments(response.data.filter(e => (props.myKey === e.postid)))
    })
   } 
  }, [userComments])
 
  
    return (
        <>
        <li className={props.from.includes('/milestone')?'mile-post-item':`post-item`}>
          
        <div className="post-profile-wrapper">
        <Link to={`/profile/${props.username}`} className='user-profile-link'>
          <img
            src="https://firebasestorage.googleapis.com/v0/b/unify-bc2ad.appspot.com/o/k7zqsjrs1ks-21%3A12?alt=media&token=bb4da667-8c03-4f1a-a6c8-5792831ebbea"
            alt="profilepic"
            className="profile-pic"
          />
          </Link>
          <div className='post-profile-header'>
          <Link to={`/profile/${props.username}`} className='user-profile-link'>
          <div className="image-frames flex-col-hstart-vstart">
            <p className="user-name">{props.username}</p>
            <p className="post-date">Today at {props.time}</p>  {/* date == currentDate ? ('Today' : {props.date}) */}
          </div>
          </Link>
          {props.from.includes('/milestone')?<LatestTag/>:''}
          {props.from.includes('/milestone')?'':
          <Link to={`/editpost/${props.myKey}`} state={{from:props.from, server:props.serverState}} className='edit-post-link'>
        <button className='edit-post-button'>
          <BiMessageSquareEdit className='edit-post-icon'/>
          </button>
          </Link>}
          </div>
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
          from={props.from}
          />
      </div>
      <div className="caption-frame">
       
        <p className="caption-header">{props.text}</p>
        {(props.from.includes('/milestone'))?'':(props.from.includes('/posts'))?
        <button className="caption-button">View Milestones &amp; Groups</button>
        :
        <Link to={`/posts/${props.myKey}`}  state={{comments:serverState?userComments:props.comments, likes:props.likes, server:serverState}} 
         className="caption-context">View Milestones &amp; Groups</Link>
    }
        
      </div>
        </li>
 </>
    )
}
