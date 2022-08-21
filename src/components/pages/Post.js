import React, { useState,useEffect} from 'react'
import './Feed.css'
import './Post.css'
import Axios from 'axios'
import ActionBar from '../tests/ActionBar'

export default function Post(props) {
  const [userComments, setUserComments] = useState([])
  const [serverState, setServerState] = useState(props.serverState)
  
  useEffect(() =>{
    if (serverState) {
     Axios.get('http://localhost:3000/newfeed/getcomments')
    .then((response)=> {
      setUserComments(response.data.filter(e => (props.myKey === e.postid)))
    })
   } else {
     console.log('server not on')
   }
  }, [props.myKey, userComments, serverState])
  
    return (
        <>
        <li className='post-item'>
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
        </div>
        <div className='image-container'>
            <div className='image-wrapper'/>   {/* change to figure and insert img */}
        </div>
        <div className='actionbar-wrapper'>   {/* change to userComments when server runs; props.comments when not running */}
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
        <p className="caption-context">{props.context}</p>
      </div>
        </li>
 </>
    )
}
