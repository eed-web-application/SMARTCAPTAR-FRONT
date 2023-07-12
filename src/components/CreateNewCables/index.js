import React, { useState, useEffect } from "react";
import "../CreateNewCables/styles.css";
import { CreateNewOrder } from "../../Headers/order";
import CablesRow from "./CablesRow";
import { getStepButtonUtilityClass, Pagination } from "@mui/material";

function CreateNewCables(props) {
  const [cables, setCables] = useState(props.cables);
  const [page, setPage] = useState(1);
  console.log(props.cables);
  return (
    <div class="bulkUploadContainer">
      <div className="tableDivCablesBulkUpload">
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div>
            <h1 className="TableTitle">Uploaded Cables</h1>
            <h1 className="errormessage">{props.errorMessage}</h1>
          </div>
        </div>
        <div className="innerDiv">
          <table className="table">
            <thead>
              <tr>
                <th></th>
                {props.cables.length > 0
                  ? CreateNewOrder.map((header, index) => {
                      return <th key={index}>{header}</th>;
                    })
                  : CreateNewOrder.map((header, index) => {
                      return <th key={index}>{header}</th>;
                    })}
              </tr>
            </thead>
            {props.cables.length > 0 ? (
              <tbody>
                <CablesRow
                  cables={props.cables}
                  dupes={props.dupes}
                  setCables={setCables}
                  openModalView={() => console.log("Test")}
                />
              </tbody>
            ) : null}
          </table>
        </div>
      </div>
    </div>
  );
}

export default CreateNewCables;
