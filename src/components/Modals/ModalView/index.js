import React from "react";
import "./styles.css";
import Modal from "react-modal";
import { Link, useNavigate } from "react-router-dom";
import CloseIcon from "@mui/icons-material/Close";

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

function ModalView(props) {
  const navigate = useNavigate();
  return (
    <Modal
      isOpen={props.modalIsOpen}
      onRequestClose={props.closeModal}
      style={customStyles}
      contentLabel="Example Modal"
    >
      <div class="ModalWrapper">
        <div class="ModalItem ModalItemOne">
          <div style={{ display: "flex" }}>
            <p style={{ marginRight: "50%" }} onClick={props.closeModal}>
              <CloseIcon></CloseIcon>
            </p>

            {props.cable != undefined ? (
              <button
                className="buttonModalCables"
                onClick={() => props.revertCable(props.modalCable)}
              >
                Revert Change
              </button>
            ) : props.table != "CABLEINV" ? (
              <div>
                <button
                  className="buttonModalCables"
                  onClick={() => props.updateCableDB(props.modalCable)}
                >
                  Update Cable
                </button>
                <button
                  className="buttonModalCables"
                  onClick={() =>
                    navigate("/cable-history", {
                      state: { cable: props.modalCable.CABLENUM },
                    })
                  }
                >
                  View History
                </button>
                {props.table == "SMARTCAPTAR_UPLOAD" &&
                props.modalCable.STATUS == "PENDING" ? (
                  <button
                    className="buttonModalCables"
                    onClick={() => props.cancelQueue(props.modalCable.CABLENUM)}
                  >
                    Cancel Request
                  </button>
                ) : null}
              </div>
            ) : null}
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
                        className="input"
                        defaultValue={props.modalCable[key]}
                        onChange={(e) =>
                          props.handleSubmitUpdate(e, props.modalCable, key)
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

export default ModalView;
