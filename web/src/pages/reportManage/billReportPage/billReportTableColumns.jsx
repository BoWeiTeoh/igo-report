import { getReportColumns } from "../../../common/columns.jsx";

const billReportTableColumns = () => {
  const billHeader = [
    { header: "playerId", size: 150 },
    { header: "branch2" },
    { header: "siteType" },
    { header: "category" },
    { header: "channelType", size: 150},
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
    { header: "payout" }
  ];
  return getReportColumns(billHeader);
};

export default billReportTableColumns;
