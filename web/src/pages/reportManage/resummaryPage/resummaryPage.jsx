import React, { useEffect, useRef, useState } from "react";
import showToast from "../../../helpers/showToast.js";
import dataSource from "../../../dataSource/dataSource.js";
import BasePage from "../../Others/basePage/basePage.jsx";
import ReactTableFilter from "../../../components/tableFilter/reactTableFilter.jsx";
import { constFilterType } from "../../../components/tableFilter/constFilter.js";
import ModalAdminSummary from "./modalSummary.jsx";
import {getDateTzISOString} from "../../../helpers/util_datetime.js";

const DEFAULT_FILTER = {};

const ReSummaryPage = (props) => {
  const [tableQuery, setTableQuery] = useState(DEFAULT_FILTER);
  const [modal, setModal] = useState(null);
  const [platform, setPlatform] = useState([]);
  const [supplier, setSupplier] = useState([]);
  const [siteType, setSiteType] = useState([]);
  const [category, setCategory] = useState([]);
  const [summaryList, setSummaryList] = useState([]);

  useEffect(() => {
    if (
      tableQuery?.branch &&
      tableQuery?.supplier &&
      tableQuery?.createTime?.startTime &&
      tableQuery?.createTime?.endTime
    ) {
      fetchData().then();
    }
  }, [tableQuery]);

  useEffect(() => {
    getPlatform().catch();
    getSummaryListCount().catch();
  }, []);

  useEffect(() => {
    const platformArr = platform.map((item) => item?.value);
    getSiteTypeByBranch({ _id: platformArr }).catch();
  }, [platform]);

  useEffect(() => {
    const siteTypeArr = siteType.map((item) => item?.value);
    getCategoriesBySiteType({ _id: siteTypeArr }).catch();
  }, [siteType]);

  useEffect(() => {
    const categoryArr = category.map((item) => item?.value);
    getSupplierByCategory({ _id: categoryArr }).catch();
  }, [category]);

  const getSiteTypeByBranch = async (query = {}) => {
    const response = await dataSource.shared?.getSiteTypeByBranch(query);
    let siteTypeList = [];
    for (let i = 0; i < response?.data?.length; i++) {
      siteTypeList.push({
        label: response?.data[i]?.name,
        value: response?.data[i]?._id
      });
    }
    await setSiteType(siteTypeList);
  };

  const getPlatform = async (query = {}) => {
    const response = await dataSource.shared?.getPlatformByRole(query);
    let platformList = [];
    for (let i = 0; i < response?.data?.length; i++) {
      platformList.push({
        label: response?.data[i]?.name,
        value: response?.data[i]?._id
      });
    }

    setPlatform(platformList);
  };

  const getSummaryListCount = async (query = {}) => {
    const response = await dataSource.shared?.getSummaryListCount(query);

    setSummaryList(response?.data);
  };

  const getSupplierByCategory = async (query = {}) => {
    const response = await dataSource.shared?.getSupplierByCategory(query);
    let supplierList = [];
    for (let i = 0; i < response?.data?.length; i++) {
      supplierList.push({
        label: response?.data[i]?.providerId + ". " + response?.data[i]?.name,
        value: response?.data[i]?._id
      });
    }
    setSupplier(supplierList);
  };

  const getCategoriesBySiteType = async (query = {}) => {
    const response = await dataSource.shared?.getCategoriesBySiteType(query);
    let categoryList = [];
    for (let i = 0; i < response?.data?.length; i++) {
      categoryList.push({
        label: response?.data[i]?.name,
        value: response?.data[i]?._id
      });
    }

    setCategory(categoryList);
  };

  const handleModalOpen = (name, data) => {
    setModal({ name, data });
  };

  const handleModalClose = () => {
    setModal(null);
  };

  const handleSelectChange = async (data, queryKey) => {
    if (queryKey === "branch") {
      if (data?.value) {
        getSiteTypeByBranch({ _id: [data?.value] }).catch();
      } else {
        const platformArr = platform.map((item) => item?.value);
        getSiteTypeByBranch({ _id: platformArr }).catch();
      }
    }
  };

  const fetchData = async () => {
    try {
      if (tableQuery?.createTime?.endTime <= tableQuery?.createTime?.startTime) {
        return showToast("Invalid Time", true);
      }
      handleModalOpen("summary", tableQuery);
    } catch (e) {
      showToast(e, true);
    }
  };

  const getFilterComponents = () => {
    return [
      {
        label: "branch",
        placeholder: "Outlet ID",
        type: constFilterType.select,
        options: platform,
        onChange: handleSelectChange,
        queryKey: "branch",
        shouldValidate: true
      },
      {
        label: "supplier",
        placeholder: "Game Brand",
        type: constFilterType.select,
        options: supplier,
        queryKey: "supplier",
        shouldValidate: true
      },
      {
        // 下注时间
        type: constFilterType.time,
        isClearable: true,
        showRange: true,
        queryKey: "createTime",
        shouldValidate: true,
        startTime: {
          placeholder: "Start Time"
        },
        endTime: {
          placeholder: "End Time"
        }
      }
    ];
  };

  // UseRef
  const reactTableFilterRef = useRef();

  const callSummaryFromOutside = async () => {
    if (reactTableFilterRef.current) {
      await reactTableFilterRef.current.onSummaryClick();
    }
  };

  return (
    <BasePage {...props} callSummaryFromOutside={callSummaryFromOutside}>
      <div>
        <label className={"fs-6"}>{"Pending Summary List"}</label>
        <label className={"fs-6"}>&nbsp;&nbsp;{":"}</label>
        <label className={"text-success fs-6"}>&nbsp;&nbsp;{summaryList}</label>
      </div>

      <ReactTableFilter
        data={getFilterComponents()}
        defaultQuery={DEFAULT_FILTER}
        onSummary={setTableQuery}
        ref={reactTableFilterRef}
      />

      <ModalAdminSummary
        isOpen={modal?.name === "summary"}
        data={modal?.data}
        onClose={handleModalClose}
        onDataUpdate={fetchData}
      />
    </BasePage>
  );
};

export default ReSummaryPage;
