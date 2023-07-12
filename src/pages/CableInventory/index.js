import React, { useEffect, useState } from "react";
import Profile from "../../components/Profile";
import Navigation from "../../components/Navigation";
import CableInventoryView from "../../components/CableViewTable/index";
import "./styles.css";

const CableInventory = (props) => {
  return (
    <main className="cablelisting">
      <Navigation
        user={props.user.USERNAME}
        setUser={props.setUser}
        admin={props.user.ADMIN}
        className="dashboard_sidebar"
      />
      <Profile className="dashboard_navbar" page={"Current Cable Inventory"} />

      <section className="cablelisting_container">
        <CableInventoryView user={props.user} table={"CABLEINV"} />
      </section>
    </main>
  );
};

export default CableInventory;
