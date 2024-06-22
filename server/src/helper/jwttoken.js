const jwt = require("jsonwebtoken");
const appConfig = require("../config/appConfig");
const {constResStatus, constResCode} = require("../const/constRes");
const dbModel = require("../db/dbModel");
const {responseError} = require("./utilController");
const vaultData = require("../vault/config");
const {logger} = require("./utilPinoLogger");

const JWT_SECRET = vaultData?.getData()["JWT_SECRET"] || process.env.JWT_SECRET;

class JwtToken {
    static signToken(user) {
        try {
            const {_id, username, lastLoginAt, isRoot, company} = user || {};
            const payload = {
                id: _id,
                ll: lastLoginAt,
                u: username,
                c: company,
                t: "login"
            };
            if (isRoot) {
                payload.sa = 1;
            }
            return jwt.sign(payload, JWT_SECRET, {
                expiresIn: appConfig.jwtExpire
            });
        } catch (e) {
            logger.error({"signTokenErr": e});
            throw e;
        }
    }

    static hasAnyPermission(permissions) {
        return async function (req, res, next) {
            let decoded;
            try {
                decoded = decodeToken(req, res);
            } catch (e) {
                return handleTokenError(e, res);
            }

            let isValid = false;
            const isRootAdmin = decoded?.sa;
            if (isRootAdmin) {
                isValid = true;
                req.authCompany = decoded?.c;
            } else {
                if (!decoded?.id) {
                    const err = {
                        error: "Token invalid",
                        code: constResCode.FAILED,
                        status: constResStatus.NO_AUTH
                    };
                    return handleTokenError(err, res);
                }

                try {
                    const userAndPermission = await getUserAndPermissions(decoded);
                    const {userPermissions, userDepartments} = userAndPermission || {};
                    req.authPermissions = userPermissions;
                    req.authDepartments = userDepartments;
                    if (Array.isArray(permissions)) {
                        const permissionRequires = permissions?.map((p) => p?.split("_")?.[1]);
                        isValid = permissionRequires?.some((p) => {
                            return userPermissions?.includes(p);
                        });
                    } else {
                        isValid = userPermissions?.includes(permissions);
                    }
                } catch (e) {
                    logger.error({"hasAnyPermission err": e});
                    return handleTokenError(e, res);
                }
            }
            if (!isValid) {
                const err = {
                    // error: "Unauthorized",
                    error: "No Permission",
                    code: constResCode.FAILED,
                    status: constResStatus.NO_AUTH
                };
                return handleTokenError(err, res);
            }

            req.authClaims = decoded;
            next();
        };
    }

    static isLoggedIn() {
        return async function (req, res, next) {
            let decoded;
            try {
                decoded = decodeToken(req, res);
            } catch (e) {
                return handleTokenError(e, res);
            }

            req.authClaims = decoded;
            next();
        };
    }

    static isLoggedInAndPopulatePermissions() {
        return async function (req, res, next) {
            let decoded;
            try {
                decoded = decodeToken(req, res);
                const userAndPermission = await getUserAndPermissions(decoded);
                req.authClaims = decoded;
                req.authPermissions = userAndPermission?.userPermissions;
                req.authDepartments = userAndPermission?.userDepartments;
            } catch (e) {
                return handleTokenError(e, res);
            }

            req.authClaims = decoded;
            next();
        };
    }

    static isAdmin() {
        return async (req, res, next) => {
            let parts = _parseHeader(req, res);
            // Parse the header
            if (!parts) {
                const err = {
                    error: "Token invalid",
                    code: constResCode.FAILED,
                    status: constResStatus.NO_AUTH
                };
                return handleTokenError(err, res);
            }

            // Decode token
            let token = parts[1];
            let decoded;
            try {
                decoded = verifyToken(token);
            } catch (err) {
                return handleTokenError(err, res);
            }

            if (decoded?.sa === 1) {
                req.authClaims = decoded;
                return next();
            } else {
                res.body = {error: "Unauthorized", code: constResCode.RE_LOGIN};
                return res.status(constResStatus.BAD_REQUEST).json(res.body);
            }
        };
    }
}

const handleTokenError = (err, res) => {
    logger.error({"handleTokenError": err});
    if (typeof err === "object") {
        const {error, message, code, status} = err;
        if (message === "Token Expired") {
            return responseError(res, "Token invalid", null, constResStatus.NO_AUTH, constResCode.RE_LOGIN);
        }
        return responseError(res, message || error, undefined, status, code);
    }
};

const getUserAndPermissions = async (decoded) => {
    try {
        const user = await dbModel.user
            .findOne({
                _id: decoded?.id
            })
            .populate({
                path: "roles",
                model: dbModel.role,
                populate: {
                    path: "permissions",
                    model: dbModel.permission,
                    populate: {
                        path: "resource",
                        model: dbModel.resource
                    }
                }
            })
            .lean();

        const userPermissions = [], userDepartments = [];
        if (user?.roles?.permissions?.length) {
            const ids = user?.roles?.permissions?.map((p) => `${p?.resource?.name}_${p?.name}`);
            userPermissions.push(...ids);
        }
        userDepartments.push(String(user?.roles?.department));
        return {userPermissions, userDepartments, user};
    } catch (e) {
        logger.error({"getUserAndPermissions ERR": e});
        throw e;
    }
};

const _parseHeader = (req, res) => {
    let authHeader = req.header("Authorization") || req.body?.Authorization || req.query.Authorization;
    if (authHeader == null) {
        res.body = {message: "No auth header provided"};
        logger.error({authHeader: res.body.message})
        // console.error(res.body.message);
        return false;
    }

    let parts = authHeader.split(" ");
    if (parts.length !== 2 || parts[0] !== "Bearer") {
        res.body = {message: "Auth header is malformed"};
        logger.error({authHeader: res.body.message})
        return false;
    }

    return parts;
};

const decodeToken = (req, res) => {
    let parts = _parseHeader(req, res);
    if (!parts) {
        throw new Error({
            error: "Token Required",
            code: constResCode.RE_LOGIN,
            status: constResStatus.NO_AUTH
        });
    }

    let token = parts[1];
    let decoded;
    try {
        decoded = jwt.verify(token, JWT_SECRET);
    } catch (err) {
        logger.error({"decodeToken err": err});
        // extract message from console.trace
        if (err instanceof jwt.TokenExpiredError) {
            throw new Error("Token Expired");
        } else {
            throw new Error("Token Invalid");
        }
    }

    return decoded;
};

const verifyToken = (token) => {
    try {
        return jwt.verify(token, JWT_SECRET, {maxAge: appConfig.jwtExpire});
    } catch (e) {
        console.error("verifyToken ERR", e);
        throw e;
    }
};

module.exports = JwtToken;
