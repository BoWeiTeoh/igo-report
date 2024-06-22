import { getAmlaColumns } from "../../../common/columns.jsx";

const amlaTableColumns = ({ handleModalOpen }) => {
    const amlaHeader = [
        { header: "date" },
        { header: "time" },
        { header: "account" },
        { header: "playerName" },
        { header: "transactionDetails" },
        { header: "proposal" },
        { header: "amount" },
        { header: "source" },
        { header: "cashier" },
        { header: "supervisor" },
    ];
    return getAmlaColumns(amlaHeader, handleModalOpen);
};

export default amlaTableColumns;
