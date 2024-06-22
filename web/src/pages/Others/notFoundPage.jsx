import React from "react";
import BasePage from "./basePage/basePage.jsx";
import { useNavigate } from "react-router-dom";
import B2Button from "../../components/b2Button/b2Button.jsx";

const NotFoundPage = () => {
  const navigate = useNavigate();

  const navigateHome = () => {
    navigate("/");
  };

  return (
    <BasePage>
      <div style={{ textAlign: "center", padding: 20 }}>
        <h1>404 Not Found</h1>
        <B2Button onClick={navigateHome}>Home</B2Button>
      </div>
    </BasePage>
  );
};

export default NotFoundPage;
