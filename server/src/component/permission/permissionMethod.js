const permissionsSeeder = require("../../script/seeder/permissionsSeeder");
const dbModel = require("../../db/dbModel");
const resourceMethod = require("../resource/resourceMethod");
const prettier = require("prettier");
const fs = require("fs");
const {logger} = require("../../helper/utilPinoLogger");

const createPermissions = async () => {
  try {
    for (const seed of permissionsSeeder) {
      let resource = await dbModel.resource.findOne({
        name: seed?.resource
      });
      if (!resource) {
        resource = await dbModel.resource.create({
          name: seed?.resource
        });
      }

      for (const permission of seed?.permissions) {
        try {
          let response = await dbModel.permission.findOne({
            name: permission,
            resource: resource?._id
          });
          if (response) {
            console.log("permission exist", response?._id, response?.name);
          } else {
            response = await dbModel.permission.create({
              name: permission,
              resource: resource?._id
            });
            console.log("permission created", response?._id, resource?.name, response?.resource);
          }
        } catch (e) {
          logger.info({"Permission create err": e});
        }
      }
    }
  } catch (e) {
    logger.error({"CreatePermissions error": e});
    throw e;
  }
};

const find = (query = {}, filter = {}) => {
  return dbModel?.permission?.find(query, filter).lean();
};

const createPermissionsConst = async () => {
  try {
    const obj = {};
    for (const seed of permissionsSeeder) {
      const resourceData = await resourceMethod.findOne({ name: seed.resource });
      if (!resourceData) {
        logger.error(`WARNING! YOU HAVE NEW RESOURCE ${seed.resource} ADDED, please generate to DB first`);
      }

      if (resourceData) {
        const permissions = await find({
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
      }
    }
    return obj;
  } catch (e) {
    logger.error({"CreatePermissionConst": e});
  }
};

const getPermissionContent = async () => {
  try {
    const obj = await createPermissionsConst();
    const serverPermission = `const constPermissions = ${JSON.stringify(obj)};` + "\n" + "module.exports=constPermissions;" + "\n";
    const webPermission = `const constPermissions = ${JSON.stringify(obj)};` + "\n" + "export default constPermissions;" + "\n";
    return { serverPermission, webPermission };
  } catch (e) {
    logger.error({"GetPermission": e});
  }
};

const generatePermissionsConst = async () => {
  try {
    const { serverPermission, webPermission } = await getPermissionContent();

    const serverFormattedContent = await prettier.format(serverPermission, {
      parser: "babel", // You can specify the parser you prefer (e.g., 'babel', 'typescript')
      singleQuote: true, // Use single quotes
      trailingComma: "all" // Add trailing commas
    });
    const webFormattedContent = await prettier.format(webPermission, {
      parser: "babel", // You can specify the parser you prefer (e.g., 'babel', 'typescript')
      singleQuote: true, // Use single quotes
      trailingComma: "all" // Add trailing commas
    });

    // fs.writeFileSync(process.cwd() + "/src/const/constPermissions2.js", serverFormattedContent, (err) => {
    //   if (err) {
    //     console.error("server permission", `\n${err}`);
    //   }
    // });
    //
    // fs.writeFileSync(process.cwd() + "/../web/src/const/constPermissions2.js", webFormattedContent, (err) => {
    //   if (err) {
    //     console.error("server permission", `\n${err}`);
    //   }
    // });
  } catch (e) {
    logger.error({"GeneratePermission": e});
  } finally {
    process.exit();
  }
};

const PermissionMethod = {
  createPermissions,
  find,
  generatePermissionsConst
};

module.exports = PermissionMethod;
