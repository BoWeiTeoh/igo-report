import "./modalConfigPage.scss";
import React, { useEffect, useState } from "react";
import showToast from "../../../helpers/showToast.js";
import dataSource from "../../../dataSource/dataSource.js";
import B2Modal from "../../../components/b2Modal/b2Modal.jsx";
import B2Input from "../../../components/form/b2Input.jsx";
import B2Select from "../../../components/b2Select/b2Select.jsx";
import { constFilterType } from "../../../components/tableFilter/constFilter.js";

const DEFAULT_STATE = {
  branch: "",
  configType: "",
  config: "",
  detail: ""
};

const ModalConfigCreate = ({ isOpen, onClose, onDataUpdate }) => {
  const [state, setState] = useState(DEFAULT_STATE);
  const [config, setConfig] = useState([]);

  const configListStartTime = [
    { value: "$gte", label: "greater and equal than " },
    { value: "$gt", label: "greater than" }
  ];
  const configListEndTime = [
    { value: "$lte", label: "lower or equal than" },
    { value: "$lt", label: "lower than" }
  ];

  const configTypeList = [
    { value: "billReportStartTime", label: "billReportStartTime" },
    { value: "billReportEndTime", label: "billReportEndTime" }
  ];

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
      if (!state?.configType) {
        showToast("Config Type cannot be empty", true);
      }
      if (!state?.config) {
        showToast("Config cannot be empty", true);
      }

      if (state?.configType && state?.config) {
        let response;
        response = await dataSource.shared?.createSystemConfig(state);
        showToast(response);
        setState(DEFAULT_STATE);
        onDataUpdate();
        onClose();
      }

    } catch (e) {
      showToast(e, true);
    }
  };

  const handleSelectChange = (selectData, queryKey) => {
    if (queryKey === "configType") {
      switch (selectData?.value) {
        case "billReportStartTime":
          setConfig(configListStartTime);
          break;
        case "billReportEndTime":
          setConfig(configListEndTime);
          break;
        default:
          setConfig([]);
      }

      setState((d) => {
        return {
          ...d,
          ["config"]: []
        };
      });
    }
    let value = selectData?.value;
    if (Array.isArray(selectData)) {
      value = selectData;
    }
    setState((d) => {
      return {
        ...d,
        [queryKey]: value
      };
    });
  };
  useEffect(() => {
    handleInputChange("", "config");
    handleSelectChange("", "config");
  }, [state?.configType]);

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
            <label>Config Type</label>
            <B2Select
              options={configTypeList}
              queryKey={"configType"}
              type={constFilterType.select}
              placeholder={" "}
              className={"creatable-select"}
              value={state?.configType}
              onChange={(e) => handleSelectChange(e, "configType")}
            />
          </div>
          <div>
            <label>Config</label>
            <B2Select
              options={config}
              queryKey={"config"}
              type={constFilterType.select}
              placeholder={" "}
              className={"creatable-select"}
              value={state?.config}
              onChange={(e) => handleSelectChange(e, "config")}
            />
          </div>
          <div>
            <label>Detail</label>
            <B2Input onChange={handleInputChange} name={"detail"} value={state?.detail} placeholder={" "} />
            <p className="detail-info">For Details, please insert important information.</p>
          </div>
        </div>
      </div>
    </B2Modal>
  );
};

export default ModalConfigCreate;
