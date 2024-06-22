import React, { useEffect, useState } from "react";
import B2Modal from "../../../components/b2Modal/b2Modal.jsx";
import ReactTable8 from "../../../components/reactTable8/reactTable8.jsx";
import exportColumns from "./exportColumns.jsx";
import B2Button from "../../../components/b2Button/b2Button.jsx";
import B2ButtonGroup from "../../../components/b2ButtonGroup/b2ButtonGroup.jsx";

const ModalExport = ({ isOpen, onClose, data }) => {
  const [rowSelected, setRowSelected] = useState([]);
  const [state, setState] = useState([]);

  useEffect(() => {
    if (Array.isArray(data)) {
      setState(data);
    }
  }, [data]);

  const handleModalClose = () => {
    setRowSelected([]);
    onClose();
  };

  const handleRowSelect = (selectData) => {
    setRowSelected(selectData);
  };

  const handleDownload = () => {
    if (rowSelected?.length) {
      rowSelected?.map((data) => {
        window.open(data?.link);
      });
    }
  };

  const columns = exportColumns();
  return (
    <B2Modal size={"xl"} title={"EXPORT"} className={"b2form min-vw-90"} isCentre={true} isOpen={isOpen}>
      <div>
        <ReactTable8
          columns={columns}
          data={state}
          checkbox={true}
          showPagination={false}
          onToggleSelection={handleRowSelect}
          limit={10000}
        />

      </div>

      <B2ButtonGroup>
        <B2Button className="btn-standard-1" color="success" onClick={handleDownload}>
          Download
        </B2Button>
        <B2Button className="btn-standard-1" color="secondary" onClick={handleModalClose}>
          Close
        </B2Button>
      </B2ButtonGroup>
    </B2Modal>
  );
};

export default ModalExport;
