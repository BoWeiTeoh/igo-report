import { getPlayerColumns } from "../../../common/columns.jsx";

const playerWithdrawTableColumns = ({ handleModalOpen, handleModelSwitch }) => {
    const playerWithdrawHeader = [
        { header: "ID" },
        { header: "name" },
        { header: "amount" },
        { header: "createTime" },
        { header: "status" },
        { header: "proposalId" }
    ];
    return getPlayerColumns(playerWithdrawHeader, handleModalOpen, handleModelSwitch);
};

export default playerWithdrawTableColumns;
