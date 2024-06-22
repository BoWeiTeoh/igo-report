import fs from "fs";
import path from "path";

const main = () => {
  let gitBranch = execSyncWrapper("git rev-parse --abbrev-ref HEAD");
  let gitCommitHash = execSyncWrapper("git rev-parse --short=7 HEAD");

  const obj = {
    gitBranch,
    gitCommitHash
  };
  const filePath = path.resolve("src", "generatedGitInfo.json");
  const fileContents = JSON.stringify(obj, null, 2);

  fs.writeFileSync(filePath, fileContents);
};

main();