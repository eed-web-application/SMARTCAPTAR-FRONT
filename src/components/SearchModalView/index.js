import React, {useState} from "react";
import "./styles.css";
import Modal from 'react-modal';
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { AiFillCloseCircle } from "react-icons/ai";
axios.defaults.baseURL = 'http://134.79.206.193/smcaptar'
const customStyles = {
	content: {
	  height:700,
	  top: '50%',
	  left: '50%',
	  right: 'auto',
	  marginRight: '-50%',
	  transform: 'translate(-50%, -50%)',
	  borderRadius:"15px",
	},
  };

function SearchModalView(props) {
	const [errorMsg, setErrorMessage] = useState(false);
	console.log(props.user)
	const AddToWorkspace = async (cable) => {
		
    await axios.post(`/addToWorkspace?`, {cable:cable,user:props.user}).then(
     (response) => {
           props.closeModal();
     },
     (error) => {

        setErrorMessage(true);
     })
        
	}
	const navigate = useNavigate();
  return (
				<Modal
		         isOpen={props.modalIsOpen}
		         onRequestClose={props.closeModal}
		         style={customStyles}
		         contentLabel="Example Modal"
		       >
				<div class="ModalWrapper"> 
				{errorMsg ? 
				<p>Cable is Already being Edited</p>
				: null}
					<div class="ModalItem ModalItemOne">
					
		 		<div onClick={props.closeModal}>
				 <AiFillCloseCircle  size = {30} /></div>
				 

		 		<div style={{left:"70%",position:"absolute"}}>

					<button className="buttonModalCables" onClick={() => AddToWorkspace(props.cable)}>Add to Workspace</button>
		 		</div>
					</div>
					<div class="ModalItem"><hr class="modalDivider"/></div>
					<div class="ModalItem">
					<div className={"grid-container"}> 
		 		<div style={{marginBottom:50,marginLeft:50}}>
		 			{props.headers.map(key => {
		 				return (
		 			 	 <div className={"grid-container"}>
		 			<div class="grid-item">{key}:</div>
		 			<div class="grid-item">
						<p>{props.cable[key]}</p>
		 		</div>
		 		</div>
		 				)
		 			})}
		 			</div>
		 </div> 
					</div>
					
				</div>
		       </Modal>
  );
}

export default SearchModalView;