import React, { useEffect, useState } from "react";
import Navigation from "../../components/Navigation";
import Profile from "../../components/Profile";
import flowchart from "../../assets/Flowcharts.png";
import RejectedTableView from "../../components/Rejected Cables";
import "./styles.css";
import PendingTableView from "../../components/Pending Cables";

const Dashboard = (props) => {
  return (
    <main className="dashboard">
      <Navigation
        user={props.user.USERNAME}
        setUser={props.setUser}
        admin={props.user.ADMIN}
        className="dashboard_sidebar"
      />
      <Profile user={props.user.USERNAME} className="dashboard_navbar" />
      <section className="dashboard_container">
        {/* <section className="dashboard_container_section upload_section">
          
          <PendingTableView className="statusDashboard"/>
        </section> */}

        {/* <section className="dashboard_container_section action_section">
        <div className="dashboard_container_section_title">
            <p className="dashboard_container_section_title_text">
              Uploading Cables
            </p>
            <button className="download_template_btn">Download Template</button>
          </div>
        </section> */}

        <section className="dashboard_container_section activity_section">
          <PendingTableView className="statusDashboard" />
        </section>

        <section className="dashboard_container_section cable_section">
          <RejectedTableView />
        </section>
      </section>
    </main>
  );
};

export default Dashboard;
