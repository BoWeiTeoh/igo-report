import React, { useEffect, useRef, useState } from "react";
import "./topBar.css";
import dataSource from "../dataSource/dataSource.js";
import LayoutContainer from "../components/layout/layoutContainer.jsx";
import ModalLogout from "./topBar/modalLogout.jsx";
import ModalProfile from "./topBar/modalProfile.jsx";
import clsx from "clsx";
import ic_logo from "../images/icon/iGO logo.png";
import ic_dropdown from "../images/icon/ic_dropdown.png";
import ic_account from "../images/icon/ic_account.png";
import ic_logout from "../images/icon/ic_logout-1.png";
import B2Image from "../components/b2Image/b2Image.jsx";

const TopBar = () => {
  const [modal, setModal] = useState(null);
  const claims = dataSource.shared?.claims;
  const [state, setState] = useState({});
  const [isOpenDropdown, setIsOpenDropdown] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    fetchData().catch();

    // Check click outside then auto turn off profile dropdown
    window.addEventListener("mousedown", clickOutsideClose);
    return () => {
      window.removeEventListener("mousedown", clickOutsideClose);
    };
  }, []);

  const fetchData = async () => {
    const userDetail = await dataSource.shared?.getAdmin({ _id: claims.id });
    setState(userDetail?.data);
  };

  const handleModalClose = () => {
    setModal(null);
  };

  const handleModalOpen = (name, data) => {
    setModal({ name, data });
  };

  const onDropdownButtonClick = (e) => {
    e.preventDefault();
    setIsOpenDropdown(!isOpenDropdown);
  };

  const clickOutsideClose = (e) => {
    const isDropdownClicked = e.target.classList.contains("profile-dropdown");
    if (dropdownRef.current && !dropdownRef.current.contains(e.target) && !isDropdownClicked) {
      setIsOpenDropdown(false);
    }
  };

  return (
    <>
      <div className="top-bar">
        <LayoutContainer>
          <div className={"top-bar-1"}>
            <div className={"top-bar-1-1"}>
              <img src={ic_logo} alt="ic_logo" className="top-bar-menu-logo" />
            </div>
            <div className={"top-bar-1-2"}>
              <div className="profile-menu-1">{claims?.u.charAt(0).toUpperCase()}</div>
              <div className="profile-menu-2">
                <div className="profile-username-role">
                  <div>
                    <p className="profile-username">{claims?.u}</p>
                    <p className="profile-role">{state?.roles?.roleName}</p>
                  </div>
                  <img src={ic_dropdown} alt="ic_dropdown"
                       className={clsx("profile-dropdown", isOpenDropdown && "open")} onClick={onDropdownButtonClick} />
                </div>

                {isOpenDropdown &&
                  (<div className="-dropdown" ref={dropdownRef}>
                    <ul>
                      <li>
                        <B2Image src={ic_account} alt="ic_account" className="image-icon" isIcon={true} />
                        <a onClick={() => handleModalOpen("profile", state)}>Profile</a>
                      </li>
                      <li>
                        <B2Image src={ic_logout} alt="ic_logout" className="image-icon" isIcon={true} />
                        <a onClick={() => handleModalOpen("logout")}>Logout</a>
                      </li>
                    </ul>
                  </div>)
                }
              </div>
            </div>
          </div>
        </LayoutContainer>
      </div>

      <ModalLogout
        isOpen={modal?.name === "logout"}
        data={modal?.data}
        onClose={handleModalClose}
      />

      <ModalProfile
        isOpen={modal?.name === "profile"}
        data={modal?.data}
        onClose={handleModalClose}
      />
    </>
  );
};

export default TopBar;
