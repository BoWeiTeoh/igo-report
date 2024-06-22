import { getConfigColumns} from "../../../common/columns.jsx";

const configTimeLimitTableColumns = ({ handleModalOpen }) => {
  const branchHeader = [
    { header: "setting" },
    { header: "value" },
    { header: "operate", actions: ["edit"] }
  ];
  return getConfigColumns(branchHeader, handleModalOpen);
};

export default configTimeLimitTableColumns;