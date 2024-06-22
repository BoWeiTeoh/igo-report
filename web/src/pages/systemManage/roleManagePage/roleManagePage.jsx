import React, { useEffect, useState } from "react";
import showToast from "../../../helpers/showToast.js";
import dataSource from "../../../dataSource/dataSource.js";
import roleManageTableColumns from "./roleManageTableColumns.jsx";
import BasePage from "../../Others/basePage/basePage.jsx";
import ReactTable8 from "../../../components/reactTable8/reactTable8.jsx";
import ReactTableFilter from "../../../components/tableFilter/reactTableFilter.jsx";
import config from "../../../config/config.js";
import { constFilterType } from "../../../components/tableFilter/constFilter.js";
import ModalRoleCreate from "./modalRoleCreate.jsx";
import ModalRoleEdit from "./modalRoleEdit.jsx";
import ModalRoleDelete from "./modalRoleDelete.jsx";
import ModalRoleAuthority from "./modalRoleAuthority.jsx";
import ModalRoleBranch from "./modalRoleBranch.jsx";

const DEFAULT_FILTER = {};
const RoleManagePage = (props) => {
  const [docs, setDocs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [paginate, setPaginate] = useState(config.paginate);
  const [tableQuery, setTableQuery] = useState(DEFAULT_FILTER);
  const [modal, setModal] = useState(null);

  useEffect(() => {
    fetchData(paginate, true).then();
  }, [tableQuery]);

  const fetchData = async (pagingObj, newSearch) => {
    try {
      pagingObj = pagingObj || paginate;
      if (newSearch) {
        pagingObj.page = 1;
      }
      setIsLoading(true);
      const response = await dataSource.shared?.getRoleManageTable(tableQuery, pagingObj);
      setDocs(response?.data);
      setPaginate({ ...response?.pagingData });
    } catch (e) {
      showToast(e, true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleModalOpen = (name, data) => {
    setModal({ name, data });
  };

  const handleModalClose = () => {
    setModal(null);
  };

  const handleModelSwitch = async (data) => {
    await dataSource.shared?.updateRole(data);
    fetchData().catch(err => {
        showToast(err, true);
    });
  };

  const columns = roleManageTableColumns({ handleModalOpen, handleModelSwitch });
  return (
    <BasePage {...props}>
      <ReactTableFilter
        data={getFilterComponents()}
        defaultQuery={DEFAULT_FILTER}
        onSearch={setTableQuery}
        onCreate={() => handleModalOpen("create")}
      />

      <ReactTable8
        columns={columns}
        data={docs || []}
        checkbox={false}
        isLoading={isLoading}
        onFetchData={fetchData}
        limit={paginate?.limit}
        totalCount={paginate?.totalDocs}
        pages={paginate?.totalPages}
        page={paginate?.page}
      />

      <ModalRoleCreate
        isOpen={modal?.name === "create"}
        data={modal?.data}
        onClose={handleModalClose}
        onDataUpdate={fetchData}
      />

      <ModalRoleEdit
        isOpen={modal?.name === "edit"}
        data={modal?.data}
        onClose={handleModalClose}
        onDataUpdate={fetchData}
      />

      <ModalRoleDelete
        isOpen={modal?.name === "delete"}
        data={modal?.data}
        onClose={handleModalClose}
        onDataUpdate={fetchData}
      />

      <ModalRoleAuthority
        isOpen={modal?.name === "authority"}
        data={modal?.data}
        onClose={handleModalClose}
        onDataUpdate={fetchData}
      />

      <ModalRoleBranch
        isOpen={modal?.name === "branch"}
        data={modal?.data}
        onClose={handleModalClose}
        onDataUpdate={fetchData}
      />
    </BasePage>
  );
};

const getFilterComponents = () => {
  return [
    {
      label: "roleName",
      type: constFilterType.input,
      queryKey: "roleName",
      search: "search"
    }
  ];
};

export default RoleManagePage;
