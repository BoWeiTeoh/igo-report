import { getPlayerColumns } from "../../../common/columns.jsx";

const playerDepositTableColumns = ({ handleModalOpen, handleModelSwitch }) => {
    const playerInfoHeader = [
        { header: "ID" },
        { header: "name" },
        { header: "amount" },
        { header: "createTime" },
        { header: "status" },
        { header: "proposalId" }
    ];
    return getPlayerColumns(playerInfoHeader, handleModalOpen, handleModelSwitch);
};

export default playerDepositTableColumns;
