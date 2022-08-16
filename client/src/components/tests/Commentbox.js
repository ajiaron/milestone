
import './Commentbox.css'
import React, {useState, useEffect, useRef } from 'react'
import {RiMessage2Line} from 'react-icons/ri'
import {RiQuillPenLine} from 'react-icons/ri'
import Comments from '../interactions/Comments'
import Axios from 'axios'

const Commentbox = ({onSendComment, commentList, username, date, postKey, postOwner}) => {
  const clearData = {
      comment:''
  }

  let [toggleForm, setToggleForm] = useState(false)
  let [formData, setFormData] = useState(clearData)


  function formDataPublish (e) {     /* pushes comment to the post's comment list */
      const commentInfo = {
          id: commentList.length,
          comment: formData.comment,
          date: date,
          postId: parseInt(postKey),
          username: username
      }
      e.preventDefault();
      onSendComment(commentInfo)
      Axios.post('http://localhost:3000/newfeed/comment', 
      {comment:commentInfo.comment, date:commentInfo.date, postId:commentInfo.postId, username:commentInfo.username,})
      .then(()=> {console.log('comment posted')})
      setFormData(clearData)
  }
  
  function useOutside(ref) {     /* clicking outside comment-box closes it */
      useEffect(()=> {
          function handleClickOutside(event) {
              if (ref.current && !ref.current.contains(event.target)) {
                setToggleForm(false)
              }
          }
          document.addEventListener('mousedown', handleClickOutside)
          return ()=> {
              document.removeEventListener('mousedown', handleClickOutside)
          }
      }, [ref])
  }
  const wrapperRef = useRef(null); 
  useOutside(wrapperRef);
  
  return (
    <div>
        <button className={`${toggleForm ? 'btn-comment':'btn-comment-closed'}`} onClick={()=>{setToggleForm(!toggleForm)}}>
             <RiMessage2Line className='comment-icon-drop'/>
        </button>
        {
            toggleForm && 
            <div className='comments-container' ref ={wrapperRef}>
                <ul className='comments-log'>
                {commentList.map(entry => (<Comments submission={entry} username={entry.username} time={date} key={entry.id}/> ))}
                </ul>    
            <div className='comment-input-item'>
            <form className='comment-form' onSubmit={formDataPublish}>
            <input className='comment-input-area' 
            placeholder='Enter a comment...' type='text' name='comment' id='comment' 
            onChange={(event)=>{setFormData({...formData, comment: event.target.value})}}
            value = {formData.comment}>
            </input>
            <button className='comment-submit-button' type='submit' disabled={!formData.comment}>
                <RiQuillPenLine className='comment-pen-icon'/>
            </button>
            </form>
            </div>
        </div>
        }
    </div>
  )
}

export default Commentbox
