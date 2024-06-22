import React, { useEffect, useRef, useState } from "react";
import showToast from "../../helpers/showToast.js";
import dataSource from "../../dataSource/dataSource.js";
import gameTableColumns from "./gameColumns.jsx";
import supplierTableColumns from "./supplierColumns.jsx";
import BasePage from "../Others/basePage/basePage.jsx";
import ReactTable8 from "../../components/reactTable8/reactTable8.jsx";
import ReactTableFilter from "../../components/tableFilter/reactTableFilter.jsx";
import { constFilterType } from "../../components/tableFilter/constFilter.js";
import {
  getCategoriesBySiteType,
  getPlatformByRole,
  getSiteTypeByBranch,
  getSupplierByCategory,
  getGame
} from "../../common/common.js";
import constGameStatus from "../../const/constGameStatus.js";

const DEFAULT_FILTER = {
};

const isValid = (query) => {
  return (
      query?.branch?.length
  );
};

const DailyReportPage = (props) => {
  const [gameDocs, setGameDocs] = useState([]);
  const [supplierDocs, setSupplierDocs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [siteType, setSiteType] = useState([]);
  const [category, setCategory] = useState([]);
  const [platform, setPlatform] = useState([]);
  const [supplier, setSupplier] = useState([]);
  const [game, setGame] = useState([]);
  const [status, setStatus] = useState([]);
  const [isSearchBtnDisabled, setIsSearchBtnDisabled] = useState(false);
  const [tableQuery, setTableQuery] = useState(DEFAULT_FILTER);

  useEffect(() => {
    getPlatformByRole({}, setPlatform).catch();
    _generateStatusOption();
  }, []);

  useEffect(() => {
    if (isValid(tableQuery)){
      _fetchData().catch(error => showToast(error, true));
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

  useEffect(() => {
    const supplierArr = supplier.map((item) => item?.value);
    getGame({ provider: supplierArr }, setGame).catch();
  }, [supplier]);

  const _fetchData = async (pagingObj, newSearch) => {
    try {
      setIsLoading(true);
      setIsSearchBtnDisabled(true);

      if (newSearch) {
        pagingObj.page = 1;
      }

      if (!tableQuery?.supplier) {
        tableQuery.supplier = supplier?.length ? supplier.map(item => item?.value) : [];
      }

      if (!tableQuery?.branch) {
        tableQuery.branch = platform?.length ? platform.map(item => item?.value) : [];
      }

      if (supplier?.length) {
        const [gameResponse, supplierResponse] = await Promise.all([
          dataSource.shared?.getDashboardGame(tableQuery),
          dataSource.shared?.getDashboardSupplier(tableQuery)
        ]);

        if (Array.isArray(gameResponse?.data)) {
          console.log("gameResponse gameResponse", gameResponse)
          setGameDocs(gameResponse.data);
        }

        if (Array.isArray(supplierResponse?.data)) {
          setSupplierDocs(supplierResponse.data);
        }
      } else {
        setGameDocs([]);
        setSupplierDocs([]);
      }

    } catch (error) {
      showToast(error, true);
    } finally {
      setIsLoading(false);
      setIsSearchBtnDisabled(false);
    }
  };

  const _handleSelectChange = async (data, queryKey) => {
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
      },
      supplier: () => {
        const supplierList = data?.length ? data.map((item) => item.value) : supplier.map((item) => item?.value);
        return getGame({ provider: supplierList }, setGame).catch();
      },
    };

    if (queryKey in actions) {
      await actions[queryKey]();
    }
  };

  const _generateStatusOption = () => {
    let statusList = [];
    for (let property in constGameStatus) {
      statusList.push({
        label: property,
        value: constGameStatus[property],
      });
    }
    setStatus(statusList);
  };

  const supplierColumns = supplierTableColumns();
  const gameColumns = gameTableColumns();

  const getFilterComponents = () => {
    return [
      {
        label: "branch",
        placeholder: "Branch",
        type: constFilterType.select,
        options: platform,
        queryKey: "branch",
        onChange: _handleSelectChange,
        onClearOtherKey: ["siteType", "category", "supplier", "game"],
        isMulti: true,
        shouldValidate: true,
      },
      {
        label: "siteType",
        placeholder: "Site Type",
        type: constFilterType.select,
        options: siteType,
        queryKey: "siteType",
        onChange: _handleSelectChange,
        onClearOtherKey: ["category", "supplier", "game"],
        isMulti: true,
      },
      {
        label: "category",
        placeholder: "Category",
        type: constFilterType.select,
        options: category,
        queryKey: "category",
        onChange: _handleSelectChange,
        onClearOtherKey: ["supplier",  "game"],
        isMulti: true,
      },
      {
        label: "supplier",
        placeholder: "Supplier",
        type: constFilterType.select,
        options: supplier,
        queryKey: "supplier",
        onChange: _handleSelectChange,
        onClearOtherKey: ["game"],
        isMulti: true,
      },
      {
        label: "game",
        placeholder: "Game",
        type: constFilterType.select,
        options: game,
        queryKey: "game",
        isMulti: true
      },
      {
        label: "status",
        placeholder: "Status",
        type: constFilterType.select,
        options: status,
        queryKey: "status",
        isMulti: true
      }
    ];
  };

  // UseRef
  const reactTableFilterRef = useRef();

  const callSearchFromOutside = async () => {
    if (reactTableFilterRef.current) {
      await reactTableFilterRef.current?.onSearchClick();
    }
  };

  return (
      <BasePage {...props}
                isSearchBtnDisabled={isSearchBtnDisabled}
                callSearchFromOutside={callSearchFromOutside}
      >
        <ReactTableFilter
            data={getFilterComponents()}
            defaultQuery={DEFAULT_FILTER}
            onSearch={setTableQuery}
            ref={reactTableFilterRef}
        />

        <ReactTable8
            columns={supplierColumns}
            data={supplierDocs || []}
            checkbox={false}
            isLoading={isLoading}
            onFetchData={_fetchData}
            limit={10000}
            showPagination={false}
        />

        <ReactTable8
            columns={gameColumns}
            data={gameDocs || []}
            checkbox={false}
            isLoading={isLoading}
            onFetchData={_fetchData}
            limit={10000}
            showPagination={false}
        />
      </BasePage>
  );
};

export default DailyReportPage;
