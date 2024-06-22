import React, { useEffect, useRef, useState } from "react";
import showToast from "../../../helpers/showToast.js";
import dataSource from "../../../dataSource/dataSource.js";
import BasePage from "../basePage/basePage.jsx";
import config from "../../../config/config.js";
import { constFilterType } from "../../../components/tableFilter/constFilter.js";
import ReactTable8 from "../../../components/reactTable8/reactTable8.jsx";
import ReactTableFilter from "../../../components/tableFilter/reactTableFilter.jsx";
import ipConfigTableColumns from "./ipConfigTableColumns.jsx";
import ModalIpCreate from "./modalIpCreate.jsx";
import ModalIpEdit from "./modalIpEdit.jsx";
import ModalIpDelete from "./modalIpDelete.jsx";

const now = new Date();
const DEFAULT_FILTER = {};

const IpConfigPage = (props) => {
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
      const response = await dataSource.shared?.getIpConfig(tableQuery, pagingObj);
      setDocs(response?.data);
      setPaginate({ ...response?.pagingData });
    } catch (e) {
      showToast(e, true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleModalOpen = (name, data = {}) => {
    setModal({ name, data });
  };

  const handleModalClose = () => {
    setModal(null);
  };

  const handleModelSwitch = async (data) => {
    // await dataSource.shared?.updateAdmin(data);
    fetchData().catch((err) => {
      showToast(err, true);
    });
  };
  const columns = ipConfigTableColumns({ handleModalOpen, handleModelSwitch });

  const getFilterComponents = () => {
    return [
      {
        label: "Config Type",
        type: constFilterType.hide,
        queryKey: "configType",
        operation: "regex",
        search: "search" // searchInput
      }
    ];
  };

  // UseRef
  const reactTableFilterRef = useRef();

  const callExportFromOutside = async () => {
    if (reactTableFilterRef.current) {
      await reactTableFilterRef.current.onExportClick();
    }
  };

  const callSearchFromOutside = async () => {
    if (reactTableFilterRef.current) {
      await reactTableFilterRef.current.onSearchClick();
    }
  };

  return (
    <BasePage {...props}>
      <ReactTableFilter
        data={getFilterComponents()}
        defaultQuery={DEFAULT_FILTER}
        // onSearch={setTableQuery}
        onCreate={() => handleModalOpen("create")}
      />

      <ReactTable8
        columns={columns}
        data={docs || []}
        checkbox={false}
        isLoading={isLoading}
        onFetchData={fetchData}
        limit={10000}
        showPagination={false}
      />
      <ModalIpCreate
        isOpen={modal?.name === "create"}
        data={modal?.data}
        onClose={handleModalClose}
        onDataUpdate={fetchData}
      />

      <ModalIpEdit
        isOpen={modal?.name === "edit"}
        data={modal?.data}
        onClose={handleModalClose}
        onDataUpdate={fetchData}
      />

      <ModalIpDelete
        isOpen={modal?.name === "delete"}
        data={modal?.data}
        onClose={handleModalClose}
        onDataUpdate={fetchData}
      />
    </BasePage>
  );
};

export default IpConfigPage;
