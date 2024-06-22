import { getConfigColumns} from "../../../common/columns.jsx";

const configExportTableColumns = ({ handleModalOpen }) => {
  const branchHeader = [
    { header: "setting" },
    { header: "value" },
    { header: "operate", actions: ["edit"] }
  ];
  return getConfigColumns(branchHeader, handleModalOpen);
};

export default configExportTableColumns;