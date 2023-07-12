import React, { useState } from "react";
import "./styles.css";
import Modal from "react-modal";
import { Link, useNavigate } from "react-router-dom";
import CloseIcon from "@mui/icons-material/Close";
import { Update } from "@mui/icons-material";
import { CreateCableOrder } from "../../../Headers/order";
import axios from "axios";
import { AiFillCloseCircle, AiOutlineCheckCircle } from "react-icons/ai";
import { newCableTemp } from "./cableTemp";
const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    borderRadius: "15px",
    width: "600px",
  },
};

function CreateCableModal(props) {
  console.log(props.types);
  const navigate = useNavigate();
  const [types, setConnTypes] = useState([]);

  const [cableNum, setCableNum] = useState("");
  const [cableType, setCableType] = useState("");
  const [type, setType] = useState("");
  const [areacode, setAreaCode] = useState("");

  const [newCable, setNewCable] = useState(newCableTemp);
  const handleSubmitUpdate = (event, cable, key) => {
    event.preventDefault();
    var text = event.target.value;
    var temp = cable;
    temp[key] = text;
    setNewCable(temp);
  };
  const handleSubmitUpdateSelect = (value, cable, key) => {
    var text = value;
    var temp = cable;
    temp[key] = text;
    setNewCable(temp);
  };

  const CreateCable = async () => {
    console.log(newCable);
    await axios
      .post(
        `http://134.79.206.193/smcaptar/CreateCable?table=${"SMARTCAPTAR_UPLOAD"}`,
        { cable: newCable, user: props.user.USERNAME }
      )
      .then(
        (response) => {
          setCableNum("");
          setCableType("");
          setType("");
          setAreaCode("");
          props.closeCreatemodal();
        },
        (error) => {
          console.log(error);
        }
      );
  };
  const updateAreaCode = (e) => {
    var project = JSON.parse(e.target.value);

    let numCables = project.NUM_CABLES;
    let prefix = project.PREFIX;
    var string = "" + numCables;
    var pad = "0000";
    let n = pad.substring(0, pad.length - string.length) + string;
    let NEWCABLENUM = `${prefix + n}`;

    setCableNum(NEWCABLENUM);
    handleSubmitUpdateSelect(NEWCABLENUM, newCable, "CABLENUM");
    setAreaCode(project.PROJECT_NAME);
    handleSubmitUpdateSelect(project.PROJECT_NAME, newCable, "AREACODE");
  };
  const updateConnTypes = async (e) => {
    const response = await fetch(
      `http://134.79.206.193/smcaptar/getConnTypes?cableType=${e.target.value}`
    );
    const data = await response.json();
    setConnTypes(data.types);
    handleSubmitUpdateSelect(e.target.value, newCable, "CABLETYPE");
    setCableType(e.target.value);
  };

  return (
    <Modal
      isOpen={props.modalCreateIsOpen}
      onRequestClose={props.closeCreateModal}
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
        <div onClick={props.closeCreatemodal}>
          <AiFillCloseCircle size={30} />
        </div>
        <div>
          <button
            className="buttonModalCables"
            type="button"
            onClick={(e) => {
              CreateCable();
            }}
          >
            Create Cable
          </button>
        </div>
      </div>
      <div className={"top"}>
        <div className={"grid-container"}>
          <div style={{ margin: 50 }}>
            {CreateCableOrder.map((key) => {
              return (
                <div className={"grid-container"}>
                  <div className="grid-item">{key}:</div>
                  <div className="grid-item">
                    {key == "CABLENUM" ? (
                      <input
                        name="text"
                        type="text"
                        className={"input"}
                        disabled
                        value={cableNum}
                      />
                    ) : key == "CABLETYPE" ? (
                      <select
                        className={"input"}
                        onChange={(e) => updateConnTypes(e)}
                      >
                        <option value={"test"}>Select</option>
                        {props.types.map((key, index) => {
                          return (
                            <option value={key.CABLETYPE}>
                              {key.CABLETYPE}
                            </option>
                          );
                        })}
                      </select>
                    ) : key == "AREACODE" ? (
                      <select
                        className={"input"}
                        onChange={(e) => {
                          updateAreaCode(e);
                        }}
                      >
                        <option value={"test"}>Select</option>
                        {props.projects.map((key, index) => {
                          return (
                            <option value={JSON.stringify(key)}>
                              {key.PROJECT_NAME}: {key.AREA}
                            </option>
                          );
                        })}
                      </select>
                    ) : key == "ORIGIN_CONNTYPE" || key == "DEST_CONNTYPE" ? (
                      <select
                        className={"input"}
                        onChange={(e) => {
                          setType(e.target.value);
                          handleSubmitUpdate(e, newCable, key);
                        }}
                      >
                        <option value={"props.conn[1]"}>Select</option>
                        {types.map((key, index) => {
                          return <option value={key}>{key}</option>;
                        })}
                      </select>
                    ) : (
                      <input
                        name="text"
                        type="text"
                        className="input"
                        defaultValue={""}
                        onChange={(e) => handleSubmitUpdate(e, newCable, key)}
                      />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </Modal>
  );
}

export default CreateCableModal;
