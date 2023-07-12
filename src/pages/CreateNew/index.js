import React, { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navigation from "../../components/Navigation";
import Profile from "../../components/Profile";
import Papa from "papaparse";
import "./styles.css";
import CreateNewCables from "../../components/CreateNewCables/index";
import Modal from "react-modal";
import Template from "../../assets/template.csv";
import axios from "axios";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",

    //   bottom: 'auto',
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    borderRadius: "20px",
  },
};
const defaultCable = {
  Status: "New",
  CableNumber: "",
  "FormalDevice Name": "",
  FormalDevice: "",
  CableFunction: "",
  CableType: "",
  "Origin Loc": "",
  "Origin  Rack": "",
  "Origin  Side": "",
  "Origin  Ele": "",
  "Origin  Slot": "",
  "Origin  Conn #": "",
  "Origin  Pinlist": "",
  "Origin  Conn Type": "",
  "Origin  Station": "",
  "Origin  Ins": "",
  "Dest  Loc": "",
  "Dest  Rack": "",
  "Dest  Side": "",
  "Dest  Ele": "",
  "Dest  Slot": "",
  "Dest Conn #": "",
  "Dest  Pinlist": "",
  "Dest  Conn Type": "",
  "Dest  Station": "",
  "Dest  Ins": "",
  Length: "",
  Routing: "",
  Revision: "",
  "Job #": "",
  "Drawing #": "",
  "Drawing  Title": "",
  "User  Id": "",
  "List Title": "",
  "Area Code": "",
};
const CreateNew = (props) => {
  const [cables, setCables] = useState([]); //REPLACE CAPTAR TEST WITH THE CORRECT JSON
  const [fileName, setFileName] = useState("");
  const [errorMessage, setErrorMessage] = useState("All Cables Valid");
  const navigate = useNavigate();
  const [modalIsOpen, setIsOpen] = useState(false);
  const [newCable, setNewCable] = useState(defaultCable);
  const [error, setError] = useState(false);
  const [dupes, setDupes] = useState([]);
  const ref = useRef();
  const [loading, setLoading] = useState(false);

  const onChange = (e) => {
    setCables([]);
    console.log("Upload Pressed");
    setFileName(e.target.files[0].name);
    const files = e.target.files;
    let cnt = 0;
    console.log(files[0]);
    if (files) {
      Papa.parse(files[0], {
        skipEmptyLines: true,

        complete: function (results) {
          console.log(results.data);
          let cableArr = [];
          for (let i = 4; i < results.data.length; i++) {
            if (results.data[i][1] != "") {
              let temp = {
                CABLENUM: results.data[i][1],
                FORMDEV_NAME: results.data[i][2],
                FUNC: results.data[i][3],
                CABLETYPE: results.data[i][4],
                ORIGIN_LOC: results.data[i][5],
                ORIGIN_RACK: results.data[i][6],
                ORIGIN_SIDE: results.data[i][7],
                ORIGIN_ELE: results.data[i][8],
                ORIGIN_SLOT: results.data[i][9],
                ORIGIN_CONNUM: results.data[i][10],
                ORIGIN_PINLIST: results.data[i][11],
                ORIGIN_CONNTYPE: results.data[i][12],
                ORIGIN_STATION: results.data[i][13],
                ORIGIN_INSTR: results.data[i][14],
                DEST_LOC: results.data[i][15],
                DEST_RACK: results.data[i][16],
                DEST_SIDE: results.data[i][17],
                DEST_ELE: results.data[i][18],
                DEST_SLOT: results.data[i][19],
                DEST_CONNUM: results.data[i][20],
                DEST_PINLIST: results.data[i][21],
                DEST_CONNTYPE: results.data[i][22],
                DEST_STATION: results.data[i][23],
                DEST_INSTR: results.data[i][24],
                LENGTH: results.data[i][25],
                ROUTING: results.data[i][26],
                REVISION: results.data[i][27],
                JOBNUM: results.data[i][28],
                DWGNUM: results.data[i][29],
                DRAWING_TITLE: results.data[i][30],
                ENTEREDBY: results.data[i][31],
                USERID_LIST_TITLE: results.data[i][32],
                AREACODE: results.data[i][33],
                MIN_LENGTH: results.data[i][34],
                MAX_LENGTH: results.data[i][35],
                ADDNL_LENGTH: results.data[i][36],
                PHASE: results.data[i][37],
                BEAM_AREA: results.data[i][38],
                SECTOR_GROUP: results.data[i][39],
                SECTOR_AREA_SOURCE: results.data[i][40],
                SECTOR_AREA_DEST: results.data[i][41],
                PENETRATION: results.data[i][42],
                PENETRATION_2: results.data[i][43],
              };
              cableArr.push(temp);
            }
          }
          console.log(cableArr);

          console.log(results);
          const arr = results.data.filter(
            (x) => x["Cable #"] != "0" && x["Cable #"] != null
          );

          console.log(arr);

          axios
            .post(
              `http://134.79.206.193/smcaptar/checkCables?table=${"SMARTCAPTAR_UPLOAD"}`,
              { cables: cableArr }
            )
            .then(
              (response) => {
                var result = response.data;
                console.log(result.duplicateCables);
                setDupes(result.duplicateCables);
              },
              (error) => {
                console.log(error);
              }
            );
          setCables(cableArr);
          ref.current.value = "";
        },
      });
    }
  };
  const onSubmitForm = async (e) => {
    e.preventDefault();

    for (var i = 0; i < cables.length; i++) {
      if (dupes.includes(cables[i]["CABLENUM"])) {
        setErrorMessage(
          "Cannot Upload Existing Cables waiting for Approval, Delete Duplicates"
        );
        return;
      }
    }

    if (cables != 0) {
      var uploadedCables = cables;

      for (var i = 0; i < uploadedCables.length; i++) {
        uploadedCables[i].Editor = props.user.USERNAME;
      }
      setLoading(true);
      axios
        .post(
          `http://134.79.206.193/smcaptar/uploadCables?table=${"SMARTCAPTAR_UPLOAD"}`,
          { cables: cables, user: props.user.USERNAME }
        )
        .then(
          (response) => {
            var result = response.data;
            setLoading(false);
            navigate("/uploaded-cables");
          },
          (error) => {
            console.log(error);
          }
        );
    } else {
      setCables([]);

      return;
    }
  };
  return (
    <main className="cablelisting">
      <Navigation
        user={props.user.USERNAME}
        setUser={props.setUser}
        admin={props.user.ADMIN}
        className="createnew_sidebar"
      />
      <Profile
        user={props.user.USERNAME}
        className="createnew_navbar"
        page={"Upload Cables"}
      />

      {!loading ? (
        <form className="createnew_container" onSubmit={(e) => onSubmitForm(e)}>
          {cables.length == 0 ? (
            <div className="createnew_container_section_file">
              <div className="sectionupload">
                <div>
                  <a
                    style={{ "margin-right": 20 }}
                    href={Template}
                    download="TemplateCAPTAR.csv"
                    target="_blank"
                  >
                    Template File
                  </a>

                  <label className="createnew_container_section_button">
                    <input
                      name="file"
                      className="createnew_container_section_button"
                      type="file"
                      accept=".csv"
                      ref={ref}
                      onInput={(e) => onChange(e)}
                    />{" "}
                    Choose File
                  </label>
                  <div className="createnew_container_section_file_title">
                    {fileName}
                  </div>
                </div>
              </div>
            </div>
          ) : null}
          {cables.length != 0 ? (
            <section className="cablelisting_container">
              <CreateNewCables
                errorMessage={errorMessage}
                setCables={setCables}
                cables={cables}
                dupes={dupes}
              />
            </section>
          ) : null}
          {cables.length != 0 ? (
            <div className="createnew_container_section_buttons">
              <Link to="/dashboard">
                <button className="createnew_container_section_cancel_button">
                  Cancel
                </button>
              </Link>
              <button
                className="createnew_container_section_submit_button"
                type="submit"
              >
                SEND TO WORKSPACE
              </button>
            </div>
          ) : null}
        </form>
      ) : null}
    </main>
  );
};

export default CreateNew;
