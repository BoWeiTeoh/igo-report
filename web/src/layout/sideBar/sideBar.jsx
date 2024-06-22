import "./sideBar.scss";
import React, { useState } from "react";
import SideBarMenu from "./sideBarMenu/sideBarMenu";
import dataSource from "../../dataSource/dataSource.js";
import B2Modal from "../../components/b2Modal/b2Modal.jsx";

const SideBar = (props) => {
  const [modalOpen, setModalOpen] = useState(false);

  const handleModalConfirm = () => {
    dataSource.shared?.logout();
  };

  const handleModalClose = () => {
    setModalOpen(false);
  };

  return (
    <React.Fragment>
      <div className="sidebar-menu">
        <SideBarMenu {...props} />
      </div>

      <B2Modal
        title={"Attention"}
        confirmText={"Yes"}
        closeText={"No"}
        isOpen={modalOpen}
        onConfirm={handleModalConfirm}
        onClose={handleModalClose}
      >
        Are you sure want to logout?
      </B2Modal>
    </React.Fragment>
  );
};

// use last rendered sideBar if return true
const MemoSideBarMenu = React.memo(SideBar, (prevProps, nextProps) => {
  return prevProps.menuCollapse === nextProps.menuCollapse;
});

export default MemoSideBarMenu;
