import React, { useState, useContext } from 'react'
import Commentbox  from './Commentbox'
import './ActionBar.css'
import { CommentsContext } from '../../CommentContext'
import {Link} from 'react-router-dom'
import {AiOutlineLike} from 'react-icons/ai'


function ActionBar(props) {
  const {comments, currentuser, postOwner, postId, likes} = props
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

  return (
    <div className='actions-container'>
        <button className={`btn-like ${isLiked && 'liked'}`} onClick={ handleLiked }>
        <AiOutlineLike className={`outline-like-${isLiked ? 'liked':'icon '}`}/>
        </button>
        <Commentbox onSendComment={myComment=> setCommentList([...commentList, myComment])}
         commentList={commentList} username={currentuser}
         date={new Date().toISOString().slice(0, 19).replace('T', ' ')}
         postKey={postId} postOwner={postOwner}
         />
        <Link to={`/posts/${postId}`}
         state={{comments:commentList, likes:upVotes}} 
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