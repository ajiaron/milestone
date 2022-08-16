import './Comments.css'
import React from 'react'

function Comments({submission, username, time}) {
  return (
    <li className='comment-item'>
        {/* <button onCLick{()=> onDeleteComment(comment.id)} type='button> </button> */}
        {/* <button onCLick{()=> onLikeComment(comment.id)} type='button> </button> */}
      <div className='comment-wrapper'>
        <div className='comment-owner'>{username}:  </div>
        <div className='comment-content'>
          <p className='comment-context'>{submission.comment}</p>
          {/*<span className='comment-date'>{date}</span>*/}
        </div>
      </div>
    </li>
  )
}

export default Comments