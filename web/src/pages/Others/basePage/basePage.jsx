import "./basePage.scss";
import React from "react";
import Check from "../../../components/checkIf.jsx";
import Loader from "../../../components/loader/loader.jsx";
import LayoutContainer from "../../../components/layout/layoutContainer.jsx";
import B2ButtonGroup from "../../../components/b2ButtonGroup/b2ButtonGroup.jsx";
import B2Button from "../../../components/b2Button/b2Button.jsx";
import ic_export from "../../../images/icon/ic_export.png";
import ic_search from "../../../images/icon/ic_search.png";
import B2Image from "../../../components/b2Image/b2Image.jsx";

const BasePage2 = (props) => {
  const {
    isLoading,
    title,
    children,
    className = "",
    noPadding,
    generateStatus = true,
    callSearchFromOutside,
    callExportFromOutside,
    callGenerateFromOutside,
    callSummaryFromOutside,
    isSearchBtnDisabled = false,
  } = props;

  const bodyNode = [];
  const filterNode = [];
  let headerNode;
  React.Children.forEach(children, (child, i) => {
    if (child?.type?.displayName === "BasePageHeader") {
      headerNode = child;
    } else {
      if (child?.type?.name === "ReactTableFilter") {
        filterNode.push(child);
      } else {
        bodyNode.push(child);
      }
    }
  });

  const layoutContainerStyle = {};
  if (noPadding) {
    layoutContainerStyle.padding = 0;
  }

  let searchInput = null;
  const filterListNode = filterNode.filter((item) => {
    return !item.props.data.some((dataItem) => {
      if (dataItem?.search === "search") {
        searchInput = item;
        return true;
      }
      return false;
    });
  });

  return (
    <>
      <div className={`base-page ${className}`} style={layoutContainerStyle}>
        <Check if={title}>
          <div className="page-title">
            <LayoutContainer style={layoutContainerStyle}>
              <div className={"base-page-header-wrap"}>
                <h5>{title}</h5>
                {headerNode}

                {/* Display when those pages are in SYSTEM MANAGER, searchInput + add New */}
                {searchInput}

                {/* All button from Report */}
                {filterNode.map(
                  (item, index) =>
                    (callSearchFromOutside ||
                      callExportFromOutside ||
                      callGenerateFromOutside ||
                      callSummaryFromOutside) && (
                      <B2ButtonGroup key={index}>
                        {item.props.onSearch && (
                          <B2Button
                            className="btn-search"
                            type="submit"
                            onClick={callSearchFromOutside}
                            disabled={isSearchBtnDisabled}
                          >
                            <B2Image
                              src={ic_search}
                              alt="ic_search"
                              className="image-icon"
                              isIcon={true}
                            />
                            {"Search"}
                          </B2Button>
                        )}
                        {item.props.onExport && (
                          <B2Button
                            className="btn-export"
                            type="submit"
                            onClick={callExportFromOutside}
                          >
                            <B2Image
                              src={ic_export}
                              alt="ic_export"
                              className="image-icon"
                              isIcon={true}
                            />
                            {"Export"}
                          </B2Button>
                        )}
                        {item.props.onGenerate && (
                          <B2Button
                            className="btn-regenerate"
                            onClick={callGenerateFromOutside}
                            disabled={!generateStatus}
                          >
                            {"Regenerate"}
                          </B2Button>
                        )}
                        {item.props.onSummary && (
                          <B2Button
                            className="btn-summary"
                            onClick={callSummaryFromOutside}
                          >
                            <B2Image
                              src={ic_export}
                              alt="ic_export"
                              className="image-icon"
                              isIcon={true}
                            />
                            {"Summary"}
                          </B2Button>
                        )}
                      </B2ButtonGroup>
                    )
                )}
              </div>
            </LayoutContainer>
          </div>
        </Check>

        <div className={"base-page-body"} style={layoutContainerStyle}>
          <LayoutContainer style={layoutContainerStyle}>
            <div className="base-page-content">
              {/* Display all Input type for filtering */}
              {filterListNode}
              {isLoading ? <Loader isFullLoader={true} /> : bodyNode}
            </div>
          </LayoutContainer>
        </div>

        <div className="hint-bill-report-only">
          <LayoutContainer style={layoutContainerStyle}>
            {filterNode.map((item, index) => {
              if (item?.props?.isBillPage) {
                return (
                  <div className="hint-bill-report-content" key={index}>
                    <ul>
                      <li>
                        <label>One excel file maximum 500,000 data.</label>
                      </li>
                      <li>
                        <label>
                          One excel file provider one supplier data.
                        </label>
                      </li>
                      <li>
                        <label>
                          If excel file no exists, please regenerate.
                        </label>
                      </li>
                      <li>
                        <label>
                          Excel file only will be affect by Outlet ID , Site Type,
                          Platform Code, Game Brand and Bill Time.
                        </label>
                      </li>
                      <li>
                        <label>
                          The config manage of transaction report and balance
                          record can be used universally.
                        </label>
                      </li>
                    </ul>
                  </div>
                );
              }
              return null;
            })}
          </LayoutContainer>
        </div>
      </div>
    </>
  );
};

// optimize rendering by return cached component if not active
const BasePage = React.memo(BasePage2, (prevProps, nextProps) => {
  return nextProps?.active === false;
});

export default BasePage;
