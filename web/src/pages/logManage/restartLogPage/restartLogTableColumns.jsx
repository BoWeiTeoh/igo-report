import React from 'react'
import { getDateTzISOString } from '../../../helpers/util_datetime.js';

const restartLogTableColumns = () => {
  return [
    {
      header: "Service",
      accessorKey: "service",
      size: 90
    },
    {
      header: "Instance",
      accessorKey: "instance",
      size: 90
    },
    {
      header: "Date",
      cell: ({ row }) => {
          const { createdAt } = row?.original || {};
          return <div>{getDateTzISOString(createdAt)}</div>;
      }
    }
  ]
};

export default restartLogTableColumns;