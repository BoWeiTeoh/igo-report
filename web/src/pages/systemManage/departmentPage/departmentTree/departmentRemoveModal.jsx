import React, {useEffect, useState} from "react";
import dataSource from "../../../../dataSource/dataSource.js";
import showToast from "../../../../helpers/showToast.js";
import B2Modal from "../../../../components/b2Modal/b2Modal.jsx";

const defaultState = {
    label: "",
    name: "",
    code: "",
    parent: "",
    timeZone: null
};

const DepartmentRemoveModal = ({isOpen, onModalClose, data, onDataUpdate}) => {
    const [state, setState] = useState(defaultState);

    useEffect(() => {
        if (data) {
            setState((d) => ({
                ...d,
                ...data
            }));
        }
    }, [data]);

    const handleConfirmClick = async () => {
        try {
            await dataSource.shared?.removeDepartment(state);
            setState(defaultState);
            onDataUpdate && onDataUpdate();
            showToast("Success");
            onModalClose();
        } catch (e) {
            showToast(e, 1);
        }
    };

    const handleModalClose = () => {
        setState(defaultState);
        onModalClose();
    };

    return (
        <B2Modal
            isOpen={isOpen}
            onConfirm={handleConfirmClick}
            onClose={handleModalClose}
            className="department-action-form"
            size={"lg"}
        >
            <label>{"Confirm want to remove Department : "}</label>
            <label className={"text-danger fs-5"}>&nbsp;&nbsp;{state?.name}</label>
        </B2Modal>
    );
};

export default DepartmentRemoveModal;
