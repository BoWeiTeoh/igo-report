export const constResCode = {
  TRY_AGAIN: 1,
  RE_LOGIN: 2,
  FAILED: 3
};

export const constResStatus = {
  BAD_REQUEST: 400, // Cannot process request
  NO_AUTH: 401, // Authentication required
  FORBIDDEN: 403, // Not allowed to access
  NOT_FOUND: 404, // Resources aren't found
  INVALID: 422, // Request validation error
  INVALID_API_USER: 420, // Token is invalid due to disabled user
  INVALID_TOKEN: 484, // Token is invalid
  INTERNAL_SERVER_ERROR: 500 // Internal Server Error
};

export const constServerError = {
  [constResStatus.INVALID]: {
    type: "invalid_response",
    msg: "Couldn't understand server response"
  },
  [constResStatus.NOT_FOUND]: {
    type: "not_found",
    msg: "Api not found"
  },
  [constResStatus.NO_AUTH]: {
    type: "unauthorized",
    msg: "Access is denied"
  },
  ERROR_SERVER_UNREACHABLE: {
    type: "could_not_contact_server",
    msg: "Couldn't contact the server. Please check your internet connection and try again"
  }
};

export const constErrorMessage = {
  InvalidPassword: "Invalid Username or Password",
  InvalidLevelPoint: "End Point Must Large Then Start Point",
  InvalidLevelName: "Invalid Level Name"
};
