import React, { useState,useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navigation from "../../components/Navigation";
import Profile from "../../components/Profile";
import Papa from "papaparse";
import "./styles.css";
import CreateNewCables from "../../components/CreateNewCables/index"
import Modal from 'react-modal';
import {uploadedOrder} from "../../testData/order"
import Template from '../../assets/template.csv'
import axios from "axios";

const customStyles = {
	content: {
	  top: '50%',
	  left: '50%',
	  right: 'auto',
    
	//   bottom: 'auto',
	  marginRight: '-50%',
	  transform: 'translate(-50%, -50%)',
	  borderRadius:"20px",
	},
  };
const defaultCable = {
      "Status": "New",
      "CableNumber": "",
      "FormalDevice Name": "",
      "FormalDevice": "",
      "CableFunction": "",
      "CableType": "",
      "Origin Loc": "",
      "Origin  Rack": "",
      "Origin  Side": "",
      "Origin  Ele": "",
      "Origin  Slot": "",
      "Origin  Conn #": "",
      "Origin  Pinlist": "",
      "Origin  Conn Type": "",
      "Origin  Station": "",
      "Origin  Ins": "",
      "Dest  Loc": "",
      "Dest  Rack": "",
      "Dest  Side": "",
      "Dest  Ele": "",
      "Dest  Slot": "",
      "Dest Conn #": "",
      "Dest  Pinlist": "",
      "Dest  Conn Type": "",
      "Dest  Station": "",
      "Dest  Ins": "",
      "Length": "",
      "Routing": "",
      "Revision": "",
      "Job #": "",
      "Drawing #": "",
      "Drawing  Title": "",
      "User  Id": "",
      "List Title": "",
      "Area Code": ""
}
const CreateNew = (props) => {
  const [cables, setCables] = useState([]); //REPLACE CAPTAR TEST WITH THE CORRECT JSON
  const [fileName, setFileName] = useState("");
  const [errorMessage, setErrorMessage] = useState("All Cables Valid");
  const navigate = useNavigate();
  const [modalIsOpen, setIsOpen] = useState(false);
  const [newCable, setNewCable] = useState(defaultCable);
  const [error,setError] = useState(false)
  const [dupes,setDupes] = useState([])
  const ref =useRef();
  const [loading, setLoading] = useState(false);

 
  const onChange = (e) => {
    setCables([])
    console.log("Upload Pressed");
    setFileName(e.target.files[0].name)
    const files = e.target.files;
    if (files) {
      Papa.parse(files[0], {
        header: true,
        complete: function (results) {
          const arr = results.data.filter((x) => x["Cable #"] != "0" && x["Cable #"] != null);

          console.log(arr)
          

          axios.post(`http://134.79.206.193/smcaptar/checkCables?table=${"SMARTCAPTAR_UPLOAD"}`, {cables:arr}).then(
    (response) => {
        var result = response.data;
        console.log(result.duplicateCables);
        setDupes(result.duplicateCables);
    },
    (error) => {
        console.log(error);
    }
);

console.log(cables)

          setCables(cables => [...arr,...cables]);
          ref.current.value = "";
        },
      });
    }
  };


  console.log(cables)
  const onSubmitForm = async (e) => {
    e.preventDefault();

    for(var i = 0; i < cables.length; i++){
      if(dupes.includes(cables[i]["Cable #"])){
        setErrorMessage("Cannot Upload Existing Cables waiting for Approval, Delete Duplicates");
        return
      }
    }
   
    if(cables != 0){ 
   
    var uploadedCables = cables;

    for(var i = 0; i < uploadedCables.length;i++){
      uploadedCables[i].Editor = props.user.USERNAME
    }
    setLoading(true)
     axios.post(`http://134.79.206.193/smcaptar/uploadCables?table=${"SMARTCAPTAR_UPLOAD"}`, {cables:cables,user:props.user.USERNAME}).then(
    (response) => {
        var result = response.data;
        setLoading(false)
        navigate('/uploaded-cables');
    },
    (error) => {
        console.log(error);
    }
);
    }else{
      setCables([]);

      return;
    }
  };
  return (

    
    <main className="cablelisting">
      

      <Navigation  user = {props.user.USERNAME} setUser={props.setUser}  admin={props.user.ADMIN} className="createnew_sidebar" />
      <Profile user = {props.user.USERNAME} className="createnew_navbar" page={"Upload Cables"}/>

     {!loading ? 
      <form className="createnew_container" onSubmit={(e) => onSubmitForm(e)}>
         {cables.length == 0 ? 
         <div className="createnew_container_section_file">
      
        <div className="sectionupload">
           
            <div>
            
               <a style={{"margin-right":20}} href={Template} download="TemplateCAPTAR.csv" target='_blank'>Template File</a>
               
            <label className="createnew_container_section_button">
            <input
            
              name="file"
              className="createnew_container_section_button"
              type="file"
              accept=".csv" 
              ref={ref}
              onInput={(e) => onChange(e)}
            /> Choose File
          </label>
          <div className="createnew_container_section_file_title">
            {fileName}
          </div>
        </div>
        </div>
        </div>
    :null}
        {cables.length != 0 ? 
        <section className="cablelisting_container">
        <CreateNewCables errorMessage={errorMessage} setCables={setCables} cables={cables} dupes={dupes}/>
        </section>
      : null}
      {cables.length != 0 ? 
        <div className="createnew_container_section_buttons">
          <Link to="/dashboard">
            <button className="createnew_container_section_cancel_button">
              Cancel
            </button>
          </Link>
          <button
            className="createnew_container_section_submit_button"
            type="submit"
          >
            SEND TO WORKSPACE
          </button>
        </div>
        :null}
      </form> : null}
    </main>
  );
};

export default CreateNew;
