import './Grouptag.css'
import React, {useState, useEffect} from 'react'
import Axios from 'axios'

function Grouptag(props) {

    return (
        <li className='group-tag-item'> 
        <div className="profile-group-container flex-col-hstart-vstart">
       
          <div className="group-members-wrapper flex-row">
            <img
              src={props.image}
              alt="Not Found"
              className="hobbies-cello"
            />
            <div className="profile-group-members flex-col">
              <p className="group-title-name">{props.title} </p>
              <div className='group-tag-context'>
              <img
                src="https://firebasestorage.googleapis.com/v0/b/unify-bc2ad.appspot.com/o/ku3gggqduw-I153%3A89%3B153%3A39?alt=media&token=4a472a20-e215-4d62-9943-75ed15dedb8c"
                alt="Not Found"
                className="user-icon-small"
              />
              <p className="group-members-text">
            {props.members[0]}, {props.members[1]}, and {' '}<span className="group-members-context">{props.membercount -2}+ others</span>
          </p>
          </div>
            </div>
          
            <img
              src="https://firebasestorage.googleapis.com/v0/b/unify-bc2ad.appspot.com/o/ku3gggqduw-I153%3A89%3B153%3A38?alt=media&token=c24b3ea5-dd26-4e8c-b791-35391102611f"
              alt="Not Found"
              className="profile-group-dropdown"
            />
          </div>
        </div>
        </li>
      )
}

export default Grouptag