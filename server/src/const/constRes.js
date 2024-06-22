const constResStatus = {
  BAD_REQUEST: 400, // Cannot process request
  NO_AUTH: 401, // Authentication required
  FORBIDDEN: 403, // Not allowed to access
  NOT_FOUND: 404, // Resources not found
  INVALID: 422, // Request validation error
  TOKEN_EXPIRED: 440, // Token is expired
  INTERNAL_SERVER_ERROR: 500 // Internal Server Error
};

const constResCode = {
  TRY_AGAIN: 1,
  RE_LOGIN: 2,
  FAILED: 3
};

module.exports = {
  constResStatus,
  constResCode
};
