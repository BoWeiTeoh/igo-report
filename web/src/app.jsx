import "./app.scss";
import "react-toastify/dist/ReactToastify.css";
import React, { useEffect, useState } from "react";
import { BrowserRouter } from "react-router-dom";
import Layout from "./layout/layout";
import dataSource from "./dataSource/dataSource.js";
import LoginPage from "./pages/Others/loginPage/loginPage";
import { ToastContainer } from "react-toastify";
import showToast from "./helpers/showToast";
import { Provider } from "react-redux";
import store from "./redux/store";
import "./styles/theme.scss";
import { constResCode } from "./const/constError.js";
import generatedGitInfo from "./generatedGitInfo.json";

const App = () => {
  const [isReady, setIsReady] = useState(false);
  const [showLoginPage, setShowLoginPage] = useState(false);
  const [version, setVersion] = useState(false);
  const authClaims = dataSource.shared?.claims;

  useEffect(() => {
    if (authClaims) {
      checkIsLoggedIn().then();
      backVersion().then();
    } else {
      setIsReady(true);
      setShowLoginPage(true);
    }
  }, []);

  const backVersion = async () => {
    try {
      let response = await dataSource.shared?.backVersion();
      setVersion(response[0]?.version);
    } catch (e) {

    }
  };
  const checkIsLoggedIn = async () => {
    try {
      await dataSource.shared?.checkIsLoggedIn();
      setIsReady(true);
    } catch (e) {
      if (e?.code === constResCode.RE_LOGIN) {
        dataSource.shared?.resetClaims();
        setShowLoginPage(true);
        showToast("Token Invalid or Expired, Please Login", true);
      }
      setIsReady(true);
    }
  };

  if (!isReady) {
    return "Authorizing...";
  }

  let node;
  if (showLoginPage) {
    node = <LoginPage />;
  } else {
    node = <Layout />;
  }

  return (
    <Provider store={store}>
      <BrowserRouter>
        <div style={{ position: "fixed", bottom: 25, left: 40, zIndex: 999999, opacity: 0.5, color: "#9f9f9f" }}>
          {"backend-version"}:{version}
        </div>
        <div style={{ position: "fixed", bottom: 5, left: 40, zIndex: 999999, opacity: 0.5, color: "#9f9f9f" }}>
          {"frontend-version"}:{"g1.0.19"}
        </div>
        {/*<div style={{ position: "fixed", bottom: 5, left: 5, zIndex: 999999, opacity: 0.5, color: "#9f9f9f" }}>*/}
        {/*  {generatedGitInfo?.gitBranch}:{generatedGitInfo?.gitCommitHash}*/}
        {/*</div>*/}
        {node}
        <ToastContainer />
      </BrowserRouter>
    </Provider>
  );
};

export default App;
