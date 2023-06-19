import React, { useState } from "react";

import Profile from "../../components/Profile";
import Navigation from "../../components/Navigation";
import CableInventoryView from "../../components/CableViewTable";
import "./styles.css";

const SentItems = (props) => {
  const [approved, setApproved] = useState(1);
  const [rejected, setRejected] = useState(1);
  const [pending, setPending] = useState(1);
  const [returned, setReturned] = useState(1);

  
  
  return (
    
    <main className="cablelisting">
      
      <Navigation  user = {props.user.USERNAME} setUser={props.setUser} admin={props.user.ADMIN} className="dashboard_sidebar" />
      <Profile user={props.user.USERNAME} className="dashboard_navbar" page={"Cable History"}/>
      <section className="cablelisting_container">
        <CableInventoryView table={"SMARTCAPTAR_HISTORY"} />
      </section>
    </main>
  );
};

export default SentItems;
