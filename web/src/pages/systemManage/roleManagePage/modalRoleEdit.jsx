import React, {useEffect, useState} from "react";
import showToast from "../../../helpers/showToast.js";
import dataSource from "../../../dataSource/dataSource.js";
import B2Modal from "../../../components/b2Modal/b2Modal.jsx";
import B2Input from "../../../components/form/b2Input.jsx";
import B2Select from "../../../components/b2Select/b2Select.jsx";
import {constFilterType} from "../../../components/tableFilter/constFilter.js";
import util_ui from "../../../helpers/util_ui.js";

const DEFAULT_STATE = {
    remark: "", roleName: ""
};

const ModalRoleEdit = ({isOpen, onClose, onDataUpdate, data}) => {
    const [state, setState] = useState(data || DEFAULT_STATE);
    const [department, setDepartment] = useState();

    useEffect(() => {
        const getDepartmentList = async () => {
            try {
                const response = await dataSource.shared?.getDepartmentList();
                let departmentOption = util_ui.generateSelectOptions(response?.data, "_id", "name");
                setDepartment(departmentOption);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        getDepartmentList().catch(err => {
            showToast(err, true);
        });
    }, []);

    let roleName = data?.roleName || "";

    useEffect(() => {

        if (data) {
            setState((d) => ({
                ...d, ...data
            }));
        }
    }, [data]);

    useEffect(() => {
        roleName = state?.roleName;
    }, []);

    const handleInputChange = (value, name) => {
        setState((d) => ({
            ...d, [name]: value
        }));
    };
    const handleModalClose = () => {
        setState(DEFAULT_STATE);
        onClose();
    };

    const handleSelectChange = (selectData, queryKey) => {
        let value = selectData?.value;
        if (Array.isArray(selectData)) {
            value = selectData;
        }
        setState((d) => {
            return {
                ...d,
                [queryKey]: value
            };
        });
    };

    const handleSubmit = async () => {
        try {
            let response;
            response = await dataSource.shared?.updateRole(state);
            showToast(response);
            setState(DEFAULT_STATE);
            onDataUpdate();
            onClose();
        } catch (e) {
            showToast(e, true);
        }
    };

    return (<B2Modal title={"Edit Role : " + roleName} className={"b2form"} isCentre={true} isOpen={isOpen}
                     onConfirm={handleSubmit} onClose={handleModalClose}>
        <div className="modal-form-content">
            <div className="modal-form-content-1">
                <div>
                    <label>Role Name</label>
                    <B2Input onChange={handleInputChange} name={"roleName"} type={"string"} value={state?.roleName}
                             placeholder={" "} maxlength={15}/>
                </div>
                <div>
                    <label>Department</label>
                    <B2Select
                        options={department}
                        queryKey={"department"}
                        type={constFilterType.select}
                        placeholder={" "}
                        className={"creatable-select"}
                        value={state?.department}
                        onChange={(e) => handleSelectChange(e, "department")}
                    />
                </div>
                <div>
                    <label>Remark</label>
                    <B2Input onChange={handleInputChange} name={"remark"} type={"string"} value={state?.remark}
                             placeholder={" "}/>
                </div>
            </div>
        </div>

        {/* <div>
        <label>Role Name</label>
        <B2Row>
          <B2Col md={7}>
            <B2Input onChange={handleInputChange} name={"roleName"} type={"string"}
                     value={state?.roleName} placeholder={" "}
            />
          </B2Col>
        </B2Row>
        <label>Remark</label>
        <B2Row>
          <B2Col md={7}>
            <B2Input onChange={handleInputChange} name={"remark"} type={"string"}
                     value={state?.remark} placeholder={" "}
            />
          </B2Col>
        </B2Row>
      </div> */}
    </B2Modal>);
};

export default ModalRoleEdit;
