import React, { useEffect, useState } from "react";
import showToast from "../../../helpers/showToast.js";
import dataSource from "../../../dataSource/dataSource.js";
import B2Modal from "../../../components/b2Modal/b2Modal.jsx";
import B2Input from "../../../components/form/b2Input.jsx";

const DEFAULT_STATE = {
  username: "",
  remark: "",
  roles: null,
  oldPassword: "",
  newPassword: "",
  confirmPassword: ""
};

const ModalReset = ({ isOpen, onClose, onDataUpdate, data }) => {
  const [state, setState] = useState(data || DEFAULT_STATE);
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
      response = await dataSource.shared?.resetPasswordByAdmin(state);
      showToast(response);
      setState(DEFAULT_STATE);
      onClose();

    } catch (e) {
      showToast(e, true);
    }
  };

  return (
    <B2Modal title={"Reset Password : " + username} className={"b2form"} isCentre={true} isOpen={isOpen}
             onConfirm={handleSubmit} onClose={handleModalClose}>
      <div className="modal-form-content">
        <div className="modal-form-content-1">
          <div>
            <label>Username</label>
            <B2Input onChange={handleInputChange} disabled={true} name={"username"} value={state?.username}
                     placeholder={" "} />
          </div>
          <div>
            <label>Role</label>
            <B2Input onChange={handleInputChange} disabled={true} name={"role"} value={state?.roles?.roleName}
                     placeholder={" "} />
          </div>
          <div>
            <label>Remark</label>
            <B2Input onChange={handleInputChange} disabled={true} name={"remark"} value={state?.remark}
                     placeholder={" "} />
          </div>
          <div>
            <label>New Password</label>
            <B2Input onChange={handleInputChange} type={"password"} name={"newPassword"} value={state?.newPassword}
                     placeholder={" "} />
          </div>
          <div>
            <label>Confirm Password</label>
            <B2Input onChange={handleInputChange} type={"password"} name={"confirmPassword"}
                     value={state?.confirmPassword} placeholder={" "} />
          </div>
        </div>

        {/* <div>
        <label>Username</label>
        <B2Row>
          <B2Col md={8}>
            <B2Input onChange={handleInputChange} disabled={true} name={"username"}
                     value={state?.username} placeholder={" "}
            />
          </B2Col>
        </B2Row>
        <label>Role</label>
        <B2Row>
          <B2Col md={8}>
            <B2Input onChange={handleInputChange} disabled={true} name={"role"}
                     value={state?.roles?.roleName} placeholder={" "}
            />
          </B2Col>
        </B2Row>
        <label>Remark</label>
        <B2Row>
          <B2Col md={8}>
            <B2Input onChange={handleInputChange} disabled={true} name={"remark"}
                     value={state?.remark} placeholder={" "}
            />
          </B2Col>
        </B2Row>
        <label>New Password</label>
        <B2Row>
          <B2Col md={8}>
            <B2Input onChange={handleInputChange} type={"password"} name={"newPassword"}
                     value={state?.newPassword} placeholder={" "}
            />
          </B2Col>
        </B2Row>
        <label>Confirm Password</label>
        <B2Row>
          <B2Col md={8}>
            <B2Input onChange={handleInputChange} type={"password"} name={"confirmPassword"}
                     value={state?.confirmPassword} placeholder={" "}
            />
          </B2Col>
        </B2Row>
      </div> */}
      </div>
    </B2Modal>
  );
};

export default ModalReset;
