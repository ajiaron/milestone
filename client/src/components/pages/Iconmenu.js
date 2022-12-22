import './Iconmenu.css'
import React, { useState, useEffect, useCallback, useContext } from 'react'
import Navbar from '../Navbar'
import Footer from '../Footer'
import { LoginContext } from '../../UserContext'
import {AiOutlinePlusCircle} from 'react-icons/ai'
import Axios from 'axios'
import Friendtag from '../interactions/Friendtag'
import {motion} from 'framer-motion'
import Milestones from '../interactions/Milestones'

function Iconmenu({onSelectImage, selectedImage}) {
    const [icons, setIcons] = useState([])
    
    const fetchIcons = useCallback(()=> {     /* gets data when server is not running */
    fetch('../icons.json', {
      method:'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
     },
    })
    .then(response => response.json())
    .then(data => {
        setIcons(data)
    }) 
  }, [])

  useEffect(()=> {
    Axios.get('http://localhost:3000/createmilestone/geticons')
    .then((response)=> {
      setIcons(response.data)
    })
    .catch(fetchIcons())
  }, [fetchIcons, selectedImage])
  return (
    <>
    <p className="text-header-icons"> 🌗 Icon Selection</p>
    <div className='grid-icon-wrapper'>
        <div className='grid-icon-container'>
                {icons.map((e,i)=> (
                    <button className='icon-item' key={i} onClick={e=>onSelectImage({src:e.target.src, alt:e.target.alt})}>
                        <img className={(selectedImage.src===e.src)?'icon-image-selected':'icon-image'} src={e.src} alt={e.alt}/>
                    </button>
                ))}
        </div>
    </div>
    </>
  )
}

export default Iconmenu