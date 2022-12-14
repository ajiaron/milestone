import React, {useState, useEffect} from 'react'
import {Link} from 'react-router-dom'
import './Navbar.css'
import Axios from 'axios'

function Navbar(props) {
  function showPage() {
    console.log(props.from)
  }

  return (
    <>
    <div className="top-header">
    {props.title ? (
        <div className="nav-wrapper flex-row-vcenter-hstart">
          <Link to={(props.title==='Edit Post' || props.from)?props.from:'/newfeed'} className='profile-back-link' state={{server:props.server}} >
          <button className='toggle-backarrow-button' onClick={showPage}>
        <img
              src="https://firebasestorage.googleapis.com/v0/b/unify-bc2ad.appspot.com/o/j2pfzeam6qs-91%3A4?alt=media&token=946b8e0b-e09c-4e87-80bd-54b48926b2d0"
              alt="Not Found"
              className="top-arrow-toggle"
            />
            </button>
            </Link>
          <p className={props.from === '/posts'?'top-brand':"top-brand-toggled"}>{props.title}</p>
          </div>):(
          <div className="nav-wrapper flex-row-vcenter-hstart">
          <p className="top-brand">milestone</p>
        </div>)}
      </div>
      </>
  )
}

export default Navbar