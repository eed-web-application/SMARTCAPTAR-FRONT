import React, { useState } from "react";
import "./styles.css";
import Modal from "react-modal";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { AiFillCloseCircle } from "react-icons/ai";
import baseUrl from "../../../config";
axios.defaults.baseURL = baseUrl;
const customStyles = {
  content: {
    height: 700,
    top: "50%",
    left: "50%",
    right: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    borderRadius: "15px",
  },
};

function ConfirmationModal(props) {
  const [errorMsg, setErrorMessage] = useState(false);

  return (
    <Modal
      isOpen={props.modalIsOpen}
      onRequestClose={props.closeModal}
      style={customStyles}
      contentLabel="Example Modal"
    >
      <div class="ModalWrapper">
        {errorMsg ? <p>Cable is Already being Edited</p> : null}
        <div class="ModalItem ModalItemOne">
          <div onClick={props.closeModal}>
            <AiFillCloseCircle size={30} />
          </div>

          <div style={{ left: "70%", position: "absolute" }}>
            <button
              className="buttonModalCables"
              onClick={() => AddToWorkspace(props.cable)}
            >
              Add to Workspace
            </button>
          </div>
        </div>
        <div class="ModalItem">
          <hr class="modalDivider" />
        </div>
        <div class="ModalItem">
          <div className={"grid-container"}>
            <div style={{ marginBottom: 50, marginLeft: 50 }}>
              {props.headers.map((key) => {
                return (
                  <div className={"grid-container"}>
                    <div class="grid-item">{key}:</div>
                    <div class="grid-item">
                      <input
                        name="text"
                        type="text"
                        disabled="disabled"
                        className="input"
                        defaultValue={
                          props.cable[key] == "null" ? "" : props.cable[key]
                        }
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}

export default ConfirmationModal;
