import { useTable } from 'react-table'
import React, { useState, useEffect } from "react";
// import "../Cables/styles.css";
import {uploadedOrder,historyOrder,inventoryOrder} from "../../testData/order"
import CablesRow from "../TableCableRow/CablesRow";
import { getStepButtonUtilityClass, Pagination } from "@mui/material";
import FilterBar from "../FilterBar/index"
import axios from "axios";
axios.defaults.baseURL = 'http://134.79.206.193/smcaptar'
// import {socket} from '../socket'
import ModalView from "../ModalView/index"
import "./styles.css";
import { BeatLoader } from "react-spinners";
import Modal from "react-modal"
import CreateCableModal from "../CreateCableModal";
import CableQAModal from "../CableQA";
import { usePapaParse } from 'react-papaparse';
import {io} from 'socket.io-client'
import { socket } from "../../socket";
 
 function CableViewTableTest(props) {
    const [cables, setCables] = useState([]);
    const [page, setPage] = useState(1)


    useEffect(()=>{
        getCablesAPI(page);
      },[])

    const getCablesAPI = async (p) => {
        console.log("GETTING CABLES")
         
              const response = await fetch(`http://134.79.206.193/smcaptar/getCables?offset=${(p - 1)*10}&table=${props.table}`);
              const data = await response.json();
                    console.log(data.cables)
                  setCables(data.cables);
            
    
          setLoading(false);
        console.log("GOT CABLES")
      }

   const data = cables;
 console.log(data)
   const columns = React.useMemo(
     () => [
       {
         Header: 'CABLENUM',
         accessor: 'CABLENUM', // accessor is the "key" in the data
       },
       {
         Header: 'STATUS',
         accessor: 'STATUS',
       },
     ],
     []
   )
 
   const {
     getTableProps,
     getTableBodyProps,
     headerGroups,
     rows,
     prepareRow,
   } = useTable({ columns, data })
 
   return (
     <table {...getTableProps()} className="table">
       <thead>
         {headerGroups.map(headerGroup => (
           <tr {...headerGroup.getHeaderGroupProps()} class="tableSeperator">
             {headerGroup.headers.map(column => (
               <th
                 {...column.getHeaderProps()}
               >
                 {column.render('Header')}
               </th>
             ))}
           </tr>
         ))}
       </thead>
       <tbody {...getTableBodyProps()}>
         {rows.map(row => {
           prepareRow(row)
           return (
             <tr {...row.getRowProps()}>
               {row.cells.map(cell => {
                 return (
                   <td
                     {...cell.getCellProps()}
                   >
                     {cell.render('Cell')}
                   </td>
                 )
               })}
             </tr>
           )
         })}
       </tbody>
     </table>
   )
 }
 export default CableViewTableTest;
