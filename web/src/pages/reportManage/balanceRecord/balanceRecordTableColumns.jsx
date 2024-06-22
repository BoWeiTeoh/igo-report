import { getReportColumns } from "../../../common/columns.jsx";

const balanceRecordTableColumns = () => {
  const balanceHeader = [
    { header: "playerId", size: 150 },
    { header: "branch2" },
    { header: "siteType" },
    { header: "category" },
    { header: "channelType", size: 150 },
    { header: "supplier2" },
    { header: "account" },
    { header: "billNo", size: 150 },
    { header: "gameCode" },
    { header: "billTime", size: 150 },
    { header: "payoutTime", size: 150 },
    { header: "game" },
    { header: "betType" },
    { header: "bet" },
    { header: "turnover" },
    { header: "winLose" },
    { header: "payout" },
    { header: "beforeBet" },
    { header: "transactionType" },
    { header: "expense" },
    { header: "income" },
    { header: "runningBalance" },
  ];
  return getReportColumns(balanceHeader);
};

export default balanceRecordTableColumns;
