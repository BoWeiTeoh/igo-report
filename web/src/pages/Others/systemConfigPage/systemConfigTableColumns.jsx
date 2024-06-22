import { getColumns } from "../../../common/columns.jsx";

const systemConfigTableColumns = ({ handleModalOpen, handleModelSwitch }) => {
  const summaryHeader = [
    { header: "configType", size: 150 },
    { header: "config" , size: 150},
    { header: "detail", size: 250 },
    { header: "creator" },
    { header: "updater" },
    { header: "operate", size: 250, actions: ["edit", "delete"] }
  ];
  return getColumns(summaryHeader, handleModalOpen, handleModelSwitch);
};

export default systemConfigTableColumns;