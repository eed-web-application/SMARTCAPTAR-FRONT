import React, { useState, useCallback } from "react";
import axios from "axios";
import SLACLOGO from "../../assets/slaclogotransparent.png";
import WAVES from "../../assets/waves.png";
import MAIL from "../../assets/mail.png";
import LOCK from "../../assets/lock.png";
import "./styles.css";
import { Navigate, Link, useNavigate, useLocation } from "react-router-dom";
import baseUrl from "../../../config";
axios.defaults.baseURL = baseUrl;
const Login = (props) => {
  const navigate = useNavigate();

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    var { email, password } = document.forms[0];
    console.log(email.value);
    axios
      .post("/login", {
        username: email.value,
        password: password.value,
      })
      .then(async (response) => {
        await props.setUser(response.data);
        await localStorage.setItem("user", JSON.stringify(response.data));
        navigate("/uploaded-cables");
      })
      .then((error) => {
        console.log(error);
      });
  };
  return (
    <main className="login">
      <form className="login_form" onSubmit={handleSubmit}>
        <img className="login_form_logo" src={SLACLOGO} alt="Logo" />
        <p className="login_form_title">Login</p>
        <div className="login_form_field">
          <p className="login_form_field_title">
            User Portal Email/Account Name
          </p>
          <div className="login_form_field_input">
            <img
              className="login_form_field_input_icon"
              src={MAIL}
              alt="Email"
            />
            <input type="text" name="email" required />
          </div>
        </div>
        <div className="login_form_field">
          <p className="login_form_field_title">Password</p>
          <div className="login_form_field_input">
            <img
              className="login_form_field_input_icon"
              src={LOCK}
              alt="Lock"
            />
            <input type="password" name="password" required />
          </div>
        </div>

        <button className="login_form_button" type="submit">
          LOGIN
        </button>
      </form>
      <div className="login_footer"></div>
      <img className="login_waves" src={WAVES} alt="Waves" />
    </main>
  );
};

export default Login;
