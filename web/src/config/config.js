const paginate = {
  page: 1, // start from
  limit: 10, // limit, max result
  totalDocs: 0,
  totalPages: 0
};

const config = Object.freeze({
  paginate,
  API_HOST: import.meta.env.VITE_API_HOST
});

export default config;
