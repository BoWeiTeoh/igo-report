import React, { useEffect, useRef, useState } from "react";
import showToast from "../../../helpers/showToast.js";
import dataSource from "../../../dataSource/dataSource.js";
import balanceRecordTableColumns from "./balanceRecordTableColumns.jsx";
import BasePage from "../../Others/basePage/basePage.jsx";
import ReactTable8 from "../../../components/reactTable8/reactTable8.jsx";
import ReactTableFilter from "../../../components/tableFilter/reactTableFilter.jsx";
import config from "../../../config/config.js";
import { constFilterType } from "../../../components/tableFilter/constFilter.js";
import { constChannelType } from "../../../const/constChannelType.js";
import {
  getCategoriesBySiteType,
  getGame,
  getPlatformByRole,
  getSiteTypeByBranch,
  getSupplierByCategory
} from "../../../common/common.js";
import ModalExport from "./modalExport.jsx";

const now = new Date();
const startTime = new Date(now.setHours(0, 0, 0, 0) - 24 * 60 * 60 * 1000);
const endTime = new Date(now.setHours(23, 59, 59, 59) - 24 * 60 * 60 * 1000);

const DEFAULT_FILTER = {
  billTime: {
    startTime: startTime,
    endTime: endTime
  },
  report: "Balance Record"
};

const isValid = (query) => {
  return (
    query?.branch?.length &&
    query?.category?.length &&
    query?.siteType?.length &&
    query?.supplier?.length &&
    query?.billTime?.startTime &&
    query?.billTime?.endTime
  );
};

const BalanceRecordPage = (props) => {
  const [docs, setDocs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoading2, setIsLoading2] = useState(false);
  const [paginate, setPaginate] = useState(config.paginate);
  const [tableQuery, setTableQuery] = useState(DEFAULT_FILTER);
  const [siteType, setSiteType] = useState([]);
  const [category, setCategory] = useState([]);
  const [platform, setPlatform] = useState([]);
  const [supplier, setSupplier] = useState([]);
  const [game, setGame] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [totalBet, setTotalBet] = useState(0);
  const [totalWinLose, setTotalWinLose] = useState(0);
  const [totalTurnover, setTotalTurnover] = useState(0);
  const [generateStatus, setGenerateStatus] = useState(false);
  const [modal, setModal] = useState(null);
  const [isGameCodeDisabled, setIsGameCodeDisabled] = useState(false);
  const [isGameDisabled, setIsGameDisabled] = useState(false);
  const [isSearchBtnDisabled, setIsSearchBtnDisabled] = useState(false);
  const [isSearchBtnTotalDisabled, setIsSearchBtnTotalDisabled] = useState(false);

  let regenerateInterval;

  useEffect(() => {
    getPlatformByRole({}, setPlatform).catch();
    getSystemStatus().catch();
  }, []);

  useEffect(() => {
    if (isValid(tableQuery)) {
      // 计算时间差（毫秒）
      fetchData(paginate, true).then(() => {
        getBillTotal().catch();
      });
    }
  }, [tableQuery]);

  useEffect(() => {
    // This function will be called after the component is mounted
    regenerateInterval = setInterval(() => {
      // Your code to be executed at each interval goes here
      console.log("Regenerate Interval triggered!");
      getSystemStatus().catch();
    }, 15000); // Replace 1000 with your desired interval in milliseconds

    // Clean up the interval when the component is unmounted
    return () => clearInterval(regenerateInterval);
  }, []); // The empty dependency array ensures that this effect runs only once on mount

  useEffect(() => {
    const platformArr = platform.map((item) => item?.value);
    getSiteTypeByBranch({ _id: platformArr }, setSiteType).catch();
  }, [platform]);

  useEffect(() => {
    const siteTypeArr = siteType.map((item) => item?.value);
    getCategoriesBySiteType({ _id: siteTypeArr }, setCategory).catch();
  }, [siteType]);

  useEffect(() => {
    const categoryArr = category.map((item) => item?.value);
    getSupplierByCategory({ _id: categoryArr }, setSupplier).catch();
  }, [category]);

  useEffect(() => {
    const supplierArr = supplier.map((item) => item?.value);
    getGame({ provider: supplierArr }, setGame).catch();
    setIsGameCodeDisabled(false);
  }, [supplier]);

  const getSystemStatus = async () => {
    try {
      const response = await dataSource.shared?.getSystemStatus({});
      if (response?.functionAvailable) {
        setGenerateStatus(true);
      } else {
        setGenerateStatus(false);
      }
    } catch (e) {
      showToast(e, true);
    }
  };

  const getBillTotal = async () => {
    try {
      if (isValid(tableQuery)) {
        setIsLoading2(true);
        setIsSearchBtnTotalDisabled(true);
        const paginateObj = paginate || {};
        const response = await dataSource.shared?.getBillTotal(tableQuery);
        const totalPages = Math.ceil(response?.data?.totalCount / paginateObj?.limit);
        setPaginate({ ...paginateObj, totalDocs: response?.data?.totalCount, totalPages: totalPages });
        setTotalCount(response?.data?.totalCount);
        setTotalBet(response?.data?.totalAmount);
        setTotalTurnover(response?.data?.totalValidAmount);
        setTotalWinLose(response?.data?.totalBonusAmount);
      } else {
        setPaginate({ ...paginate, totalDocs: 0, totalPages: 0 });
        setTotalCount(0);
        setTotalBet(0);
        setTotalTurnover(0);
        setTotalWinLose(0);
      }
    } catch (e) {
      setIsLoading2(false);
      showToast(e, true);
    } finally {
      setIsLoading2(false);
      setIsSearchBtnTotalDisabled(false);
    }
  };

  const fetchData = async (pagingObj, newSearch) => {
    try {
      pagingObj = pagingObj || paginate;
      if (isValid(tableQuery)) {
        setIsLoading(true);
        setIsSearchBtnDisabled(true);
        if (newSearch) {
          pagingObj.page = 1;
        }
        const response = await dataSource.shared?.getBillReport(tableQuery, pagingObj);
        setDocs(response?.data);
        if (response?.data?.length) {
          response?.data.push({
            subTotal: true,
            amount: response?.pagingData?.subTotal?.amount,
            validAmount: response?.pagingData?.subTotal?.validAmount,
            bonusAmount: response?.pagingData?.subTotal?.bonusAmount
          });
        }
        const totalPages = Math.ceil(totalCount / pagingObj?.limit);
        if (totalPages && totalCount) {
          setPaginate({ ...response?.pagingData, totalDocs: totalCount, totalPages: totalPages });
        } else {
          setPaginate({ ...response?.pagingData });
        }
      } else if (newSearch) {
        setDocs([]);
      }
    } catch (e) {
      setIsLoading(false);
      showToast(e, true);
    } finally {
      setIsLoading(false);
      setIsSearchBtnDisabled(false)
    }
  };

  const handleSelectChange = async (data, queryKey) => {
    const actions = {
      supplier: () => {
        const supplierList = data?.length ? data.map((item) => item.value) : supplier.map((item) => item?.value);
        setIsGameCodeDisabled(false);
        return getGame({ provider: supplierList }, setGame).catch();
      },
      category: () => {
        const categoryArr = data?.length ? data.map((item) => item.value) : category.map((item) => item?.value);
        return getSupplierByCategory({ _id: categoryArr }, setSupplier).catch();
      },
      siteType: () => {
        const siteTypeArr = data?.length ? data.map((item) => item.value) : siteType.map((item) => item?.value);
        return getCategoriesBySiteType({ _id: siteTypeArr }, setCategory).catch();
      },
      branch: () => {
        const platformArr = data?.length ? data.map((item) => item.value) : platform.map((item) => item?.value);
        return getSiteTypeByBranch({ _id: platformArr }, setSiteType).catch();
      },
      game: () => {
        if (data && data.length > 0) {
          setIsGameCodeDisabled(true)
        } else {
          setIsGameCodeDisabled(false)
        }
      },
    };

    if (queryKey in actions) {
      await actions[queryKey]();
    }
  };

  const handleExportClick = async (data) => {
    try {
      if (isValid(data)) {
        const response = await dataSource.shared?.exportBillReport(data);

        handleModalOpen("export", response?.data, data);
      }
    } catch (e) {
      showToast(e, true);
    }
  };

  const handleSearchClick = async (data) => {
    setTableQuery(data);
  };

  const handleGenerateClick = async (data) => {
    try {
      if (isValid(data)) {
        if (new Date(data?.billTime?.startTime) < new Date()){
          const response = await dataSource.shared?.generateBillReportSummary(data);
          setGenerateStatus(false);
          if (response) {
            getSystemStatus().catch();
          }
        }
      }
    } catch (e) {
      showToast(e, true);
    }
  };

  const handleModalOpen = (name, data, searchCondition) => {
    setModal({ name, data, searchCondition });
  };

  const handleModalClose = () => {
    setModal(null);
  };
  
  const handleInputChange = (data, queryKey) => {
    if (queryKey === "gameCode") {
      if (data.length > 0) {
        setIsGameDisabled(true);
      } else {
        setIsGameDisabled(false);
      }
    }
  };

  const getFilterComponents = () => {
    return [
      {
        label: "branch",
        placeholder: "Outlet ID",
        type: constFilterType.select,
        options: platform,
        queryKey: "branch",
        onChange: handleSelectChange,
        isMulti: true,
        shouldValidate: true,
        onClearOtherKey: ["siteType", "category", "supplier", "game"]
      },
      {
        label: "siteType",
        placeholder: "Site Type",
        type: constFilterType.select,
        options: siteType,
        queryKey: "siteType",
        onChange: handleSelectChange,
        isMulti: true,
        shouldValidate: true,
        onClearOtherKey: ["category", "supplier", "game"]
      },
      {
        label: "category",
        placeholder: "Platform Code",
        type: constFilterType.select,
        options: category,
        queryKey: "category",
        onChange: handleSelectChange,
        isMulti: true,
        shouldValidate: true,
        onClearOtherKey: ["supplier", "game"]
      },
      {
        label: "supplier",
        placeholder: "Game Brand",
        type: constFilterType.select,
        options: supplier,
        queryKey: "supplier",
        onChange: handleSelectChange,
        isMulti: true,
        shouldValidate: true,
        onClearOtherKey: ["game"]
      },
      {
        label: "currency",
        placeholder: "Currency",
        type: constFilterType.select,
        options: [{ label: "PHP", value: "PHP" }],
        queryKey: "currency"
      },
      {
        label: "account",
        placeholder: "Account",
        type: constFilterType.input,
        queryKey: "account"
      },
      {
        label: "billNo",
        placeholder: "Bill No",
        type: constFilterType.input,
        queryKey: "billNo"
      },
      {
        label: "gameCode",
        placeholder: "Game Code",
        type: constFilterType.input,
        queryKey: "gameCode",
        disabled: isGameCodeDisabled,
        onChange: handleInputChange
      },
      {
        label: "min",
        placeholder: "Bet Amount: Min",
        type: constFilterType.input,
        queryKey: "min"
      },
      {
        label: "max",
        placeholder: "Bet Amount: Max",
        type: constFilterType.input,
        queryKey: "max"
      },
      {
        type: constFilterType.time,
        dateTimeFormat: "yyyy-MM-dd HH:mm:ss",
        isClearable: true,
        showRange: true,
        queryKey: "billTime",
        shouldValidate: true,
        startTime: {
          placeholder: "Bill Time Start Time",
          queryKey: "startTime"
        },
        endTime: {
          placeholder: "Bill Time End Time",
          queryKey: "endTime"
        }
      },
      {
        type: constFilterType.time,
        dateTimeFormat: "yyyy-MM-dd HH:mm:ss",
        isClearable: true,
        showRange: true,
        queryKey: "payoutTime",
        startTime: {
          placeholder: "Payout Start Time",
          queryKey: "startTime"
        },
        endTime: {
          placeholder: "Payout End Time",
          queryKey: "endTime"
        }
      },
      {
        label: "game",
        placeholder: "Game",
        type: constFilterType.select,
        options: game,
        queryKey: "game",
        isMulti: true,
        isSearchable: true,
        disabled: isGameDisabled,
        onChange: handleSelectChange
      },
      {
        label: "channelType",
        placeholder: "Channel Type",
        type: constFilterType.select,
        options: constChannelType,
        queryKey: "channelType",
        onChange: handleSelectChange
      }
    ];
  };

  const columns = balanceRecordTableColumns();

  // UseRef
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

  const callGenerateFromOutside = async () => {
    if (reactTableFilterRef.current) {
      await reactTableFilterRef.current?.onGenerateClick();
    }
  };

  return (
    <BasePage
      {...props}
      callExportFromOutside={callExportFromOutside}
      callSearchFromOutside={callSearchFromOutside}
      callGenerateFromOutside={callGenerateFromOutside}
      generateStatus={generateStatus}
      isSearchBtnDisabled={isSearchBtnDisabled || isSearchBtnTotalDisabled}
    >
      <ReactTableFilter
        data={getFilterComponents()}
        defaultQuery={DEFAULT_FILTER}
        onSearch={handleSearchClick}
        onExport={handleExportClick}
        onGenerate={handleGenerateClick}
        generateStatus={generateStatus}
        ref={reactTableFilterRef}
        isBillPage={true}
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
        addCol={1}
        page={paginate?.page}
        totalBet={totalBet}
        totalTurnover={totalTurnover}
        totalWinLose={totalWinLose}
        isLoading2={isLoading2}
        isBillPage={true}
      />

      <ModalExport
        isOpen={modal?.name === "export"}
        data={modal?.data}
        onClose={handleModalClose}
        searchCondition={modal?.searchCondition}
      />
    </BasePage>
  );
};

export default BalanceRecordPage;
