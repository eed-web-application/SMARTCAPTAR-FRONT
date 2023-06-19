import React from "react";
import { Link, useLocation,useNavigate } from "react-router-dom";
import CompanyLogo from "../../assets/SLAC-simple-hires-removebg-preview.png";
import HomeIcon from "../../assets/home-icon.png";
import SendIcon from "../../assets/send-icon.png";
import CableIcon from "../../assets/list-icon.png";
import DocumentsIcon from "../../assets/file-icon.png";
import LogoutIcon from "../../assets/logout-icon.png";
import SettingsIcon from "../../assets/settings-icon.png";
import MailIcon from "../../assets/mail.png";
import Modal from "react-modal"
import "./styles.css";
import axios from "axios";
axios.defaults.baseURL = 'http://134.79.206.193/smcaptar'

const customStyles = {
  overlay: {
    zIndex: '4'
  },
	content: {
	  top: '40%',
	  left: '55%',
	  right: 'auto',
	  marginRight: '-50%',
	  transform: 'translate(-50%, -50%)',
    borderRadius:20,
    height:252,
    width:698,
    backgroundColor:"#F6F9FC",
	},
  };
 
const Nav = (props) => {
  const [modalIsOpen, setIsOpen] = React.useState(false);
  const navigate = useNavigate();
  const { pathname } = useLocation();
  function closeModal() {
		setIsOpen(false);
	  }
    function openModal() {
      setIsOpen(true);
      }
  const BreakLine = () => {
    return <div className="break-line"></div>;
  };

  const logout = () => {
    localStorage.clear()
    props.setUser(null)
  }

  return (
    <section className="navigation">
       
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Example Modal"
      >
        
        <p className="modal-text" style={{textAlign:"center"}} >Are you sure you want to Logout?</p>
        <div style={{textAlign:"center"}}>
        <button  style={{margin:20}}className="cancelButton" onClick={() => closeModal()}>Cancel</button>
        <button  style={{margin:20}}className="cancelButton" onClick={() => logout()}>Logout</button>
        </div>
        </Modal> 
      <img src={CompanyLogo} className="navigation_logo" alt="company logo" />

     
      <div className="navigation_container">
      <Link to="/create-new">
        <button className="navigation_create-btn">Bulk Upload</button>
      </Link>
        <h1 className="navigation_container_title">{props.user}'s DESK</h1>
        <ul className="navigation_container_list">
          <li className="navigation_container_list_item">
            <img
              src={HomeIcon}
              className="navigation_container_list_item_icon"
              alt="homeIcon"
            />
            <div className="navigation_container_list_item_text">
              <Link to={{pathname:"/uploaded-cables",state:{user:props.user}}} >Workspace</Link>
              {pathname === "/uploaded-cables" ? BreakLine() : null}
            </div>
            
          </li>
         
          <li className="navigation_container_list_item">
            <img
              src={DocumentsIcon}
              className="navigation_container_list_item_icon"
              alt="documentsIcon"
            />
            <div className="navigation_container_list_item_text">
              <Link to="/projects">Approval Queue</Link>
              {pathname === "/projects" || pathname ==="/project-dashboard" ? BreakLine() : null}
            </div>
          </li>
          
           <li className="navigation_container_list_item">
            <img
              src={DocumentsIcon}
              className="navigation_container_list_item_icon"
              alt="documentsIcon"
            />
            <div className="navigation_container_list_item_text">
              <Link to="/approved-cables">Approved Cables</Link>
              {pathname === "/approved-cables" || pathname ==="/approved-cables" ? BreakLine() : null}
            </div>
          </li>
           <li className="navigation_container_list_item">
            <img
              src={MailIcon}
              className="navigation_container_list_item_icon"
              alt="mailIcon"
            />
            <div className="navigation_container_list_item_text">
              <Link to="/cable-inventory">Cable Inventory</Link>
              {pathname === "/cable-inventory" ? BreakLine() : null}
            </div>
          </li>
        </ul>
        <h1 className="navigation_container_title">ACCOUNT</h1>
        <ul className="navigation_container_list">
          {props.user == "ADMIN" ? 
          <li className="navigation_container_list_item">
            <img
              src={SettingsIcon}
              className="navigation_container_list_item_icon"
              alt="settingsIcon"
            />
            <div className="navigation_container_list_item_text">

            

              <p className = "navigation_container_list_item_text2" onClick={() => openModal()} ></p>
              <Link to="/settings">Settings</Link>
              {pathname === "/settings" ? BreakLine() : null}

            </div>
          </li>
          : null}
          <li className="navigation_container_list_item">
            <img
              src={LogoutIcon}
              className="navigation_container_list_item_icon"
              alt="logoutIcon"
            />
            <div className="navigation_container_list_item_text">

            

            <button  style={{margin:20}}className="cancelButton" onClick={() => openModal()}>Logout</button>
              {pathname === "/logout" ? BreakLine() : null}
            </div>
          </li>
        </ul>
      </div>
    </section>
  );
};

export default Nav;
