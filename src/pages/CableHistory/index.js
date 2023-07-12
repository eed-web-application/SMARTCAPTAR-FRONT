import React from "react";
import Profile from "../../components/Profile";
import Navigation from "../../components/Navigation";
import CableInventoryView from "../../components/CableViewTable";
import "./styles.css";
import { useLocation } from "react-router-dom";
import { isCompositeComponent } from "react-dom/test-utils";

const CableHistory = (props) => {
  const { state } = useLocation();
  console.log(props.user);
  return (
    <main className="cablelisting">
      <Navigation
        user={props.user.USERNAME}
        setUser={props.setUser}
        admin={props.user.ADMIN}
        className="dashboard_sidebar"
      />
      <Profile
        className="dashboard_navbar"
        page={"Cable Number History for " + state.cable}
      />
      <section className="cablelisting_container">
        <CableInventoryView
          user={props.user}
          table={"SMARTCAPTAR_HISTORY"}
          cable={state.cable}
        />
      </section>
    </main>
  );
};

export default CableHistory;
