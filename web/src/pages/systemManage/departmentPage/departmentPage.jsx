import React, { useEffect, useState } from "react";
import showToast from "../../../helpers/showToast.js";
import BasePage from "../../Others/basePage/basePage.jsx";
import DepartmentTree from "./departmentTree/departmentTree.jsx";
import useDepartment from "./useDepartment.js";
import DepartmentRoleAndUser from "./departmentRoleAndUser/departmentRoleAndUser.jsx";
import useRole from "./departmentRoleAndUser/useRole.js";
import B2Row from "../../../components/grid/b2Row.jsx";
import ModalRoleCreate from "./departmentRoleAndUser/modalRoleCreate.jsx";
import ModalUserCreate from "./departmentRoleAndUser/modalUserCreate.jsx";
import ModalCompanyEdit from "./departmentRoleAndUser/modalCompanyEdit.jsx";
import "./departmentPage.scss";
import B2Col from "../../../components/grid/b2Col.jsx";
import B2Modal from "../../../components/b2Modal/b2Modal.jsx";
import B2Button from "../../../components/b2Button/b2Button.jsx";
import dataSource from "../../../dataSource/dataSource.js";

const DepartmentPage = (props) => {
  const [modal, setModal] = useState(null);
  const [roleSelect, setRoleSelect] = useState(null);
  const [renderUserCount, setRenderUserCount] = useState(0); // todo refactor

  const { fetchDepartmentTree, departmentSelect, departmentTree, handleDepartmentClick } = useDepartment();
  const { fetchRoleList, roleList, setRoleList, handleRoleDelete } = useRole();

  useEffect(() => {
    if (departmentSelect) {
      const fetchData = async () => {
        try {
          const roleList = await fetchRoleList(departmentSelect);
          handleRoleSelect(roleList[0]).then();
        } catch (e) {
        }
      };
      fetchData().then();
    }
  }, [departmentSelect]);

  useEffect(() => {
    const init = async () => {
      // fetchPermissionList().then();
      const tree = await fetchDepartmentTree();
      if (tree?.children?.length) {
        handleDepartmentClick(tree?.children[0]);
      }
    };
    init().then();
  }, []);

  const handleDepartmentUpdate = (updatedDepartmentData) => {
    fetchDepartmentTree(updatedDepartmentData).catch(err => {
      showToast(err, true);
    });
    handleDepartmentClick(updatedDepartmentData);
  };

  const handleRoleSelect = async (role) => {
    setRoleSelect(role);
    if (role) {
      try {
        const response = await dataSource.shared?.getRole(
          {
            _id: role?._id
          },
          null
        );
        setRoleSelect(response?.data);
      } catch (e) {
        showToast(e, 1);
      }
    }
  };

  const handleModalOpen = (name, data) => {
    setModal({ name, data });
  };

  const handleModalClose = () => {
    setModal(null);
  };

  const handleDeleteConfirm = async (roleData) => {
    await handleRoleDelete(roleData);
    setRoleSelect(null);
    setRoleList(null);
    fetchRoleList(departmentSelect).then();
    handleModalClose();
    showToast("Success");
  };

  return (
    <BasePage {...props} title={null}>
      <B2Row>
        <B2Col xs="auto" className="_side">
          <DepartmentTree
            departmentTree={departmentTree}
            departmentSelect={departmentSelect}
            fetchDepartmentTree={fetchDepartmentTree}
            onDepartmentClick={handleDepartmentClick}
          />
        </B2Col>

        <B2Col className={"_main"}>
          {departmentSelect && (
            <div className={"mb-3"}>
              <CompanyContext handleModalOpen={handleModalOpen} departmentSelect={departmentSelect} />
            </div>
          )}

          <div>
            <DepartmentRoleAndUser
              roleList={roleList}
              onRoleSelect={handleRoleSelect}
              roleSelect={roleSelect}
              renderUserCount={renderUserCount}
              onModalOpen={handleModalOpen}
            />
          </div>
        </B2Col>
      </B2Row>

      <ModalRoleCreate
        isOpen={modal?.name === "roleCreate"}
        data={modal?.data}
        onClose={handleModalClose}
        onDataUpdate={() => (modal?.data?.isEdit ? handleRoleSelect(roleSelect) : fetchRoleList(departmentSelect))}
      />

      <ModalUserCreate
        isOpen={modal?.name === "userCreate"}
        roleSelect={modal?.data}
        onClose={handleModalClose}
        onDataUpdate={() => setRenderUserCount((d) => d + 1)}
      />

      <ModalCompanyEdit
        isOpen={modal?.name === "companyEdit"}
        data={modal?.data}
        onClose={handleModalClose}
        onDataUpdate={handleDepartmentUpdate}
      />

      <B2Modal
        isOpen={modal?.name === "roleDelete"}
        data={modal?.data}
        title={"Delete Role"}
        onClose={handleModalClose}
        onConfirm={() => handleDeleteConfirm(modal?.data)}
      >
        Are you sure to delete role <b>{modal?.data?.name}</b>?
      </B2Modal>
    </BasePage>
  );
};

const CompanyContext = ({ departmentSelect, handleModalOpen }) => {
  const { name } = departmentSelect || {};
  return (
    <div style={{ display: "flex", justifyContent: "space-between" }}>
      <div className={"row-h"}>
        <h2 style={{ margin: "0 10px 0 0" }}>{name}</h2>
        <B2Button
          size={"sm"}
          onClick={() => handleModalOpen("companyEdit", { ...departmentSelect, isEdit: true })}
          color={"warning"}
        >
          Edit
        </B2Button>
      </div>

      {/*<B2ButtonGroup>*/}
      {/*  /!*<B2Button size={"sm"}*!/*/}
      {/*  /!*        color={"secondary"}*!/*/}
      {/*  /!*        onClick={() => handleModalOpen("companyDelete", {DepartmentID: departmentSelect?.DepartmentID})}>*!/*/}
      {/*  /!*    Delete {name}*!/*/}
      {/*  /!*</B2Button>*!/*/}

      {/*  <B2Button*/}
      {/*    color={"primary"}*/}
      {/*    size={"sm"}*/}
      {/*    withShadow={true}*/}
      {/*    permission={constPermissions.ROLE_CREATE}*/}
      {/*    onClick={() => handleModalOpen("roleCreate", { department: departmentSelect?._id })}*/}
      {/*  >*/}
      {/*    Create Role*/}
      {/*  </B2Button>*/}
      {/*</B2ButtonGroup>*/}
    </div>
  );
};

export default DepartmentPage;
