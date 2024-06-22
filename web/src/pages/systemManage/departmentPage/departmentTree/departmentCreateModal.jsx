import React, { useState } from "react";
import dataSource from "../../../../dataSource/dataSource.js";
import B2Input from "../../../../components/form/b2Input.jsx";
import showToast from "../../../../helpers/showToast.js";
import B2Modal from "../../../../components/b2Modal/b2Modal.jsx";

const defaultState = {
  label: "",
  name: "",
  code: "",
  parent: "",
  timeZone: null
};

const DepartmentCreateModal = ({ isOpen, onModalClose, data, parentDepartment, onDataUpdate }) => {
  const [state, setState] = useState(defaultState);

  const handleInputChange = (value, name) => {
    setState((d) => {
      return {
        ...d,
        [name]: value
      };
    });
  };

  const handleConfirmClick = async () => {
    try {
      if (parentDepartment?._id) {
        state.parent = parentDepartment._id;
      }
      await dataSource.shared?.createDepartment(state);
      setState(defaultState);
      onDataUpdate && onDataUpdate();
      showToast("Success");
      onModalClose();
    } catch (e) {
      showToast(e, 1);
    }
  };

  const handleModalClose = () => {
    setState(defaultState);
    onModalClose();
  };

  return (
    <B2Modal
      isOpen={isOpen}
      onConfirm={handleConfirmClick}
      onClose={handleModalClose}
      className="department-action-form"
      size={"lg"}
    >
      <label>Add Department</label>
      <div className={"_form"}>
        <B2Input onChange={handleInputChange} value={state?.name} name={"name"} maxlength={15}/>
      </div>
    </B2Modal>
  );
};

export default DepartmentCreateModal;
