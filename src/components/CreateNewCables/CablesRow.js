import React from "react";
import { CreateNewOrder, order } from "../../Headers/order";

function CablesRow(props) {
  console.log(props.cables);
  return props.cables.map((d, index) => (
    <tr key={d.CABLENUM}>
      <td>
        <button
          className="deletebtn"
          type="button"
          onClick={(e) => {
            let value = e.target.checked;
            console.log(index);
            props.setCables(props.cables.splice(index, 1));
          }}
        >
          Delete
        </button>
      </td>
      {CreateNewOrder.map((key, index) => {
        if (key == "CABLENUM") {
          return (
            <td className="relative-parent">
              <span className="size-calibration"></span>
              {props.dupes.includes(d[key]) ? (
                <button
                  className="openModal"
                  type="button"
                  onClick={(e) => props.openModalView(d)}
                >
                  ALREADY EXISTS
                </button>
              ) : (
                <button
                  className="openModal"
                  type="button"
                  onClick={(e) => props.openModalView(d)}
                >
                  {d[key]}
                </button>
              )}
            </td>
          );
        }
        return (
          <td className="relative-parent">
            <span className="size-calibration"></span>
            <p>{d[key]}</p>
          </td>
        );
      })}
    </tr>
  ));
}

export default CablesRow;
