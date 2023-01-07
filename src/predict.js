const brain = require("brain.js");
const getModel = require("./utils/getModel");

async function main() {
  const modelName = process.argv[2];
  const model = await getModel(modelName);

  const net = new brain.recurrent.LSTM();
  net.fromJSON(model);

  const name = process.argv[3];

  const output = net.run(name);

  console.log(`Gender: ${output}`);
}

main();
