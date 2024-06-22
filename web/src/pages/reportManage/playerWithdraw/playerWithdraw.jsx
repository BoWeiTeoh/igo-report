import React, { useEffect, useRef, useState } from "react";
import config from "../../../config/config.js";
import dataSource from "../../../dataSource/dataSource.js";
import showToast from "../../../helpers/showToast.js";
import BasePage from "../../Others/basePage/basePage.jsx";
import ReactTable8 from "../../../components/reactTable8/reactTable8.jsx";
import ReactTableFilter from "../../../components/tableFilter/reactTableFilter.jsx";
import playerWithdrawTableColumns from "./playerWithdrawTableColumns.jsx";
import { constFilterType, constStatusOptions } from "../../../components/tableFilter/constFilter.js";
import ModalExport from "../playerDeposit/modalExport.jsx";

const now = new Date();
let startTime = new Date(now.setHours(0, 0, 0, 0) - 24 * 60 * 60 * 1000);
let endTime = new Date(now.setHours(23, 59, 59, 59) - 24 * 60 * 60 * 1000);

const DEFAULT_FILTER = {
    createTime: {
        startTime: startTime,
        endTime: endTime
    }
};

const PlayerWithdrawPage = (props) => {
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
        const paginateObj = paginate || {};
        const response = await dataSource.shared?.getTotalCount(tableQuery, paginateObj, "/withdraw/count");
        const totalPages = Math.ceil(response?.data / paginateObj?.limit);
        setPaginate({ ...paginateObj, totalDocs: response?.data, totalPages: totalPages });
        setTotalCount(response?.data);
    };

    const fetchData = async (pagingObj, newSearch) => {
        try {
            if (tableQuery?.createTime?.endTime < tableQuery?.createTime?.startTime) {
                return showToast("Invalid Time", true);
            }
            pagingObj = pagingObj || paginate;
            setIsLoading(true);
            setIsSearchBtnDisabled(true);
            if (newSearch) {
                pagingObj.page = 1;
            }
            const response = await dataSource.shared?.getPlayerWithdrawTable(tableQuery, pagingObj);
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
            const response = await dataSource.shared?.exportPlayerWithdrawReport(data);
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

    // UseRef
    const reactTableFilterRef = useRef();

    const callExportFromOutside = async () => {
        if (reactTableFilterRef.current) {
            await reactTableFilterRef.current?.onExportClick();
        }
    };

    const callSearchFromOutside = async () => {
        if (reactTableFilterRef.current) {
        await reactTableFilterRef.current.onSearchClick();
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
                placeholder: "Name",
                type: constFilterType.input,
                queryKey: "name"
            },
            {
                label: "min",
                placeholder: "Amount: Min",
                type: constFilterType.input,
                queryKey: "min"
            },
            {
                label: "max",
                placeholder: "Amount: Max",
                type: constFilterType.input,
                queryKey: "max"
            },
            {
                type: constFilterType.time,
                isClearable: true,
                showRange: true,
                queryKey: "createTime",
                startTime: {
                    placeholder: "Withdraw Time Range"
                },
                endTime: {
                    placeholder: "Withdraw Time Range"
                }
            },
            {
                label: "status",
                placeholder: "Status",
                type: constFilterType.select,
                options: constStatusOptions,
                queryKey: "status",
            },
            {
                label: "proposalId",
                placeholder: "Proposal ID",
                type: constFilterType.input,
                queryKey: "proposalId"
            },
        ];
    };
  
    const columns = playerWithdrawTableColumns({});

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

export default PlayerWithdrawPage;
