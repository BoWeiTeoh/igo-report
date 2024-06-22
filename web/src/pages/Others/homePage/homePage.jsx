import React from "react";
import BasePage from "../basePage/basePage.jsx";
import dataSource from "../../../dataSource/dataSource.js";

const HomePage = (props) => {
  const claims = dataSource.shared?.claims;

  return (
    <BasePage {...props} title={null}>
      <div style={{ padding: 20 }}>
        <h6>Hi, {claims?.u}</h6>
        <p>Welcome to IGO.</p>
      </div>
    </BasePage>
  );
};

export default HomePage;
