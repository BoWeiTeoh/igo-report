import React, { useEffect, useState } from "react";
import "./b2Tab.scss";

const TAB_WIDTH_MULTIPLY = 12;
const TAB_WIDTH_DEFAULT = 80;
const B2Tab = ({ list, checkedIndex = 0, onTabClick }) => {
  const [index, setIndex] = useState(checkedIndex);

  useEffect(() => {
    if (checkedIndex === null) {
      setIndex(null);
    } else if (checkedIndex !== undefined) {
      setIndex(checkedIndex);
    }
  }, [checkedIndex]);

  if (!list?.length) {
    return null;
  }

  const handleClick = (i, tabObj) => {
    setIndex(i);
    onTabClick && onTabClick(tabObj?.data || tabObj, i);
  };

  // set tab width
  let longestLabelLength = 0;
  list?.forEach((d) => {
    if (d?.label?.length > longestLabelLength) {
      longestLabelLength = d?.label.length;
    }
  });
  const tabWidth = Math.max(longestLabelLength * TAB_WIDTH_MULTIPLY, TAB_WIDTH_DEFAULT);
  let gliderStyle = {
    transform: "translateX(100%)",
    width: tabWidth
  };

  // loop tab
  const node = list?.map((d, i) => {
    const ind = i + 1;
    const tabId = `radio-${JSON.stringify(d)}-${ind}`;
    const props = {};
    const checked = index === i;
    if (index !== undefined) {
      props.checked = checked;
    }
    if (index === undefined && i === 0) {
      props.defaultChecked = true;
    }

    const percent = 100 * index;
    gliderStyle.transform = `translateX(${percent}%)`;

    return (
      <React.Fragment key={d.value + d.label}>
        <input type="radio" id={tabId} name="tabs" {...props} onChange={() => handleClick(i, d)} />
        <label
          className="_tab"
          htmlFor={tabId}
          style={{
            width: tabWidth
          }}
          onChange={() => handleClick(i, d)}
        >
          {d.label}
          {d.badge && <span className="_badge">{d.badge}</span>}
        </label>
      </React.Fragment>
    );
  });

  return (
    <>
      <div className="b2tab">
        {node}
        {index !== null && <span className="glider" style={gliderStyle}></span>}
      </div>
    </>
  );
};

export default B2Tab;
