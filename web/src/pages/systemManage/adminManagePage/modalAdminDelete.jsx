import React, { useEffect, useState } from "react";
import showToast from "../../../helpers/showToast.js";
import dataSource from "../../../dataSource/dataSource.js";
import B2Modal from "../../../components/b2Modal/b2Modal.jsx";

const DEFAULT_STATE = {
  roleName: ""
};

const ModalRoleDelete = ({ isOpen, onClose, onDataUpdate, data }) => {
  const [state, setState] = useState(data || DEFAULT_STATE);

  useEffect(() => {
    if (data) {
      setState((d) => ({
        ...d,
        ...data
      }));
    }
  }, [data]);

  useEffect(() => {

  }, []);

  const handleModalClose = () => {
    setState(DEFAULT_STATE);
    onClose();
  };

  const handleSubmit = async () => {
    try {
      let response;
      response = await dataSource.shared?.deleteAdmin(state);
      showToast(response);
      setState(DEFAULT_STATE);
      onDataUpdate();
      onClose();
    } catch (e) {
      showToast(e, true);
    }
  };

  return (
    <B2Modal title={"Delete Admin"} isOpen={isOpen} onConfirm={handleSubmit} onClose={handleModalClose}>
      <label>{"Confirm want to delete Admin : "}</label>
      <label className={"text-danger fs-5"}>&nbsp;&nbsp;{state?.username}</label>
    </B2Modal>
  );
};

export default ModalRoleDelete;