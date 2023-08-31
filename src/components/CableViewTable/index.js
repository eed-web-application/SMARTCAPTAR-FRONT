import React, { useState, useEffect } from "react";
import {
  uploadedOrder,
  historyOrder,
  inventoryOrder,
} from "../../Headers/order";
import CablesRow from "../TableCableRow/CablesRow";
import { TablePagination } from "@mui/material";
import FilterBar from "../FilterBar/index";
import axios from "axios";
axios.defaults.baseURL = "http://134.79.206.193/smcaptar";
import "./styles.css";
import { BeatLoader } from "react-spinners";
import Modal from "react-modal";
import CreateCableModal from "../Modals/CreateCableModal/index";
import CableQAModal from "../Modals/CableWorkspaceModal";
import { usePapaParse } from "react-papaparse";
import SearchModalView from "../Modals/CableInventoryModal";
import CableHistoryModal from "../Modals/CableHistoryModal";
import { JSON2CSV } from "./JSON2CSV";
import Lottie from "lottie-react";
import Success from "../../assets/success.json";

//Custom styles for the modal that is used to display the Request Approvals, Delete Cables modals
const customStyles = {
  overlay: {
    zIndex: "4",
  },
  content: {
    top: "40%",
    left: "55%",
    right: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    borderRadius: 20,
    height: 252,
    width: 698,
    backgroundColor: "#FFFFFF",
  },
};
function CableInventoryView(props) {
  //State to hold Cables from get request
  const [cables, setCables] = useState([]);
  //State to hold if modal is open or not
  const [modalIsOpen, setIsOpen] = useState(false);
  // state to hold the cable information for a cable that is clicked on
  const [modalCable, setModalCable] = useState({});
  const [page, setPage] = useState(1);
  //Setting the headers used for the table
  const [headers, setHeaders] = useState(uploadedOrder);
  //State to hold the text that is typed in the search box
  const [searchTxt, setSearch] = useState("");
  //State to hold which text is selected from the dropdown
  const [filterTerm, setFilter] = useState("CABLENUM");
  //State that sets if table is loading or not
  const [loading, setLoading] = useState(true);
  //Total amount of cables loaded
  const [total, setTotal] = useState(0);
  //State if modal for delete is open or not
  const [modalDeleteIsOpen, setDeleteIsOpen] = React.useState(false);
  //State if modal for Creating a new cable is open or not
  const [modalCreateIsOpen, setCreateIsOpen] = React.useState(false);
  //State if modal for Queing cables is open or not
  const [modalReqApproveIsOpen, setReqApproveIsOpen] = React.useState(false);
  //State if modal for Approving Cables is open or not
  const [modalApproveIsOpen, setApproveIsOpen] = React.useState(false);
  //State if modal for Rejecting cables is open or not
  const [modalRejectIsOpen, setRejectIsOpen] = React.useState(false);
  //State to check if a user selects to queue cables
  const [check, setCheck] = React.useState(false);
  //State that holds all cable types associated with a cable
  const [types, setTypes] = useState([]);
  const [rows, setRows] = useState(10);
  const [columnInfo, setColumnInfo] = useState({});
  //State that holds the text for rejection comments
  const [comments, setComments] = useState("");
  const [projects, setProjects] = useState([]);
  //State that holds user information
  const [user, setUser] = useState({});
  //State that holds all connector types that match the cable type selected in the modify cable menu
  const [conn, setConnTypes] = useState([]);
  const [admins, setAdmins] = useState([]);
  //Functions to change the text value of each header in the modify cable modal
  const handleSubmitUpdate = (event, cable, key) => {
    event.preventDefault();
    var text = event.target.value;
    var temp = cable;
    temp[key] = text;
    setModalCable(temp);
  };

  //Utillity function for closing the modal and resetting the state
  function closeModal() {
    setIsOpen(false);
    setModalCable({});
  }
  //Utility function for closing the create modal and fetching the cables again
  function closeCreateModal() {
    setCreateIsOpen(false);
    getCablesAPI(page);
  }
  //Function for getting all cable types and setting the values to the state
  const getTypes = async () => {
    const response = await fetch(
      `http://134.79.206.193/smcaptar/getCableTypes`
    );
    const data = await response.json();
    setTypes(data.types);
  };
  //Get all project names and setting it to the state
  const getProjects = async () => {
    const response = await fetch(`http://134.79.206.193/smcaptar/getProjects`);
    const data = await response.json();
    setProjects(data.projects);
  };
  //Get all connector types associated with a cable type
  const getConnTypes = async (CT) => {
    const response = await fetch(
      `http://134.79.206.193/smcaptar/getConnTypes?cableType=${CT}`
    );
    const data = await response.json();
    setConnTypes(data.types);
  };
  //Opens modal and sets the correct data to be shown
  const openModalView = (cable) => {
    if (props.table != "SMARTCAPTAR_HISTORY") {
      getProjects();
      getTypes();
      getConnTypes(cable.CABLETYPE);
    }
    setModalCable(cable);
    setIsOpen(true);
  };
  //Function used to search CABLEINV once the user clicks submit
  const searchInventory = async () => {
    const response = await fetch(
      `http://134.79.206.193/smcaptar/getCablesInventory?offset=${
        (page - 1) * rows
      }&user=${props.user.USERNAME}&table=${
        props.table
      }&searchTxt=${searchTxt}&filter=${filterTerm}`
    );
    const data = await response.json();
    await setCables(data.cables);
    setTotal(data.total);
    setColumnInfo(data.columnInfo);
    if (props.table == "CABLEINV") {
      setHeaders(inventoryOrder);
    }
    setLoading(false);
  };
  //Function for getting the correct cables based on table being passed to this component
  const getCablesAPI = async (p, row) => {
    console.log(row);
    if (searchTxt != "" && props.table == "CABLEINV") {
      const response = await fetch(
        `http://134.79.206.193/smcaptar/getCablesInventory?offset=${
          (p - 1) * row
        }&user=${props.user.USERNAME}&table=${
          props.table
        }&searchTxt=${searchTxt}&filter=${filterTerm}&rows=${rows}`
      );
      const data = await response.json();
      await setCables(data.cables);
      setTotal(data.total);
      setColumnInfo(data.columnInfo);
      if (props.table == "CABLEINV") {
        setHeaders(inventoryOrder);
      }
      setLoading(false);
    } else if (props.table == "SMARTCAPTAR_HISTORY") {
      const response = await fetch(
        `http://134.79.206.193/smcaptar/getCables?offset=${
          (p - 1) * rows
        }&user=${props.user.USERNAME}&table=${props.table}&CABLENUM=${
          props.cable
        }`
      );
      const data = await response.json();
      await setCables(data.cables);
      setTotal(data.total);
      setColumnInfo(data.columnInfo);
      setLoading(false);
    } else {
      const response = await fetch(
        `http://134.79.206.193/smcaptar/getCables?offset=${
          (p - 1) * row
        }&user=${props.user.USERNAME}&table=${props.table}&rows=${row}`
      );
      const data = await response.json();
      await setCables(data.cables);
      setTotal(data.total);
      setColumnInfo(data.columnInfo);

      if (props.table == "CABLEINV") {
        setHeaders(inventoryOrder);
      }
      setLoading(false);
    }
  };
  //The use effect gets the user, then fetches cables
  useEffect(() => {
    console.log(columnInfo);
    var loggedInUser = localStorage.getItem("user");

    var foundUser;
    if (loggedInUser != null) {
      foundUser = JSON.parse(loggedInUser);

      setUser(foundUser);
    }
    getCablesAPI(page, rows);
  }, []);
  //Selected each cable with a checkmark and approves them
  async function ApproveCables() {
    let tempCables = [];
    cables.forEach((d) => {
      if (d.select) {
        tempCables.push(d);
      }
    });
    let newData = await axios.post(`/approveCables`, {
      cables: tempCables,
      user: props.user.USERNAME,
    });
    setApproveIsOpen(false);
    getCablesAPI(page);
  }
  //Selects each cable marked with a check and queues the cables
  async function QueueCables() {
    let tempCables = [];
    cables.forEach((d) => {
      if (d.select) {
        tempCables.push(d);
      }
    });
    await axios
      .post(`/queueCables?table=${"SMARTCAPTAR_QUEUE"}`, { cables: tempCables })
      .then(() => console.log("FINSIHED"));
    setCables([]);
    await getCablesAPI(page, user);
  }
  //Close the approval Modal and resets the state
  async function close() {
    setReqApproveIsOpen(false);
    setCheck(false);
    QueueCables();
  }
  //Function to delete cables marked with a check
  async function DeleteCables() {
    let tempCables = [];
    cables.forEach((d) => {
      if (d.select) {
        tempCables.push(d);
      }
    });
    await axios.post(`/deleteCables`, { cables: tempCables });
    setDeleteIsOpen(false);
    setCables([]);
    await getCablesAPI(page, user);
  }
  //Function to export the cables marked by a check to a CSV format
  async function ExportCSV() {
    // var csv = Papa.unparse(array0;
    let tempCables = [];
    cables.forEach((d) => {
      if (d.select) {
        tempCables.push(d);
      }
    });

    JSON2CSV(tempCables, "CAPTAR");
  }
  //Updates a single cable
  async function updateCableDB(cable) {
    console.log(cable);
    await axios
      .post(`/updateCable?table=${props.table}`, {
        cable: cable,
        user: props.user.USERNAME,
      })
      .then(
        (response) => {
          var result = response.data;
        },
        (error) => {
          console.log(error);
        }
      );

    await getCablesAPI(page);
    closeModal();
  }
  //Rejects each cable marked with a check
  async function RejectCables() {
    let tempCables = [];
    cables.forEach((d) => {
      if (d.select) {
        tempCables.push(d);
      }
    });
    await axios
      .post(`/rejectCables?table=${props.table}`, {
        cables: tempCables,
        comment: comments,
      })
      .then(
        (response) => {
          var result = response.data;
        },
        (error) => {
          console.log(error);
        }
      );

    setCables([]);
    await getCablesAPI(page, user);
    setRejectIsOpen(false);
  }
  //Rejects cables marked with a check
  async function CancelQueue(num) {
    await axios
      .post(`/cancelQueue?table=${props.table}`, { cableNum: num })
      .then(
        (response) => {
          var result = response.data;
        },
        (error) => {
          console.log(error);
        }
      );
    await getCablesAPI(page);
  }

  const CreateCable = async () => {
    getTypes();
    getProjects();
    // getConnTypes(cable.CABLETYPE);
    setCreateIsOpen(true);
  };

  return (
    <div style={{ marginTop: 20, marginLeft: 20 }}>
      {props.table == "CABLEINV" ? (
        <SearchModalView
          user={props.user.USERNAME}
          cable={modalCable}
          headers={inventoryOrder}
          closeModal={closeModal}
          modalIsOpen={modalIsOpen}
        />
      ) : null}
      <Modal
        isOpen={modalReqApproveIsOpen}
        style={customStyles}
        contentLabel="Example Modal"
      >
        {!check ? (
          <div>
            <p className="modal-text" style={{ textAlign: "center" }}>
              Are you sure you want to <span class="red_text">Approve</span>?
            </p>
            <div style={{ textAlign: "center" }}>
              <button
                style={{ margin: 20 }}
                className="cancelButton"
                onClick={() => setReqApproveIsOpen(false)}
              >
                Cancel
              </button>
              <button
                style={{ margin: 20 }}
                className="deleteButton"
                onClick={() => {
                  setCheck(true);
                }}
              >
                Request Approvals
              </button>
            </div>
          </div>
        ) : (
          <Lottie
            animationData={Success}
            loop={true}
            onLoopComplete={() => {
              close();
            }}
          />
        )}
      </Modal>

      <Modal
        isOpen={modalDeleteIsOpen}
        style={customStyles}
        contentLabel="Example Modal"
      >
        <p className="modal-text" style={{ textAlign: "center" }}>
          Are you sure you want to <span class="red_text">Delete Cables</span>?
        </p>
        <div style={{ textAlign: "center" }}>
          <button
            style={{ margin: 20 }}
            className="cancelButton"
            onClick={() => setDeleteIsOpen(false)}
          >
            Cancel
          </button>
          <button
            style={{ margin: 20 }}
            className="deleteButton"
            onClick={() => DeleteCables()}
          >
            Delete Cables
          </button>
        </div>
      </Modal>
      <CreateCableModal
        user={props.user}
        projects={projects}
        types={types}
        conn={conn}
        headers={headers}
        closeCreatemodal={closeCreateModal}
        modalCreateIsOpen={modalCreateIsOpen}
      />

      <Modal
        isOpen={modalApproveIsOpen}
        style={customStyles}
        contentLabel="Example Modal"
      >
        <p className="modal-text" style={{ textAlign: "center" }}>
          Are you sure you want to <span class="red_text">Approve Cables</span>?
        </p>

        <div style={{ textAlign: "center" }}>
          <button
            style={{ margin: 20 }}
            className="cancelButton"
            onClick={() => setApproveIsOpen(false)}
          >
            Cancel
          </button>
          <button
            style={{ margin: 20 }}
            className="deleteButton"
            onClick={() => ApproveCables()}
          >
            Approve Cables
          </button>
        </div>
      </Modal>

      <Modal
        isOpen={modalRejectIsOpen}
        style={customStyles}
        contentLabel="Example Modal"
      >
        <p className="modal-text" style={{ textAlign: "center" }}>
          Is there a reason you are <span class="red_text">Rejecting</span>{" "}
          these Cables?
        </p>
        <div
          style={{ flex: 1, justifyContent: "center", alignContent: "center" }}
        >
          <input
            type="textarea"
            name="textValue"
            style={{
              height: 30,
              width: 400,
              borderWidth: 2,
              borderColor: "grey",
              borderRadius: 10,
              alignSelf: "center",
            }}
            onChange={(event) => {
              console.log(event.target.value), setComments(event.target.value);
            }}
          />
        </div>
        <div style={{ textAlign: "center" }}>
          <button
            style={{ margin: 20 }}
            className="cancelButton"
            onClick={() => setRejectIsOpen(false)}
          >
            Cancel
          </button>
          <button
            style={{ margin: 20 }}
            className="deleteButton"
            onClick={() => RejectCables()}
          >
            Reject Cables
          </button>
        </div>
      </Modal>

      {loading ||
      props.table == "CABLEINV" ||
      props.table == "SMARTCAPTAR_HISTORY" ? null : (
        <CableQAModal
          getConnTypes={getConnTypes}
          columnInfo={columnInfo}
          conn={conn}
          projects={projects}
          admins={admins}
          types={types}
          table={props.table}
          cancelQueue={CancelQueue}
          cable={props.cable}
          updateCableDB={updateCableDB}
          headers={headers}
          modalCable={modalCable}
          closeModal={closeModal}
          modalIsOpen={modalIsOpen}
          handleSubmitUpdate={handleSubmitUpdate}
        />
      )}
      {loading || props.table == "SMARTCAPTAR_HISTORY" ? (
        <CableHistoryModal
          columnInfo={columnInfo}
          conn={conn}
          projects={projects}
          admins={admins}
          types={types}
          table={props.table}
          cancelQueue={CancelQueue}
          cable={props.cable}
          updateCableDB={updateCableDB}
          headers={headers}
          modalCable={modalCable}
          closeModal={closeModal}
          modalIsOpen={modalIsOpen}
          handleSubmitUpdate={handleSubmitUpdate}
        />
      ) : null}
      <div className="tableDivCables">
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              flexDirection: "row",
              flex: 1,
              margin: 10,
              marginBottom: 5,
            }}
          >
            {props.table == "SMARTCAPTAR_UPLOAD" ? (
              <>
                <button
                  className="approveCablesButton"
                  onClick={() => {
                    CreateCable();
                  }}
                >
                  Create Cable
                </button>
                <button
                  className="approveCablesButton"
                  onClick={() => {
                    setReqApproveIsOpen(true);
                  }}
                >
                  Request Approvals
                </button>

                <button
                  className="approveCablesButton"
                  onClick={() => {
                    setDeleteIsOpen(true);
                  }}
                >
                  Delete Cables
                </button>
              </>
            ) : props.table == "SMARTCAPTAR_QUEUE" ? (
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
            ) : null}
            {props.table != "SMARTCAPTAR_HISTORY" ? (
              <button
                className="approveCablesButton"
                onClick={() => {
                  ExportCSV();
                }}
              >
                Export to CSV
              </button>
            ) : null}
          </div>

          <div style={{ display: "flex", flexDirection: "row", margin: 10 }}>
            {props.table != "SMARTCAPTAR_HISTORY" ? (
              <FilterBar
                searchInventory={searchInventory}
                table={props.table}
                setSearch={setSearch}
                setFilter={setFilter}
                filterTerm={filterTerm}
                name={
                  props.table == "SMARTCAPTAR_UPLOAD"
                    ? "Workspace"
                    : props.table == "CABLEINV"
                    ? "Inventory"
                    : "Queue"
                }
              />
            ) : null}
            <div style={{ marginLeft: "auto" }}>
              {props.table == "CABLEINV" ? (
                <TablePagination
                  containerStyle={{ alignSelf: "flex-end" }}
                  component="div"
                  count={total}
                  page={page - 1}
                  onPageChange={(event, newPage) => {
                    console.log(newPage);
                    setPage(newPage + 1);
                    getCablesAPI(newPage + 1, rows);
                  }}
                  rowsPerPage={rows}
                  onRowsPerPageChange={(event) => {
                    setRows(event.target.value);
                    getCablesAPI(page, event.target.value);
                  }}
                />
              ) : (
                <TablePagination
                  component="div"
                  count={total}
                  page={page - 1}
                  onPageChange={(event, newPage) => {
                    setPage(newPage + 1);
                  }}
                  rowsPerPage={rows}
                  onRowsPerPageChange={(event) => {
                    setRows(event.target.value);
                  }}
                />
              )}
            </div>
          </div>
        </div>

        <div style={cables.length != 0 ? { overflow: "auto" } : {}}>
          <table className="table">
            <thead>
              <tr class="tableSeperator">
                {props.table != "SMARTCAPTAR_HISTORY" &&
                props.table != "CABLEINV" &&
                props.table != "SMARTCAPTAR_APPROVED" ? (
                  <th>
                    <input
                      type="checkbox"
                      onChange={(e) => {
                        let value = e.target.checked;
                        setCables(
                          cables
                            // .slice((page - 1) * rows, (page - 1) * rows + rows)
                            .map((d) => {
                              d.select = value;
                              return d;
                            })
                        );
                      }}
                    />
                  </th>
                ) : null}
                {headers.map((header, index) => {
                  return <th key={header}>{header}</th>;
                })}
              </tr>
            </thead>
            {cables.length != 0 ? (
              <tbody>
                {props.table == "SMARTCAPTAR_UPLOAD" ||
                props.table == "SMARTCAPTAR_QUEUE" ? (
                  <CablesRow
                    cables={
                      cables
                        .sort((a, b) => {
                          if (a.STATUS == "REJECTED" && b.STATUS == "NEW") {
                            return -1;
                          } else if (
                            a.STATUS == "REJECTED" &&
                            b.STATUS == "PENDING"
                          ) {
                            return -1;
                          } else if (
                            a.STATUS == "NEW" &&
                            b.STATUS == "PENDING"
                          ) {
                            return -1;
                          } else {
                            return 1;
                          }
                        })
                        .filter((item) => {
                          if (searchTxt == "") {
                            return item;
                          } else if (
                            item[filterTerm]
                              .toLowerCase()
                              .includes(searchTxt.toLowerCase())
                          ) {
                            return item;
                          }
                        })
                      //.slice((page - 1) * rows, (page - 1) * rows + rows)
                    }
                    headers={headers}
                    setCables={setCables}
                    openModalView={openModalView}
                    table={props.table}
                    cable={props.cable}
                    user={props.user}
                  />
                ) : (
                  <CablesRow
                    cables={cables}
                    headers={headers}
                    setCables={setCables}
                    openModalView={openModalView}
                    user={props.user}
                    table={props.table}
                    cable={props.cable}
                  />
                )}
              </tbody>
            ) : (
              <div></div>
            )}
          </table>
          {loading ? (
            <div style={{ margin: 20 }}>
              <BeatLoader className="noCables" />
            </div>
          ) : cables.length == 0 ? (
            <div class="noCables">
              <h1>NO CABLES AVAILABLE</h1>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default CableInventoryView;
