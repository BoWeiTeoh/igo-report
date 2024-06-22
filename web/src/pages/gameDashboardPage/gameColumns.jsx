import { getDashboardColumns } from "../../common/columns.jsx";

const gameDashboardTableColumns = () => {
    const dashboardHeader = [
        { header: "game" }
    ];
    return getDashboardColumns(dashboardHeader);
};

export default gameDashboardTableColumns;
