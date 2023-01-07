const fs = require("fs");
const path = require("path");

module.exports = async function getModel(modelName) {
  const modelFolder = path.join(__dirname, "..", "models");
  if (!fs.existsSync(modelFolder)) {
    fs.mkdirSync(modelFolder);
  }

  const modelPath = path.join(modelFolder, `/${modelName}.json`);
  const modelContent = fs.readFileSync(modelPath, "utf8");
  const model = JSON.parse(modelContent);
  return model;
};
