import React, { useEffect, useState } from "react";
import "./reactTable8Pagination.scss";
import { constPaginateSetting } from "./constPaginate";
import clsx from "clsx";

const ReactTable8Pagination = ({
                                 pageIndex,
                                 pageSize,
                                 showPageInput = true,
                                 showPageSize = true,
                                 pages,
                                 className,
                                 totalCount,
                                 totalAmount,
                                 subTotalAmount,
                                 prevClick,
                                 prevDisabled,
                                 nextClick,
                                 nextDisabled,
                                 onApplyPageChange,
                                 onPageSizeChange
                               }) => {
  const [pageInput, setPageInput] = useState(pageIndex);

  useEffect(() => {
    setPageInput(pageIndex);
  }, [pageIndex]);

  const handlePageInputChange = (e) => {
    let page = e.target.value ? Number(e.target.value) : 1;
    if (page > pages) {
      page = pages;
    }
    if (page <= 0) {
      page = 1;
    }
    setPageInput(page);
  };

  const applyPageChange = () => {
    onApplyPageChange(pageInput - 1);
  };

  return (
    <div className={clsx("pagination-bottom", className)}>
      <div className={"-pagination"}>
        {showPageSize && (
          <span className="-pagination-display">
            <span>Display: &nbsp;</span>
            <select
              onChange={(e) => {
                onPageSizeChange(Number(e.target.value));
              }}
              value={pageSize}
            >
              {constPaginateSetting.pageSizeOptions.map((pageSize) => (
                <option key={pageSize} value={pageSize}>
                  {pageSize}
                </option>
              ))}
            </select>
          </span>
        )}

        {showPageInput && (
          <span className="-pagination-goto">
            <span className={"-pageInfoText"}>Go to Page: &nbsp;</span>
            <div className="-pageJump">
              <input type={"number"} value={pageInput} onChange={handlePageInputChange} onBlur={applyPageChange} />
            </div>
          </span>
        )}

        {showPageInput && (
          <span className="-pagination-current">
            <span className={"-pageInfoText"}>Page &nbsp;</span><span
            className={"-pageCurrentInfoText"}>{pageInput}</span>
            {pages ? (
              <span className={"-pageInfoText"}>
                {" "}
                of <span className="-totalPages">{pages}</span>
              </span>
            ) : null}
          </span>
        )}

        <div className="-previous-next">
          <button className="-btn" onClick={prevClick} disabled={prevDisabled}>
            Prev
          </button>
          <button className="-btn" onClick={nextClick} disabled={nextDisabled}>
            Next
          </button>
        </div>

        {typeof totalCount !== "undefined" && (
          <span className="-rowCount">
            {`Total ${totalCount} Item`}
            <br />
            {totalAmount ? "Total:" + totalAmount + ", SubTotal:" + subTotalAmount : ""}
          </span>
        )}
      </div>
    </div>
  );
};

export const canPrevious = (totalPages, currentPage) => {
  return currentPage !== 1;
};

export const canNext = (totalPages, currentPage) => {
  return currentPage < totalPages;
};

export default ReactTable8Pagination;
