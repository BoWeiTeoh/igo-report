require("dotenv").config({ path: "../../.env" });
const { initVault } = require("../common/initService");
const dbModel = require("../db/dbModel");
const PlayerCreditTransferLog = dbModel.playerCreditTransferLog;

initVault("script")
    .then(() => {
        randomInsertData().then(() => {
            console.log("Data insertion completed.");
        });
    })
    .catch((e) => {
        console.log("initVault adminService", e);
    });

const recordsPerBatch = 100000; // Number of records to insert in each batch

const randomInsertData = async () => {
    const platformId = process.argv[2] || "50";
    const platforms = await dbModel.platform.find({}, { platformId: 1 }).lean();
    const platformIds = platforms.map(platform => platform.platformId); // Extracting platformIds
    const provider = await dbModel.supplier.find({}, { providerId: 1 }).lean();
    const providerIds = provider.map(provider => provider.providerId);
    // Array of possible types
    const types = ["transferIn", "transferOut", "TransferIn", "TransferOut"];
    const status = ["1","2","3"]

    while (true) {
        const batchInserts = [];
        for (let j = 0; j < recordsPerBatch; j++) {
            // Random providerId and platformId
            const randomProviderId = providerIds[Math.floor(Math.random() * providerIds.length)];
            const randomPlatformId = platformIds[Math.floor(Math.random() * platformIds.length)]; // Selecting from platformIds
            const playerName = "fgtesty" + String(Math.floor(Math.random() * 10000) + 10001);
            const playerId = await dbModel.player.findOne({ name: playerName }, { _id: 1, playerId: 1 }).lean();
            if (!playerId) {
                continue;
            }
            const randAmount = Math.floor(Math.random() * 10000) + 1;
            const rand = Math.floor(Math.random() * 999999999);

            // Generate a random type
            const randomType = types[Math.floor(Math.random() * types.length)];
            const randomStatus = status[Math.floor(Math.random() * status.length)];
            // Generate a random date within the last year
            const date = new Date(Date.now() - Math.floor(Math.random() * 31536000000)); // Milliseconds in a year

            const result = String(Math.floor(Math.random() * 999999999));

            // Find the platform object associated with the randomPlatformId
            const randomPlatform = platforms.find(platform => platform.platformId === randomPlatformId);
            const platformObjId = randomPlatform._id;
            const logData = new PlayerCreditTransferLog({
                playerObjId: playerId._id,
                platformObjId: platformObjId, // Assign the found platformObjId
                playerName: playerName,
                adminName: "super-admin",
                playerId: playerId.playerId?.toString() || result,
                platformId: randomPlatformId.toString(),
                type: randomType, // Use the randomly selected type
                transferId: "transfer_" + rand.toString(),
                providerId: randomProviderId.toString(),
                amount: randAmount,
                lockedAmount: 0,
                createTime: date,
                apiRes: {},
                data: {},
                status: randomStatus,
                isRepaired: false,
                bUsed: false,
                isEbet: false,
            });
            batchInserts.push(logData);
        }
        await PlayerCreditTransferLog.insertMany(batchInserts);
        console.log("Inserted", recordsPerBatch, "records");
    }
}