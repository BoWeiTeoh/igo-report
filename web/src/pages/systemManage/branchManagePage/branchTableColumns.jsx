import { getColumns } from "../../../common/columns.jsx";

const branchTableColumns = ({ handleModalOpen }) => {
  const branchHeader = [
    { header: "branch3" },
    { header: "siteType2" },
    { header: "operate", actions: ["edit"] }
  ];
  return getColumns(branchHeader, handleModalOpen);
};

export default branchTableColumns;