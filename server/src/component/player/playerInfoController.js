const { responseError, responseSuccess } = require("../../helper/utilController.js");
const platformMethod = require("../platform/platformMethod");
const playerMethod = require("../player/playerMethod");
const adminMethod = require("../admin/adminMethod");
const utilController = require("../../helper/utilController");
const utilExport = require("../../helper/utilExport");
const utilDate = require("../../helper/utilDate");

const configMethod = require("../config/configMethod");
const { constConfig } = require("../../const/constConfig");

const vaultData = require("../../vault/config");
const Axios = require("axios");
const fpmsLink = vaultData.getData()["AWS_FPMS_URL"];
const host = vaultData.getData()["FPMS_HTTP"];
const FpmsHttp = require("../../fpmsHttp/fpmsHttp");
const { constCommonError} = require("../../const/constErrorCode");


const _playerInfoQuery = async (authClaims, filter) => {
    const platforms = await adminMethod.getBranches(authClaims);
    const platformArr = platforms.map(item => item?._id);
    const TIME_LIMIT_PLAYER_REPORT = await configMethod.getValue(constConfig.TIME_LIMIT_PLAYER_REPORT)
    const { min, max, registrationTime, isCompleteInfo, ...otherFilter } = filter;
    utilController.checkFilterDate(registrationTime, TIME_LIMIT_PLAYER_REPORT);
    const playerQuery = {
        ...otherFilter,
        platform: { $in: platformArr },
        isShadowAccount: { $in: [null, false] },
    };
    
    if (isCompleteInfo) {
        playerQuery.isCompleteInfo = isCompleteInfo === 'false' ? false : Boolean(isCompleteInfo);
    }

    if (min || max) {
        if (min && max) {
            playerQuery.validCredit = { $gte: parseFloat(min), $lte: parseFloat(max) };
        } else if (min) {
            playerQuery.validCredit = { $gte: parseFloat(min) };
        } else if (max) {
            playerQuery.validCredit = { $lte: parseFloat(max) };
        }
    }

    if (!playerQuery.name && !playerQuery.playerId && registrationTime) {
        let regStartTime = (registrationTime?.startTime && new Date(registrationTime?.startTime)) || new Date();
        let regEndTime = (registrationTime?.endTime && new Date(registrationTime?.endTime)) || new Date();

        playerQuery.registrationTime = {
            $gte: new Date(regStartTime),
            $lt: new Date(regEndTime)
        };
    }

    const playerProjection = {
        playerId: 1,
        validCredit: 1,
        name: 1,
        registrationTime: 1,
        isCompleteInfo: 1,
        platform: 1,

        // KYC
        phoneNumber: 1,
        realName: 1,
        // gender: 1,
        DOB: 1,
        email: 1, // KYC No Need Email
        // IDCardNumber: 1,
        sourceOfFunds: 1,
        // address: 1,
        // country: 1, // KYC No Need Country
        playerProvince: 1,
        // postcode: 1,
        playerCity: 1,
        nationality: 1,
        photoId1: 1,
        placeOfBirth: 1,
        natureOfWork: 1
    };
    return {playerQuery, playerProjection,platforms};
}

class PlayerInfoController {
    async onGet(req, res) {
        try {
            const { filter, paginateOption } = utilController?.parseQuery(req.query);
            const query = { _id: req?.authClaims?.id };
            const {playerQuery, playerProjection,platforms} = await _playerInfoQuery(query, filter);
            const options = {
                // ...paginateOption,
                select: playerProjection,
            }
            const response = await playerMethod.aggregate(playerQuery,null, playerProjection, paginateOption.page, paginateOption.limit);
            response.map(item => {
                const userPlatform = platforms.find(platform => String(platform._id) === String(item.platform));
                if (item?.photoId1?.imageName) {
                    item.image =  fpmsLink[userPlatform.platformId] + item?.photoId1?.imageName;
                }
                return item
            })
            return responseSuccess(res, response)
        } catch (e) {
            return responseError(res, e);
        }
    }

    async getCount(req, res) {
        try {
            const { filter, paginateOption } = utilController?.parseQuery(req.query);
            const query = { _id: req?.authClaims?.id };
            const { playerQuery } = await _playerInfoQuery(query, filter);

            const totalDocs = await playerMethod.count(playerQuery);
            const limit = paginateOption.limit;
            const page = paginateOption.page;
            const totalPages = Math.ceil(totalDocs / limit);

            const pagingData = {
                docs: {},
                totalDocs,
                limit,
                totalPages,
                page
            };

            return responseSuccess(res, pagingData);
        } catch (e) {
            return responseError(res, e);
        }
    }

    async onExport(req, res) {
        try {
            const { filter } = utilController?.parseQuery(req.query);
            const query = { _id: req?.authClaims?.id };
            let links = [];
            const EXPORT_LIMIT_PLAYER_REPORT = await configMethod.getValue(constConfig.EXPORT_LIMIT_PLAYER_REPORT);
            const { playerQuery, playerProjection } = await _playerInfoQuery(query, filter);
            req.query.isExport = true;
            let i = 0;
            let skip = 0;
            while (true) {
                const response = await playerMethod.find(playerQuery, playerProjection, skip, EXPORT_LIMIT_PLAYER_REPORT);
                if (response && response.length) {
                    const result = response.map(item => {
                        return {
                            PlayerId: item?.playerId,
                            Name: item?.name,
                            ValidCredit: item?.validCredit.toFixed(3),
                            "Registration Time": utilDate.getDateTzISOString(item?.registrationTime),
                            IsCompleteInfo: item?.isCompleteInfo ? "TRUE" : "FALSE"
                        };
                    });

                    const fileName = `playerInfoReport-${i++}-${String(req?.authClaims?.u)}`;
                    const exportData = await utilExport.exportData(result, fileName);
                    links.push({ link: exportData?.link });
                    skip += EXPORT_LIMIT_PLAYER_REPORT;
                } else {
                    break;
                }
            }
            return responseSuccess(res, links);
        } catch (e) {
            return responseError(res, e);
        }
    }

    async onGetPhoneNumber (req, res) {
        try {
            const decryptPermission = vaultData?.getData()?.["DECRYPT_PERMISSION"];
            if (!decryptPermission) throw (constCommonError.COMMON().PERMISSION)
            const { phoneNumber } = req.body;
            const decryptApi = new FpmsHttp();
            const response = await decryptApi.decryptPhoneNumber({
                phoneNumber: phoneNumber
            });

            return responseSuccess(res, response);
        } catch (e) {
            return responseError(res, e)
        }
    }
}

const playerInfoController = new PlayerInfoController();
module.exports = playerInfoController;
