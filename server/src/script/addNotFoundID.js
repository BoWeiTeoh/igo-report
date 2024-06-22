require("dotenv").config({ path: "../../.env" });
const { initVault } = require("../common/initService");
const dbModel = require("../db/dbModel");

let array = [];
function generateId(roleNumber, type) {
    switch (type) {
        // adminManage
        case "user": {
            return `A${roleNumber.toString().padStart(3, '0')}`;
        }
        case "role": {
            return `R${roleNumber.toString().padStart(3, '0')}`;
        }
    }

}


initVault("script").then(() => {
    randomInsertData().then();
}).catch(e => {
    console.log("initVault adminService", e);
});


const randomInsertData = async () => {
    const users = await dbModel.user.find({ userID: { $exists: false }, ID: { $exists: true } }).lean();
    const roles = await dbModel.role.find({ roleID: { $exists: false } }).lean();

    // 
    try {
        for (let i = 0; i < users.length; i++) {
            let userID = generateId(users[i]?.ID, "user")
            if (!users[i]?.userID) {
                await dbModel.user.updateOne({ _id: users[i]?._id }, { $set: { userID: userID } });
            }
        }
        for (let i = 0; i < roles.length; i++) {
            let roleID = generateId(roles[i]?.ID, "role")
            if (!roles[i]?.roleID) {
                await dbModel.role.updateOne({ _id: roles[i]?._id }, { $set: { roleID: roleID } });
            }
        }
    } catch (e) {
        console.log("err", e);
    }
    await Promise.all(array)
}