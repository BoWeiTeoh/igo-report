import { useState } from "react";
import dataSource from "../../../../dataSource/dataSource.js";
import showToast from "../../../../helpers/showToast.js";

const useRole = () => {
  const [roleList, setRoleList] = useState([]);

  const fetchRoleList = async (department) => {
    const { _id } = department || {};
    try {
      const roleList = await dataSource.shared?.getRoleList({
        department: _id
      });
      setRoleList(roleList?.data);
      return roleList?.data;
    } catch (e) {
      showToast(e, 1);
    }
  };

  const handleRoleDelete = async (role) => {
    if (role) {
      try {
        await dataSource.shared?.deleteRole(role);
      } catch (e) {
        showToast(e);
      }
    }
  };

  return {
    fetchRoleList,
    handleRoleDelete,
    roleList,
    setRoleList
  };
};

export default useRole;
