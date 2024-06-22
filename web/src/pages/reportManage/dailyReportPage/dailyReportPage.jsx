import React, { useEffect, useRef, useState } from "react";
import showToast from "../../../helpers/showToast.js";
import dataSource from "../../../dataSource/dataSource.js";
import branchReportTableColumns from "./dailyReportTableColumns.jsx";
import BasePage from "../../Others/basePage/basePage.jsx";
import ReactTable8 from "../../../components/reactTable8/reactTable8.jsx";
import ReactTableFilter from "../../../components/tableFilter/reactTableFilter.jsx";
import config from "../../../config/config.js";
import { constFilterType } from "../../../components/tableFilter/constFilter.js";
import {
  getCategoriesBySiteType,
  getPlatformByRole,
  getSiteTypeByBranch,
  getSupplierByCategory
} from "../../../common/common.js";
import {constChannelType} from "../../../const/constChannelType.js";

const now = new Date();
const startTime = new Date(now.setHours(0, 0, 0, 0) - 24 * 60 * 60 * 1000);
const endTime = new Date(now.setHours(0, 0, 0, 0));

const DEFAULT_FILTER = {
  betTime: {
    startTime: startTime,
    endTime: endTime
  }
};

const isValid = (query) => {
  return (
    query?.category?.length &&
    query?.siteType?.length &&
    query?.branch?.length &&
    query?.supplier?.length &&
    query?.betTime?.startTime &&
    query?.betTime?.endTime
  );
};

const DailyReportPage = (props) => {
  const [docs, setDocs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [paginate, setPaginate] = useState(config.paginate);
  const [tableQuery, setTableQuery] = useState(DEFAULT_FILTER);
  const [siteType, setSiteType] = useState([]);
  const [category, setCategory] = useState([]);
  const [platform, setPlatform] = useState([]);
  const [supplier, setSupplier] = useState([]);
  const [isSearchBtnDisabled, setIsSearchBtnDisabled] = useState(false);

  useEffect(() => {
    getPlatformByRole({}, setPlatform).catch();
  }, []);

  useEffect(() => {
    if (isValid(tableQuery)) {
      fetchData(paginate, true).then();
    } else {
      setDocs([]);
    }
  }, [tableQuery]);

  useEffect(() => {
    const siteTypeArr = siteType.map((item) => item?.value);
    getCategoriesBySiteType({ _id: siteTypeArr }, setCategory).catch();
  }, [siteType]);

  useEffect(() => {
    const platformArr = platform.map((item) => item?.value);
    getSiteTypeByBranch({ _id: platformArr }, setSiteType).catch();
  }, [platform]);

  useEffect(() => {
    const categoryArr = category.map((item) => item?.value);
    getSupplierByCategory({ _id: categoryArr }, setSupplier).catch();
  }, [category]);

  const fetchData = async (pagingObj, newSearch) => {
    try {
      if (isValid(tableQuery)) {
        setIsLoading(true);
        setIsSearchBtnDisabled(true);

        if (newSearch) {
          pagingObj.page = 1;
        }

        const response = await dataSource.shared?.getDailyReport(tableQuery, pagingObj);

        if (response?.data?.data?.length && response?.data?.total) {
          const totalData = {
            total: true,
            amount: response?.data?.total?.amount,
            validAmount: response?.data?.total?.validAmount,
            bonusAmount: response?.data?.total?.bonusAmount,
            count: response?.data?.total?.count
          };
          setDocs([...response.data.data, totalData]);
        } else {
          setDocs([]);
        }

        setPaginate({ ...response?.pagingData });
      }
    } catch (error) {
      showToast(error, true);
    } finally {
      setIsLoading(false);
      setIsSearchBtnDisabled(false);
    }
  };

  const handleSelectChange = async (data, queryKey) => {
    const actions = {
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
      }
    };

    if (queryKey in actions) {
      await actions[queryKey]();
    }
  };

  const handleExportClick = async (data) => {
    try {
      if (isValid(data)) {
        const response = await dataSource.shared?.exportDailyReport(data);

        window.open(response?.data?.link);
      }
    } catch (e) {
      showToast(e, true);
    }
  };

  const columns = branchReportTableColumns();

  const getFilterComponents = () => {
    return [
      {
        label: "branch",
        placeholder: "Outlet ID",
        type: constFilterType.select,
        options: platform,
        queryKey: "branch",
        onChange: handleSelectChange,
        onClearOtherKey: ["siteType", "category", "supplier"],
        isMulti: true,
        shouldValidate: true
      },
      {
        label: "siteType",
        placeholder: "Site Type",
        type: constFilterType.select,
        options: siteType,
        queryKey: "siteType",
        onChange: handleSelectChange,
        onClearOtherKey: ["category", "supplier"],
        isMulti: true,
        shouldValidate: true
      },
      {
        label: "category",
        placeholder: "Platform Code",
        type: constFilterType.select,
        options: category,
        queryKey: "category",
        onChange: handleSelectChange,
        onClearOtherKey: ["supplier"],
        isMulti: true,
        shouldValidate: true
      },
      {
        label: "supplier",
        placeholder: "Game Brand",
        type: constFilterType.select,
        options: supplier,
        queryKey: "supplier",
        isMulti: true,
        shouldValidate: true
      },
      {
        type: constFilterType.time,
        showTimeSelect: false,
        dateTimeFormat: "yyyy-MM-dd",
        // isClearable: false,
        // showRange: true,
        queryKey: "betTime",
        shouldValidate: true,
        startTime: {
          placeholder: "Start Time"
        },
        endTime: {
          placeholder: "End Time"
        }
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
    <BasePage {...props} 
      callExportFromOutside={callExportFromOutside} 
      callSearchFromOutside={callSearchFromOutside}
      isSearchBtnDisabled={isSearchBtnDisabled}  
    >
      <ReactTableFilter
        data={getFilterComponents()}
        defaultQuery={DEFAULT_FILTER}
        onSearch={setTableQuery}
        onExport={handleExportClick}
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
        addCol={1}
        page={paginate?.page}
        // showPagination={false}
      />
    </BasePage>
  );
};

export default DailyReportPage;
