import React, { useState, useEffect } from "react";
// import "../Cables/styles.css";
import { projectOrder } from "../../../Headers/order";
import { Pagination } from "@mui/material";
import "../../CableViewTable/styles.css";
import { BeatLoader } from "react-spinners";
import Modal from "react-modal";
import { AiFillCloseCircle, AiOutlineCheckCircle } from "react-icons/ai";
import axios from "axios";
import { JSON2CSV } from "../../CableViewTable/JSON2CSV";
import FilterBar from "../../FilterBar";
axios.defaults.baseURL = "http://134.79.206.193/smcaptar";
import FileUploadView from "../../Modals/FileUploadModal/FileUpload";
function CompatibilityTableView(props) {
  const [projects, setProjects] = useState([]);
  const [page, setPage] = useState(1);
  const [headers, setHeaders] = useState(projectOrder);
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
      width: 500,
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
    setModalFileIsOpen(false);
    setCableType("");
    setConns("");
  };
  const getProjectsAPI = async (p) => {
    const response = await fetch(
      `http://134.79.206.193/smcaptar/getCompatibility`
    );
    const data = await response.json();
    console.log(data.compat);
    setProjects(data.compat);
    setTotal(data.total);
    setLoading(false);
  };
  const submitCableType = async () => {
    await axios.post(`/uploadCableType`, {
      CABLETYPE: cableType,
      COMPAT: conns,
    });

    closeModal();
  };

  useEffect(() => {
    getProjectsAPI(page);
  }, []);
  return (
    <div>
      <FileUploadView
        closeModal={closeModal}
        modalIsOpen={modalFileIsOpen}
        file={"COMPATIBILITY"}
      />
      <div
        style={{ display: "flex", margin: 20, justifyContent: "space-between" }}
      >
        <div>
          <p className="dashboard_container_section_title_text">
            Compatibility
          </p>
        </div>
        <div>
          <FilterBar
            table={"SMARTCAPTAR_COMPATIBILITY"}
            setSearch={setSearch}
            filterTerm={"USERNAME"}
            name={"CABLE TYPE"}
          />
        </div>
        <div style={{ flex: "flex-end" }}>
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
              JSON2CSV(projects, "COMPATIBILITY");
            }}
          >
            Export to CSV
          </button>
        </div>
      </div>

      <div class="managerTableDiv">
        <table className="table">
          <thead>
            <tr class="tableSeperator">
              <th>CABLE TYPE</th>
              <th>CONN CAPATIBILITIES</th>
            </tr>
          </thead>

          <tbody>
            {projects
              .filter((item) => {
                if (searchTxt == "") {
                  return item;
                } else if (
                  item.CABLETYPE.toLowerCase().includes(searchTxt.toLowerCase())
                ) {
                  return item;
                }
              })
              .map((item) => (
                <tr>
                  <td>{item.CABLETYPE}</td>
                  <select className={"input"}>
                    {item.COMPAT.split(",").map((data, index) => {
                      return <option value={data}>{data}</option>;
                    })}
                  </select>
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

export default CompatibilityTableView;
