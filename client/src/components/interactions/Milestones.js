import React from 'react'
import './Milestones.css'

function Milestones(props) {
    return (
        <li className={props.from?('personal-milestone-item'):('post-milestone-item')}>
        <div className="profile-milestone-content flex-col-hstart-vstart">
          <div className="profile-milestone-item flex-row">
            <img
              src={props.src}
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
              src="https://firebasestorage.googleapis.com/v0/b/unify-bc2ad.appspot.com/o/6ibzja7dt2g-I190%3A746%3B153%3A38?alt=media&token=1cea81c4-d4bd-44c1-9e3c-9a354cde061f"
              alt="Not Found"
              className={props.from?"milestone-item-dropdown":"milestone-item-disabled"}
          
            />
          </div>
        </div>
        </li>
      )
}

export default Milestones