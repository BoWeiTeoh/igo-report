import "./tableFilter.scss";
import React, { forwardRef, useEffect, useState } from "react";
import ReactTableFilterItem from "./reactTableFilterItem";
import util from "../../helpers/util";
import B2ButtonGroup from "../b2ButtonGroup/b2ButtonGroup.jsx";
import Button from "../b2Button/b2Button.jsx";
import { constFilterType } from "./constFilter";
import ic_add from "../../images/icon/ic_add.png";
import B2Image from "../b2Image/b2Image.jsx";

const ReactTableFilter = forwardRef((props, ref) => {
  const {
    data = [],
    onSearch,
    onExport,
    onPrint,
    onCreate,
    onSummary,
    defaultQuery = {},
    filterRef,
    forceClearFilter,
    onGenerate,
  } = props;

  const getDefaultState = () => {
    const dataQueryKey = {};
    data?.forEach((d) => {
      if (d.queryKey) {
        if ([constFilterType.input, constFilterType.date].includes(d.type)) {
          dataQueryKey[d.queryKey] = "";
        }
      }
    });
    return {
      ...dataQueryKey,
      ...defaultQuery
    };
  };

  const [state, setState] = useState(getDefaultState);

  useEffect(() => {
    if (forceClearFilter) {
      setState(defaultQuery);
    }
  }, [forceClearFilter]);

  const onExportClick = async () => {
    const query = populateQuery(state, data);
    await onExport(query);
  };

  const onGenerateClick = async () => {
    const query = populateQuery(state, data);
    await onGenerate(query);
  };

  const onSearchClick = (e) => {
    if (e) {
      e.preventDefault();
    }
    const query = populateQuery(state, data);
    onSearch(query);
  };

  const onSummaryClick = (e) => {
    try {
      if (e) {
        e.preventDefault();
      }
      const query = populateQuery(state, data);
      onSummary(query);
    } catch (e) {
      throw e;
    }
  };

  const onPrintClick = async () => {
    try {
      const query = populateQuery(state, data);
      await onPrint(query);
    } catch (e) {
      throw e;
    }
  };

  const onClearClick = () => {
    setState(defaultQuery);
  };

  React.useImperativeHandle(ref, () => ({
    onExportClick: async () => {
      await onExportClick();
    },
    onSearchClick: async () => {
      onSearchClick();
    },
    onGenerateClick: async () => {
      await onGenerateClick();
    },
    onSummaryClick: async () => {
      onSummaryClick();
    }
  }));

  return (
    <form className={"table-filter-container"} ref={filterRef} onSubmit={onSearchClick}>
      <div className={"table-filter"}>
        {data?.map((d, i) => (
          <ReactTableFilterItem key={d?.label || d?.placeholder || i} {...d} setState={setState} state={state}
                                onSearchClick={onSearchClick} />
        ))}
      </div>

      <B2ButtonGroup style={{ padding: 0 }}>
        {onCreate && (
          <Button className="btn-search" type="submit" onClick={onCreate}>
            <B2Image src={ic_add} alt="ic_add" className="image-icon" isIcon={true} />
            {"Add"}
          </Button>
        )}
      </B2ButtonGroup>

      <div className={"table-filter-wrapper"}></div>
    </form>
  );
});

const toBoolean = (value) => {
  if (value === "true") {
    return true;
  }
  if (value === "false") {
    return false;
  }
  return value;
};

ReactTableFilter.name = "ReactTableFilter";
export default ReactTableFilter;

const populateQuery = (state, data) => {
  const query = {};
  const stateCloned = util.object.cloneObject(state);
  stateCloned &&
  Object.keys(stateCloned)?.forEach((key) => {
    let objValue = stateCloned[key];
    let objTypeValue = util.object.stringToObject(objValue);

    // difference queryKey in the dropdown option
    if (objTypeValue?.queryKey) {
      const queryKey = objTypeValue.queryKey;
      delete objTypeValue.queryKey;
      query[queryKey] = objTypeValue;
    }

    if (Array.isArray(objValue)) {
      // delete query key if array only true false
      if (objValue?.length === 2 && objValue.includes("true") && objValue.includes("false")) {
        delete stateCloned[key];
      } else if (objValue?.length === 1 && ["true", "false"].includes(objValue[0])) {
        objValue[0] = toBoolean(objValue[0]);
        query[key] = objValue[0];
      } else if (objValue?.length) {
        query[key] = objValue?.filter((v) => !["*"]?.includes(v)); // ignore all on multiCheck
      }
    }
    // sometime queryKey is diff in drop option, so we no set queryKey on the outside
    else if (key !== "undefined" && objValue !== undefined && String(objValue)?.trim() !== "") {
      objValue = toBoolean(objValue);
      query[key] = objValue;
    }
  });

  // set operation by filter data
  Object.keys(query).forEach((q) => {
    const filterData = data.find((d) => d.queryKey === q);
    let value = query[q];
    if (Array.isArray(value)) {
      query[q] = value.map((d) => d.value);
    }
    if (filterData?.operation) {
      query[q] = {
        operation: filterData.operation,
        value: query[q]
      };
    }
  });

  return query;
};
