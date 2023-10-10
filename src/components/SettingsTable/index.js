import React, { useState, useEffect } from "react";
import "../CreateNewCables/styles.css";
import { order, tableOrder } from "../../testData/order";
import Modal from "react-modal";
import CablesRow from "../TableCableRow/CablesRow";
import { TablePagination } from "@mui/material";
import baseUrl from "../../../config";
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

function SettingsView(props) {
  const [cables, setCables] = useState([]);
  const [modalIsOpen, setIsOpen] = useState(false);
  const [modalCable, setModalCable] = useState({});
  const [page, setPage] = useState(0);
  const [headers, setHeaders] = useState([]);
  const handleSubmitUpdate = (event, cable, key) => {
    event.preventDefault();
    var text = event.target.value;
    var temp = cable;
    temp[key] = text;
    setModalCable(temp);
  };
  function closeModal() {
    setIsOpen(false);
    setModalCable({});
  }

  const openModalView = (cable) => {
    setIsOpen(true);
    setModalCable(cable);
  };

  const getCablesAPI = async (p) => {
    const response = await fetch(
      `${baseUrl}/getCables?offset=${p * 20}`
    );
    // const responseUp = await fetch(`http://134.79.206.193/smcaptar/uploadCables`);
    const data = await response.json();
    console.log(data.cables);
    setHeaders(Object.keys(data.cables[0]));
    setCables(data.cables);
  };

  useEffect(() => {
    getCablesAPI(page);
  }, []);
  console.log(headers);
  const ApproveCables = () => {
    let tempCables = [];
    cables.forEach((d) => {
      if (d.select) {
        tempCables.push(d);
      }
    });
    console.log(tempCables);
  };

  return (
    <div style={{ marginTop: 20, marginLeft: 20 }}>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Example Modal"
      >
        <section style={{ marginBottom: "10px" }}>
          <div style={{ top: "7%", position: "absolute" }}>
            <p onClick={closeModal}>X</p>
          </div>
          <div style={{ left: "70%", position: "absolute" }}>
            <button
              className="buttonModalCables"
              onClick={() => console.log("Update Cable")}
            >
              Update Cable
            </button>
          </div>
        </section>
        <div className={"grid-container"}>
          <div style={{ margin: 50 }}>
            {headers.map((key) => {
              return (
                <div className={"grid-container"}>
                  <div class="grid-item">{key}:</div>
                  <div class="grid-item">
                    <input
                      name="text"
                      type="text"
                      className="input"
                      defaultValue={modalCable[key]}
                      onChange={(e) => handleSubmitUpdate(e, modalCable, key)}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Modal>

      <div className="tableDivCables">
        <div style={{ marginLeft: 10 }}>
          <button
            className="approveCables"
            onClick={() => {
              ApproveCables();
            }}
          >
            Add User
          </button>

          <TablePagination
            component="div"
            count={150000}
            page={page}
            onPageChange={(event, newPage) => {
              setPage(newPage);
              getCablesAPI(newPage);
            }}
            rowsPerPage={10}
          />
        </div>
        <div className="innerDiv">
          <table className="table">
            <thead>
              <tr>
                <th>
                  <input
                    type="checkbox"
                    onChange={(e) => {
                      let value = e.target.checked;
                      setCables(
                        cables.map((d) => {
                          d.select = value;
                          return d;
                        })
                      );
                    }}
                  />
                </th>
                {headers.map((header, index) => {
                  return <th key={index}>{header}</th>;
                })}
              </tr>
            </thead>
            <tbody>
              <CablesRow
                cables={cables}
                headers={headers}
                setCables={setCables}
                openModalView={openModalView}
              />
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default SettingsView;
