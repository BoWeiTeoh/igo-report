const constCommonError = {
    NAME: (name)=> {
        return {
            EXIST: {
                code: 2000,
                msg: `Existing ${name}, Please Change`
            },
            NOT_EXIST: {
                code: 2001,
                msg: `${name} Not Existing `
            },
            EMPTY: {
                code: 2002,
                msg: `${name} can't be empty`
            },
            SPACE: {
                code: 2003,
                msg: `${name} can't contain whitespace, Please Remove`
            },
        }
    },
    COMMON: (name) => {
        return {
            NO_DATA: {
                code: 3000,
                msg: `No Data`
            },
            NOT_SELECT: {
                code: 3001,
                msg: `Please Fill in ${name}`
            },
            INVALID: {
                code: 3002,
                msg: `Invalid ${name}`
            },
            INACTIVE: {
                code: 3003,
                msg: `${name} Inactive`
            },
            FAIL:{
                code: 3004,
                msg: `Fail to create ${name}`
            },
            NOT_FOUND: {
                code: 3005,
                msg: `${name} Not Found`
            },
            DELETE: {
                code: 3006,
                msg: `${name} Need Delete`
            },
            PERMISSION: {
                code: 3007,
                msg: `No Permission`
            }
        }
    },
    PASSWORD: {
        EMPTY: {
            code: 4000,
            msg: "Please Fill in username and password"
        },
        WRONG: {
            code: 4001,
            msg: "Wrong Username or Password"
        },
        NOT_MATCH: {
            code: 4002,
            msg: "Passwords did not match"
        },
        LENGTH: {
            code: 4003,
            msg: "Password requires at least 6 characters"
        },
        INVALID: {
            code: 4004,
            msg: "Password contains invalid characters"
        }
    },
    TIME: {
        LENGTH: {
            code: 5000,
            msg: "Time range exceeds ranges days"
        },
        EMPTY: {
            code: 5001,
            msg: "Please Fill in a Time"
        },
        INVALID: {
            code: 5002,
            msg: "Invalid Time"
        }
    },
    CONFIG: {
        EXIST: {
            code: 6000,
            msg: "Config Type Exist"
        },
        NOT_FOUND: {
            code: 6001,
            msg: "Configuration setting not found"
        },
        MIN: {
            code: 6002,
            msg: "Configuration value are lower than minimum"
        },
        MAX: {
            code: 6003,
            msg: "Configuration value are greater than maximum"
        },
        INTEGER: {
            code: 6004,
            msg: "Value must be an integer"
        }
    },
    FUNCTION: {
        NOT_AVAILABLE: {
            code: 7000,
            msg: "Function not available , Please Try Later"
        }
    }
};

const constServerError = {
    API: {
        EXPIRED: {
            code: 2000,
            msg: "Token Expired"
        },
        NOT_FOUND: {
            code: 2001,
            msg: "API Not Found"
        }
    },
    HTTP: {
        500: {
            msg: "Internal Server Error"
        },
        501: {
            msg: "Not Implemented"
        },
        502: {
            msg: "Invalid Response"
        },
        503: {
            msg: "DB TimeOut"
        },
        504: {
            msg: "Gateway TimeOut"
        }
    }
};

module.exports = {
    constCommonError,
    constServerError
}