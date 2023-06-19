import React ,{useEffect,useState} from "react";
import Profile from "../../components/Profile";
import Navigation from "../../components/Navigation";
import "./styles.css";
import SettingsTableView from "../../components/AddUsers";
import ProjectsTableView from "../../components/AddProjects";
import CompatibilityTableView from "../../components/AddCompatibility";

const Settings = (props) => {
	return (
		<main className="settings_page">
			<Navigation  user = {props.user.USERNAME} setUser={props.setUser}  admin={props.user.ADMIN} className="dashboard_sidebar" />
			<Profile user = {props.user.USERNAME} className="dashboard_navbar" page={"Settings"}/>
			<section className="dashboard_container">
	<section className="dashboard_container_section activity_section">
	  <ProjectsTableView/>
	</section>

	<section className="dashboard_container_section cable_section">
	  <SettingsTableView/>
	</section>
	<section className="dashboard_container_section action_section">
	  <CompatibilityTableView/>
	</section>
  </section>
			
		</main>
	);
};

export default Settings;
