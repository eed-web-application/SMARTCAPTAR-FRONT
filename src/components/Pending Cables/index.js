import React, { useState, useEffect } from "react";
// import "../Cables/styles.css";
import {uploadedOrder,historyOrder,inventoryOrder,userOrder,SimpleCableOrder} from "../../testData/order"
import CablesRow from "../TableCableRow/CablesRow";
import {  Pagination } from "@mui/material";
import "../CableViewTable/styles.css"
import { BeatLoader } from "react-spinners";
import "../Pending Cables/styles.css";

function PendingTableView(props) {
  const [cables, setCables] = useState([]);
  const [page, setPage] = useState(1)
  const [headers, setHeaders] = useState(SimpleCableOrder)
  const [searchTxt, setSearch] = useState("");
  const [filterTerm, setFilter] = useState("CABLENUM");
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);



const getPendingCablesAPI = async (p) => {
	
		const response = await fetch(`http://134.79.206.193/smcaptar/getPendingCables?offset=${(p - 1)*10}&table=SMARTCAPTAR_UPLOAD`);
		const data = await response.json();
			setCables(data.cables);
      setTotal(data.total)
	setLoading(false);
}


  useEffect(() => {
  getPendingCablesAPI(page);
  }, []);


  
  return (
	  <div>
		  
      

   
		{/* <FilterBar setSearch={setSearch} setFilter={setFilter} filterTerm={filterTerm}/> */}
    <div className="row">
      <div class="columnSmall leftSmall">
    <p className="dashboard_container_section_title_text">
              Pending Cables
            </p>
            </div>
           
		 <div class="columnSmall rightSmall">
	   <Pagination
  component="div"
  count={Math.ceil(total / 5) }
  page={page}
  onChange={(event,newPage) => {
	setPage(newPage);
  }}
  rowsPerPage={5}
  
/>
 </div>
 </div>
     <div className="innerDiv">
     
      <table class="table">
        <thead>
          <tr class="tableSeperator">
		
            {headers.map((header,index) => {
							return <th key={index}>{header}</th>;
							})}
          </tr>
        </thead>
		
        <tbody>
          {cables.slice((page-1)*5,(page-1)*5 + 5).map(item => (
            <tr>
              <td>
              {item.CABLENUM}
              </td>
              <td className="pendingStatusColor">
              {item.STATUS}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {loading ? 
            <BeatLoader className="noCables" /> : 
      cables.length == 0 ? 
      <div class="noCables"><h1>NO CABLES AVAILABLE</h1></div>
: null}
	  </div>
	  </div>
  );
}

export default PendingTableView;
