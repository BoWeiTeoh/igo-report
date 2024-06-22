const permissionsSeeder = [
  {
    resource: "Admin",
    permissions: ["Read"]
  },
  {
    resource: "Role",
    permissions: ["Read"]
  },
  {
    resource: "Category",
    permissions: ["Read"]
  },
  {
    resource: "Site-Type",
    permissions: ["Read"]
  },
  {
    resource: "Branch",
    permissions: ["Read"]
  },
  {
    resource: "Summary-Report",
    permissions: ["Read"]
  },
  {
    resource: "Branch-Report",
    permissions: ["Read"]
  },
  {
    resource: "Transaction-Report",
    permissions: ["Read", "Regenerate"]
  },
  {
    resource: "Balance-Record",
    permissions: ["Read"]
  },
  {
    resource: "Daily-Report",
    permissions: ["Read"]
  },
  {
    resource: "Re-Summary",
    permissions: ["Read"]
  },
  {
    resource: "Department",
    permissions: ["Read"]
  },
  {
    resource: "Player-Info",
    permissions: ["Read"]
  },
  {
    resource: "Player-Deposit",
    permissions: ["Read"]
  },
  {
    resource: "Player-Withdraw",
    permissions: ["Read"]
  },
  {
    resource: "Transfer-In-Out",
    permissions: ["Read"]
  },
  {
    resource: "Amla-Report",
    permissions: ["Read"]
  },
  {
    resource: "Game",
    permissions: ["Read"]
  },
  {
    resource: "Jackpot-Report",
    permissions: ["Read"]
  },
];

module.exports = permissionsSeeder;
