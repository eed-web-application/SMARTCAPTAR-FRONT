import React, { useState, useEffect } from "react";
import "./styles.css";
import { userOrder } from "../../../Headers/order";
import "../../CableViewTable/styles.css";
import { BeatLoader } from "react-spinners";
import Modal from "react-modal";
import { AiFillCloseCircle, AiOutlineCheckCircle } from "react-icons/ai";
import axios from "axios";
import FileUploadView from "../../Modals/FileUploadModal/FileUpload";
import { JSON2CSV } from "../../CableViewTable/JSON2CSV";
import baseUrl from "../../config";
axios.defaults.baseURL = baseUrl;

import FilterBar from "../../FilterBar";
function SettingsTableView(props) {
  const [users, setUsers] = useState([]);
  const [headers, setHeaders] = useState(userOrder);
  const [searchTxt, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalModifyIsOpen, setModifyModalIsOpen] = useState(false);
  const [tempUser, setModifyUser] = useState({ USERNAME: "", PROJECTS: "" });
  const [tempUserProjects, setModifyUserProjects] = useState([]);
  const [modalFileIsOpen, setModalFileIsOpen] = useState(false);

  const [username, setUsername] = useState("");
  const [projects, setProjects] = useState([]);
  const [addProjects, setAddProject] = useState([]);
  const [tempProject, setTempProject] = useState("");
  const customStyles = {
    content: {
      width: 500,
      height: 300,
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
    setModalFileIsOpen(false);
    setAddProject([]);
    setUsername("");
  };

  const submitUser = async () => {
    await axios.post(`/addUser`, {
      user: username,
      admin: false,
      projects: addProjects.toString(),
    });
    closeModal();
    getUsersAPI(page);
  };

  const deleteUser = async () => {
    await axios.post(`/deleteUser`, {
      user: tempUser.USERNAME,
      projects: tempUser.PROJECTS,
    });
    closeModifyModal();
    getUsersAPI(page);
  };

  const getUsersAPI = async (p) => {
    const response = await fetch(`${baseUrl}/getAllUsers`);
    const data = await response.json();
    setUsers(data.users);
    setHeaders(userOrder);

    setLoading(false);
  };
  const getProjectsAPI = async (p) => {
    const response = await fetch(
      `${baseUrl}/getAllProjects`
    );
    const data = await response.json();
    setProjects(data.projects);
  };

  const openModal = async () => {
    setModalIsOpen(true);
  };

  const openModifyModal = async (user) => {
    setModifyModalIsOpen(true);
    var temp = user.PROJECTS;
    setModifyUser(user);
    setModifyUserProjects(user.PROJECTS.split(","));
  };

  const updateUser = async () => {
    await axios.post(`/modifyUser`, {
      user: tempUser.USERNAME,
      admin: false,
      projects: tempUserProjects.toString(),
      oldProjects: tempUser.PROJECTS,
    });
    closeModifyModal();
    getUsersAPI(page);
  };

  useEffect(() => {
    console.log(users);
    getUsersAPI();
    getProjectsAPI();
  }, []);

  const deleteSelectedProject = (project) => {
    console.log("Herre");
    var array = [...addProjects]; // make a separate copy of the array
    var index = array.indexOf(project);
    if (index !== -1) {
      array.splice(index, 1);
      setAddProject(array);
    }
  };
  const deleteModifySelectedProject = (project) => {
    console.log(project);
    var array = [...tempUserProjects]; // make a separate copy of the array
    var index = array.indexOf(project);
    if (index !== -1) {
      array.splice(index, 1);
      setModifyUserProjects(array);
    }
  };
  const closeModifyModal = () => {
    setModifyModalIsOpen(false);
  };
  return (
    <div>
      <FileUploadView
        closeModal={closeModal}
        modalIsOpen={modalFileIsOpen}
        file={"USERS"}
      />
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
            <button className="buttonModalCables" onClick={() => submitUser()}>
              Submit
            </button>
          </div>
        </div>
        <div
          class="QAContainer"
          style={{
            padding: 10,
            marginBottom: 10,
            display: "flex",
            justifyContent: "space-between",
            flexDirection: "column",
          }}
        >
          <div>
            <input
              name="text"
              type="text"
              placeholder="Username"
              className="input"
              defaultValue={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div>
            <select
              className="input"
              onChange={(e) => setTempProject(e.target.value)}
            >
              <option value="" selected disabled hidden>
                Choose Project
              </option>
              {projects.map((data, index) => {
                return (
                  <option value={data.PROJECT_NAME}>{data.PROJECT_NAME}</option>
                );
              })}
            </select>
            <button
              className="buttonModalCables"
              onClick={() => {
                if (!addProjects.includes(tempProject) && tempProject != "") {
                  console.log(tempProject);
                  setAddProject((addProjects) => [...addProjects, tempProject]);
                }
              }}
            >
              Add Project
            </button>
          </div>
          <div style={{ display: "flex", padding: 5 }}>
            {addProjects.map((data, index) => {
              return (
                <div class="parent inline-flex-parent">
                  <div class="child" style={{ paddingRight: 5 }}>
                    <p className="selectedProject">{data}</p>
                  </div>
                  <div class="child">
                    <button
                      onClick={() => {
                        deleteSelectedProject(data);
                      }}
                      className="deleteSelectedProject"
                    >
                      X
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={modalModifyIsOpen}
        onRequestClose={closeModifyModal}
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
          <div onClick={closeModifyModal}>
            <AiFillCloseCircle size={30} />
          </div>
          <div>
            <button className="buttonModalCables" onClick={() => updateUser()}>
              Submit
            </button>
            <button className="buttonModalCables" onClick={() => deleteUser()}>
              Delete
            </button>
          </div>
        </div>

        <div
          class="QAContainer"
          style={{
            padding: 10,
            marginBottom: 10,
            display: "flex",
            justifyContent: "space-between",
            flexDirection: "column",
          }}
        >
          <div>
            <input
              name="text"
              type="text"
              placeholder="Username"
              className="input"
              defaultValue={tempUser.USERNAME}
            />
          </div>

          <div>
            <select
              className="input"
              onChange={(e) => setTempProject(e.target.value)}
            >
              <option value="" selected disabled hidden>
                Choose Project
              </option>
              {projects.map((data, index) => {
                return (
                  <option value={data.PROJECT_NAME}>{data.PROJECT_NAME}</option>
                );
              })}
            </select>
            <button
              className="buttonModalCables"
              onClick={() => {
                if (
                  !tempUserProjects.includes(tempProject) &&
                  tempProject != ""
                ) {
                  setModifyUserProjects((tempUserProjects) => [
                    ...tempUserProjects,
                    tempProject,
                  ]);
                }
              }}
            >
              Add Project
            </button>
          </div>
          <div style={{ display: "flex", padding: 5 }}>
            {tempUserProjects.length > 0 ? (
              <div>
                {tempUserProjects.map((data, index) => {
                  return (
                    <div class="parent inline-flex-parent">
                      <div class="child" style={{ paddingRight: 5 }}>
                        <p className="selectedProject">{data}</p>
                      </div>
                      <div class="child">
                        <button
                          onClick={() => {
                            deleteModifySelectedProject(data);
                          }}
                          className="deleteSelectedProject"
                        >
                          X
                        </button>
                      </div>
                    </div>
                  );
                })}{" "}
              </div>
            ) : null}
          </div>
        </div>
      </Modal>

      <div style={{ display: "flex", margin: 20 }}>
        <div style={{}}>
          <p className="dashboard_container_section_title_text">Users</p>
        </div>

        <div>
          <FilterBar
            table={"SMARTCAPTAR_USERS"}
            setSearch={setSearch}
            filterTerm={"USERNAME"}
            name={"Usernames"}
          />
        </div>

        <div>
          <button
            className="approveCablesButton"
            onClick={() => {
              setModalFileIsOpen(true);
            }}
          >
            CSV Update
          </button>
          <button
            className="approveCablesButton"
            onClick={() => {
              JSON2CSV(users, "USERS");
            }}
          >
            Export to CSV
          </button>
          <button
            className="approveCablesButton"
            onClick={() => {
              openModal();
            }}
          >
            Add User
          </button>
        </div>

        {/* <div class="column right">
	  <Pagination
  component="div"
  count={Math.ceil(total / 3)}
  page={page}
  onChange={(event,newPage) => {
    console.log(users)
	setPage(newPage);
  }}
  rowsPerPage={6}
  
/> </div> */}
      </div>

      <div class="managerTableDiv">
        <table className="table">
          <thead>
            <tr class="tableSeperator">
              {headers.map((header, index) => {
                return <th key={index}>{header}</th>;
              })}
            </tr>
          </thead>

          <tbody className="userBody">
            {users
              .filter((item) => {
                if (searchTxt == "") {
                  return item;
                } else if (
                  item.USERNAME.toLowerCase().includes(searchTxt.toLowerCase())
                ) {
                  return item;
                }
              })
              .sort((a, b) => a.USERNAME.localeCompare(b.USERNAME))
              .map((item) => (
                <tr>
                  <td>{item.USERNAME}</td>
                  <td>
                    {item.PROJECTS != null ? (
                      <select>
                        <option value="" selected disabled hidden>
                          View
                        </option>
                        {item.PROJECTS.split(",").map((data, index) => {
                          return <option value={data}>{data}</option>;
                        })}
                      </select>
                    ) : null}
                  </td>
                  <td>
                    <button
                      className="approveCablesButton"
                      onClick={() => {
                        openModifyModal(item);
                      }}
                    >
                      Modify
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
        {loading ? (
          <BeatLoader className="noCables" />
        ) : users.length == 0 ? (
          <div class="noCables">
            <h1>NO CABLES AVAILABLE</h1>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default SettingsTableView;
