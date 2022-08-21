import React, { useState, useEffect } from 'react'
import Commentbox  from './Commentbox'
import './ActionBar.css'
import { CommentsContext } from '../../CommentContext'
import {Link} from 'react-router-dom'
import {AiOutlineLike} from 'react-icons/ai'
import Axios from 'axios'


function ActionBar(props) {
  const {comments, currentuser, postOwner, postId, likes, serverState} = props
  const [upVotes, setUpVotes] = useState(likes);
  const [isLiked, setIsLiked] = useState(false)
  const [commentList, setCommentList] = useState(comments)

  const handleLiked = () => {
    if (isLiked) {
      setUpVotes(upVotes-1)
    } else {
      setUpVotes(upVotes+1)
    }
    setIsLiked(!isLiked)
  }
  useEffect(()=> {
    setIsLiked(JSON.parse(window.localStorage.getItem('isLiked')))
  }, [])
  useEffect(()=> {
    window.localStorage.setItem('isLiked', isLiked)
  }, [isLiked])
  console.log(postId, isLiked)
  return (
    <div className='actions-container'>
        <button className={`btn-like ${isLiked && 'liked'}`} onClick={ handleLiked }>
        <AiOutlineLike className={`outline-like-${isLiked ? 'liked':'icon '}`}/>
        </button>
         <Commentbox onSendComment={myComment=> 
         serverState ? setCommentList([...comments, myComment]) : setCommentList([...commentList, myComment])} 
         commentList={serverState?comments:commentList} username={currentuser} /* 'comments' when server is on, 'commentList' when off */
         date={new Date().toISOString().slice(0, 19).replace('T', ' ')}
         postKey={postId} postOwner={postOwner}
         />
        <Link to={`/posts/${postId}`}
         state={{comments:serverState?comments:commentList, likes:upVotes, server:serverState}} 
         className='post-item-link'>
        <button className='btn-milebook'>
        <img
          src="https://firebasestorage.googleapis.com/v0/b/unify-bc2ad.appspot.com/o/k7zqsjrs1ks-21%3A25?alt=media&token=53a4b050-cfd5-4567-b0e2-7c60f0ae48ea"
          alt="Not Found"
          className="milestone-icon"
          />
        </button>
        </Link>
    </div>
  )
}

export default ActionBar