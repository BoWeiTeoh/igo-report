import { useState } from "react";
import dataSource from "../../../dataSource/dataSource.js";
import showToast from "../../../helpers/showToast.js";

const useDepartment = () => {
  const [departmentTree, setDepartmentTree] = useState([]);
  const [departmentSelect, setDepartmentSelect] = useState(null);

  const fetchDepartmentTree = async () => {
    try {
      const departmentTree = await dataSource.shared?.getDepartmentTree();
      setDepartmentTree(departmentTree?.data);
      return departmentTree?.data;
    } catch (e) {
      showToast(e, 1);
    }
  };

  const handleDepartmentClick = (department) => {
    setDepartmentSelect(department);
  };

  return {
    fetchDepartmentTree,
    handleDepartmentClick,
    departmentTree,
    departmentSelect
  };
};

export default useDepartment;
