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

function CableQAModal(props) {
  const [cableType, setCableType] = useState(null);
  const [connType, setConnType] = useState(null);

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
          {props.cable != undefined ? (
            <button
              className="buttonModalCables"
              onClick={() => props.revertCable(props.modalCable)}
            >
              Revert Change
            </button>
          ) : props.table != "CABLEINV" ? (
            <div>
              {props.modalCable.STATUS != "PENDING" ? (
                <button
                  className="buttonModalCables"
                  onClick={() => props.updateCableDB(props.modalCable)}
                >
                  Update Cable
                </button>
              ) : null}
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
      <div class="QAContainer">
        {props.table != "CABLEINV" ? (
          <div class="QAColumn">
            {props.modalCable.CABLENUM != undefined ? (
              <div>
                {props.modalCable.DUPLICATES.length > 0 ? (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      marginBottom: 10,
                    }}
                  >
                    <div style={{ marginRight: 5 }}>
                      <BiErrorCircle size={20} color={"Yellow"} />
                    </div>
                    <div
                      style={{
                        flex: 1,
                        wordWrap: "break-word",
                        inlineSize: 100,
                        paddingTop: 1,
                      }}
                    >
                      <p style={{ fontWeight: "bold" }}>
                        Potential Duplicate Cable
                      </p>
                    </div>
                  </div>
                ) : null}

                {props.modalCable.ORIGIN_TYPEERR ||
                props.modalCable.DEST_TYPEERR ? (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      marginBottom: 10,
                    }}
                  >
                    <div style={{ marginRight: 5 }}>
                      <BiErrorCircle size={20} color={"red"} />
                    </div>
                    <div
                      style={{
                        flex: 1,
                        wordWrap: "break-word",
                        inlineSize: 100,
                        paddingTop: 1,
                      }}
                    >
                      <p style={{ fontWeight: "bold" }}>
                        Cable Type does not match Connector Type
                      </p>
                    </div>
                  </div>
                ) : null}

                {!(
                  props.modalCable.ORIGIN_TYPEERR ||
                  props.modalCable.DEST_TYPEERR
                ) && props.modalCable.DUPLICATES ? (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      marginBottom: 10,
                    }}
                  >
                    <div style={{ textAlign: "center" }}>
                      <AiOutlineCheckCircle size={50} color={"green"} />
                    </div>
                    <div
                      style={{
                        flex: 1,
                        wordWrap: "break-word",
                        inlineSize: 200,
                        paddingTop: 1,
                        textAlign: "center",
                      }}
                    >
                      <p style={{ fontWeight: "bold" }}>
                        Cable Passed all Checks!
                      </p>
                    </div>
                  </div>
                ) : null}
              </div>
            ) : null}

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                marginBottom: 10,
              }}
            >
              <div style={{ textAlign: "center" }}>Approvals Requested</div>
              <div
                style={{
                  flex: 1,
                  wordWrap: "break-word",
                  inlineSize: 200,
                  paddingTop: 1,
                  textAlign: "center",
                }}
              >
                {props.modalCable.APPROVERS != undefined ? (
                  <div>
                    {Object.entries(
                      JSON.parse(props.modalCable["APPROVERS"])
                    ).map((key) => {
                      return (
                        <div
                          key={key}
                          style={{
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "space-between",
                          }}
                        >
                          <p style={{ fontWeight: "bold" }}>{key}</p>
                          <input type="checkbox" checked={key[1]} />
                        </div>
                      );
                    })}
                  </div>
                ) : null}
              </div>

              <div>
                <h3>Comments:</h3>
                <p>{props.modalCable.COMMENTS}</p>
              </div>
            </div>
          </div>
        ) : null}

        <div class="QACableColumn">
          {props.headers.map((key) => {
            return (
              <div key={key} className={"grid-container"}>
                <div class="grid-item">{key}:</div>
                <div class="grid-item">
                  {key == "STATUS" ||
                  key == "CABLENUM" ||
                  key == "ENTEREDBY" ||
                  key == "CREATED_BY" ||
                  key == "CREATED_DATE" ||
                  key == "MODIFIED_BY" ||
                  key == "MODIFIED_DATE" ? (
                    <input
                      name="text"
                      type="text"
                      disabled="disabled"
                      className="input"
                      defaultValue={
                        props.modalCable[key] == "null"
                          ? ""
                          : props.modalCable[key]
                      }
                      onChange={(e) =>
                        props.handleSubmitUpdate(e, props.modalCable, key)
                      }
                    />
                  ) : key == "CABLETYPE" ? (
                    <select
                      onChange={(e) => {
                        props.handleSubmitUpdate(e, props.modalCable, key);
                        setCableType(e.target.value);
                        props.getConnTypes(e.target.value);
                      }}
                      className={
                        (key == "CABLETYPE" &&
                          props.modalCable.ORIGIN_TYPEERR) ||
                        props.modalCable.DEST_TYPEERR
                          ? "inputRed"
                          : "input"
                      }
                    >
                      <option value={props.modalCable[key]}>
                        {props.modalCable[key]}
                      </option>
                      {props.types.map((key, index) => {
                        return (
                          <option key={key} value={key.CABLETYPE}>
                            {key.CABLETYPE}
                          </option>
                        );
                      })}
                    </select>
                  ) : key == "AREACODE" ? (
                    <select
                      onChange={(e) =>
                        props.handleSubmitUpdate(e, props.modalCable, key)
                      }
                      className={"input"}
                    >
                      <option value={props.modalCable[key]}>
                        {props.modalCable[key]}
                      </option>
                      {props.projects.map((key, index) => {
                        return (
                          <option key={key} value={key.PROJECT_NAME}>
                            {key.PROJECT_NAME}
                          </option>
                        );
                      })}
                    </select>
                  ) : key == "ORIGIN_CONNTYPE" ? (
                    <select
                      onChange={(e) =>
                        props.handleSubmitUpdate(e, props.modalCable, key)
                      }
                      className={
                        props.modalCable.ORIGIN_TYPEERR ? "inputRed" : "input"
                      }
                    >
                      <option value={props.modalCable[key]}>
                        {props.modalCable[key]}
                      </option>
                      {props.conn.map((key, index) => {
                        return (
                          <option key={key} value={key}>
                            {key}
                          </option>
                        );
                      })}
                    </select>
                  ) : key == "DEST_CONNTYPE" ? (
                    <select
                      onChange={(e) =>
                        props.handleSubmitUpdate(e, props.modalCable, key)
                      }
                      className={
                        props.modalCable.DEST_TYPEERR ? "inputRed" : "input"
                      }
                    >
                      <option value={props.modalCable[key]}>
                        {props.modalCable[key]}
                      </option>
                      {props.conn.map((key, index) => {
                        return (
                          <option key={key} value={key}>
                            {key}
                          </option>
                        );
                      })}
                    </select>
                  ) : (
                    <input
                      maxlength={props.columnInfo[key].DATA_LENGTH}
                      name="text"
                      type="text"
                      className="input"
                      defaultValue={props.modalCable[key]}
                      onChange={(e) =>
                        props.handleSubmitUpdate(e, props.modalCable, key)
                      }
                    />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Modal>
  );
}

export default CableQAModal;
