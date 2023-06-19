import React ,{useEffect,useState} from "react";
import Profile from "../../components/Profile";
import Navigation from "../../components/Navigation";
import CableInventoryView from "../../components/CableViewTable/index";
import "./styles.css";

const ApprovedCables = (props) => {

console.log(props)
	return (
		<main className="cablelisting">
			<Navigation  user = {props.user.USERNAME} setUser={props.setUser} admin={props.user.ADMIN} className="dashboard_sidebar" />
			<Profile user = {props.user.USERNAME} className="dashboard_navbar" page={"Approved Cables"}/>
			
			<section className="cablelisting_container">
					<CableInventoryView user={props.user} table={"SMARTCAPTAR_APPROVED"}/>
			</section>
		</main>
	);
};

export default ApprovedCables;
