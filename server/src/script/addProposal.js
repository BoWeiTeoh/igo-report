require("dotenv").config({ path: "../../.env" });
const { initVault } = require("../common/initService");
const { logger } = require("../helper/utilPinoLogger");
const dbModel = require("../db/dbModel");
const proposalDB = dbModel?.proposal;
const crypto = require("crypto");
const constDepositType = require("../const/constDepositType");
const constWithdrawType = require("../const/constWithdrawType");
let running = true; // Flag to control the loop

initVault("script")
    .then(() => {
        // Start the loop
        runLoop().then(() => {
            logger.info("Data insertion completed.");
        });
    })
    .catch((e) => {
        logger.error({ "initVault adminService": e });
        running = false;
    });

const runLoop = async () => {
    while (running) {
        try {
            const player = await dbModel.player.find({}).lean();
            const platforms = await dbModel.platform.find({}, { _id: 1 }).lean();
            const platformObjIds = platforms.map(platform => platform._id);
            const proposalTypeQuery = {
                $or: [
                    { name: { $in: [...constDepositType, ...constWithdrawType] } }
                ],
                platformId: { $in: platformObjIds }
            };

            const proposalTypes = await dbModel.proposalType.find(proposalTypeQuery, {_id:1, name:1}).lean();
            await randomInsertData(player, proposalTypes);
        } catch (error) {
            logger.error({ "randomInsertData error": error });
        }
    }
};
let proposalIdCounter = crypto.randomInt(6);
const randomInsertData = async (player, proposal) => {
    const batchSize = 300000;

    const status = ["Success", "Approved", "PrePending", "Fail"];
    const mainType = ["TopUp", "PlayerBonus"];

    const playerCount = player.length;
    for (let i = 0; i < batchSize; i++) {
        const randomPlayerIndex = Math.floor(Math.random() * playerCount);
        const randomPlayer = player[randomPlayerIndex];
        const randomStatus = status[Math.floor(Math.random() * status.length)];
        const randomMainType = mainType[Math.floor(Math.random() * mainType.length)];
        const randomProposalIndex = Math.floor(Math.random() * proposal.length);
        const randomProposal = proposal[randomProposalIndex];
        const date = new Date(Date.now() - Math.floor(Math.random() * 31536000000));
        const arrData = new proposalDB({
            type: randomProposal?._id,
            mainType: randomMainType,
            status: randomStatus,
            proposalId: proposalIdCounter++,
            priority: "0",
            entryType: "1",
            userType: "2",
            noSteps: true,
            processedTimes: 0,
            inputDevice: 0,
            isSending: false,
            data: {
                playerObjId: randomPlayer?._id,
                playerName: randomPlayer?.name,
                updateAmount: Math.floor(Math.random() * randomPlayer?.validCredit) - 1,
                curAmount: 0,
                remark: "1",
                adminName: "admin",
                creditChangeType: randomProposal?.name,
                isShadowAccount: false,
                amount: randomPlayer?.validCredit,
                platformId: randomPlayer?.platform,
                firstTopUp: true,
                playerRegisterTime: randomPlayer?.registrationTime,
                proposalPlayerLevelValue: 0,
                playerLevelName: "普通会员",
                proposalPlayerLevel: "普通会员",
                isStressTestPlayer: false,
            },
            createTime: date,
        });

        // Insert data into database
        await arrData.save();
    }
    logger.info({"Insert": batchSize});
};
