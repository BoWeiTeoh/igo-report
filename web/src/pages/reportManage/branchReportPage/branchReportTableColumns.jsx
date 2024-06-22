import { getReportColumns } from "../../../common/columns.jsx";

const branchReportTableColumns = () => {
  const branchHeader = [
    { header: "no" },
    { header: "branch" },
    { header: "siteType" },
    { header: "category" },
    { header: "bet" },
    { header: "turnover" },
    { header: "payout" },
    { header: "winLose" },
    { header: "count" }
  ];
  return getReportColumns(branchHeader);
};

export default branchReportTableColumns;
