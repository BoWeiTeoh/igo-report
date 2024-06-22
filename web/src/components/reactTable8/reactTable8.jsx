import React, { forwardRef, useEffect, useState } from "react";
import "./reactTable.scss"; // default style
import "./reactTable8.scss";
import {formatDecimal, toDecimalString} from "../../helpers/util_number.js";

import { flexRender, getCoreRowModel, getSortedRowModel, useReactTable } from "@tanstack/react-table";
import clsx from "clsx";
import { useDidUpdateEffect } from "../../helpers/reactHooks";
import ReactTable8Pagination from "./reactTable8Pagination";
import PropTypes from "prop-types";
import { constPaginateSetting } from "./constPaginate";
import B2Checkbox from "../form/b2Checkbox";

const CHECKBOX_SIZE = 45;
// you can pass onValidateSelect to prevent checkbox being checked
const ReactTable = forwardRef((props, tableRef) => {
  const {
    columns,
    data = [],
    pages,
    onFetchData,
    className,
    onToggleSelection,
    onValidateSelect,
    style = {},
    checkbox,
    onRowClick,
    isLoading,
    showPagination = true,
    showFooter = false,
    canSingleSelect = false,
    disableToggleAll,
    selectedRowProp,
    selectionsProp,
    maxHeight,
    compact,
    addCol = 0,
    page,
    totalCount,
    totalBet,
    totalTurnover,
    totalWinLose,
    isLoading2,
    isBillPage
  } = props || {};
  const [isReady, setIsReady] = useState(false);
  const [oneRowSelect, setOneRowSelect] = useState(null);
  const [rowSelection, setRowSelection] = React.useState({});
  const [sorting, setSorting] = React.useState(constPaginateSetting.defaultSorted);
  const [paginationObj, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: props?.limit || constPaginateSetting.defaultPageSize
  });

  useEffect(() => {
    setIsReady(true);
  }, []);

  useEffect(() => {
    if (props?.page) {
      setPagination((d) => ({
        ...d,
        pageIndex: props?.page - 1
      }));
    }
  }, [props?.page]);

  useEffect(() => {
    if (page) {
      setPagination((d) => ({
        ...d,
        pageIndex: page - 1
      }));
    }
  }, [page]);

  useDidUpdateEffect(() => {
    const selectedData = table.getSelectedRowModel();
    const selectedDataArr = selectedData?.rows?.map((d) => d.original);
    if (typeof onToggleSelection === "function") {
      onToggleSelection(selectedDataArr);
    }
  }, [rowSelection]);

  const pagination = React.useMemo(
    () => ({
      pageIndex: paginationObj?.pageIndex,
      pageSize: paginationObj?.pageSize
    }),
    [paginationObj?.pageIndex, paginationObj?.pageSize]
  );

  const table = useReactTable({
    data,
    columns,
    state: { sorting, pagination, rowSelection },
    defaultColumn: {
      size: 100
    },
    onSortingChange: setSorting,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    debugTable: true,
    pageCount: pages ?? -1,
    onPaginationChange: setPagination,
    manualPagination: true,
    manualSorting: true,
    enableSortingRemoval: false,
    enableMultiSort: true,
    enableMultiRemove: true,
    columnResizeMode: "onChange"
  });
  const tableState = table.getState();

  if (tableRef) {
    const sortedData = data?.map((d) => {
      return {
        ...d.type,
        _original: d
      };
    });
    tableRef.current = {
      state: {
        columns,
        sortedData
      }
    };
  }

  // avoid fire this on mounted because：
  // new data pass in will trigger useEffect, and it'll cause infinite rerender
  useDidUpdateEffect(() => {
    const { pageIndex, pageSize } = paginationObj || {};
    if (typeof onFetchData === "function") {
      onFetchData({ page: pageIndex + 1, limit: pageSize, sort: sorting });
    }
  }, [paginationObj?.pageIndex, paginationObj?.pageSize, sorting]);

  useEffect(() => {
    if (isReady) {
      if (selectionsProp?.length === 0) {
        table.resetRowSelection();
      }
    }
  }, [selectionsProp]);

  const headerGroups = table.getHeaderGroups();

  const handleRowOnChange = (row) => {
    let canSelect = true;
    if (typeof onValidateSelect === "function") {
      canSelect = onValidateSelect(row?.original);
    }
    canSelect === true && row.toggleSelected();
  };

  const handleSingleRowClick = (row) => {
    if (canSingleSelect) {
      let prop;
      if (row?.id === oneRowSelect?.id) {
        setOneRowSelect(null);
        prop = null;
      } else {
        setOneRowSelect(row);
        prop = row?.original;
      }

      if (typeof onRowClick === "function") {
        onRowClick(prop);
      }
    }
  };

  const totalTableSize = table.getCenterTotalSize() + CHECKBOX_SIZE;

  const rootStyle = {
    ...style
  };
  if (maxHeight) {
    rootStyle.maxHeight = maxHeight;
  }

  const applyPageChange = (pageInput) => {
    table.setPageIndex(pageInput);
  };

  const handlePageSizeChange = (size) => {
    table.setPageSize(size);
  };

  return (
    <div
      className={clsx(
        "ReactTable -striped common-table react-table-8",
        onRowClick && "clickable-row",
        className,
        compact && "table-compact"
      )}
      style={rootStyle}
    >
      <div className={clsx("_loading", isLoading && "_active")}>
        <div className="_loading-inner">Loading...</div>
      </div>

      <div className="rt-table">
        <div className={"rt-thead -header"} style={{ minWidth: totalTableSize }}>
          <TableHeaderGroups
            headerGroups={headerGroups}
            checkbox={checkbox}
            table={table}
            disableToggleAll={disableToggleAll}
          />
        </div>
        <div className={"rt-tbody"} style={{ minWidth: totalTableSize }}>
          <TableBodyMemo
            tableState={tableState}
            table={table}
            checkbox={checkbox}
            props={props}
            selectedRowProp={selectedRowProp}
            handleRowOnChange={handleRowOnChange}
            handleSingleRowClick={handleSingleRowClick}
            oneRowSelect={oneRowSelect}
            paginationObj={paginationObj}
            addCol={addCol}
          />
        </div>
        {showFooter && <TableFooter checkbox={checkbox} table={table} totalTableSize={totalTableSize} />}
      </div>
      {isBillPage && <TableAggregation isLoading2={isLoading2} totalCount={totalCount} totalBet={totalBet}
                                       totalTurnover={totalTurnover} totalWinLose={totalWinLose} />}
      {showPagination && (
        <ReactTable8Pagination
          pageIndex={tableState.pagination.pageIndex + 1}
          pages={pages}
          pageSize={tableState.pagination.pageSize}
          onApplyPageChange={applyPageChange}
          prevClick={table?.previousPage}
          prevDisabled={!table?.getCanPreviousPage()}
          nextClick={table?.nextPage}
          nextDisabled={!table?.getCanNextPage()}
          onPageSizeChange={handlePageSizeChange}
        />
      )}
    </div>
  );
});

const checkboxStyle = {
  flex: `${CHECKBOX_SIZE} 0 auto`,
  width: CHECKBOX_SIZE,
  maxWidth: CHECKBOX_SIZE
};
const TableHeaderGroups = ({ headerGroups, disableToggleAll, table, checkbox }) => {
  const handleAllToggle = () => {
    if (disableToggleAll !== true) {
      return table.getToggleAllRowsSelectedHandler();
    }
  };

  return headerGroups.map((headerGroup) => {
    return (
      <div key={headerGroup.id} className={"rt-tr"}>
        {checkbox && (
          <div style={checkboxStyle} className={"rt-th rt-checkbox"}>
            <IndeterminateCheckbox
              {...{
                checked: table.getIsAllRowsSelected(),
                indeterminate: table.getIsSomeRowsSelected() ? 1 : 0,
                onChange: handleAllToggle()
              }}
            />
          </div>
        )}
        <TableHeader headerGroup={headerGroup} />
      </div>
    );
  });
};

const TableHeader = ({ headerGroup }) => {
  return headerGroup.headers.map((header) => {
    const canSort = header.column.getCanSort();
    const sortCN = header.column.getIsSorted() && `-sort-${header.column.getIsSorted()}`;
    const { className, maxSize } = header?.column?.columnDef || {};
    const headerSize = header.getSize();
    const myStyle = {
      width: headerSize,
      flex: `${headerSize} 0 auto`
    };
    if (maxSize) {
      myStyle.maxWidth = maxSize;
    }

    const resizeHandler = header.getResizeHandler();

    return (
      <div
        key={header.id}
        // colSpan={header.colSpan}
        style={myStyle}
        className={clsx(className, sortCN, `rt-th`)}
      >
        {header.isPlaceholder ? null : (
          <div
            className={clsx(canSort && "cursor-pointer select-none", "rt-resizable-header-content")}
            // onClick={header.column.getToggleSortingHandler()}
          >
            <div className={"_body"}>{flexRender(header.column.columnDef.header, header.getContext())}</div>
          </div>
        )}

        <div
          onMouseDown={resizeHandler}
          onTouchStart={resizeHandler}
          className={`resizer ${header.column.getIsResizing() ? "isResizing" : ""}`}
        />
      </div>
    );
  });
};

const TableBody = ({
                     table,
                     paginationObj,
                     oneRowSelect,
                     selectedRowProp,
                     handleSingleRowClick,
                     checkbox,
                     handleRowOnChange,
                     tableState,
                     props,
                     addCol = 0
                   }) => {
  return table
    .getRowModel()
    .rows.slice(0, paginationObj?.pageSize + addCol)
    .map((row, i) => {
      const isEven = (i + 1) % 2 === 0;
      let isSelected;
      if (selectedRowProp) {
        isSelected = JSON.stringify(selectedRowProp) === JSON.stringify(row?.original);
      }
      // else {
      //     isSelected = row?.id === oneRowSelect?.id;
      // }

      const isCheckBoxSelected = row.getIsSelected();
      let trProps = {};
      if (typeof props?.setTrProps === "function") {
        trProps = props?.setTrProps(row);
      }

      return (
        <div key={row.id} className={"rt-tr-group"}>
          <div
            onClick={() => handleSingleRowClick(row)}
            className={clsx("rt-tr", isEven ? "-even" : "-odd", isSelected && "row-selected")}
            {...trProps}
          >
            {checkbox && (
              <div style={checkboxStyle} className={"rt-td rt-checkbox"}>
                <IndeterminateCheckbox
                  {...{
                    checked: isCheckBoxSelected,
                    indeterminate: row.getIsSomeSelected() ? 1 : 0,
                    onChange: () => handleRowOnChange(row, isCheckBoxSelected)
                  }}
                />
              </div>
            )}

            {row.getVisibleCells().map((cell) => {
              const columnSize = cell.column.getSize();
              const { className, maxSize } = cell?.column?.columnDef;
              let styles = {
                width: columnSize,
                flex: `${columnSize} 0 auto`
                // maxWidth: columnSize
              };
              if (maxSize) {
                styles.maxWidth = maxSize;
              }

              if (typeof cell?.column?.columnDef?.style === "object") {
                styles = {
                  ...styles,
                  ...cell?.column?.columnDef?.style
                };
              }

              if (typeof cell?.column?.columnDef?.getProps === "function") {
                const obj = cell?.column?.columnDef?.getProps(tableState, cell?.row, cell?.column);
                if (typeof obj?.style === "object") {
                  styles = {
                    ...styles,
                    ...obj.style
                  };
                }
              }

              return (
                <div key={cell.id} style={styles} className={clsx(className, "rt-td")}>
                  <div className={"_body"}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</div>
                </div>
              );
            })}
          </div>
        </div>
      );
    });
};

const TableAggregation = ({ isLoading2, totalCount, totalBet, totalTurnover, totalWinLose, totalTableSize }) => {
  return (
    <div className={"rt-taggregation"} style={{ minWidth: totalTableSize }}>
      <div className={"rt-taggregation-content"}>
        <div className={"rt-taggregation-content-row"}>
          <h6>Total Count:</h6>
          {!isLoading2 && (<h6>{totalCount}</h6>)}
          {isLoading2 && ("Loading...")}
        </div>
        <div className={"rt-taggregation-content-row"}>
          <h6>Total Bet:</h6>
          {!isLoading2 && (<h6>{formatDecimal(totalBet, 3)}</h6>)}
          {isLoading2 && ("Loading...")}
        </div>
        <div className={"rt-taggregation-content-row"}>
          <h6>Total Turnover:</h6>
          {!isLoading2 && (<h6>{formatDecimal(totalTurnover, 3)}</h6>)}
          {isLoading2 && ("Loading...")}
        </div>
        <div className={"rt-taggregation-content-row"}>
          <h6>Total Win/Lose:</h6>
          {!isLoading2 && (<h6>{formatDecimal(totalWinLose, 3)}</h6>)}
          {isLoading2 && ("Loading...")}
        </div>
        <div className={"rt-taggregation-content-row"}>
          <h6>Total Payout:</h6>
          {!isLoading2 && (<h6>{formatDecimal((totalBet + totalWinLose), 3)}</h6>)}
          {isLoading2 && ("Loading...")}
        </div>
      </div>
    </div>
  );
};

const TableFooter = ({ table, totalTableSize, checkbox }) => {
  return (
    <div className={"rt-tfoot"} style={{ minWidth: totalTableSize }}>
      {table.getFooterGroups().map((footerGroup) => {
        return (
          <div key={footerGroup.id} className={"rt-tr"}>
            {checkbox && <div className={"rt-td"} style={checkboxStyle} />}
            {footerGroup.headers.map((header) => {
              const { className, maxSize } = header?.column?.columnDef || {};

              const columnSize = header.column.getSize();
              let styles = {
                width: columnSize,
                flex: `${columnSize} 0 auto`
              };

              if (maxSize) {
                styles.maxWidth = maxSize;
              }

              return (
                <div key={header.id} className={clsx(className, "rt-td")} style={styles}>
                  <div className={"_body"}>
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.footer, header.getContext())}
                  </div>
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};

// we have to cache body because resizing will render whole table, if many data will happen lag issue
const TableBodyMemo = React.memo(TableBody, (prevProps, nextProps) => {
  const prevData = prevProps?.props?.data;
  const nextData = nextProps?.props?.data;

  // 如这些数据没变动，就返回cached
  return (
    prevData?.length === nextData?.length &&
    prevProps?.isLoading === nextProps?.isLoading &&
    prevProps?.selectedRowProp === nextProps?.selectedRowProp && // single click update selected row
    prevProps?.tableState?.rowSelection === nextProps?.tableState.rowSelection && // checkbox selected
    prevProps?.tableState?.columnVisibility === nextProps?.tableState.columnVisibility &&
    prevProps?.tableState?.columnSizing === nextProps?.tableState?.columnSizing &&
    JSON.stringify(prevData) === JSON.stringify(nextData)
  );
});

const ReactTable8 = React.memo(ReactTable, (prevProps, nextProps) => {
  return false;
});
export default ReactTable8;

const IndeterminateCheckbox = (props) => {
  const { indeterminate } = props;
  const ref = React.useRef(null);

  React.useEffect(() => {
    if (typeof indeterminate === "boolean") {
      ref.current.indeterminate = !props.checked && indeterminate;
    }
  }, [ref, indeterminate]);

  return <B2Checkbox {...props} ref={ref} />;
};

ReactTable8.propTypes = {
  paginationComponent: PropTypes.bool,
  shouldExpand: PropTypes.bool,
  minRows: PropTypes.number,
  maxHeight: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  pages: PropTypes.number,
  checkbox: PropTypes.bool,
  defaultSorted: PropTypes.array,
  isLoading: PropTypes.bool,
  style: PropTypes.object,
  className: PropTypes.string,

  // checkbox table is required
  selection: PropTypes.array,
  isSelectAll: PropTypes.bool,
  totalCount: PropTypes.number,
  onToggleAll: PropTypes.func,
  onToggleSelection: PropTypes.func,
  // ------------------

  data: PropTypes.array.isRequired,
  columns: PropTypes.array.isRequired,

  onRowProps: PropTypes.func,
  onFetchData: PropTypes.func,
  onCheckboxSelect: PropTypes.func,
  onCheckboxKeySelect: PropTypes.func,
  onCheckboxClearAll: PropTypes.func,
  onRowSelect: PropTypes.func,

  showFooter: PropTypes.bool
};
