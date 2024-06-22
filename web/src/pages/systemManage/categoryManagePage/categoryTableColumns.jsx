import { getColumns } from "../../../common/columns.jsx";

const categoryTableColumns = ({ handleModalOpen }) => {
  const categoryHeader = [
    { header: "category2" },
    { header: "supplier3" },
    { header: "operate", actions: ["edit"] }
  ];
  return getColumns(categoryHeader, handleModalOpen);
};

export default categoryTableColumns;
