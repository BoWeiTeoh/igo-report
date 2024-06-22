import { getReportColumns } from "../../../common/columns.jsx";

const summaryReportTableColumns = () => {
  const summaryHeader = [
    { header: "no" },
    { header: "siteType" },
    { header: "category" },
    { header: "bet" },
    { header: "turnover" },
    { header: "payout" },
    { header: "winLose" },
    { header: "count" }
  ];
  return getReportColumns(summaryHeader);
};

export default summaryReportTableColumns;
