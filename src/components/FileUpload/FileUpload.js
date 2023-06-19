import React, {useState} from "react";
import Modal from 'react-modal';
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { AiFillCloseCircle } from "react-icons/ai";
import "./styles.css"
import { FiUpload } from "react-icons/fi";
import { ElevatorSharp } from "@mui/icons-material";
import Papa from "papaparse"
axios.defaults.baseURL = 'http://134.79.206.193/smcaptar'
const customStyles = {
	content: {
	  height:200,
	  top: '50%',
	  left: '50%',
	  right: 'auto',
	  marginRight: '-50%',
	  transform: 'translate(-50%, -50%)',
	  borderRadius:"15px",
	},
  };

function FileUploadView(props) {
	const [errorMsg, setErrorMessage] = useState(false);
    const [msg, setMsg] = useState("");
    const [file, setFile] = useState({
        selectedFile: null
      });

      


      const checkFileType = (e, eventType) => {
        let extension = e.target.value.match(/\.([^.]+)$/)[1];
        
        if(extension == "csv"){
            setFile({selectedFile: e.target.files[0]})
            Papa.parse(e.target.files[0], {
              skipEmptyLines:true,
              
              complete: results => {
                console.log(results.data)


                let arr = {}
                //for each array, filter the empty columns
                //remove first index
                //set first index = to the string array in the object
                for(var i = 0; i < results.data.length; i++){
                  var temp = results.data[i].filter(function(x) {return x != "";})
                  var label = temp.shift();
                  arr[label] = temp.toString()
                }
                console.log(arr)
                let api = ""
                if(props.file == "connectors"){
                  api = "csvUploadConnectors"
                }else if(props.file == "users"){
                  api = "csvUploadUsers"
                }
                axios.post(`http://134.79.206.193/smcaptar/${api}`, {arr:arr}).then(
    (response) => {
        // var result = response.data;
        // setLoading(false)
        // navigate('/uploaded-cables');
    },
    (error) => {
        console.log(error);
    }
);
              },

            });
        }else{
            setFile({ selectedFile: null });
            setMsg(`.${extension} format is not supported.`);
        }
       
      };
      const chooseFile = (e) => {
        if (e.target.files && e.target.files[0]) {
          checkFileType(e);
        }
      };
      
	const uploadCSV = async (cable) => {
		//api to parse CSV and update the SQL table
    }
  return (
				<Modal
		         isOpen={props.modalIsOpen}
		         onRequestClose={props.closeModal}
		         style={customStyles}
		         contentLabel="Example Modal"
		       >
				<div className="FirstTab">
        <button
        className="approveCablesButton"
        onClick={() => {
         props.closeModal;
        }}
      >
        Add User
      </button>
      <form
        className="uploadBox"
        onSubmit={(e) => e.preventDefault()}
      >
        {file.selectedFile !== null ? (
          <p className="filename">{file.selectedFile.name}</p>
        ) : msg !== "" ? (
          msg
        ) : (
          <FiUpload className="upload-icon" />
        )}

        <div>
          <div className="drag">
           {" "}
            <div className="browse">
              <label
                htmlFor="img"
                className="file-label"
                onClick={() => document.getElementById("getFile").click()}
              >
                Browse
                <input
                  type="file"
                  data-max-size="2048"
                  id="getFile"
                  className="fileIcon"
                  onChange={chooseFile}
                />
              </label>
            </div>
          </div>
        </div>

        <p className="info">Supported files: CSV</p>
      </form>
    </div>
		       </Modal>
  );
}

export default FileUploadView;