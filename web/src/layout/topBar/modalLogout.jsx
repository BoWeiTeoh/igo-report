import React from "react";
import dataSource from "../../dataSource/dataSource.js";
import B2Modal from "../../components/b2Modal/b2Modal.jsx";

const ModalLogout = ({ isOpen, onClose }) => {


  const handleModalClose = () => {
    onClose();
  };

  const handleLogoutConfirm = () => {
    localStorage.setItem("username", "")
    dataSource.shared?.logout();
  };

  return (<B2Modal
    title={"Confirm to logout"}
    confirmText={"Yes"}
    closeText={"Cancel"}
    isOpen={isOpen}
    onConfirm={handleLogoutConfirm}
    onClose={handleModalClose}>
    <label>Do you wish to logout?</label>
  </B2Modal>);
};

export default ModalLogout;
