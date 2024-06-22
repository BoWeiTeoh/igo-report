import React, {useEffect, useRef, useState} from "react";
import config from "../../../config/config.js";
import dataSource from "../../../dataSource/dataSource.js";
import showToast from "../../../helpers/showToast.js";
import BasePage from "../../Others/basePage/basePage.jsx";
import ReactTable8 from "../../../components/reactTable8/reactTable8.jsx";
import amlaTableColumns from "./amlaTableColumn.jsx";
import ReactTableFilter from "../../../components/tableFilter/reactTableFilter.jsx";
import { constFilterType, constBooleanOptions } from "../../../components/tableFilter/constFilter.js";
import ModalExport from "../playerDeposit/modalExport.jsx";

const now = new Date();
let startTime = new Date(now.setHours(0, 0, 0, 0) - 24 * 60 * 60 * 1000);
let endTime = new Date(now.setHours(23, 59, 59, 59) - 24 * 60 * 60 * 1000);

const DEFAULT_FILTER = {
    registrationTime: {
        startTime: startTime,
        endTime: endTime
    }
};


const amlaPage = (props) => {
    const [docs, setDocs] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [paginate, setPaginate] = useState(config.paginate);
    const [tableQuery, setTableQuery] = useState(DEFAULT_FILTER);
    const [isSearchBtnDisabled, setIsSearchBtnDisabled] = useState(false);
    const [modal, setModal] = useState(null);

    useEffect(() => {
        fetchData(paginate, true).then();
    }, [tableQuery]);

    const fetchData = async (pagingObj, newSearch) => {
        try {
            // todo function
        } catch (e) {
            showToast(e, true);
        } finally {
            setIsLoading(false);
            setIsSearchBtnDisabled(false);
        }
    };
    const handleExportClick = async (data) => {
        try {
            // todo
        } catch (e) {
            showToast(e, true);
        }
    };

    const handleModalOpen = (name, data) => {
        setModal({ name, data });
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
                label: "playerName",
                placeholder: "Player Name",
                type: constFilterType.input,
                queryKey: "playerName"
            },
            {
                label: "account",
                placeholder: "Account",
                type: constFilterType.input,
                queryKey: "account"
            },
            {
                type: constFilterType.time,
                // showTimeSelect: false,
                // dateTimeFormat: "MM-dd-yyyy",
                isClearable: true,
                showRange: true,
                queryKey: "registrationTime",
                startTime: {
                    placeholder: "Start Time"
                },
                endTime: {
                    placeholder: "End Time"
                }
            }
        ];
    };

    const columns = amlaTableColumns({handleModalOpen});
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

            {/*<ModalExport*/}
            {/*    isOpen={modal?.name === "export"}*/}
            {/*    data={modal?.data}*/}
            {/*    onClose={handleModalClose}*/}
            {/*    searchCondition={modal?.searchCondition}*/}
            {/*/>*/}
        </BasePage>
    );
};

export default amlaPage;
