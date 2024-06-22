import React, { useEffect, useRef, useState } from "react";
import showToast from "../../../helpers/showToast.js";
import dataSource from "../../../dataSource/dataSource.js";
import branchReportTableColumns from "./branchReportTableColumns.jsx";
import BasePage from "../../Others/basePage/basePage.jsx";
import ReactTable8 from "../../../components/reactTable8/reactTable8.jsx";
import ReactTableFilter from "../../../components/tableFilter/reactTableFilter.jsx";
import config from "../../../config/config.js";
import { constFilterType } from "../../../components/tableFilter/constFilter.js";
import { getCategoriesBySiteType, getPlatformByRole, getSiteTypeByBranch } from "../../../common/common.js";
import {constChannelType} from "../../../const/constChannelType.js";

const now = new Date();
const startTime = new Date(now.setHours(0, 0, 0, 0) - 24 * 60 * 60 * 1000);
const endTime = new Date(now.setHours(23, 59, 59, 59) - 24 * 60 * 60 * 1000);

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
    query?.betTime?.startTime &&
    query?.betTime?.endTime
  );
};

const BranchReportPage = (props) => {
  const [docs, setDocs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [paginate, setPaginate] = useState(config.paginate);
  const [tableQuery, setTableQuery] = useState(DEFAULT_FILTER);
  const [siteType, setSiteType] = useState([]);
  const [category, setCategory] = useState([]);
  const [platform, setPlatform] = useState([]);
  const [isSearchBtnDisabled, setIsSearchBtnDisabled] = useState(false);

  useEffect(() => {
    getPlatformByRole({}, setPlatform).catch();
  }, []);

  useEffect(() => {
    if (isValid(tableQuery)) {
      fetchData().then();
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

  const fetchData = async (pagingObj = paginate) => {
    try {
      if (tableQuery && Object.keys(tableQuery).length > 0) {
        if (!tableQuery?.category) {
          tableQuery.category = category.map((item) => item.value);
        }
        if (!tableQuery?.siteType) {
          tableQuery.siteType = siteType.map((item) => item.value);
        }
        setIsLoading(true);
        setIsSearchBtnDisabled(true);
        const response = await dataSource.shared?.getBranchReport(tableQuery, pagingObj);
        if (response?.data?.data?.length && response?.data?.total) {
          response.data.data.push({
            total: true,
            amount: response?.data?.total?.amount,
            validAmount: response?.data?.total?.validAmount,
            bonusAmount: response?.data?.total?.bonusAmount,
            count: response?.data?.total?.count
          });
        }
        setDocs(response?.data?.data);
        setPaginate({ ...response?.pagingData });
      }
    } catch (e) {
      showToast(e, true);
    } finally {
      setIsLoading(false);
      setIsSearchBtnDisabled(false);
    }
  };

  const handleSelectChange = async (data, queryKey) => {
    if (queryKey === "siteType") {
      if (data?.length) {
        data = data.map((item) => item?.value);
        getCategoriesBySiteType({ _id: data }, setCategory).catch();
      } else {
        const siteTypeArr = siteType.map((item) => item?.value);
        getCategoriesBySiteType({ _id: siteTypeArr }, setCategory).catch();
      }
    }
    if (queryKey === "branch") {
      if (data?.length) {
        data = data.map((item) => item?.value);
        getSiteTypeByBranch({ _id: data }, setSiteType).catch();
      } else {
        const platformArr = platform.map((item) => item?.value);
        getSiteTypeByBranch({ _id: platformArr }, setSiteType).catch();
      }
    }
  };

  const handleExportClick = async (data) => {
    try {
      if (isValid(data)) {
        const response = await dataSource.shared?.exportBranchReport(data);

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
        onClearOtherKey: ["siteType", "category"],
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
        onClearOtherKey: ["category"],
        isMulti: true,
        shouldValidate: true
      },
      {
        label: "category",
        placeholder: "Platform Code",
        type: constFilterType.select,
        options: category,
        queryKey: "category",
        isMulti: true,
        shouldValidate: true
      },
      {
        type: constFilterType.time,
        isClearable: true,
        showRange: true,
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
        limit={10000}
        showPagination={false}
      />
    </BasePage>
  );
};

export default BranchReportPage;
