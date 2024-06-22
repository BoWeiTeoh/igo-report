import { getConfigColumns} from "../../../common/columns.jsx";

const configResourceTableColumns = ({ handleModalOpen }) => {
  const branchHeader = [
    { header: "setting" },
    { header: "value" },
    { header: "operate", actions: ["edit"] }
  ];
  return getConfigColumns(branchHeader, handleModalOpen);
};

export default configResourceTableColumns;