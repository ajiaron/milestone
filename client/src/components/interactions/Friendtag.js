import './Friendtag.css'



import React, {useState, useEffect} from 'react'
import Axios from 'axios'


function Friendtag(props) {

  return (
    <li className='friends-list-item'> 
    <div className="profile-group-container flex-col-hstart-vstart">
   
      <div className="group-members-wrapper flex-row">
        <div
    
    
          className="hobbies-cello"
        />
        <div className="friends-list-members">
            <div className='friends-name-info'>
          <p className="friend-name">@{props.name} </p>
          <p className='view-profile-text'>View Profile</p>
          </div>
        <button className='delete-friend-button'>
            <p className='delete-friend-text'>Remove</p>
        </button>
        </div>
      </div>
    </div>
    </li>
  )
}

export default Friendtag