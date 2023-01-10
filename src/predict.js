const brain = require("brain.js");
const getModel = require("./utils/getModel");

async function main() {
  const modelName = process.argv[2];
  const model = await getModel(modelName);

  const net = new brain.recurrent.LSTM();
  net.fromJSON(model);

  const name = process.argv[3];

  console.time("Time to predict gender");
  const output = net.run(name);
  console.timeEnd("Time to predict gender");

  console.log(`Gender: ${output}`);
}

main();
