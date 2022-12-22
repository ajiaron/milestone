import React, {useState, useEffect} from "react";
import "./ToggleSwitch.css";

const NewToggleSwitch = ({ label, onToggleSwitch, isPublic}) => {
  const [isToggled, setIsToggled] = useState(Boolean(isPublic))
  function handleClick() {
    onToggleSwitch(!isToggled)
    setIsToggled(!isToggled)
  }

  return (
    <div className="toggle-switch-container">
      <div className="toggle-switch">
        <input type="checkbox" className="checkbox" onChange={handleClick} checked={!Boolean(isPublic)}
               name={label} id={label} />
        <label className="label" htmlFor={label}>
          <span className="inner" />
          <span className="switch" />
        </label>
      </div>
    </div>
  );
};

export default NewToggleSwitch;