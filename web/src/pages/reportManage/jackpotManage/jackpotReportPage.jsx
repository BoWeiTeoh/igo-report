import React, { useState, useEffect, useCallback, useRef } from 'react';
import showToast from "../../../helpers/showToast.js";
import dataSource from "../../../dataSource/dataSource.js";
import jackpotTableColumns from "./jackpotTableColumn.jsx";
import BasePage from "../../Others/basePage/basePage.jsx";
import ReactTable8 from "../../../components/reactTable8/reactTable8.jsx";
import ReactTableFilter from "../../../components/tableFilter/reactTableFilter.jsx";
import config from "../../../config/config.js";
import {constFilterType} from "../../../components/tableFilter/constFilter.js";
import {
    getCategoriesBySiteType,
    getPlatformByRole,
    getSiteTypeByBranch,
    getSupplierByCategory
} from "../../../common/common.js";
import {constChannelType} from "../../../const/constChannelType.js";
import ModalExport from "../playerDeposit/modalExport.jsx";

const now = new Date();
const startTime = new Date(now.setHours(0, 0, 0, 0) - 24 * 60 * 60 * 1000);
const endTime = new Date(now.setHours(0, 0, 0, 0));

const DEFAULT_FILTER = {
    summaryTime: {
        startTime: startTime,
        endTime: endTime
    }
};

const isValid = (query) => {
    return (
        query?.provider?.length &&
        query?.platform?.length
    );
};

const JackpotReportPage = (props) => {
    const [docs, setDocs] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [paginate, setPaginate] = useState(config.paginate);
    const [tableQuery, setTableQuery] = useState(DEFAULT_FILTER);
    const [siteType, setSiteType] = useState([]);
    const [category, setCategory] = useState([]);
    const [platform, setPlatform] = useState([]);
    const [supplier, setSupplier] = useState([]);
    const [modal, setModal] = useState(null);

    useEffect(() => {
        getPlatformByRole({}, setPlatform).catch();
    }, []);

    useEffect(() => {
        if (isValid(tableQuery)) {
            fetchData(paginate, true).catch(error => showToast(error, true));
        } else {
            setDocs([]);
        }
    }, [tableQuery]);

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

    const fetchData = async (pagingObj, newSearch) => {
        try {
            pagingObj = pagingObj || paginate;

            if (newSearch) {
                pagingObj.page = 1;
            }
            setIsLoading(true);
            const response = await dataSource.shared?.getJackpotReportTable(tableQuery, pagingObj);
            setDocs(response?.data);
            setPaginate({ ...response?.pagingData });
        } catch (e) {
            showToast(e, true);
        } finally {
            setIsLoading(false);
        }
    };

    const handleExportClick = async (data) => {
        try {
            if (isValid(tableQuery)){
                if (data) {
                    const response = await dataSource.shared?.exportJackpotReport(data);
                    handleModalOpen("export", response?.data);
                }
            }
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

    // UseRef
    const reactTableFilterRef = useRef();

    const callSearchFromOutside = async () => {
        if (reactTableFilterRef.current) {
            await reactTableFilterRef.current?.onSearchClick();
        }
    };

    const callExportFromOutside = async () => {
        if (reactTableFilterRef.current) {
            await reactTableFilterRef.current.onExportClick();
        }
    };

    const getFilterComponents = () => {
        return [
            {
                label: "gameCode",
                placeholder: "Game Code",
                type: constFilterType.input,
                queryKey: "gameCode",
            },
            {
                label: "platform",
                placeholder: "Outlet ID",
                type: constFilterType.select,
                options: platform,
                queryKey: "platform",
                onClearOtherKey: ["provider"],
                isMulti: true,
                shouldValidate: true
            },
            {
                label: "supplier",
                placeholder: "Game Brand",
                type: constFilterType.select,
                options: supplier,
                queryKey: "provider",
                isMulti: true,
                shouldValidate: true
            },
            {
                type: constFilterType.time,
                showTimeSelect: false,
                dateTimeFormat: "yyyy-MM-dd",
                isClearable: true,
                queryKey: "summaryTime",
                startTime: {
                    placeholder: "create from",
                },
                endTime: {
                    placeholder: "create to",
                },
                shouldValidate: true
            },
        ];
    };

    const columns = jackpotTableColumns({handleModalOpen});

    return (
        <BasePage {...props} callSearchFromOutside={callSearchFromOutside} callExportFromOutside={callExportFromOutside} >
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
                page={paginate?.page}
                isJackpotPage={true}
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

export default JackpotReportPage;
