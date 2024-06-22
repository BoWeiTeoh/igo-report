import { getReportColumns } from "../../../common/columns.jsx";

const dailyReportTableColumns = () => {
  const dailyHeader = [
    { header: "no" },
    { header: "branch" },
    { header: "siteType" },
    { header: "category2" },
    { header: "supplier" },
    { header: "date" },
    { header: "bet" },
    { header: "turnover" },
    { header: "payout" },
    { header: "winLose" },
    { header: "count" }
  ];
  return getReportColumns(dailyHeader);
};

export default dailyReportTableColumns;
