import React, { useState, useEffect } from "react";
// import "../Cables/styles.css";
import {
  uploadedOrder,
  historyOrder,
  inventoryOrder,
  projectOrder,
} from "../../testData/order";
import CablesRow from "../../TableCableRow/CablesRow";
import { Pagination } from "@mui/material";
import "../CableViewTable/styles.css";
import { BeatLoader } from "react-spinners";
import Modal from "react-modal";
import { AiFillCloseCircle, AiOutlineCheckCircle } from "react-icons/ai";
import axios from "axios";
import baseUrl from "../../../config";
axios.defaults.baseURL = baseUrl;
function ProjectsTableView(props) {
  const [projects, setProjects] = useState([]);
  const [page, setPage] = useState(1);
  const [headers, setHeaders] = useState(projectOrder);
  const [searchTxt, setSearch] = useState("");
  const [filterTerm, setFilter] = useState("CABLENUM");
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalFileIsOpen, setModalFileIsOpen] = useState(false);

  const [modalModifyIsOpen, setModalModifyIsOpen] = useState(false);

  const [project, setProjectName] = useState("");
  const [prefix, setPrefix] = useState("");
  const customStyles = {
    content: {
      width: 800,
      height: 200,
      top: "50%",
      left: "50%",
      right: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
      borderRadius: "15px",
    },
  };
  const closeModal = () => {
    setModalIsOpen(false);
    setProjectName("");
    setPrefix("");
  };
  const closeModalModify = () => {
    setModalModifyIsOpen(false);
    setProject("");
    setPrefix("");
  };
  const getProjectsAPI = async (p) => {
    const response = await fetch(
      `${baseUrl}/getAllProjects`
    );
    const data = await response.json();
    console.log(data.projects);
    setProjects(data.projects);
    setTotal(data.total);
    setLoading(false);
  };

  useEffect(() => {
    getProjectsAPI(page);
  }, []);

  const submitProject = async () => {
    await axios.post(`/addProject`, { project: project, prefix: prefix });
    getProjectsAPI(page);
    setProjectName("");
    setPrefix("");
    closeModal();
  };

  return (
    <div>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Example Modal"
      >
        <div
          style={{
            marginBottom: 10,
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <div onClick={closeModal}>
            <AiFillCloseCircle size={30} />
          </div>
          <div>
            <button
              className="buttonModalCables"
              onClick={() => submitProject()}
            >
              Save
            </button>
          </div>
        </div>
        <div class="QAContainer" style={{ padding: 20 }}>
          <input
            name="text"
            type="text"
            placeholder="Project Name"
            className="input"
            defaultValue={project}
            onChange={(e) => setProjectName(e.target.value)}
          />
          <input
            name="text"
            type="text"
            placeholder="Prefix"
            className="input"
            defaultValue={prefix}
            onChange={(e) => setPrefix(e.target.value)}
          />
        </div>
      </Modal>

      <div style={{ display: "flex", margin: 20 }}>
        <div style={{ marginRight: "40%" }}>
          <p className="dashboard_container_section_title_text">Projects</p>
        </div>
        <div>
          <button
            className="approveCablesButton"
            onClick={() => {
              setModalIsOpen(true);
            }}
          >
            Add New Project
          </button>
        </div>

        <div>
          {/* <FilterBar setSearch={setSearch} setFilter={setFilter} filterTerm={filterTerm}/> */}
        </div>

        <Pagination
          component="div"
          count={Math.ceil(total / 10)}
          page={page}
          onChange={(event, newPage) => {
            setPage(newPage);
          }}
          rowsPerPage={5}
        />
      </div>

      <div className="innerDiv">
        <table className="table">
          <thead>
            <tr class="tableSeperator">
              {headers.map((header, index) => {
                return <th key={index}>{header}</th>;
              })}
            </tr>
          </thead>

          <tbody>
            {projects
              .sort((a, b) => a.PROJECT_NAME.localeCompare(b.PROJECT_NAME))
              .slice((page - 1) * 6, (page - 1) * 6 + 6)
              .map((item) => (
                <tr>
                  <td>{item.PROJECT_NAME}</td>
                  <td>{item.PREFIX}</td>
                  <td>{item.NUM_CABLES}</td>
                  <td>
                    {item.ASSIGNED_USERS != null ? (
                      <select>
                        <option value="" selected disabled hidden>
                          View
                        </option>
                        {item.ASSIGNED_USERS.split(",").map((data, index) => {
                          return <option value={data}>{data}</option>;
                        })}
                      </select>
                    ) : null}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
        {loading ? (
          <BeatLoader className="noCables" />
        ) : projects.length == 0 ? (
          <div class="noCables">
            <h1>NO CABLES AVAILABLE</h1>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default ProjectsTableView;
