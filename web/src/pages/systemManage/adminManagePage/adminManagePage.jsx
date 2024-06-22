import React, { useEffect, useState } from "react";
import showToast from "../../../helpers/showToast.js";
import dataSource from "../../../dataSource/dataSource.js";
import adminManageTableColumns from "./adminManageTableColumns.jsx";
import BasePage from "../../Others/basePage/basePage.jsx";
import ReactTable8 from "../../../components/reactTable8/reactTable8.jsx";
import ReactTableFilter from "../../../components/tableFilter/reactTableFilter.jsx";
import config from "../../../config/config.js";
import { constFilterType } from "../../../components/tableFilter/constFilter.js";
import ModalAdminCreate from "./modalAdminCreate.jsx";
import ModalAdminEdit from "./modalAdminEdit.jsx";
import ModalAdminDelete from "./modalAdminDelete.jsx";
import ModalReset from "./modalReset.jsx";


const DEFAULT_FILTER = {};
const AdminManagePage = (props) => {
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
      setIsLoading(true);
      if (newSearch) {
        pagingObj.page = 1;
      }
      const response = await dataSource.shared?.getAdminTable(tableQuery, pagingObj);
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
    await dataSource.shared?.updateAdmin(data);
    fetchData().catch(err => {
      showToast(err, true);
    });
  };

  const columns = adminManageTableColumns({ handleModalOpen, handleModelSwitch });
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

      <ModalAdminCreate
        isOpen={modal?.name === "create"}
        data={modal?.data}
        onClose={handleModalClose}
        onDataUpdate={fetchData}
      />

      <ModalReset
        isOpen={modal?.name === "reset"}
        data={modal?.data}
        onClose={handleModalClose}
      />

      <ModalAdminEdit
        isOpen={modal?.name === "edit"}
        data={modal?.data}
        onClose={handleModalClose}
        onDataUpdate={fetchData}
      />

      <ModalAdminDelete
        isOpen={modal?.name === "delete"}
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
      label: "username",
      type: constFilterType.input,
      queryKey: "username",
      operation: "regex",
      search: "search" // searchInput
    }
  ];
};

export default AdminManagePage;
