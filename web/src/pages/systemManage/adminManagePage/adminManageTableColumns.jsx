import { getColumns } from "../../../common/columns.jsx";

const adminManageTableColumns = ({ handleModalOpen, handleModelSwitch }) => {
  const adminManageHeader = [
    { header: "userID" },
    { header: "username" },
    { header: "role" },
    { header: "creator" },
    { header: "createdAt" },
    { header: "updater" },
    { header: "updatedAt" },
    { header: "remark" },
    { header: "state" },
    { header: "operate", size: 250, actions: ["reset", "edit", "delete"] }
  ];
  return getColumns(adminManageHeader, handleModalOpen, handleModelSwitch);
};

export default adminManageTableColumns;
