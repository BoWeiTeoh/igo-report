import { getColumns } from "../../../common/columns.jsx";

const ipConfigTableColumns = ({ handleModalOpen, handleModelSwitch }) => {
  const summaryHeader = [
    { header: "ipAddress", size: 150 },
    { header: "detail", size: 250 },
    { header: "creator" },
    { header: "updater" },
    { header: "operate", size: 250, actions: ["edit", "delete"] }
  ];
  return getColumns(summaryHeader, handleModalOpen, handleModelSwitch);
};

export default ipConfigTableColumns;
