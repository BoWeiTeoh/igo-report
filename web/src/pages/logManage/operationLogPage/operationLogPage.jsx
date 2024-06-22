import React, { useEffect, useRef, useState } from "react";
import showToast from "../../../helpers/showToast.js";
import dataSource from "../../../dataSource/dataSource.js";
import operationLogTableColumns from "./operationLogTableColumns.jsx";
import BasePage from "../../Others/basePage/basePage.jsx";
import ReactTable8 from "../../../components/reactTable8/reactTable8.jsx";
import ReactTableFilter from "../../../components/tableFilter/reactTableFilter.jsx";
import config from "../../../config/config.js";
import { constFilterType } from "../../../components/tableFilter/constFilter.js";

const DEFAULT_FILTER = {};

const OperationLogPage = (props) => {
  const [docs, setDocs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [paginate, setPaginate] = useState(config.paginate);
  const [tableQuery, setTableQuery] = useState(DEFAULT_FILTER);

  useEffect(() => {
    fetchData().then();
  }, [tableQuery]);

  const fetchData = async (pagingObj = paginate) => {
    try {
      setIsLoading(true);
      const response = await dataSource.shared?.getOperationLogTable(tableQuery, pagingObj);
      setDocs(response?.data);
      setPaginate({ ...response?.pagingData });
    } catch (e) {
      showToast(e, true);
    } finally {
      setIsLoading(false);
    }
  };

  const columns = operationLogTableColumns();

  // UseRef
  const reactTableFilterRef = useRef();

  const callSearchFromOutside = async () => {
    if (reactTableFilterRef.current) {
      await reactTableFilterRef.current?.onSearchClick();
    }
  };

  return (
    <BasePage {...props} callSearchFromOutside={callSearchFromOutside}>
      <ReactTableFilter
        data={getFilterComponents()}
        defaultQuery={DEFAULT_FILTER}
        onSearch={setTableQuery}
        ref={reactTableFilterRef}
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
    </BasePage>
  );
};

const getFilterComponents = () => {
  return [
    {
      label: "username",
      type: constFilterType.input,
      queryKey: "username",
      placeholder: "username",
      operation: "regex"
    },
    {
      label: "title",
      type: constFilterType.input,
      queryKey: "title",
      placeholder: "title",
      operation: "regex"
    },
    {
      type: constFilterType.time,
      showTimeSelect: false,
      dateTimeFormat: "yyyy-MM-dd",
      isClearable: true,
      queryKey: "createdAt",
      startTime: {
        placeholder: "create from",
      },
      endTime: {
        placeholder: "create to",
      }
    }
  ];
};

export default OperationLogPage;
