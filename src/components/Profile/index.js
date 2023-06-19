import React,{useState,useEffect} from "react";
import SearchBar from "../SearchBar";


import "./styles.css";

const Profile = (props) => {
  console.log(props.user)
  const [user, setUser] = useState(0);
 
  return (
    <section class="profile">
    
      {props.page ? 
      <div className="profile_welcome">
        
     {props.page}
          </div> : 
      <div className="profile_welcome">
        
        
     {props.user}'s Dashboard
      </div>
}
{/* <SearchBar/> */}
      {/* <div className="profile_tools">
       
        {props.user}
      </div> */}
    </section>
  );
};

export default Profile;
