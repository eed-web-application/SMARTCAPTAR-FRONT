import React from "react";
import { CreateNewOrder, order } from "../../Headers/order";
import { IoMdCheckmark, IoMdWarning } from "react-icons/io";

function CablesRow(props) {
  console.log(props.cables);
  return props.cables.map((d, index) => (
    <tr key={d.CABLENUM}>
      <td>
        {props.dupes.includes(d["CABLENUM"]) ? (
          <div className="warning">
            <IoMdWarning color={"white"} />
          </div>
        ) : null}
        {props.recon.includes(d["CABLENUM"]) ? (
          <div className="reconWarning">
            <IoMdWarning color={"white"} />
          </div>
        ) : null}
        {!props.dupes.includes(d["CABLENUM"]) &&
        !props.recon.includes(d["CABLENUM"]) ? (
          <div className="deletebtn">
            <IoMdCheckmark color={"white"} />
          </div>
        ) : null}
      </td>
      {CreateNewOrder.map((key, index) => {
        if (key == "CABLENUM") {
          return (
            <td className="relative-parent">
              <span className="size-calibration"></span>

              <button
                className="openModal"
                type="button"
                onClick={(e) => props.openModalView(d)}
              >
                {d[key]}
              </button>
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
