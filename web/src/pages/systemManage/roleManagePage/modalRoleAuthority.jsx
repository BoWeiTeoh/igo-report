import React, { useEffect, useState } from "react";
import showToast from "../../../helpers/showToast.js";
import dataSource from "../../../dataSource/dataSource.js";
import B2Modal from "../../../components/b2Modal/b2Modal.jsx";
import PermissionList from "./permissionList.jsx";

const DEFAULT_STATE = {
  _id: null,
  permission: []
};

const ModalRoleAuthority = ({ isOpen, onClose, onDataUpdate, data }) => {
  const [state, setState] = useState(data || DEFAULT_STATE);
  const [permissionUpdate, setPermissionUpdate] = useState({});
  const [role, setRole] = useState({});

  useEffect(() => {
    if (data) {
      setState((d) => ({
        ...d,
        ...data
      }));

    }
  }, [data]);

  useEffect(() => {
    if (state?._id) {
      fetchRole().catch();
    }
  }, [state]);

  const fetchRole = async () => {
    try {
      const response = await dataSource.shared?.getRole({ _id: state?._id });
      setRole(response?.data);
    } catch (e) {
    }
  };
  const handleModalClose = () => {
    setState(DEFAULT_STATE);
    onClose();
  };

  const handleResourceSave = async () => {
    try {
      let response;
      let query = {
        role: state?._id,
        list: permissionUpdate
      };
      response = await dataSource.shared?.updateRolePermission(query);
      showToast(response);
      setState(DEFAULT_STATE);
      onDataUpdate();
      onClose();
    } catch (e) {
      showToast(e);
    }
  };

  return (
    <B2Modal
      size={"lg"}
      title={"Role Authority : " + state?.roleName}
      className={"b2form"}
      isCentre={true}
      isOpen={isOpen}
      onConfirm={handleResourceSave}
      onClose={handleModalClose}
    >
      <div className={"_body"}>
        <PermissionList roleSelect={role} onDataUpdate={onDataUpdate} setPermissionUpdate={setPermissionUpdate} />
      </div>
    </B2Modal>
  );
};

export default ModalRoleAuthority;
