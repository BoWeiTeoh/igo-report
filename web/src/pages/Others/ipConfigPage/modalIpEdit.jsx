import React, { useEffect, useState } from "react";
import showToast from "../../../helpers/showToast.js";
import dataSource from "../../../dataSource/dataSource.js";
import B2Modal from "../../../components/b2Modal/b2Modal.jsx";
import B2Input from "../../../components/form/b2Input.jsx";

const DEFAULT_STATE = {
  _id: "",
  ipAddress: "",
  detail: ""
};

const ModalIpEdit = ({ isOpen, onClose, onDataUpdate, data }) => {
  const [state, setState] = useState(data || DEFAULT_STATE);
  let ipAddress = data?.ipAddresss || "";

  useEffect(() => {
    if (data) {
      setState((d) => ({
        ...d,
        ...data
      }));
    }
  }, [data]);

  useEffect(() => {
    ipAddress = state?.ipAddress;
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
      let response;
      response = await dataSource.shared?.updateIpConfig(state);
      showToast(response);
      setState(DEFAULT_STATE);
      onDataUpdate();
      onClose();
    } catch (e) {
      showToast(e, true);
    }
  };

  return (
    <B2Modal
      title={"Edit Ip Config : " + ipAddress}
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
            <B2Input
              onChange={handleInputChange}
              name={"ipAddress"}
              type={"string"}
              value={state?.ipAddress}
              placeholder={" "}
            />
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

export default ModalIpEdit;
