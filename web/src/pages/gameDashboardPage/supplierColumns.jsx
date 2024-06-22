import { getDashboardColumns } from "../../common/columns.jsx";

const supplierDashboardTableColumns = () => {
    const dashboardHeader = [
        { header: "supplier", size: 1850 }
    ];
    return getDashboardColumns(dashboardHeader);
};

export default supplierDashboardTableColumns;
