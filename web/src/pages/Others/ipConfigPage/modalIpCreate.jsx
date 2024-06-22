// import "./modalIpPage.scss";
import React, { useEffect, useState } from "react";
import showToast from "../../../helpers/showToast.js";
import dataSource from "../../../dataSource/dataSource.js";
import B2Modal from "../../../components/b2Modal/b2Modal.jsx";
import B2Input from "../../../components/form/b2Input.jsx";

const DEFAULT_STATE = {
  ipAddress: "",
  detail: ""
};

const ModalIpCreate = ({ isOpen, onClose, onDataUpdate }) => {
  const [state, setState] = useState(DEFAULT_STATE);

  useEffect(() => {
  }, []);

  const handleInputChange = (value, name) => {
    setState((d) => ({
      ...d,
      [name]: value
    }));
  };

  const handleModalClose = () => {
    setState(DEFAULT_STATE);
    onClose();
  };

  const handleSubmit = async () => {
    try {
      if (!state?.ipAddress) {
        showToast("Ip Address cannot be empty", true);
      }

      if (state?.ipAddress) {
        let response;
        response = await dataSource.shared?.createIpConfig(state);
        showToast(response);
        setState(DEFAULT_STATE);
        onDataUpdate();
        onClose();
      }
    } catch (e) {
      showToast(e, true);
    }
  };

  return (
    <B2Modal
      title={"CREATE SYSTEM CONFIG"}
      className={"b2form"}
      isCentre={true}
      isOpen={isOpen}
      onConfirm={handleSubmit}
      onClose={handleModalClose}
    >
      <div className="modal-form-content">
        <div className="modal-form-content-1">
          <div>
            <label>Ip Address</label>
            <B2Input onChange={handleInputChange} name={"ipAddress"} value={state?.ipAddress} placeholder={" "} />
          </div>
          <div>
            <label>Detail</label>
            <B2Input onChange={handleInputChange} name={"detail"} value={state?.detail} placeholder={" "} />
          </div>
        </div>
      </div>
    </B2Modal>
  );
};

export default ModalIpCreate;
