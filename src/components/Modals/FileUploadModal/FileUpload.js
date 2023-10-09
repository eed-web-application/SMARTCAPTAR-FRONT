import React, { useState } from "react";
import Modal from "react-modal";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { AiFillCloseCircle } from "react-icons/ai";
import "./styles.css";
import { FiUpload } from "react-icons/fi";
import { ElevatorSharp, RepeatOneSharp } from "@mui/icons-material";
import Papa from "papaparse";
import baseUrl from "../../config";
axios.defaults.baseURL = baseUrl;
const customStyles = {
  content: {
    height: 240,

    top: "50%",
    left: "50%",
    right: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    borderRadius: "15px",
  },
};

function FileUploadView(props) {
  const [errorMsg, setErrorMessage] = useState(false);
  const [msg, setMsg] = useState("");
  const [file, setFile] = useState({
    selectedFile: null,
  });

  const checkFileType = async (e, eventType) => {
    let extension = e.target.value.match(/\.([^.]+)$/)[1];

    if (extension == "csv") {
      setFile({ selectedFile: e.target.files[0] });
      Papa.parse(e.target.files[0], {
        skipEmptyLines: true,

        complete: (results) => {
          console.log(results.data);

          let arr = {};
          //for each array, filter the empty columns
          //remove first index
          //set first index = to the string array in the object
          for (var i = 0; i < results.data.length; i++) {
            var temp = results.data[i].filter(function (x) {
              return x != "";
            });
            var label = temp.shift();
            arr[label] = temp.toString();
          }
          console.log(arr);
          let api = "";
          if (props.file == "COMPATIBILITY") {
            api = "csvUploadConnectors";
          } else if (props.file == "USERS") {
            api = "csvUploadUsers";
          }
          axios
            .post(`${baseUrl}/${api}`, { arr: arr })
            .then(
              (response) => {},
              (error) => {
                console.log(error);
              },
              props.closeModal()
            );
        },
      });
    } else {
      setFile({ selectedFile: null });
      setMsg(`.${extension} format is not supported.`);
    }
  };

  const chooseFile = (e) => {
    if (e.target.files && e.target.files[0]) {
      checkFileType(e);
    }
  };

  return (
    <Modal
      isOpen={props.modalIsOpen}
      onRequestClose={props.closeModal}
      style={customStyles}
      contentLabel="Example Modal"
    >
      <div
        style={{
          justifyContent: "center",
          alignContent: "center",
          alignItems: "center",
        }}
      >
        <form className="uploadBox" onSubmit={(e) => e.preventDefault()}>
          {file.selectedFile !== null ? (
            <p className="filename">{file.selectedFile.name}</p>
          ) : msg !== "" ? (
            msg
          ) : (
            <FiUpload className="upload-icon" />
          )}

          <div>
            <div className="drag">
              {" "}
              <div className="browse">
                <label
                  htmlFor="img"
                  className="file-label"
                  onClick={() => document.getElementById("getFile").click()}
                >
                  Browse
                  <input
                    type="file"
                    data-max-size="2048"
                    id="getFile"
                    className="fileIcon"
                    onChange={chooseFile}
                  />
                </label>
              </div>
            </div>
          </div>

          <p className="info">Supported files: CSV</p>
        </form>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <button
            className="approveCablesButton"
            onClick={() => {
              props.closeModal();
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </Modal>
  );
}

export default FileUploadView;
