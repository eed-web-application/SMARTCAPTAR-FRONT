import React  from "react";
import Profile from "../../components/Profile";
import Navigation from "../../components/Navigation";
import CableInventoryView from "../../components/CableViewTable";
import "./styles.css";

// import 'react-calendar/dist/Calendar.css';
const Projects = (props) => {
	return (
		<main className="cablelisting">
			<Navigation  user = {props.user.USERNAME} setUser={props.setUser}  admin={props.user.ADMIN} className="dashboard_sidebar" />
			<Profile user = {props.user.USERNAME} className="dashboard_navbar" page={"Approval Queue"}/>
			
			<section className="cablelisting_container">
					<CableInventoryView user={props.user} table={"SMARTCAPTAR_QUEUE"}/>
			</section>
		</main>
	);
};

export default Projects;
