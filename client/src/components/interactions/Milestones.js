import React from 'react'
import './Milestones.css'

function Milestones(props) {
    return (
        <li className='personal-milestone-item'>
        <div className="profile-milestone-content flex-col-hstart-vstart">
          <div className="profile-milestone-item flex-row">
            <img
              src="https://firebasestorage.googleapis.com/v0/b/unify-bc2ad.appspot.com/o/e9l0ihcreg-153%3A105?alt=media&token=1b843546-7b48-4040-a603-7c52f630a7aa"
              alt="Not Found"
              className="hobbies-music"
            />
            <div className='milestone-item-context'>
            <p className="milestone-item-title">{props.title}</p>
            <p className="milestone-streak">
            {props.entries} days<span className="milestone-streak-context"> {props.streak}</span>
            </p>
            </div>
            <img
              src="https://firebasestorage.googleapis.com/v0/b/unify-bc2ad.appspot.com/o/e9l0ihcreg-153%3A106?alt=media&token=57a337c9-c527-4d5d-826a-8cd161a52035"
              alt="Not Found"
              className="milestone-item-dropdown"
            />
          </div>
        </div>
        </li>
      )
}

export default Milestones