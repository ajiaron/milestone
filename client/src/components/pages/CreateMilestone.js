import './CreateMilestone.css'
import Navbar from '../Navbar'
import Footer from '../Footer'
import React, { useState, useEffect, useContext, useRef } from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import { Link } from 'react-router-dom'
import { LoginContext } from '../../UserContext'
import Axios from 'axios'
import { motion } from 'framer-motion'
import {TbChevronDown} from 'react-icons/tb'
import {BiCheck} from 'react-icons/bi'
import Iconmenu from './Iconmenu'
import ToggleSwitch from '../interactions/ToggleSwitch'


function CreateMilestone() {
  const {user} = useAuth0()
  const {username, userId, userData} = useContext(LoginContext) 
  const [ownerID, setOwnerID] = useState(0)
  const permissions = ['Everyone', 'Friends Only', 'Group Members','Only You']
  const durationList = ['Indefinitely', 'Until Tomorrow','Next Month', 'Select a date...']
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [postPermission, setPostPermission] = useState('Friends Only')
  const [viewPermission, setViewPermission] = useState('Everyone')
  const [duration, setDuration] = useState('Indefinitely')
  const [postToggle, setPostToggle] = useState(false)
  const [viewToggle, setViewToggle] = useState(false)
  const [durationToggle, setDurationToggle] = useState(false)
  const [commentToggle, setCommentToggle] = useState(true)
  const [likesToggle, setLikesToggle] = useState(true)
  const [linksToggle, setLinksToggle] = useState(true)
  const [toggleIcons, setToggleIcons] = useState(false)
  const [defaultImage, setDefaultImage] = useState({src:"https://firebasestorage.googleapis.com/v0/b/unify-bc2ad.appspot.com/o/xjahx9j9orm-200%3A2971?alt=media&token=318ef105-5adc-4e9b-a8b4-8127175360c5", alt:"default"})
  const [isSelected, setIsSelected] = useState(false)
  const [selectedImage, setSelectedImage] = useState(defaultImage)
  const [milestoneList, setMilestoneList] = useState([])
  const [iconList, setIconList] = useState([])
  const [milestoneID, setMilestoneID] = useState(0)


  function handleClick() {
    console.log('Title: ', title)
    console.log('Description: ', description)
    console.log('Posts: ', postPermission)
    console.log('Views: ', viewPermission)
    console.log('Duration: ', duration)
    console.log('Comments: ',commentToggle)
    console.log('Likes: ', likesToggle)
    console.log('Links: ', linksToggle)
    console.log(selectedImage)
    console.log((user)?user.nickname:username)
    Axios.get('http://localhost:3000/createmilestone/getusers')
    .then((response)=> {
      setOwnerID(response.data.find(e=> e.name === user.nickname).id)
    })
  
    console.log(milestoneID)
    Axios.post('http://localhost:3000/createmilestone/postmilestone', 
    {idmilestones:milestoneList.length, title:title, ownerID:ownerID, ownerName:user.nickname, entries: 0, description:description, src:selectedImage.src, streak:"in a row"})
    .then(() => {console.log('personal milestone posted')})
    Axios.post('http://localhost:3000/createmilestone/postpermissions', 
    {idmilestones:milestoneID, title:title, ownerID:ownerID, 
    collaborate:(postPermission?1:0), viewable:(viewPermission?1:0), comments:(commentToggle?1:0), likes:(likesToggle?1:0), links:(linksToggle?1:0), duration:duration})
    .then(()=> console.log('milestone permissions updates'))
  }

  function useOutside(ref) {     
  useEffect(()=> {
      function handleClickOutside(event) {
          if (ref.current && !ref.current.contains(event.target) &&
           !(event.target.className.includes('post-permission-input-item') || event.target.className.includes('post-permission-option') 
           || event.target.className.includes('habit-view-option')|| event.target.className.includes('habit-duration-option')
           || event.target.className.includes('post-permission-input') || event.target.className.includes('habit-view-input')|| event.target.className.includes('habit-duration-input')
           )) {
            setPostToggle(false)
            setViewToggle(false)
            setDurationToggle(false)
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

  function togglePost(e) {
    setPostToggle(!postToggle)
  }
  function toggleView(e) {
    setViewToggle(!viewToggle)
  }
  function toggleDuration(e) {
    setDurationToggle(!durationToggle)
  }

  const PostDropdown = ({postToggle, permissions, postPermission, setPostPermission}) => {
    return (
        <div className='drop-content' aria-orientation="vertical" ref={wrapperRef}>
         <ul className={postToggle?'drop-content-list':'drop-content-list-disabled'}>
          {permissions.filter(e=>e!==postPermission).map((options, i)=> (
            <li className='drop-content-item' key={i}>   
              <button className="post-permission-input-item" onClick={e=>setPostPermission(options)}> 
                <p className="post-permission-option">{options}</p>
             </button>
          </li>
          ))}
         </ul>
        </div>
      );
  }
  const ViewDropdown = ({viewToggle, permissions, viewPermission, setViewPermission}) => {
    return (
        <div className='drop-content' aria-orientation="vertical" ref={wrapperRef}>
         <ul className={viewToggle?'drop-content-list':'drop-content-list-disabled'}>
          {permissions.filter(e=>e!==viewPermission).map((options, i)=> (
            <li className='drop-content-item' key={i}>   
              <button className="post-permission-input-item"onClick={e=>setViewPermission(options)}> 
                <p className="post-permission-option">{options}</p>
             </button>
          </li>
          ))}
         </ul>
        </div>
      );
  }
  const DurationDropdown = ({durationToggle, durationList, duration, setDuration}) => {
    return (
        <div className='drop-content' aria-orientation="vertical" ref={wrapperRef}>
         <ul className={durationToggle?'drop-content-list':'drop-content-list-disabled'}>
          {durationList.filter(e=>e!==duration).map((options, i)=> (
            <li className='drop-content-item' key={i}>   
              <button className="post-permission-input-item" onClick={e=>setDuration(options)}> 
                <p className="post-permission-option">{options}</p>
             </button>
          </li>
          ))}
         </ul>
        </div>
      );
  }
  function showIcons() {
    setToggleIcons(!toggleIcons)
    setIsSelected(!isSelected)
  }
  useEffect(()=> {
    Axios.get('http://localhost:3000/createmilestone/getmilestones')
    .then((response)=> {
      setMilestoneList(response.data)
      setMilestoneID(response.data.length)
    })
  })

  return (
    <motion.div className='container'initial={{width:0}} animate={{width:'100vw'}} exit={{x:window.innerWidth, transition:{duration:.25}}}>
        <div className='create-milestone-content'>
        <Navbar title='Create Milestone Habit'/>
        <div className="milestone-habit-container flex-col">
        <div className='habit-image-wrapper'>
          <img
            src={selectedImage.src}
            alt={selectedImage.alt}
            className={selectedImage.src!==defaultImage.src?'habit-image-selected':"habit-image"}
          />   
        </div>
        <button className='upload-image-btn' onClick={e=>showIcons()}>
        <p className="upload-image-text">+Upload photo</p>
        </button>
        {toggleIcons?<Iconmenu onSelectImage={image=>{setSelectedImage(image)}} selectedImage={selectedImage}/>:''}
              <div className="habit-title-wrapper flex-col">
                <p className="habit-title-header">TITLE</p>
                <div className="habit-title-input"> {/* input tag here */}
                  <input className="habit-title-context" placeholder='Add a title for your new Milestone Habit' onChange={(e=>setTitle(e.target.value))}/>
                </div>
              </div>
              <div className="habit-description-wrapper flex-col">
                <p className="habit-description-header">DESCRIPTION</p>
                <textarea className="habit-description-input" placeholder='Add a description...' onChange={(e=>setDescription(e.target.value))}>        
                </textarea>
              </div>
          <div className='habit-permissions-wrapper'>
            <p className="habit-permissions-header">PERMISSIONS</p>
            <div className={postToggle?'permission-wrapper-toggled':'permission-wrapper'}>
              <p className="post-permission-text">Who can post to this Milestone?</p>
              <div className='post-permission-toggle'>
              <button className={postToggle?"post-input-toggled":"post-permission-input"} onClick={e=>togglePost(e)}> {/* input tag here */}
                <p className="post-permission-option">{postPermission}</p>
               <TbChevronDown className={postToggle?'dropdown-arrow-disabled':'dropdown-arrow'} />
               <BiCheck className={postToggle?'dropdown-arrow':'dropdown-arrow-disabled'} />
              </button>
              </div>
            </div>
            <PostDropdown postToggle={postToggle} permissions={permissions} postPermission={postPermission} setPostPermission={setPostPermission}/>
            <div className={viewToggle?'permission-wrapper-toggled':'permission-wrapper'}>
              <p className="habit-view-text">Who can view this Milestone?</p>
              <div className='post-permission-toggle'>
              <button className={viewToggle?"habit-view-toggled":"habit-view-input"} onClick={e=>toggleView(e)}>  {/* input tag here */}
                 <p className="habit-view-option">{viewPermission}</p>
                 <TbChevronDown className={viewToggle?'dropdown-arrow-disabled':'dropdown-arrow'} />
                 <BiCheck className={viewToggle?'dropdown-arrow':'dropdown-arrow-disabled'} />
              </button>
              </div>
            </div>
            <ViewDropdown viewToggle={viewToggle} permissions={permissions} viewPermission={viewPermission} setViewPermission={setViewPermission}/>
        <div className='toggle-permission-container'>
          <div className="comment-switch-wrapper">
              <p className="switch-label">Comments</p>
              <ToggleSwitch label={"Comments"} onToggleSwitch={toggle=>setCommentToggle(toggle)}/>
          </div>
          <div className="likes-switch-wrapper">
              <p className="switch-label">Likes</p>
              <ToggleSwitch label={"Likes"} onToggleSwitch={toggle=>setLikesToggle(toggle)}/>
          </div>
          <div className="link-switch-wrapper">
              <p className="link-sharing-label">Link Sharing</p>
              <ToggleSwitch label={"Link Sharing"} onToggleSwitch={toggle=>setLinksToggle(toggle)}/>
          </div>
        </div>
          <p className="habit-duration-header">DURATION</p>
            <div className={durationToggle?'permission-wrapper-toggled':'permission-wrapper'}>
              <p className="habit-duration-text">How long will this last?</p>
              <div className='post-permission-toggle'>
              <button className={durationToggle?"habit-view-toggled":"habit-duration-input"} onClick={e=>toggleDuration(e)}>  {/* input tag here */}
                 <p className="habit-duration-option">{duration}</p>
                 <TbChevronDown className={durationToggle?'dropdown-arrow-disabled':'dropdown-arrow'} />
                 <BiCheck className={durationToggle?'dropdown-arrow':'dropdown-arrow-disabled'} />
              </button>
              </div>
            </div>
            <DurationDropdown durationToggle={durationToggle} durationList={durationList} duration={duration} setDuration={setDuration}/>
          <div className="publish-save-container flex-col-hstart-vstart">
            <button className="save-button" onClick={handleClick}>
                <div className='save-button-container'>
              <p className="save-text">Save</p>
              </div>
            </button>
            <Link to='/newfeed'>
            <button className="publish-button">
                <div className='publish-button-container'>
              <p className="publish-text">Publish</p>
              </div>
            </button>
            </Link>
          </div>
          </div>
        </div>
        <Footer logged={true} />
        </div>
    </motion.div>
  )
}

export default CreateMilestone