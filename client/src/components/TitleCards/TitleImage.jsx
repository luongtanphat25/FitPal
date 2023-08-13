/* eslint-disable jsx-a11y/alt-text */
import React from "react";
import "../../styles/TitleImage.css";

 function TitleImage(props){
  const icon = `overlay-icon ${props.icon}`; 
  
  return (
    <div>
      <div className="title-container" height="200">
        <img className="object-fit-cover" height="200" width="100%" src="https://images.pexels.com/photos/2294361/pexels-photo-2294361.jpeg"/>
        <div className="overlay-image" height="175">
          <i className={icon}></i>
        </div>
      </div>
    </div>
  )
}

export default TitleImage;