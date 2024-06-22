import { getOtherColumns } from "../../../common/columns.jsx";

const exportColumns = () => {
  const exportHeader = [
    { header: "link", size: 800 },
    { header: "time", size: 150 },
    { header: "aws", size: 150 },
    { header: "status", size: 150 }
  ];
  return getOtherColumns(exportHeader);
};

export default exportColumns;