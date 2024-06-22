import { useEffect, useRef, useState } from "react";
import helpers from "./util";

// useEffect will fire on construct,
// this hook won't fire on construct
export const useDidUpdateEffect = (callback, inputs) => {
  const didMountRef = useRef(false);

  useEffect(() => {
    if (didMountRef.current) callback();
    else didMountRef.current = true;
  }, inputs);
};

// use to save prevProps/prevState
export const usePrevious = (value) => {
  const ref = useRef();

  useEffect(() => {
    ref.current = value; //assign the value of ref to the argument
  }, [value]); //this code will run when the value of 'value' changes

  return ref.current; //in the end, return the current ref value.
};

export const useStateDifferent = () => {
  const [ori, setOri2] = useState();

  const setOri = (state) => {
    setOri2(helpers.object.cloneObject(state));
  };

  const _findObjDiff = (newObj, oriObj) => {
    const changed = {};
    Object.entries(newObj).forEach(([key, value]) => {
      const oriValue = oriObj?.[key];
      if (oriValue !== undefined) {
        if (oriObj?.[key] !== value) {
          changed[key] = value;
        }
      } else {
        changed[key] = value;
      }
    });
    return changed;
  };

  const handleArrayComparison = (newState, keyId) => {
    let changed = [];
    newState.forEach((d) => {
      if (keyId) {
        const oriState = ori?.find((e) => e[keyId] === d[keyId]);
        if (oriState) {
          const diff = _findObjDiff(d, oriState);
          const changes = Object.keys(diff);
          if (changes?.length) {
            changed.push({
              [keyId]: oriState?.[keyId],
              ...diff
            });
          }
        }
      }
    });
    return changed;
  };

  const handleObjectComparison = (newState) => {
    let changed = {};
    Object.entries(newState).forEach(([key, value]) => {
      const oriValue = ori?.[key];
      if (oriValue !== undefined) {
        if (ori?.[key] !== value) {
          changed[key] = value;
        }
      } else {
        changed[key] = value;
      }
    });
    return changed;
  };

  const findDifferent = (newState, keyId) => {
    if (Array.isArray(newState) && Array.isArray(ori)) {
      return handleArrayComparison(newState, keyId);
    } else if (typeof newState === "object" && !Array.isArray(newState)) {
      return handleObjectComparison(newState);
    }

    return null; // or handle other cases if needed
  };

  return [ori, setOri, findDifferent];
};

export const useOutsideClicker = (ref, callback, ignoreRef) => {
  const handleOutsideClick = (event) => {
    const { current } = ref || {};
    if (current && !current?.contains(event.target) && !ignoreRef?.current?.contains(event.target) && callback) {
      callback();
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  });
};

export const useWindowDimensions = () => {
  const [windowDimensions, setWindowDimensions] = useState(_getWindowDimensions());

  useEffect(() => {
    const handleResize = () => {
      setWindowDimensions(_getWindowDimensions());
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return windowDimensions;
};

const _getWindowDimensions = () => {
  const { innerWidth: width, innerHeight: height } = window;
  return {
    width,
    height
  };
};
