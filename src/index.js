const fs = require("fs");
const path = require("path");
const csvtojson = require("csvtojson");
const _ = require("lodash");
const brain = require("brain.js");
const handleVisualElapsed = require("./utils/handleVisualElapsed");

async function main() {
  const { filePath, dataName } = handleData();

  const trainingData = await getTrainingData(filePath);

  const net = new brain.recurrent.LSTM({
    hiddenLayers: [64, 64],
    learningRate: 0.001,
  });

  console.log(`Starting training for ${dataName}...`);
  const startTime = Date.now();
  net.train(trainingData, {
    log: true,
    logPeriod: 1,
    iterations: 1000,
  });
  const endTime = Date.now();
  const visualElapsed = await handleVisualElapsed(endTime, startTime);
  console.log(`Training time ${visualElapsed}`);

  await saveModel(net, dataName);

  const output = net.run("João");
  console.log(`Output: ${output}`);
}

async function saveModel(net, modelName) {
  const model = net.toJSON();
  const modelFolder = path.join(__dirname, "models");
  if (!fs.existsSync(modelFolder)) {
    fs.mkdirSync(modelFolder);
  }

  const modelPath = path.join(modelFolder, `/${modelName}.json`);
  fs.writeFileSync(modelPath, JSON.stringify(model));
}

async function getTrainingData(filePath) {
  const data = fs.readFileSync(filePath, "utf8");
  const rows = await csvtojson().fromString(data);

  const trainingData = _.shuffle(
    rows.map((row) => ({
      input: row.name,
      output: row.gender,
    }))
  );

  return trainingData;
}

function handleData() {
  const dataName = process.argv[2];
  if (!dataName) {
    console.log("Please provide a data name like: pnpm start brazil_1k");
    return;
  }

  const filePath = path.join(__dirname, "data", `/${dataName}.csv`);

  if (!fs.existsSync(filePath)) {
    console.log(`File ${filePath} does not exist`);
    return;
  }

  return {
    filePath,
    dataName,
  };
}

main();
