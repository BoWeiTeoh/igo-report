import "./departmentTree.scss";
import React, {useState} from "react";
import DepartmentCreateModal from "./departmentCreateModal.jsx";
import DepartmentRemoveModal from "./departmentRemoveModal.jsx"
import DepartmentTreeList from "./departmentTreeList.jsx";

const DepartmentTree = ({departmentTree, onDepartmentClick, departmentSelect, fetchDepartmentTree}) => {
    const [modal, setModal] = useState();

    const handleModalOpen = (name, data) => {
        setModal({name, data});
    };

    const handleModalClose = () => {
        setModal(null);
    };

    return (<>
            <div className="department-tree tree greybox">
                <DepartmentTreeList
                    departmentTree={departmentTree}
                    departmentSelect={departmentSelect}
                    onModalOpen={handleModalOpen}
                    onDepartmentClick={onDepartmentClick}
                />
            </div>

            <DepartmentCreateModal
                isOpen={modal?.name === "createDepartment"}
                parentDepartment={modal?.data}
                modalTitle={"modalTitle"}
                onDataUpdate={fetchDepartmentTree}
                onModalClose={handleModalClose}
            />

            <DepartmentRemoveModal
                isOpen={modal?.name === "removeDepartment"}
                parentDepartment={modal?.data}
                modalTitle={"modalTitle"}
                onDataUpdate={fetchDepartmentTree}
                data={modal?.data}
                onModalClose={handleModalClose}
            />
        </>);
};

export default DepartmentTree;
