import React, {useState, useContext} from 'react'
import {RiNewspaperLine} from 'react-icons/ri'
import {HiOutlineUserGroup} from 'react-icons/hi'
import {AiOutlinePlusCircle} from 'react-icons/ai'
import { LoginContext } from '../UserContext'
import './Navbar.css'
import {Link} from 'react-router-dom'

function Footer(props) {
    const logged = props.logged
    const {username} = useContext(LoginContext)

    return (
        <>
        <div className="bottom-footer">
            <div className="foot-wrapper flex-row-vcenter-hstart">
              <Link to={logged?'/newfeed':'/'} className='landing-link'>
               <button className='feedpage-button'>
                 <RiNewspaperLine className='feedpage-icon'/>
               </button>
              </Link>

              <Link to={'/createmilestone'} className='create-milestone-link'> 
              <button className='milebook-button'>
              <img
                src="https://firebasestorage.googleapis.com/v0/b/unify-bc2ad.appspot.com/o/k7zqsjrs1ks-21%3A25?alt=media&token=53a4b050-cfd5-4567-b0e2-7c60f0ae48ea"
                alt="Homebook"
                className="milestone-logo"
              />
              </button>
              </Link>

              <button className='add-post-button'>
                <AiOutlinePlusCircle className='add-post-icon'/>
              </button>
              
              <Link to={'/friends'} className='friends-list-link'>
              <button className='friends-page-button'>
                <HiOutlineUserGroup className='friends-list-icon'/>
              </button>
              </Link>

              <Link to={`/profile/${username}`} className='profile-link'>
                <button className='profile-button'>
              <img
                src="https://firebasestorage.googleapis.com/v0/b/unify-bc2ad.appspot.com/o/8bju731tyra-139%3A62?alt=media&token=0292233b-2f08-4475-9e21-8cb4327ad610"
                alt="Not Found"
                className="user-icon"
              />
              </button>
              </Link>
            </div>
          </div>
          </>
      )
}

export default Footer