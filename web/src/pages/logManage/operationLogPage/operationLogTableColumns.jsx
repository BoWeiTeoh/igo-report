import React from "react";
import { getDateTzISOString } from "../../../helpers/util_datetime.js";

const operationLogTableColumns = () => {
  return [
    {
      header: "Username",
      accessorKey: "username",
      size: 90
    },
    {
      header: "Operation",
      accessorKey: "operation",
      size: 50
    },
    {
      header: "Date",
      cell: ({ row }) => {
        const { createdAt } = row?.original || {};
        return <div>{getDateTzISOString(createdAt)}</div>;
      }
    },
    {
      header: "Title",
      accessorKey: "title"
    },
    {
      header: "Remark",
      minSize: 300,
      size: 400,
      cell: ({ row }) => {
        const { data } = row?.original || {};
        return <div>{parseOperationLogData(data)}</div>;
      }
    },
    {
      header: "Request ID",
      size: 150,
      accessorKey: "requestId"
    }
  ];
};

const parseOperationLogData = (data) => {
  return data?.map(d => {
    let text = "";
    if (d.key) {
      text = `(${d.key}) `;
    }
    if (d.oriValue) {
      text += `${d.oriValue}`;
    }
    if (d.newValue) {
      text += `👉 ${d.newValue}`;
    }
    return (
      <div key={text}>
        {text}
      </div>
    );
  });
};

export default operationLogTableColumns;
