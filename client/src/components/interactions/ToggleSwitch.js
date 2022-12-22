import React, {useState, useEffect} from "react";
import "./ToggleSwitch.css";

const ToggleSwitch = ({ label, onToggleSwitch}) => {
  const [isToggled, setIsToggled] = useState(true)
  function handleClick() {
    onToggleSwitch(!isToggled)
    setIsToggled(!isToggled)
  }

  return (
    <div className="toggle-switch-container">
      <div className="toggle-switch">
        <input type="checkbox" className="checkbox" onChange={handleClick}
               name={label} id={label} />
        <label className="label" htmlFor={label}>
          <span className="inner" />
          <span className="switch" />
        </label>
      </div>
    </div>
  );
};

export default ToggleSwitch;