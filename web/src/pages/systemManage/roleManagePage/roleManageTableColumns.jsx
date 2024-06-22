import { getColumns } from "../../../common/columns.jsx";

const roleManageTableColumns = ({ handleModalOpen, handleModelSwitch }) => {
  const roleManageHeader = [
    { header: "roleID" },
    { header: "role2" },
    { header: "creator" },
    { header: "createdAt" },
    { header: "updater" },
    { header: "updatedAt" },
    { header: "remark" },
    { header: "state" },
    { header: "operate", size: 350, actions: ["branch", "authority", "edit", "delete"] }
  ];
  return getColumns(roleManageHeader, handleModalOpen, handleModelSwitch);
};

export default roleManageTableColumns;
