import React, { useState, useEffect } from "react";
import "../CreateNewCables/styles.css";
import { CreateNewOrder } from "../../Headers/order";
import CablesRow from "./CablesRow";
import { getStepButtonUtilityClass, Pagination } from "@mui/material";
import { IoMdCheckmark, IoMdWarning } from "react-icons/io";

function CreateNewCables(props) {
  const [cables, setCables] = useState(props.cables);
  const [page, setPage] = useState(1);
  console.log(props.cables);
  return (
    <div class="bulkUploadContainer">
      <div className="tableDivCablesBulkUpload">
        <div
          style={{
            display: "flex",
            margin: 20,
          }}
        >
          {props.dupes.length > 0 ? (
            <div style={{}}>
              <div className="warning">
                <IoMdWarning color={"white"} />
              </div>

              <h1 className="errormessage">
                Marked Cables are already in a workspace, these cables will not
                be submitted.
              </h1>
            </div>
          ) : null}
          {props.recon.length > 0 ? (
            <div style={{}}>
              <div className="reconWarning">
                <IoMdWarning color={"white"} />
              </div>

              <h1 className="errormessage">
                Marked Cables have an unrecognizable Cable Number, these cables
                will not be submitted.
              </h1>
            </div>
          ) : null}
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
                  recon={props.recon}
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
