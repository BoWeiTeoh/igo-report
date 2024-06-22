import React, { useEffect, useState } from "react";
import B2Modal from "../../../components/b2Modal/b2Modal.jsx";
import ReactTable8 from "../../../components/reactTable8/reactTable8.jsx";
import exportColumns from "./exportColumns.jsx";
import B2Button from "../../../components/b2Button/b2Button.jsx";
import B2ButtonGroup from "../../../components/b2ButtonGroup/b2ButtonGroup.jsx";
import dataSource from "../../../dataSource/dataSource.js";
import showToast from "../../../helpers/showToast.js";

const ModalExport = ({ isOpen, onClose, onDataUpdate, data, searchCondition }) => {
  const [rowSelected, setRowSelected] = useState([]);
  const [state, setState] = useState(data || []);
  const [generateStatus, setGenerateStatus] = useState(false);

  useEffect(() => {
    if (data) {
      setState(data);
      getSystemStatus().catch();
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
        window.open(data?.bucketUrl + data?.link);
      });
    }
  };

  const handleDelete = async () => {
    try {
      await dataSource.shared?.deleteExportFile({ rowSelected });
      handleModalClose();
    } catch (err) {
      showToast(err,true)
    }
  };

  const handleRegenerate = async () => {
    try {
      const filter = {
        report: "Balance Record"
      }
      await dataSource.shared?.generateSpecifyBillFile({ rowSelected, filter });
      await getSystemStatus().catch();
    } catch (err) {
      showToast(err, true);
    }
  };

  const handleRefresh = async () => {
    const response = await dataSource.shared?.exportBillReport(searchCondition);
    await getSystemStatus().catch();
    setState(response?.data);
  };

  const getSystemStatus = async () => {
    try {
      const response = await dataSource.shared?.getSystemStatus({});
      if (response?.functionAvailable) {
        setGenerateStatus(true);
      } else {
        setGenerateStatus(false);
      }
    } catch (e) {
      showToast(e, true);
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
        <B2Button className="btn-standard-1" color="danger" onClick={handleDelete}>
          Delete
        </B2Button>
        <B2Button className="btn-standard-1" color="warning" onClick={handleRegenerate} disabled={!generateStatus}>
          Regenerate
        </B2Button>
        <B2Button className="btn-standard-1" color="dark" onClick={handleRefresh}>
          Refresh
        </B2Button>
        <B2Button className="btn-standard-1" color="secondary" onClick={handleModalClose}>
          Close
        </B2Button>
      </B2ButtonGroup>
    </B2Modal>
  );
};

export default ModalExport;
