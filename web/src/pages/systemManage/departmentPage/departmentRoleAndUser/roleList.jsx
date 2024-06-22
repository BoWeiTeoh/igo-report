import React from "react";
import B2Tab from "../../../../components/b2Tab/b2Tab.jsx";

const RoleList = ({ list, roleSelect, onRoleSelect }) => {
  let roleCheckedIndex = null;
  const tabList = list?.map((d, i) => {
    if (roleSelect?._id === d._id) {
      roleCheckedIndex = i;
    }
    return {
      label: d.roleName,
      value: d._id,
      data: d // include data
    };
  });

  return (
    <div className={"role-list"}>
      <B2Tab list={tabList} onTabClick={onRoleSelect} checkedIndex={roleCheckedIndex} />
    </div>
  );
};

export default RoleList;
