require("dotenv").config({ path: "../.env" });
const fs = require("fs");
const permissionsSeeder = require("./seeder/permissionsSeeder");
const resourceMethod = require("../component/resource/resourceMethod");
const permissionMethod = require("../component/permission/permissionMethod");
const {logger} = require("../helper/utilPinoLogger");

const createPermissionsConst = async () => {
  logger.info({"dir": process.cwd()});
  logger.info({"PermissionsSeeder": permissionsSeeder});
  try {
    const permissionGroup = [];
    const obj = {};
    for (const seed of permissionsSeeder) {
      const resourceData = await resourceMethod.findOne({ name: seed.resource });
      logger.info({ResourceData: resourceData});
      if (!resourceData) {
        logger.error(`WARNING! YOU HAVE NEW RESOURCE ${seed.resource} ADDED, please generate to DB first`);
      }

      if (resourceData) {
        const permissions = await permissionMethod.find({
          resource: resourceData?._id,
          name: seed.permissions
        });

        const resourceName = resourceData.name?.toUpperCase();
        permissions.forEach((p) => {
          const permissionName = p.name?.toUpperCase();
          if (resourceName && permissionName) {
            const key = `${resourceName}_${permissionName}`;
            obj[key] = `${resourceData?.name}_${p.name}`;
          }
        });

        permissionGroup.push({
          resource: seed.resource,
          permissions
        });

        logger.info({"permissionGroup": permissionGroup});
      }
    }
    logger.info({CreatePermissionsConst: obj});
    return obj;
  } catch (e) {
    logger.error({err: e});
  }
};

const getPermissionContent = async () => {
  try {
    const obj = await createPermissionsConst();
    return `const constPermissions = ${JSON.stringify(obj)};` + "\n" + "module.exports=constPermissions;" + "\n";
  } catch (e) {
    logger.error({err: e});
  }
};

const generatePermissionsConst = async () => {
  try {
    const content = await getPermissionContent();
    fs.writeFileSync(process.cwd() + "/src/const/constPermissions2.js", content, (err) => {
      if (err) {
        logger.error({"Server permission": `\n${err}`
      });
      }
    });
  } catch (e) {
    logger.error({"err": e});
  } finally {
    process.exit();
  }
};

generatePermissionsConst().catch();
