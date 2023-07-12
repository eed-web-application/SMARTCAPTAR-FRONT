import React, { useEffect, useState } from "react";
import "./styles.css";
import Modal from "react-modal";
import { Link, useNavigate } from "react-router-dom";
import { BiErrorCircle } from "react-icons/bi";
import { AiFillCloseCircle, AiOutlineCheckCircle } from "react-icons/ai";

const customStyles = {
  content: {
    width: 800,
    height: 700,
    top: "50%",
    left: "50%",
    right: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    borderRadius: "15px",
  },
};

function CableHistoryModal(props) {
  const [cableType, setCableType] = useState(null);

  const navigate = useNavigate();

  return (
    <Modal
      isOpen={props.modalIsOpen}
      onRequestClose={props.closeModal}
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
        <div onClick={props.closeModal}>
          <AiFillCloseCircle size={30} />
        </div>
        <div>
          <button
            className="buttonModalCables"
            onClick={() => props.revertCable(props.modalCable)}
          >
            Revert Change
          </button>
        </div>
      </div>
      <div class="QAContainer">
        <div class="QACableColumn">
          {props.headers.map((key) => {
            return (
              <div className={"grid-container"}>
                <div class="grid-item">{key}:</div>
                <div class="grid-item">
                  <input
                    disabled={true}
                    name="text"
                    type="text"
                    className="input"
                    defaultValue={props.modalCable[key]}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Modal>
  );
}

export default CableHistoryModal;
