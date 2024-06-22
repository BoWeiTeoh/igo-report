import React, { useEffect, useState } from "react";
import showToast from "../../../helpers/showToast.js";
import dataSource from "../../../dataSource/dataSource.js";
import B2Modal from "../../../components/b2Modal/b2Modal.jsx";
import B2Input from "../../../components/form/b2Input.jsx";
import B2Select from "../../../components/b2Select/b2Select.jsx";
import { constFilterType } from "../../../components/tableFilter/constFilter.js";
import util_ui from "../../../helpers/util_ui.js";

const DEFAULT_STATE = {
  username: "",
  remark: "",
  roles: null
};

const ModalAdminEdit = ({ isOpen, onClose, onDataUpdate, data }) => {
  const [state, setState] = useState(data || DEFAULT_STATE);
  const [roleList, setRoleList] = useState();
  let username = data?.username || "";

  useEffect(() => {
    if (data) {
      setState((d) => ({
        ...d,
        ...data
      }));
    }
  }, [data]);

  useEffect(() => {
    username = state?.username;

    const getRoleList = async () => {
      try {
        const response = await dataSource.shared?.getRoleList();
        let roleOption = util_ui.generateSelectOptions(response?.data, "_id", "roleName");
        setRoleList(roleOption);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    getRoleList().catch(err => {
      showToast(err, true);
    });
  }, []);

  const handleInputChange = (value, name) => {
    if (name === "username") {
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
      response = await dataSource.shared?.updateAdmin(state);
      showToast(response);
      setState(DEFAULT_STATE);
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
    <B2Modal title={"Edit Admin : " + username} className={"b2form"} isCentre={true} isOpen={isOpen}
             onConfirm={handleSubmit} onClose={handleModalClose}>
      <div className="modal-form-content">
        <div className="modal-form-content-1">
          <div>
            <label>Username</label>
            <B2Input onChange={handleInputChange} name={"username"} value={state?.username} placeholder={" "} maxlength={15}/>
          </div>
          <div>
            <label>Role</label>
            <B2Select
              options={roleList}
              queryKey={"roles"}
              type={constFilterType.select}
              placeholder={" "}
              className={"creatable-select"}
              value={state?.roles?._id}
              onChange={(e) => handleSelectChange(e, "roles")}
            />
          </div>
          <div>
            <label>Remark</label>
            <B2Input onChange={handleInputChange} name={"remark"} value={state?.remark} placeholder={" "} />
          </div>
        </div>
      </div>

      {/* <div>
        <label>Username</label>
        <B2Row>
          <B2Col md={8}>
            <B2Input onChange={handleInputChange} name={"username"}
                     value={state?.username} placeholder={" "}
            />
          </B2Col>
        </B2Row>
        <label>Role</label>
        <B2Row>
          <B2Col md={8}>
            <B2Select
              options={roleList}
              queryKey={"roles"}
              type={constFilterType.select}
              placeholder={" "}
              className={"creatable-select"}
              value={state?.roles?._id}
              onChange={(e) => handleSelectChange(e, "roles")}
            />
          </B2Col>
        </B2Row>
        <label>Remark</label>
        <B2Row>
          <B2Col md={8}>
            <B2Input onChange={handleInputChange} name={"remark"}
                     value={state?.remark} placeholder={" "}
            />
          </B2Col>
        </B2Row>
      </div> */}
    </B2Modal>
  );
};

export default ModalAdminEdit;
