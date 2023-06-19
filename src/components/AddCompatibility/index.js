import React, { useState, useEffect } from "react";
// import "../Cables/styles.css";
import {projectOrder} from "../../testData/order"
import {  Pagination } from "@mui/material";
import "../CableViewTable/styles.css"
import { BeatLoader } from "react-spinners";
import Modal from 'react-modal';
import {AiFillCloseCircle,AiOutlineCheckCircle} from "react-icons/ai";
import axios from "axios";
axios.defaults.baseURL = 'http://134.79.206.193/smcaptar'
import FileUploadView from "../FileUpload/FileUpload";
function CompatibilityTableView(props) {
  const [projects, setProjects] = useState([]);
  const [page, setPage] = useState(1)
  const [headers, setHeaders] = useState(projectOrder)
  const [searchTxt, setSearch] = useState("");
  const [filterTerm, setFilter] = useState("CABLENUM");
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalFileIsOpen, setModalFileIsOpen] = useState(false);

  const [cableType, setCableType] = useState("");
  const [conns, setConns] = useState("");
  const customStyles = {
    content: {
        width:500,
        height:200,
      top: '50%',
      left: '50%',
      right: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      borderRadius:"15px",
    },
    };


const closeModal = () => {
  setModalIsOpen(false);
  setModalFileIsOpen(false);
  setCableType("");
setConns("");
}
const getProjectsAPI = async (p) => {
	
		const response = await fetch(`http://134.79.206.193/smcaptar/getCompatibility`);
		const data = await response.json();
    console.log(data.compat)
			setProjects(data.compat);
      setTotal(data.total)
	setLoading(false);
}
const submitCableType = async () => {
	
 await axios.post(`/uploadCableType`, {CABLETYPE:cableType,COMPAT:conns})

closeModal();
}


  useEffect(() => {
	getProjectsAPI(page);
  }, []);
  return (
	  <div>
		  <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                style={customStyles}
                contentLabel="Example Modal"
		       >
             <div style={{marginBottom:10,display:"flex",justifyContent:"space-between"}}>
                <div onClick={closeModal}> 
		 		<AiFillCloseCircle  size = {30} />
                 </div>
                <div> 
					<button className="buttonModalCables" onClick={() => submitCableType()}>Save</button>
					</div>
                
		 		</div> 
         <div class="QAContainer" style={{padding:20}}>
         <input
                        name="text"
                        type="text"
                        placeholder="Cable Type"
                        className="input"
                        defaultValue={cableType}
                        onChange={(e) =>
                            setCableType(e.target.value)
                        }
                    />
                    <input
                        name="text"
                        type="text"
                        placeholder="Connectors"
                        className="input"
                        defaultValue={conns}
                        onChange={(e) =>
                            setConns(e.target.value)
                        }
                    />
         </div>
            </Modal>
            <FileUploadView closeModal={closeModal} modalIsOpen={modalFileIsOpen} file={"connectors"}/>
      <div style={{display:"flex",margin:20,justifyContent:"space-between"}}>
     <div >
		<p className="dashboard_container_section_title_text">
		  Compatibility
		</p>
      </div>
			<div style={{flex:"flex-end"}}> 
      <button
        className="approveCablesButton"
        onClick={() => {
         setModalFileIsOpen(true)
        }}
      >
        CSV Update
      </button>
	  <button
        className="approveCablesButton"
        onClick={() => {
         setModalIsOpen(true);
        }}
      >
        Add Cable Type
      </button>
	  </div>
   <div> 
		 
	  <Pagination
  component="div"
  count={Math.ceil(projects.length / 5)}
  page={page}
  onChange={(event,newPage) => {
	setPage(newPage);
	getUsersAPI(newPage);
  }}
  rowsPerPage={5}
  
/> 
</div>
</div>

     <div className="innerDiv">
      
      <table className="table">
        <thead>
          <tr class="tableSeperator">
		
              <th>CABLE TYPE</th>
              <th>CONN CAPATIBILITIES</th>
					
          </tr>
        </thead>
		
        <tbody>
          {projects.slice((page-1)*5,(page-1)*5 + 5).map(item => (
            <tr>
              <td>
                {item.CABLETYPE}
              </td>
              <select className={"input"}>
                {item.COMPAT.split(",").map((data,index) => {
                  return (
                    <option value={data}>{data}</option>
                  )
                 
                })}
                       
                        </select>
            </tr>
          ))}
        </tbody>
      </table>
      {loading ? 
            <BeatLoader className="noCables" /> : 
      projects.length == 0 ? 
      <div class="noCables"><h1>NO CABLES AVAILABLE</h1></div>
: null}
	  </div>
	  </div>
  );
}

export default CompatibilityTableView;
