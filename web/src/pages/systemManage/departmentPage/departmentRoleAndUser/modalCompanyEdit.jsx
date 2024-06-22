import React, { useEffect, useState } from "react";
import showToast from "../../../../helpers/showToast.js";
import dataSource from "../../../../dataSource/dataSource.js";
import B2Modal from "../../../../components/b2Modal/b2Modal.jsx";
import B2Input from "../../../../components/form/b2Input.jsx";

const DEFAULT_STATE = {
  name: ""
};

const ModalCompanyEdit = ({ isOpen, onClose, onDataUpdate, data }) => {
  const [state, setState] = useState(data || DEFAULT_STATE);

  useEffect(() => {
    if (data) {
      setState((d) => ({
        ...d,
        ...data
      }));
    }
  }, [data]);

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
      response = await dataSource.shared?.updateDepartment(state);
      showToast(response);
      setState(DEFAULT_STATE);
      onDataUpdate(response?.data);
      onClose();
    } catch (e) {
      showToast(e, 1);
    }
  };

  return (
    <B2Modal isOpen={isOpen} onConfirm={handleSubmit} onClose={handleModalClose}>
      <B2Input onChange={handleInputChange} name={"name"} value={state?.name} maxlength={15}/>
    </B2Modal>
  );
};

export default ModalCompanyEdit;
