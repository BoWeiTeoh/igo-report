import React, { useEffect, useState } from "react";
import showToast from "../../../helpers/showToast.js";
import dataSource from "../../../dataSource/dataSource.js";
import B2Modal from "../../../components/b2Modal/b2Modal.jsx";
import { getDateTzISOString } from "../../../helpers/util_datetime.js";

const DEFAULT_STATE = {
  createTime: {}
};

const ModalSummary = ({ isOpen, onClose, onDataUpdate, data }) => {
  const [state, setState] = useState(data || DEFAULT_STATE);

  useEffect(() => {
    if (data) {
      setState((d) => ({
        ...d,
        ...data
      }));
    }
  }, [data]);

  const handleModalClose = () => {
    setState(DEFAULT_STATE);
    onClose();
  };

  const handleSubmit = async () => {
    try {
      let response;
      response = await dataSource.shared?.manualSummary(state);
      showToast(response);
      setState(DEFAULT_STATE);
      onDataUpdate();
      onClose();
    } catch (e) {
      showToast(e, true);
    }
  };

  return (
    <B2Modal title={"Summary"} isOpen={isOpen} onConfirm={handleSubmit} onClose={handleModalClose}>
      <div>
        <label className={"fs-6"}>{"Confirm Summary Time "}</label>
      </div>
      <div>
        <label className={"fs-6"}>{"Start Time : "}</label>
        <label className={"text-success fs-6"}>&nbsp;&nbsp;{getDateTzISOString(state?.createTime?.startTime)}</label>
      </div>
      <div>
        <label className={"fs-6"}>{"End Time"}</label>
        <label className={"fs-6"}>&nbsp;&nbsp;{":"}</label>
        <label className={"text-success fs-6"}>&nbsp;&nbsp;{getDateTzISOString(state?.createTime?.endTime)}</label>
      </div>
    </B2Modal>
  );
};

export default ModalSummary;