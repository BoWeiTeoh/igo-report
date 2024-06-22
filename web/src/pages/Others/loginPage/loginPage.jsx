import React, { useState } from "react";
import "./loginPage.css";
import { constErrorMessage } from "../../../const/constError.js";
import showToast from "../../../helpers/showToast.js";
import B2Button from "../../../components/b2Button/b2Button.jsx";
import dataSource from "../../../dataSource/dataSource.js";
import ic_logo from "../../../images/icon/iGO logo.png";

const LoginPage = () => {
  const [form, setForm] = useState({
    username: localStorage?.getItem("username"),
    password: ""
  });
  const onInputChange = (e) => {
    const { name, value } = e?.target || {};
    setForm((d) => {
      return {
        ...d,
        [name]: value
      };
    });
  };

  const onButtonClick = async (e) => {
    e.preventDefault();
    const { username = "", password = "" } = form;

    try {
      const reqBody = {
        username,
        password
      };
      await dataSource?.shared?.login(reqBody);
      location.reload();
    } catch (e) {
      const errorMessage = constErrorMessage[e?.error?.name] || e?.error?.message || e;
      showToast(errorMessage, true);
    }
  };

  return (
    <div className="login-page-wrapper">
      <img src={ic_logo} alt="ic_logo" />
      <div className="login-page">
        <input type={"text"} onChange={onInputChange} name={"username"} placeholder={"Account"} />
        <input type={"password"} onChange={onInputChange} name={"password"} placeholder={"Password"} />
        <B2Button onClick={onButtonClick}>
          Login
        </B2Button>
      </div>
    </div>
  );
};

export default LoginPage;
