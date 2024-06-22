import React, { useEffect, useState } from "react";
import Routers from "../routers/routers";
import SideBar from "./sideBar/sideBar";
import TopBar from "./topBar";
import "./layout.scss";
import { useSelector } from "react-redux";
import { closeModalGlobal } from "../redux/dispatcher";
import B2Button from "../components/b2Button/b2Button.jsx";
import showToast from "../helpers/showToast";
import B2Modal from "../components/b2Modal/b2Modal.jsx";

const Layout = (props) => {
  const [isReady, setIsReady] = useState(false);
  const [menuCollapse, setMenuCollapse] = useState(false);
  const modal = useSelector((d) => d.common?.modal);

  useEffect(() => {
    fetchCommonData().then();
  }, []);

  const fetchCommonData = async () => {
    try {
      setIsReady(true);
    } catch (e) {
      setIsReady(true);
      showToast(e, true);
    }
  };

  const toggleMenu = () => {
    const toggle = !menuCollapse;
    setMenuCollapse(toggle);
  };

  if (!isReady) {
    return "Loading data...";
  }

  return (
    <>
      <div className={`root-container ${menuCollapse ? "collapsed" : ""}`} data-theme={"light"}>
        <div className={`side-bar`}>
          <SideBar toggleMenu={toggleMenu} menuCollapse={menuCollapse} {...props} />
        </div>
        <div className="main-content-wrap">
          <TopBar {...props} />
          <div className="main-content">
            <Routers {...props} />
          </div>
        </div>
      </div>

      <B2Modal isOpen={modal?.name === "login"} onClose={closeModalGlobal} title={"Token Expired"}>
        <p>Please login again</p>
        <B2Button onClick={() => location.reload()}>Click Me</B2Button>
      </B2Modal>
    </>
  );
};

export default Layout;
