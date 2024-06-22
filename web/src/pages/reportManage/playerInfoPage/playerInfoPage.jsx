import React, {useEffect, useRef, useState} from "react";
import config from "../../../config/config.js";
import dataSource from "../../../dataSource/dataSource.js";
import showToast from "../../../helpers/showToast.js";
import BasePage from "../../Others/basePage/basePage.jsx";
import ReactTable8 from "../../../components/reactTable8/reactTable8.jsx";
import playerInfoTableColumns from "./playerInfoTableColumns.jsx";
import ReactTableFilter from "../../../components/tableFilter/reactTableFilter.jsx";
import {constBooleanOptions, constFilterType} from "../../../components/tableFilter/constFilter.js";
import ModalExport from "../playerDeposit/modalExport.jsx";
import ModalDetail from "../playerInfoPage/modalDetail.jsx";
import ModalPicture from "../playerInfoPage/modalPicture.jsx";

const now = new Date();
let startTime = new Date(now.setHours(0, 0, 0, 0) - 24 * 60 * 60 * 1000);
let endTime = new Date(now.setHours(23, 59, 59, 59) - 24 * 60 * 60 * 1000);

const DEFAULT_FILTER = {
  registrationTime: {
    startTime: startTime,
    endTime: endTime
  }
};


const PlayerInfoPage = (props) => {
  const [docs, setDocs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [paginate, setPaginate] = useState(config.paginate);
  const [tableQuery, setTableQuery] = useState(DEFAULT_FILTER);
  const [isSearchBtnDisabled, setIsSearchBtnDisabled] = useState(false);
  const [modal, setModal] = useState(null);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    fetchData(paginate, true).then(() => {
      fetchTotal().catch();
    });
  }, [tableQuery]);

  const fetchTotal = async () => {
    try {
      const pagingObj = paginate || {};
      const totalData = await dataSource.shared?.getTotalCount(tableQuery, pagingObj, "/player-info/count");
      setPaginate({...pagingObj, totalDocs: totalData?.pagingData.totalDocs, totalPages: totalData?.pagingData?.totalPages});
      setTotalCount(totalData?.pagingData?.totalDocs);
    } catch (e) {
      showToast(e, true);
    }
  };

  const fetchData = async (pagingObj, newSearch) => {
    try {
      pagingObj = pagingObj || paginate;
      setIsLoading(true);
      setIsSearchBtnDisabled(true);
      if (newSearch) {
        pagingObj.page = 1;
      }
      const response = await dataSource.shared?.getPlayerInfoTable(tableQuery, pagingObj);
      setDocs(response?.data);
      const totalPages = Math.ceil(totalCount / pagingObj?.limit);
      if (totalPages && totalCount) {
        setPaginate({ ...response?.pagingData, totalDocs: totalCount, totalPages: totalPages, limit: pagingObj?.limit });
      } else {
        setPaginate({ ...response?.pagingData });
      }
    } catch (e) {
      showToast(e, true);
    } finally {
      setIsLoading(false);
      setIsSearchBtnDisabled(false);
    }
  };
  const handleExportClick = async (data) => {
    try {
      const response = await dataSource.shared?.exportPlayerInfoReport(data);
      handleModalOpen("export", response?.data);
    } catch (e) {
      showToast(e, true);
    }
  };
  const handleModalOpen = (name, data) => {
    setModal({ name, data });
  };

  const handleModalClose = () => {
    setModal(null);
  };

  const reactTableFilterRef = useRef();
  const callExportFromOutside = async () => {
    if (reactTableFilterRef.current) {
      await reactTableFilterRef.current?.onExportClick();
    }
  };
  const callSearchFromOutside = async () => {
    if (reactTableFilterRef.current) {
      await reactTableFilterRef.current?.onSearchClick();
    }
  };
  const getFilterComponents = () => {
    return [
      {
        label: "id",
        placeholder: "Player ID",
        type: constFilterType.input,
        queryKey: "playerId"
      },
      {
        label: "name",
        placeholder: "Player Name",
        type: constFilterType.input,
        queryKey: "name"
      },
      {
        label: "min",
        placeholder: "Credit: Min",
        type: constFilterType.input,
        queryKey: "min"
      },
      {
        label: "max",
        placeholder: "Credit: Max",
        type: constFilterType.input,
        queryKey: "max"
      },
      {
        label: "isCompleteInfo",
        placeholder: "Completed Info",
        type: constFilterType.select,
        options: constBooleanOptions,
        queryKey: "isCompleteInfo",
      },
      {
        type: constFilterType.time,
        // showTimeSelect: false,
        // dateTimeFormat: "MM-dd-yyyy",
        isClearable: true,
        showRange: true,
        queryKey: "registrationTime",
        // shouldValidate: true,
        startTime: {
          placeholder: "Start Time"
        },
        endTime: {
          placeholder: "End Time"
        }
      }
    ];
  };

  const columns = playerInfoTableColumns({handleModalOpen});
  return (
    <BasePage
        {...props}
        callExportFromOutside={callExportFromOutside}
        callSearchFromOutside={callSearchFromOutside}
        isSearchBtnDisabled={isSearchBtnDisabled}
    >

      <ReactTableFilter
          data={getFilterComponents()}
          defaultQuery={DEFAULT_FILTER}
          onExport={handleExportClick}
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
        page={paginate?.page}
      />

      <ModalExport
          isOpen={modal?.name === "export"}
          data={modal?.data}
          onClose={handleModalClose}
          searchCondition={modal?.searchCondition}
      />

      <ModalDetail
          isOpen={modal?.name === "detail"}
          data={modal?.data}
          onClose={handleModalClose}
      />

      <ModalPicture
          isOpen={modal?.name === "picture"}
          data={modal?.data}
          onClose={handleModalClose}
      />
    </BasePage>
  );
};

export default PlayerInfoPage;
