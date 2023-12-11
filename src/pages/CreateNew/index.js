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
import { FiUpload } from "react-icons/fi";
import Lottie from "lottie-react";
import Loading from "../../assets/loading.json";
import Success from "../../components/Animations/Success";
import baseUrl from "../../config";
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

const CreateNew = (props) => {
  const [cables, setCables] = useState([]); //REPLACE CAPTAR TEST WITH THE CORRECT JSON
  const [fileName, setFileName] = useState("");
  const [errorMessage, setErrorMessage] = useState(["All Cables Valid"]);
  const navigate = useNavigate();
  const [modalIsOpen, setIsOpen] = useState(false);
  const [error, setError] = useState(false);
  const [dupes, setDupes] = useState([]);
  const [recon, setRecon] = useState([]);
  const [msg, setMsg] = useState("");

  const ref = useRef();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const [file, setFile] = useState({
    selectedFile: null,
  });
  const chooseFile = (e) => {
    if (e.target.files && e.target.files[0]) {
      onChange(e);
    }
  };

  const onChange = (e) => {
    let extension = e.target.value.match(/\.([^.]+)$/)[1];

    if (extension == "csv") {
      setFile({ selectedFile: e.target.files[0] });
      setCables([]);
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
            if (
              results.data[0][1] != "" &&
              results.data[1][1] != "" &&
              results.data[2][1] != ""
            ) {
              for (let i = 1; i < results.data.length; i++) {
                let temp = {
                  CABLENUM: results.data[i][0],
                  CABLETYPE: results.data[i][1],
                  JOBNUM: results.data[i][2],
                  ENTEREDBY: results.data[i][3],
                  FUNC: results.data[i][5],
                  LENGTH: results.data[i][8],
                  ROUTING: results.data[i][9],
                  FORMDEV_NAME: results.data[i][42],
                  ORIGIN_LOC: results.data[i][20],
                  ORIGIN_RACK: results.data[i][21],
                  ORIGIN_SIDE: results.data[i][22],
                  ORIGIN_ELE: results.data[i][23],
                  ORIGIN_SLOT: results.data[i][24],
                  ORIGIN_CONNUM: results.data[i][25],
                  ORIGIN_PINLIST: results.data[i][26],
                  ORIGIN_CONNTYPE: results.data[i][27],
                  ORIGIN_STATION: results.data[i][28],
                  ORIGIN_INSTR: results.data[i][29],
                  DEST_LOC: results.data[i][32],
                  DEST_RACK: results.data[i][33],
                  DEST_SIDE: results.data[i][34],
                  DEST_ELE: results.data[i][35],
                  DEST_SLOT: results.data[i][36],
                  DEST_CONNUM: results.data[i][37],
                  DEST_PINLIST: results.data[i][38],
                  DEST_CONNTYPE: results.data[i][39],
                  DEST_STATION: results.data[i][40],
                  DEST_INSTR: results.data[i][41],
                  REVISION: results.data[i][54],
                  DWGNUM: results.data[i][11],
                  DRAWING_TITLE: results.data[i][17],
                  USERID_LIST_TITLE: results.data[i][43],

                  AREACODE: results.data[i][19],
                  MIN_LENGTH: results.data[i][51],
                  MAX_LENGTH: results.data[i][52],
                  ADDNL_LENGTH: results.data[i][53],
                  PHASE: results.data[i][44],
                  BEAM_AREA: results.data[i][45],
                  SECTOR_GROUP: results.data[i][46],
                  SECTOR_AREA_SOURCE: results.data[i][47],
                  SECTOR_AREA_DEST: results.data[i][48],
                  PENETRATION: results.data[i][49],
                  PENETRATION_2: results.data[i][50],
                };
                cableArr.push(temp);
              }
            } else {
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
            }
            console.log(cableArr);

            console.log(results);
            const arr = results.data.filter(
              (x) => x["Cable #"] != "0" && x["Cable #"] != null
            );

            console.log(arr);

            axios
              .post(
                `${baseUrl}/checkCables?table=${"SMARTCAPTAR_UPLOAD"}`,
                { cables: cableArr }
              )
              .then(
                (response) => {
                  var result = response.data;
                  console.log(result.duplicateCables);
                  setDupes(result.duplicateCables);
                  setRecon(result.nonRecognizedCablenums);
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
    } else {
      setFile({ selectedFile: null });
      setMsg(`.${extension} format is not supported.`);
    }
  };
  const onSubmitForm = async (e) => {
    e.preventDefault();

    if (cables != 0) {
      var uploadedCables = cables;

      for (var i = 0; i < uploadedCables.length; i++) {
        uploadedCables[i].Editor = props.user.USERNAME;
      }
      setLoading(true);
      axios
        .post(
          `${baseUrl}/uploadCables?table=${"SMARTCAPTAR_UPLOAD"}`,
          {
            cables: cables,
            user: props.user.USERNAME,
            dupes: dupes,
            recon: recon,
          }
        )
        .then(
          (response) => {
            var result = response.data;
            setLoading(false);
            setSuccess(true);
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
      <div style={{ width: 10, height: 10 }}></div>

      {!loading ? (
        <form className="createnew_container" onSubmit={(e) => onSubmitForm(e)}>
          {success ? (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                alightContent: "center",
              }}
            >
              <Success onComplete={navigate} />
            </div>
          ) : null}
          {cables.length == 0 && !success ? (
            <div
              style={{
                justifyContent: "center",
                alignContent: "center",
                alignItems: "center",
                backgroundColor: "white",
                borderRadius: 10,
              }}
            >
              <form
                onClick={() => document.getElementById("getFile").click()}
                className="uploadBox"
                onSubmit={(e) => e.preventDefault()}
              >
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
                      <label htmlFor="img" className="file-label">
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
            </div>
          ) : null}
          {cables.length != 0 && !success ? (
            <section className="cablelisting_container">
              <CreateNewCables
                errorMessage={errorMessage}
                setCables={setCables}
                cables={cables}
                dupes={dupes}
                recon={recon}
              />
            </section>
          ) : null}
          {cables.length != 0 && !success ? (
            <div className="createnew_container_section_buttons">
              <button
                onClick={() => {
                  setCables([]), setFile({ selectedFile: null });
                }}
                className="createnew_container_section_cancel_button"
              >
                Cancel
              </button>

              <button
                className="createnew_container_section_submit_button"
                type="submit"
              >
                SEND TO WORKSPACE
              </button>
            </div>
          ) : null}
        </form>
      ) : (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            alightContent: "center",
          }}
        >
          <div
            style={{
              position: "absolute",
              width: 400,
              height: 400,
              borderRadius: 10,
            }}
          >
            <Lottie animationData={Loading} loop={true} />
          </div>
        </div>
      )}
    </main>
  );
};

export default CreateNew;
