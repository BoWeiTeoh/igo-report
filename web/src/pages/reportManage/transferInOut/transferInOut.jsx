import React, { useEffect, useRef, useState } from "react";
import config from "../../../config/config.js";
import dataSource from "../../../dataSource/dataSource.js";
import showToast from "../../../helpers/showToast.js";
import BasePage from "../../Others/basePage/basePage.jsx";
import ReactTable8 from "../../../components/reactTable8/reactTable8.jsx";
import transferInOutTableColumns from "./transferInOutTableColumns.jsx";
import ReactTableFilter from "../../../components/tableFilter/reactTableFilter.jsx";
import {
    constFilterType,
    constPlayerCreditTransferInOut,
    constPlayerCreditTransferStatus
} from "../../../components/tableFilter/constFilter.js";
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

const TransferInOutPage = (props) => {
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

    const fetchData = async (pagingObj, newSearch) => {
        try {
            pagingObj = pagingObj || paginate;
            setIsLoading(true);
            setIsSearchBtnDisabled(true);
            if (newSearch) {
                pagingObj.page = 1;
            }
            const response = await dataSource.shared?.getTransferInOutTable(tableQuery, pagingObj);
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

    const fetchTotal = async () => {
        const paginateObj = paginate || {};
        const response = await dataSource.shared?.getTotalCount(tableQuery, paginateObj, "/transfer/count");
        const totalPages = Math.ceil(response?.data / paginateObj?.limit);
        setPaginate({ ...paginateObj, totalDocs: response?.data, totalPages: totalPages });
        setTotalCount(response?.data);
    };

    const handleExportClick = async (data) => {
        try {
            const response = await dataSource.shared?.exportTransferInOutReport(data);
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
            label: "playerName",
            placeholder: "Name",
            type: constFilterType.input,
            queryKey: "playerName"
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
            label: "providerId",
            placeholder: "Provider Id",
            type: constFilterType.input,
            queryKey: "providerId"
          },
          {
            type: constFilterType.time,
            isClearable: true,
            showRange: true,
            queryKey: "createTime",
            startTime: {
              placeholder: "Start Time"
            },
            endTime: {
              placeholder: "End Time"
            }
          },
          {
            label: "transferInOut",
            placeholder: "Transfer In/Out",
            type: constFilterType.select,
            options: constPlayerCreditTransferInOut,
            isMulti: true,
            queryKey: "type",
          },
            {
                label: "status",
                placeholder: "Status",
                type: constFilterType.select,
                options: constPlayerCreditTransferStatus,
                queryKey: "status",
            }
        ];
    };

    const columns = transferInOutTableColumns({});
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
        </BasePage>
    );
};

export default TransferInOutPage;