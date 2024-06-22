import { getOtherColumns } from "../../../common/columns.jsx";

const exportColumns = () => {
  const exportHeader = [
    { header: "link", size: 800 }
  ];
  return getOtherColumns(exportHeader);
};

export default exportColumns;