export const ensureOptionArray = (state, filterName) => {
  let options = state[filterName] || [];
  if (!Array.isArray(options)) {
    options = [];
  }

  return options;
};
