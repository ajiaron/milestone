import React, {useState, useEffect } from 'react'
import {Link} from 'react-router-dom'
import './Milestones.css'

function Milestones(props) {
  const {myKey, title, entries, streak, src, from, milestoneList, onSendMilestone, onDeleteMilestone, expand} = props

  const [selected, setSelected] = useState(false)
  const [renderCount, setRenderCount] = useState(0)
  const selectedStone = {
    id: myKey,
    key:myKey,
    title: title,
    entries: entries,
    streak: streak,
    src: src,
  };
  function selectStone() {
    if (from === 'create'|| from.includes('edit')) {
      if (selected && from === 'edit') {
        onDeleteMilestone(selectedStone)
      } else {
        onSendMilestone(selectedStone)
      }
      setSelected(!selected)
    }
  }

  useEffect(()=> {
    if (from ==='edit' && renderCount < 1) {
      setSelected(milestoneList.includes(parseInt(myKey)))
      setRenderCount(renderCount + 1)

    }
  }, [milestoneList, renderCount, myKey])
  
    return (
        <li className={from.includes('profile')?('personal-milestone-item'):(from.includes('milestonelist')||expand===true)?'full-milestone-item':'post-milestone-item'}>
          <Link to={(from.includes('profile')||from.includes('milestonelist'))?`/milestone/${myKey}`:'#'} state={{name:title, from:from}} className='milestone-page-link' >

        <div className={(selected?'selected-milestone-content':'profile-milestone-content')+' flex-col-hstart-vstart'} onClick={selectStone}>
          <div className="profile-milestone-item flex-row">
            <img
              src={src}
              alt="Not Found"
              className="hobbies-music"
            />
            <div className='milestone-item-context'>
            <p className="milestone-item-title">{title}</p>
            <p className="milestone-streak">
            {entries+1} days<span className="milestone-streak-context"> {streak}</span>
            </p>
            </div>
            
            <img
              src="https://firebasestorage.googleapis.com/v0/b/unify-bc2ad.appspot.com/o/6ibzja7dt2g-I190%3A746%3B153%3A38?alt=media&token=1cea81c4-d4bd-44c1-9e3c-9a354cde061f"
              alt="Not Found"
              className={(from === 'profile' || from === 'milestonelist')?"milestone-item-dropdown":"milestone-item-disabled"}
          
            />
          </div>
        </div>
        </Link>
        </li>
      )
}

export default Milestones