import React, { useState, useEffect } from "react";
import { uploadedOrder, deny } from "../../Headers/order";
import "./styles.css";

function FilterBar(props) {
  const [headers, setHeaders] = useState(uploadedOrder);

  const handleChange = (e) => {
    e.preventDefault();
    props.setSearch(e.target.value);
  };

  return (
    <div>
      {props.table != "SMARTCAPTAR_USERS" &&
      props.table != "SMARTCAPTAR_COMPATIBILITY" ? (
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <select
            class="dropdown"
            value={props.filterTerm}
            onChange={(e) => props.setFilter(e.target.value)}
          >
            {headers.map((item) => (
              <option value={item}>{item}</option>
            ))}
            <option>CABLENUM</option>
            <option>AREACODE</option>
            <option>DATE</option>
          </select>
          {!deny.includes(props.filterTerm) ? (
            <div style={{ margin: 0, padding: 0 }}>
              <input
                class="searchTerm"
                type="text"
                onChange={handleChange}
                value={props.searchTxt}
                placeholder={"Search " + props.name}
              />
              <button
                className="approveCablesButton"
                onClick={() => {
                  props.searchInventory();
                }}
              >
                Search
              </button>
            </div>
          ) : null}
        </div>
      ) : (
        <div>
          <div style={{ margin: 0, padding: 0 }}>
            <input
              class="searchTerm"
              type="text"
              onChange={handleChange}
              value={props.searchTxt}
              placeholder={"Search " + props.name}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default FilterBar;
