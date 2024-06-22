import { getPlayerColumns } from "../../../common/columns.jsx";

const playerInfoTableColumns = ({ handleModalOpen }) => {
  const playerInfoHeader = [
    { header: "ID" },
    { header: "name" },
    { header: "validCredit" },
    { header: "registrationTime" },
    { header: "playerInformation" },
    { header: "picture" },
    { header: "isCompleteInfo" },
    { header: "playerStatus" }
  ];
  return getPlayerColumns(playerInfoHeader, handleModalOpen);
};

export default playerInfoTableColumns;
