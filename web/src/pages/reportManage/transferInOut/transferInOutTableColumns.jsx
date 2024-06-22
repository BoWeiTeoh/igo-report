import { getPlayerColumns } from "../../../common/columns.jsx";

const transferInOutTableColumns = ({ handleModalOpen, handleModelSwitch }) => {
    const playerInfoHeader = [
        { header: "ID" },
        { header: "playerName" },
        { header: "amount" },
        { header: "providerId" },
        { header: "createTime" },
        { header: "transferInOut" },
        { header: "transferInOutStatus" }
    ];
    return getPlayerColumns(playerInfoHeader, handleModalOpen, handleModelSwitch);
};

export default transferInOutTableColumns;