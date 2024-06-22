import React, { useEffect, useState } from "react";
import ReactTable8 from "../../../components/reactTable8/reactTable8.jsx";
import configResourceTableColumns from "./configResourceTableColumns.jsx";
import BasePage from "../../Others/basePage/basePage.jsx";
import dataSource from "../../../dataSource/dataSource.js";
import ModalEditConfig from "./modalEditConfig.jsx";
import showToast from "../../../helpers/showToast.js";

const ConfigResourcePage = (props) => {
  const [docs, setDocs] = useState([]);
  const [modal, setModal] = useState(null);

  useEffect(() => {
    getConfigTable().catch(err => {
      showToast(err, true);
    });
  }, []);

  const getConfigTable = async () => {
    try {
      const query = {type: 1}
      const response = await dataSource.shared?.getConfigResource(query);
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

  const columns = configResourceTableColumns({ handleModalOpen });
  return (
    <BasePage {...props}>

      <ReactTable8
        columns={columns}
        data={docs || []}
        checkbox={false}
        showFooter={false}
        showPagination={false}
        limit={100}
      />

      <ModalEditConfig
        isOpen={modal?.name === "edit"}
        data={modal?.data}
        onClose={handleModalClose}
        onDataUpdate={() => getConfigTable()}
      />
    </BasePage>
  );
};

export default ConfigResourcePage;
