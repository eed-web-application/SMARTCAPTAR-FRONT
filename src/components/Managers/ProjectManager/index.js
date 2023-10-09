import React, { useState, useEffect } from "react";
// import "../Cables/styles.css";
import {
  uploadedOrder,
  historyOrder,
  inventoryOrder,
  projectOrder,
} from "../../../Headers/order";
import CablesRow from "../../TableCableRow/CablesRow";
import { Pagination } from "@mui/material";
import "../../CableViewTable/styles.css";
import { BeatLoader } from "react-spinners";
import Modal from "react-modal";
import { AiFillCloseCircle, AiOutlineCheckCircle } from "react-icons/ai";
import axios from "axios";
import FilterBar from "../../FilterBar";
import baseUrl from "../../config";
axios.defaults.baseURL = baseUrl;
function ProjectsTableView(props) {
  const [projects, setProjects] = useState([]);
  const [page, setPage] = useState(1);
  const [headers, setHeaders] = useState(projectOrder);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [searchTxt, setSearch] = useState("");
  const [modify, setModify] = useState(false);
  const [modifyName, setModifyName] = useState(false);

  const [modalIsOpen, setModalIsOpen] = useState(false);

  const [project, setProjectName] = useState("");
  const [prefix, setPrefix] = useState("");
  const customStyles = {
    content: {
      width: 550,
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
    setProjectName("");

    setModify(false);
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
    if (!modify) {
      await axios.post(`/addProject`, { project: project, prefix: prefix });
    } else {
      await axios.post(`/updateProject`, {
        project: project,
        prefix: prefix,
        oldProject: modifyName,
      });
    }
    getProjectsAPI(page);
    setProjectName("");
    setPrefix("");
    setModify(false);
    setModifyName("");
    setProjectName("");
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
          <div onClick={() => closeModal()}>
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
          <FilterBar
            table={"SMARTCAPTAR_USERS"}
            setSearch={setSearch}
            filterTerm={"PROJECT"}
            name={"Projects"}
          />
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

        <div></div>
      </div>

      <div className="innerDiv">
        <div class="managerTableDiv">
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
                .filter((item) => {
                  if (searchTxt == "") {
                    return item;
                  } else if (
                    item.PROJECT_NAME.toLowerCase().includes(
                      searchTxt.toLowerCase()
                    )
                  ) {
                    return item;
                  }
                })
                .sort(function (a, b) {
                  if (b.ASSIGNED_USERS == null) return -1;
                  if (a.ASSIGNED_USERS == null) return 0;
                  return a.ASSIGNED_USERS < b.ASSIGNED_USERS;
                })
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
                    <td>
                      <button
                        className="approveCablesButton"
                        onClick={() => {
                          setProjectName(item.PROJECT_NAME);
                          setModifyName(item.PROJECT_NAME);

                          setPrefix(item.PREFIX);
                          setModalIsOpen(true);
                          setModify(true);
                        }}
                      >
                        Modify
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
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
