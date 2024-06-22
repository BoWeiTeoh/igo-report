import { getColumns } from "../../../common/columns.jsx";

const siteTypeTableColumns = ({ handleModalOpen }) => {
  const roleManageHeader = [
    { header: "siteType3" },
    { header: "category3" },
    { header: "operate", actions: ["edit"] }
  ];
  return getColumns(roleManageHeader, handleModalOpen);
};

export default siteTypeTableColumns;
