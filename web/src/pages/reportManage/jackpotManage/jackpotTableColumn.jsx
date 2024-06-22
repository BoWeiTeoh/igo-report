import { getJackpotColumns } from "../../../common/columns.jsx";

const jackpotTableColumns = ({ handleModalOpen, handleModelSwitch }) => {
    const jackpotHeader = [
        { header: "gameCode" },
        { header: "platform" },
        { header: "totalBetAmount" },
        { header: "jackpotIncrement" },
        { header: "totalJackpotAmount" },
        { header: "grandJackpotIncrement" },
        { header: "grandJackpotAmount" },
        { header: "majorJackpotIncrement" },
        { header: "majorJackpotAmount" },
        { header: "minorJackpotIncrement" },
        { header: "minorJackpotAmount" },
        { header: "type" },
        { header: "payout" },
        { header: "jackpotPayout" },
        { header: "seedAmount" },
    ];
    return getJackpotColumns(jackpotHeader, handleModalOpen, handleModelSwitch);
};

export default jackpotTableColumns;
