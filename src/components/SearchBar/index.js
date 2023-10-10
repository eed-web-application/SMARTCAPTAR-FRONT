import React, { useState, useEffect } from "react";
// import "../Cables/styles.css";
import {
  uploadedOrder,
  historyOrder,
  inventoryOrder,
} from "../../Headers/order";
import { BeatLoader } from "react-spinners";
import SearchModalView from "../Modals/CableInventoryModal";
import "./styles.css";
import { AiOutlineSearch } from "react-icons/ai";
import baseUrl from "../../config";
function SearchBar(props) {
  const [cable, setCable] = useState([]);
  const [errorMsg, setErrorMessage] = useState(false);

  const [modalIsOpen, setIsOpen] = useState(false);
  const [searchTxt, setSearch] = useState("");

  function closeModal() {
    setIsOpen(false);
    setModalCable({});
  }

  const openModalView = (cable) => {
    setIsOpen(true);
  };

  const getCableSearch = async (e) => {
    e.preventDefault();
    const response = await fetch(
      `${baseUrl}/searchCable?cableNum=${searchTxt}`
    );
    const data = await response.json();
    if (data.cables[0] == undefined) {
      setErrorMessage(true);
    } else {
      setCable(data.cables[0]);
      console.log("GOT CABLES");
      openModalView();
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    let temp = e.target.value;
    setSearch(temp.toUpperCase());
    setErrorMessage(false);
  };

  return (
    <div>
      {errorMsg ? (
        <div style={{ justifyContent: "center", alignItems: "center" }}>
          <p>No Cables Found</p>
        </div>
      ) : null}
      <div class="searchWrapper">
        <SearchModalView
          cable={cable}
          headers={inventoryOrder}
          closeModal={closeModal}
          modalIsOpen={modalIsOpen}
        />
        <form onSubmit={getCableSearch}>
          <AiOutlineSearch
            size={25}
            style={{ color: "black", marginLeft: 5, marginBottom: 3 }}
          />
          <input
            class="searchTermCableInv"
            type="text"
            onChange={handleChange}
            value={searchTxt}
            placeholder={"Search Cable Number"}
          />
          <button class="searchSubmit" type="submit">
            Submit{" "}
          </button>
        </form>
      </div>
    </div>
  );
}

export default SearchBar;
