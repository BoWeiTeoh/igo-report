import React from "react";
import "./departmentTree.scss";
import B2Icon from "../../../../components/b2Icon/b2Icon.jsx";
import clsx from "clsx";
import B2Button from "../../../../components/b2Button/b2Button.jsx";
import helpers from "../../../../helpers/util.js";
import B2Image from "../../../../components/b2Image/b2Image.jsx";
import ic_add from "../../../../images/icon/ic_add.png";
import ic_delete from "../../../../images/icon/ic_delete.png";

const DepartmentTreeList = ({ departmentTree, departmentSelect, onDepartmentClick, onModalOpen }) => {
  const rootDepartment = departmentTree;
  const isAdmin = helpers.ui.isAdmin();

  const handleDepartmentsRender = (department) => {
    const { children, _id, name } = department || {};

    const isRoot = name?.toLowerCase() === "root";

    let companyIcon;
    if (department.label === "COMPANY") {
      companyIcon = <B2Icon icon={"icon-company"} />;
    }

    let level1 = false;
    let level2 = false;
    let level3 = false;
    let level4 = false;
    let level5 = false;
    let level6 = false;
    if (department.level === 1) {
      level1 = true;
    } else if (department.level === 2) {
      level2 = true;
    } else if (department.level === 3) {
      level3 = true;
    } else if (department.level === 4) {
      level4 = true;
    } else if (department.level === 5) {
      level5 = true;
    } else {
      level6 = true;
    }

    let childLevel1 = false;
    let childLevel2 = false;
    if (children) {
      childLevel1 = children.some(d => d.level === 1);
      childLevel2 = children.some(d => d.level === 2);

      return (
        <>
          <div className={"_item"} style={isRoot ? { display: "none" } : {}}>
            <div className={clsx("item-role", level1 && "company", level2 && "department", level3 && "level3", level4 && "level4", level5 && "level5", level6 && "other")}>
              {companyIcon}

              <span
                onClick={() => onDepartmentClick(department)}
                data-text={name}
                className={clsx("_text fww-bold", _id === departmentSelect?._id && "fw-bold")}
              >
                {name}
              </span>
              
              <div className="btn-container">
                <B2Image 
                  src={ic_add} 
                  alt={"ic_add"} 
                  isIcon={true} 
                  className={"image-icon-small"} 
                  onClick={() => handleAddDepartmentClick("createDepartment", department)}
                />
                <B2Image 
                  src={ic_delete} 
                  alt={"ic_delete"} 
                  isIcon={true} 
                  className={"image-icon-small"}
                  onClick={() => handleRemoveDepartmentClick("removeDepartment", department)}
                />
              </div>
              
            </div>
          </div>

          <ul className={clsx("tree-level", childLevel1 && "company", childLevel2 && "department")}>
            {children.map((d) => {
              return <li key={d._id} className="level">{handleDepartmentsRender(d)}</li>;
            })}
          </ul>
        </>
      );
    }
  };

  const handleAddDepartmentClick = (name, data) => {
    onModalOpen(name, data);
  };

  const handleRemoveDepartmentClick = (name, data) => {
    onModalOpen(name, data);
  };

  return (
    <React.Fragment>
      <ul>
        {isAdmin && (
          <>
            <B2Button size="sm" onClick={() => handleAddDepartmentClick("createDepartment", rootDepartment)} withShadow>
              Create Company
            </B2Button>
            <br />
            <br />
          </>
        )}
        {handleDepartmentsRender(departmentTree)}
      </ul>
    </React.Fragment>
  );
};

export default DepartmentTreeList;
