import React, { useEffect, useState } from "react";
import showToast from "../../../helpers/showToast.js";
import dataSource from "../../../dataSource/dataSource.js";
import B2Modal from "../../../components/b2Modal/b2Modal.jsx";
import B2Input from "../../../components/form/b2Input.jsx";
import B2Select from "../../../components/b2Select/b2Select.jsx";
import { constFilterType } from "../../../components/tableFilter/constFilter.js";
import util_ui from "../../../helpers/util_ui.js";

const DEFAULT_STATE = {
  roleName: "",
  remark: ""
};

const ModalRoleCreate = ({ isOpen, onClose, onDataUpdate, data }) => {
  const [state, setState] = useState(DEFAULT_STATE);
  const [department, setDepartment] = useState();

  useEffect(() => {
    const getDepartmentList = async () => {
      try {
        const response = await dataSource.shared?.getDepartmentList();
        let departmentOption = util_ui.generateSelectOptions(response?.data, "_id", "name");
        setDepartment(departmentOption);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    getDepartmentList().catch(err => {
      showToast(err, true);
    });
  }, []);

  const handleInputChange = (value, name) => {
    if (name === "roleName") {
      const isValid = util_ui.validateInputNoSpace(value);
      if (!isValid) return;
    }
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
      response = await dataSource.shared?.createRole(state);
      setState(DEFAULT_STATE);
      showToast(response);
      onDataUpdate();
      onClose();
    } catch (e) {
      showToast(e, true);
    }
  };

  const handleSelectChange = (selectData, queryKey) => {
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

  return (
    <B2Modal size={"lg"} title={"ADD ROLE"} className={"b2form"} isCentre={true} isOpen={isOpen}
             onConfirm={handleSubmit} onClose={handleModalClose}>
      <div className="modal-form-content">
        <div className="modal-form-content-1">
          <div>
            <label>Role Name</label>
            <B2Input onChange={handleInputChange} name={"roleName"} value={state?.roleName} placeholder={" "} maxlength={15}/>
          </div>
          <div>
            <label>Department</label>
            <B2Select
              options={department}
              queryKey={"department"}
              type={constFilterType.select}
              placeholder={" "}
              className={"creatable-select"}
              value={setState}
              onChange={(e) => handleSelectChange(e, "department")}
            />
          </div>
          <div>
            <label>Remark</label>
            <B2Input onChange={handleInputChange} name={"remark"} value={state?.remark} placeholder={" "} />
          </div>
        </div>
      </div>
    </B2Modal>
  );
};

export default ModalRoleCreate;
