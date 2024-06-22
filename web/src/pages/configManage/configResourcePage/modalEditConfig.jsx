import React, { useEffect, useState } from "react";
import showToast from "../../../helpers/showToast.js";
import dataSource from "../../../dataSource/dataSource.js";
import B2Modal from "../../../components/b2Modal/b2Modal.jsx";
import B2Input from "../../../components/form/b2Input.jsx";

const DEFAULT_STATE = {
};

const ModalBranchEdit = ({ isOpen, onClose, onDataUpdate, data }) => {
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
      response = await dataSource.shared?.updateConfigResource(state);
      showToast(response);
      setState(DEFAULT_STATE);
      onDataUpdate();
      onClose();
    } catch (e) {
      showToast(e, true);
    }
  };

  const handleInputChange = (value, name) => {
    setState((d) => ({
      ...d,
      [name]: value
    }));
  };

  return (
    <B2Modal title={data?.setting} className={"b2form"} isCentre={true} isOpen={isOpen}
             onConfirm={handleSubmit} onClose={handleModalClose}>
      <div className="modal-form-content">
        <div className="modal-form-content-1">
          <div>
            <label>Value</label>
            <B2Input
              placeholder={" "}
              value={state?.value}
              name={"value"}
              onChange={handleInputChange}
            />
          </div>
        </div>
      </div>
    </B2Modal>
  );
};

export default ModalBranchEdit;
