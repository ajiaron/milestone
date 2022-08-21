import React from "react"
import {Link} from 'react-router-dom';
import "./Feed.css"

export default function Feed() {
  return (
    <div className="information-feed-v-2 flex-col-hstart-vstart clip-contents">
    <div className="group-387 flex-col">
      <div className="group-029">
        <p className="txt-233">milestone</p>
      </div>
      <div className="group-673 flex-row">
        <img
          src="https://firebasestorage.googleapis.com/v0/b/unify-bc2ad.appspot.com/o/xu0qs2xk1c-21%3A25?alt=media&token=1f704c97-79c5-4ab5-922a-e7c5d603ae06"
          alt="Not Found"
          className="milestone-logo"
        />
        <img
          src="https://firebasestorage.googleapis.com/v0/b/unify-bc2ad.appspot.com/o/xu0qs2xk1c-21%3A22?alt=media&token=e1e067bb-ab8a-413c-8118-2b5401039169"
          alt="Not Found"
          className="user-icon"
        />
      </div>
    </div>
    <img
      src="https://firebasestorage.googleapis.com/v0/b/unify-bc2ad.appspot.com/o/xu0qs2xk1c-18%3A510?alt=media&token=4ab26884-11b3-4fc4-b55e-8fd3085402c9"
      alt="Not Found"
      className="action-item-header"
    />
    <div className="caption-frame flex-col-hstart-vstart">
      <p className="txt-952">i love running and listening to bossa nova 3</p>
      <p className="txt-1105">currently listening to ur mom</p>
    </div>
    <div className="frame-10 flex-col-hstart-vstart">
      <div className="image-frames flex-col-hstart-vstart">
        <div className="image-frame-5" />
        <div className="image-frame-6" />
      </div>
    </div>
    <div className="frame-7 flex-col-hcenter-vstart">
      <div className="frame-5 flex-row-vend-hstart">
        <img
          src="https://firebasestorage.googleapis.com/v0/b/unify-bc2ad.appspot.com/o/xu0qs2xk1c-21%3A7?alt=media&token=d1e14237-87a9-4cc1-93f4-a2d4304906f4"
          alt="Not Found"
          className="profile-pic"
        />
        <div className="image-frames flex-col-hstart-vstart">
          <p className="txt-241">Aaron Jiang</p>
          <p className="txt-1105">Today at 1:28 AM</p>
        </div>
      </div>
      <div className="frame-6 flex-row-vend-hstart">
        <img
          src="https://firebasestorage.googleapis.com/v0/b/unify-bc2ad.appspot.com/o/xu0qs2xk1c-21%3A12?alt=media&token=2076ae13-b1ba-4a6f-b261-9109be651ead"
          alt="Not Found"
          className="profile-pic"
        />
        <div className="image-frames flex-col-hstart-vstart">
          <p className="txt-241">Aaron Jiang</p>
          <p className="txt-1105">Today at 1:28 AM</p>
        </div>
      </div>
    </div>
  </div>
  )
}

