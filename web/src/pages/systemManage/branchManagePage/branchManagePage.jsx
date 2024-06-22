import React, { useEffect, useState } from "react";
import ReactTable8 from "../../../components/reactTable8/reactTable8.jsx";
import branchTableColumns from "./branchTableColumns.jsx";
import BasePage from "../../Others/basePage/basePage.jsx";
import dataSource from "../../../dataSource/dataSource.js";
import ModalEditBranch from "./modalEditBranch.jsx";
import showToast from "../../../helpers/showToast.js";

const BranchManagePage = (props) => {
  const [docs, setDocs] = useState([]);
  const [modal, setModal] = useState(null);

  useEffect(() => {
    getBranch().catch(err => {
      showToast(err, true);
    });
  }, []);

  const getBranch = async () => {
    try {
      const response = await dataSource.shared?.getBranchTable({});
      setDocs(response?.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleModalOpen = (name, data) => {
    setModal({ name, data });
  };

  const handleModalClose = () => {
    setModal(null);
  };

  const columns = branchTableColumns({ handleModalOpen });
  return (
    <BasePage {...props}>

      <ReactTable8
        columns={columns}
        data={docs || []}
        checkbox={false}
        showFooter={false}
        showPagination={false}
      />

      <ModalEditBranch
        isOpen={modal?.name === "edit"}
        data={modal?.data}
        onClose={handleModalClose}
        onDataUpdate={() => getBranch()}
      />
    </BasePage>
  );
};

export default BranchManagePage;
