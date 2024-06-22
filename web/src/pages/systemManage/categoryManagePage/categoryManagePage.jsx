import React, { useEffect, useState } from "react";
import showToast from "../../../helpers/showToast.js";
import dataSource from "../../../dataSource/dataSource.js";
import categoryTableColumns from "./categoryTableColumns.jsx";
import BasePage from "../../Others/basePage/basePage.jsx";
import ReactTable8 from "../../../components/reactTable8/reactTable8.jsx";
import ReactTableFilter from "../../../components/tableFilter/reactTableFilter.jsx";
import config from "../../../config/config.js";
import { constFilterType } from "../../../components/tableFilter/constFilter.js";
import ModalCategoryCreate from "./modalCategoryCreate.jsx";
import ModalCategoryEdit from "./modalCategoryEdit.jsx";

const DEFAULT_FILTER = {};
const CategoryManagePage = (props) => {
  const [docs, setDocs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [paginate, setPaginate] = useState(config.paginate);
  const [tableQuery, setTableQuery] = useState(DEFAULT_FILTER);
  const [modal, setModal] = useState(null);

  useEffect(() => {
    fetchData().then();
  }, [tableQuery]);

  const fetchData = async (pagingObj = paginate) => {
    try {
      setIsLoading(true);
      const response = await dataSource.shared?.getCategoryTable(tableQuery, pagingObj);
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

  const columns = categoryTableColumns({ handleModalOpen });
  return (
    <BasePage {...props}>
      <ReactTableFilter
        data={getFilterComponents()}
        defaultQuery={DEFAULT_FILTER}
        onSearch={setTableQuery}
        onCreate={() => handleModalOpen("create")}
        // onExport={handleExportClick}
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
      />

      <ModalCategoryCreate
        isOpen={modal?.name === "create"}
        data={modal?.data}
        onClose={handleModalClose}
        onDataUpdate={fetchData}
      />

      <ModalCategoryEdit
        isOpen={modal?.name === "edit"}
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
      label: "Platform Code",
      type: constFilterType.input,
      queryKey: "name",
      search: "search"
    }
  ];
};

export default CategoryManagePage;
