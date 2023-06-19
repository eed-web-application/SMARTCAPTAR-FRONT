import React, { useState, useEffect } from "react";
import {uploadedOrder,historyOrder,inventoryOrder} from "../../testData/order"
import CablesRow from "../TableCableRow/CablesRow";
import { getStepButtonUtilityClass, Pagination,TablePagination } from "@mui/material";
import { useTable } from 'react-table'
import FilterBar from "../FilterBar/index"
import axios from "axios";
axios.defaults.baseURL = 'http://134.79.206.193/smcaptar'
import "./styles.css";
import { BeatLoader } from "react-spinners";
import Modal from "react-modal"
import CreateCableModal from "../CreateCableModal";
import CableQAModal from "../CableQA";
import { usePapaParse } from 'react-papaparse';
import { StrikethroughSTwoTone } from "@mui/icons-material";
import SearchModalView from "../SearchModalView";
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
    backgroundColor:"#FFFFFF",
	},
  };

function CableInventoryView(props) {
  const [cables, setCables] = useState([]);
  const [modalIsOpen, setIsOpen] = useState(false);
  const [modalCable, setModalCable] = useState({});
  const [page, setPage] = useState(1)
  const [headers, setHeaders] = useState(uploadedOrder)
  const [searchTxt, setSearch] = useState("");
  const [filterTerm, setFilter] = useState("CABLENUM");
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [modalDeleteIsOpen, setDeleteIsOpen] = React.useState(false);
  const [modalCreateIsOpen, setCreateIsOpen] = React.useState(false);
  const [modalReqApproveIsOpen, setReqApproveIsOpen] = React.useState(false);
  const [modalApproveIsOpen, setApproveIsOpen] = React.useState(false);
  const [modalRejectIsOpen, setRejectIsOpen] = React.useState(false);
  const [check, setCheck] = React.useState(false);
  const [types, setTypes] = useState([]);
  const [rows, setRows] = useState(10);
  const [columnInfo, setColumnInfo] = useState({});

  const [projects, setProjects] = useState([]);
  const [user, setUser] = useState({});
  const [conn, setConnTypes] = useState([]);
  const [admins, setAdmins] = useState([]);
  const handleSubmitUpdate = (event, cable, key) => {
	event.preventDefault();
	var  text = event.target.value;
	var temp = cable;
	temp[key] = text;
  setModalCable(temp);
	
  
};
console.log(props.user.USERNAME)

  
const { jsonToCSV } = usePapaParse();

  function closeModal() {
	setIsOpen(false);
	setModalCable({})
  }
  function closeCreateModal() {
    setCreateIsOpen(false);
    getCablesAPI(page)
    }

    const getTypes = async () => {
      const response = await fetch(`http://134.79.206.193/smcaptar/getCableTypes`);
      const data = await response.json();
      setTypes(data.types);
  }
   const getProjects = async () => {
      const response = await fetch(`http://134.79.206.193/smcaptar/getProjects`);
      const data = await response.json();
      setProjects(data.projects);
  }
  const getConnTypes = async (CT) => {
      const response = await fetch(`http://134.79.206.193/smcaptar/getConnTypes?cableType=${CT}`);
      const data = await response.json();
      setConnTypes(data.types);
  }
  
const openModalView = (cable) => {
  getProjects();
  getTypes();
  getConnTypes(cable.CABLETYPE);
  setModalCable(cable)
	setIsOpen(true);
	
}
const searchInventory = async () => {
  
	const response = await fetch(`http://134.79.206.193/smcaptar/getCablesInventory?offset=${(page - 1)*rows}&user=${props.user.USERNAME}&table=${props.table}&searchTxt=${searchTxt}&filter=${filterTerm}`);
		const data = await response.json();
			await setCables(data.cables);
      setTotal(data.total)
      setColumnInfo(data.columnInfo)
  if(props.table == "CABLEINV"){
    setHeaders(inventoryOrder)
  }
	setLoading(false);
}

const getCablesAPI = async (p,user) => {
  if(searchTxt != "" && props.table == "CABLEINV"){
    const response = await fetch(`http://134.79.206.193/smcaptar/getCablesInventory?offset=${(p - 1)*rows}&user=${props.user.USERNAME}&table=${props.table}&searchTxt=${searchTxt}&filter=${filterTerm}`);
		const data = await response.json();
			await setCables(data.cables);
      setTotal(data.total)
      setColumnInfo(data.columnInfo)
  if(props.table == "CABLEINV"){
    setHeaders(inventoryOrder)
  }
	setLoading(false);
  }else{
		const response = await fetch(`http://134.79.206.193/smcaptar/getCables?offset=${(p - 1)*rows}&user=${props.user.USERNAME}&table=${props.table}`);
		const data = await response.json();
			await setCables(data.cables);
      setTotal(data.total)
      setColumnInfo(data.columnInfo)
      
	
  if(props.table == "CABLEINV"){
    setHeaders(inventoryOrder)
  }
	setLoading(false);
}
}

    useEffect(()=>{
      console.log(columnInfo)
      var loggedInUser = localStorage.getItem("user");
      
      var foundUser;
      if (loggedInUser != null) {
        foundUser = JSON.parse(loggedInUser);
       
        setUser(foundUser);
      }
      getCablesAPI(page, foundUser);
      
    },[])




  async function ApproveCables(){
	
    let tempCables = [];
    cables.forEach(d => {
      if (d.select) {
        tempCables.push(d);
      }
    });
	 let newData = await axios.post(`/approveCables`, {cables:tempCables,user:props.user.USERNAME})
setApproveIsOpen(false);
 getCablesAPI(page);
  };



  async function QueueCables(){
    let tempCables = [];
    cables.forEach(d => {
      if (d.select) {
        tempCables.push(d);
      }
    });
	 await axios.post(`/queueCables?table=${"SMARTCAPTAR_QUEUE"}`, {cables:tempCables}).then(() => console.log("FINSIHED"))
setCables([])
await getCablesAPI(page,user);
  };



  async function close(){
    setReqApproveIsOpen(false);
    setCheck(false);
  }



  async function DeleteCables(){
    let tempCables = [];
    cables.forEach(d => {
      if (d.select) {
        tempCables.push(d);
      }
    });	 
  await axios.post(`/deleteCables`, {cables:tempCables})
setDeleteIsOpen(false);
setCables([])
await getCablesAPI(page,user);
  };


async function ExportCSV(){
  // var csv = Papa.unparse(array);
  const csv = jsonToCSV([
    ["1-1", "1-2", "1-3"],
    ["2-1", "2-2", "2-3"]
  ])
  var csvData = new Blob([csv], {type: 'text/csv;charset=utf-8;'});
    var csvURL =  null;
    if (navigator.msSaveBlob)
    {
        csvURL = navigator.msSaveBlob(csvData, 'CAPTAR.csv');
    }
    else
    {
        csvURL = window.URL.createObjectURL(csvData);
    }

    var tempLink = document.createElement('a');
    tempLink.href = csvURL;
    tempLink.setAttribute('download', 'CAPTAR.csv');
    tempLink.click();
}


  async function updateCableDB(cable){
    console.log(cable)
	 await axios.post(`/updateCable?table=${props.table}`, {cable:cable,user:props.user.USERNAME}).then(
    (response) => {
        var result = response.data;
    },
    (error) => {
        console.log(error);
    }
);

await getCablesAPI(page);
closeModal()
  };

  async function RejectCables(){
    let tempCables = [];
    cables.forEach(d => {
      if (d.select) {
        tempCables.push(d);
      }
    });
    await axios.post(`/rejectCables?table=${props.table}`, {cables:tempCables}).then(
     (response) => {
         var result = response.data;
     },
     (error) => {
         console.log(error);
     }
 );
 
 setCables([])
await getCablesAPI(page,user);
 setRejectIsOpen(false);
   };

   async function CancelQueue(num){
    await axios.post(`/cancelQueue?table=${props.table}`, {cableNum:num}).then(
     (response) => {
         var result = response.data;
     },
     (error) => {
         console.log(error);
     }
 );
 await getCablesAPI(page);
   };

 const CreateCable = async () => {
  getTypes();
  getProjects();
  // getConnTypes(cable.CABLETYPE);
	setCreateIsOpen(true);
 }

  return (
    <div style={{marginTop:20,marginLeft:20}}>
      {props.table == "CABLEINV" ? 
       <SearchModalView  user={props.user.USERNAME} cable={modalCable} headers={inventoryOrder} closeModal={closeModal} modalIsOpen={modalIsOpen}/> : null}
            <Modal
        isOpen={modalReqApproveIsOpen}
        style={customStyles}
        contentLabel="Example Modal"
      >
        {!check ? 
        <div> 
        <p className="modal-text" style={{textAlign:"center"}} >Are you sure you want to <span class="red_text">Request Approvals</span>?</p>
        <div style={{textAlign:"center"}}>
        <button  style={{margin:20}}className="cancelButton" onClick={() => setReqApproveIsOpen(false)}>Cancel</button>
        <button  style={{margin:20}}className="deleteButton" onClick={() => {QueueCables(),setCheck(true) , setTimeout(close, 1000)}}>Request Approvals</button>
        </div>
        </div>
        : <BeatLoader/>}
        </Modal>

        <Modal
        isOpen={modalDeleteIsOpen}
        style={customStyles}
        contentLabel="Example Modal"
      >
        
        <p className="modal-text" style={{textAlign:"center"}} >Are you sure you want to <span class="red_text">Delete Cables</span>?</p>
        <div style={{textAlign:"center"}}>
        <button  style={{margin:20}}className="cancelButton" onClick={() => setDeleteIsOpen(false)}>Cancel</button>
        <button  style={{margin:20}}className="deleteButton" onClick={() => DeleteCables()}>Delete Cables</button>
        </div>
        </Modal>
        <CreateCableModal   user={props.user} projects={projects} types={types} conn={conn} headers={headers} closeCreatemodal={closeCreateModal} modalCreateIsOpen={modalCreateIsOpen} />


        <Modal
        isOpen={modalApproveIsOpen}
        style={customStyles}
        contentLabel="Example Modal"
      >
        
        <p className="modal-text" style={{textAlign:"center"}} >Are you sure you want to <span class="red_text">Approve Cables</span>?</p>
        <div style={{textAlign:"center"}}>
        <button  style={{margin:20}}className="cancelButton" onClick={() => setApproveIsOpen(false)}>Cancel</button>
        <button  style={{margin:20}}className="deleteButton" onClick={() => ApproveCables()}>Approve Cables</button>
        </div>
        </Modal>

        <Modal
        isOpen={modalRejectIsOpen}
        style={customStyles}
        contentLabel="Example Modal"
      >
        
        <p className="modal-text" style={{textAlign:"center"}} >Are you sure you want to <span class="red_text">Reject Cables</span>?</p>
        <div style={{textAlign:"center"}}>
        <button  style={{margin:20}}className="cancelButton" onClick={() => setRejectIsOpen(false)}>Cancel</button>
        <button  style={{margin:20}}className="deleteButton" onClick={() => RejectCables()}>Reject Cables</button>
        </div>
        </Modal>
        {loading || props.table == "CABLEINV" ? null : 
        <CableQAModal  columnInfo={columnInfo} conn={conn} projects={projects} admins={admins} types={types}  table={props.table} cancelQueue={CancelQueue} cable={props.cable} updateCableDB={updateCableDB} headers={headers} modalCable={modalCable} closeModal={closeModal} modalIsOpen={modalIsOpen} handleSubmitUpdate={handleSubmitUpdate}/>
        }
   <div className="tableDivCables">
        <div style={{display:"flex",flexDirection:"column"}}> 
    <div style={{flexDirection:"row",flex:1,margin:10,marginBottom:5}}> 
   {props.table == "SMARTCAPTAR_UPLOAD" ? 

	  <><button
    className="approveCablesButton"
    onClick={() => {
CreateCable()        } }
  >
    Create Cable
  </button>
    <button
                className="approveCablesButton"
                onClick={() => {
                  setReqApproveIsOpen(true);
                } }
              >
                Request Approvals
              </button>
              
              <button
                className="approveCablesButton"
                onClick={() => {
                  setDeleteIsOpen(true);
                } }
              >
                  Delete Cables
                </button></>
      
	  : props.table == "SMARTCAPTAR_QUEUE" ? 
    <>
    
	  <button
        className="approveCablesButton"
        onClick={() => {
          setApproveIsOpen(true);
        }}
      >
        Approve Cables
      </button>
      
      
      <button
      className="approveCablesButton"
      onClick={() => {
        setRejectIsOpen(true);
      }}
    >
      Reject Cables
    </button>
    
    </>
	  : null}
    <button
      className="approveCablesButton"
      onClick={() => {
        ExportCSV();
      }}
    >
      Export to CSV
    </button>
    </div>




		  <div style={{display:"flex",flexDirection:"row",margin:10}}>
		
		<FilterBar searchInventory={searchInventory}table={props.table}setSearch={setSearch} setFilter={setFilter} filterTerm={filterTerm} name={props.table == "SMARTCAPTAR_UPLOAD" ?"Workspace" : props.table =="CABLEINV" ? "Inventory" : "Queue"}/>
	
  <div style={{marginLeft:"auto"}}> 
    {props.table =="CABLEINV" ? 
    <TablePagination
    containerStyle={{alignSelf:"flex-end"}}
  component="div"
  count={total}
  page={page -1}
  onPageChange={(event,newPage) => {
    console.log(newPage)
	setPage(newPage + 1);
  getCablesAPI(newPage+1)  
  }}
  rowsPerPage={rows}
  onRowsPerPageChange={(event) => {
    setRows(event.target.value)
  }}

  
/>: <TablePagination
  component="div"
  count={total}
  page={page -1}
  onPageChange={(event,newPage) => {
	setPage(newPage+1); 
  }}
  rowsPerPage={rows}
  onRowsPerPageChange={(event) => {
    setRows(event.target.value)
  }}

  
/>}
</div>
	   
    </div>
    </div>
	
     <div className="innerDiv">
  
      <table className="table">
        <thead>
          <tr class="tableSeperator">
			{props.table != "SMARTCAPTAR_HISTORY" && props.table != "CABLEINV" && props.table != "SMARTCAPTAR_APPROVED" ? 
            <th>
              <input
                type="checkbox"
                onChange={e => {
                  let value = e.target.checked;
                  setCables(
                    cables.map(d => {
                      d.select = value;
                      return d;
                    })
                  );
                }}
              />
            </th>
			: null}
            {headers.map((header,index) => {
							return <th key={header}>{header}</th>;
							})}
          </tr>
        </thead>
		{cables.length != 0 ? 
        <tbody>
          {props.table == 'SMARTCAPTAR_UPLOAD' || props.table == 'SMARTCAPTAR_QUEUE' ? 
          <CablesRow
            cables={cables.sort((a,b) => {
             
              if(a.STATUS == 'REJECTED' && b.STATUS == 'NEW'){
                return -1;
              }else if(a.STATUS == 'REJECTED' && b.STATUS == 'PENDING'){
                return -1;
              } else if(a.STATUS == 'NEW' && b.STATUS == 'PENDING'){
                return -1;
              }else{
                return 1;
              }
              
            }).filter((item) => {
              if (searchTxt == "") {
                return item;
              } else if (item[filterTerm].toLowerCase().includes(searchTxt.toLowerCase())) {
                return item;
              }
              }).slice((page-1)*10,(page-1)*10 + 10)}
			headers={headers}
            setCables={setCables}
			openModalView={openModalView}
			table={props.table}
      cable={props.cable}
      user={props.user}
      
          />
		 : <CablesRow
     cables={cables}
headers={headers}
     setCables={setCables}
openModalView={openModalView}
user={props.user}
table={props.table}
cable={props.cable}

   />}
        </tbody>
		 :  <div></div>}
      </table>
      {loading ? 
            <BeatLoader className="noCables" /> : 
      cables.length == 0 ? 
      <div class="noCables"><h1>NO CABLES AVAILABLE</h1></div>
: null}
	  </div>
	  </div>
    </div>
  );
}

export default CableInventoryView;
