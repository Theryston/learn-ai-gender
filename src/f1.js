const fs = require("fs");
const path = require("path");
const csvtojson = require("csvtojson");
const _ = require("lodash");
const brain = require("brain.js");
const getModel = require("./utils/getModel");

async function main() {
  const { filePath, dataName } = handleData();

  const trainingData = await getTrainingData(filePath);

  const modelName = dataName;
  const model = await getModel(modelName);

  const net = new brain.recurrent.LSTM();
  net.fromJSON(model);

  const predictions = trainingData.map((example) => net.run(example.input));

  const correctPredictions = predictions.filter(
    (prediction, index) => prediction === trainingData[index].output
  );

  const correctPercentage =
    (correctPredictions.length / predictions.length) * 100;

  console.log(`Correct percentage: ${correctPercentage.toFixed(2)}%`);
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
