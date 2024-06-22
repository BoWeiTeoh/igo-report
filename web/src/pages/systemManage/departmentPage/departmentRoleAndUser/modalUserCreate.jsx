import React, { useEffect, useState } from "react";
import showToast from "../../../../helpers/showToast.js";
import util from "../../../../helpers/util.js";
import B2Modal from "../../../../components/b2Modal/b2Modal.jsx";
import B2Input from "../../../../components/form/b2Input.jsx";
import dataSource from "../../../../dataSource/dataSource.js";

const DEFAULT_STATE = {
  username: "",
  password: ""
};

const ModalUserCreate = ({ isOpen, onClose, onDataUpdate, data, roleSelect }) => {
  const { isEdit } = data || {};
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
      util.ui.validateInputs(["password"], state);
      state.role = roleSelect?._id;
      await dataSource.shared?.createUser(state);
      setState(DEFAULT_STATE);
      onDataUpdate();
      onClose();
    } catch (e) {
      showToast(e, true);
    }
  };

  return (
    <B2Modal isOpen={isOpen} onConfirm={handleSubmit} onClose={handleModalClose}>
      <B2Input onChange={handleInputChange} name={"username"} value={state?.username} />
      <B2Input onChange={handleInputChange} name={"password"} value={state?.password} />
    </B2Modal>
  );
};

export default ModalUserCreate;
