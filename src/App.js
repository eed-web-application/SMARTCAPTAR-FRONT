import "./App.css";
import { BrowserRouter, Routes, Route,redirect } from "react-router-dom";
import {Navigate, useNavigate, useLocation } from 'react-router-dom';
import Login from "./pages/Login";
import CreateNew from "./pages/CreateNew";
import Dashboard from "./pages/Dashboard"
import SentItems from "./pages/AllCableHistory";
import Projects from "./pages/ApprovalQueue";
import UploadedCables from "./pages/UploadedCables"
import Settings from "./pages/Settings";
import CableHistory from "./pages/CableHistory"
import CableInventory from "./pages/CableInventory"
import React, {useEffect,useState} from 'react'
import ApprovedCables from "./pages/ApprovedCables"
import useToken from "./Hooks/Token";
// var socket = io('http://134.79.206.193',{path: "/smcaptar/smcaptar"}, { transports : ['websocket'] });

function App() {
const [user, setUser] = useState({});
const [loggedIn, setLoggedIn] = useState(false);

    useEffect(() => {
      console.log(user)
      var loggedInUser = localStorage.getItem("user");
      console.log(loggedInUser)
      if (loggedInUser != null) {
        const foundUser = JSON.parse(loggedInUser);
        setUser(foundUser);
        setLoggedIn(true)
      }else{
        setLoggedIn(false)
      }
    }, []);

    const PrivateRoute = ({ auth: { isAuthenticated }, children }) => {
      var loggedInUser = localStorage.getItem("user");
      return loggedInUser ? children  : <Navigate to="/login" />;
    };
    const PrivateAdminRoute = ({ auth: { isAuthenticated }, children }) => {
      var loggedInUser = JSON.parse(localStorage.getItem("user")).USERNAME;
      return loggedInUser == "ADMIN" ? children  : <Navigate to="/login" />;
    };
 
  return (
    <BrowserRouter>
    <Routes>
      <Route path="/" element={ <PrivateRoute auth={{ isAuthenticated: user ? true : false }}><Dashboard setUser={setUser} user={user} /></PrivateRoute>} />
      <Route path="/login" element={ <Login setUser={setUser}/>} />
      <Route path="/Dashboard" element={ <PrivateRoute auth={{ isAuthenticated: user ? true : false }}><Dashboard setUser={setUser} user={user} /></PrivateRoute>} />
      <Route path="/cable-inventory" element={ <PrivateRoute auth={{ isAuthenticated: user ? true : false }}><CableInventory setUser={setUser} user={user} /></PrivateRoute>} />
      <Route path="/uploaded-cables" element={ <PrivateRoute auth={{ isAuthenticated: user ? true : false }}><UploadedCables setUser={setUser} user={user}/></PrivateRoute>} />
      <Route path="/approved-cables" element={ <PrivateRoute auth={{ isAuthenticated: user ? true : false }}><ApprovedCables setUser={setUser} user={user} /></PrivateRoute>} />
      <Route path="/cable-history" element={ <PrivateRoute auth={{ isAuthenticated: user ? true : false }}><CableHistory setUser={setUser} user={user} /></PrivateRoute>} />
      <Route path="/create-new" element={ <PrivateRoute auth={{ isAuthenticated: user ? true : false }}><CreateNew  setUser={setUser} user={user}/></PrivateRoute>} />
      <Route path="/sent-items" element={ <PrivateRoute auth={{ isAuthenticated: user ? true : false }}><SentItems setUser={setUser}  user={user} /></PrivateRoute>} />
      <Route path="/projects" element={ <PrivateRoute auth={{ isAuthenticated: user ? true : false }}><Projects setUser={setUser} user={user} /></PrivateRoute>} />
        <Route path="/Settings" element={ <PrivateAdminRoute auth={{ isAuthenticated: user ? true : false }}><Settings setUser={setUser} user={user} /></PrivateAdminRoute>} />
      
    </Routes>
    </BrowserRouter>
  );

 
}

export default App;
