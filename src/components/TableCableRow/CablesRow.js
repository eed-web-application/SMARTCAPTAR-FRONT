import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./styles.css";
import axios from "axios";
import CableQAModal from "../Modals/CableWorkspaceModal";
import baseUrl from "../../config";
axios.defaults.baseURL = baseUrl;
function CablesRow(props) {
  const [error, setError] = useState(true);

  const navigate = useNavigate();

  return props.cables.map((d) => (
    <tr key={d.CABLENUM}>
      {props.table != "SMARTCAPTAR_HISTORY" &&
      props.table != "CABLEINV" &&
      props.cable == undefined &&
      props.table != "SMARTCAPTAR_APPROVED" ? (
        <td>
          {(d.STATUS == "PENDING" && props.table == "SMARTCAPTAR_UPLOAD") ||
          (props.table != "SMARTCAPTAR_UPLOAD" &&
            JSON.parse(d.APPROVERS)[props.user.USERNAME] == true) ? null : (
            <input
              type="checkbox"
              checked={d.select}
              onChange={(e) => {
                let value = e.target.checked;

                props.setCables(
                  props.cables.map((sd) => {
                    if (sd.CABLENUM === d.CABLENUM) {
                      sd.select = value;
                    }
                    return sd;
                  })
                );
              }}
            />
          )}
        </td>
      ) : null}

      {props.headers.map((key, index) => {
        if (key == "CABLENUM") {
          return (
            <td key={key} className="relative-parent">
              <span className="size-calibration"></span>
              <button
                className="openModal"
                onClick={(e) => {
                  if (
                    props.table == "SMARTCAPTAR_HISTORY" &&
                    props.cable == undefined
                  ) {
                    navigate("/cable-history", {
                      state: { cable: d.CABLENUM },
                    });
                  } else {
                    props.openModalView(d);
                  }
                }}
              >
                {d[key]}
              </button>
            </td>
          );
        }
        if (key == "STATUS") {
          return (
            <td key={key} className="relative-parent">
              <span className="size-calibration"></span>
              <p
                class={
                  d[key] == "NEW"
                    ? "statusNEW"
                    : d[key] == "PENDING" || d[key] == "MODIFY"
                    ? "statusPENDING"
                    : d[key] == "REJECTED"
                    ? "statusREJECTED"
                    : null
                }
              >
                {d[key]}
              </p>
            </td>
          );
        }
        if (key == "DATEENT") {
          return (
            <td key={key}>
              <p>{new Date(d[key]).toLocaleDateString()}</p>
            </td>
          );
        }
        return (
          <td key={key} className="relative-parent">
            <span className="size-calibration"></span>
            <p>{d[key]}</p>
          </td>
        );
      })}
    </tr>
  ));
}

export default CablesRow;
