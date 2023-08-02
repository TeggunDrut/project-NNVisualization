// let net = new Network([
//   new Layer({
//     type: "input",
//     name: "Input",
//     size: 2,
//   }),
//   new Layer({
//     type: "hidden",
//     name: "Hidden",
//     size: 2,
//   }),
//   new Layer({
//     type: "output",
//     name: "Output",
//     size: 1,
//   }),
// ]);

// for(let i = 0; i < 10000; i++) {
//   net.backpropagate([[0], [0]], [0]);
// }

// // net.train([0, 0], [0])
// // net.train([0, 1], [1])
// // net.train([1, 0], [1])
// // net.train([1, 1], [0])

// // console.log(net.forward([0, 0]))
// // console.log(net.forward([0, 1]))
// // console.log(net.forward([1, 0]))
// // console.log(net.forward([1, 1]))
// brainjs
// let nn = new brain.NeuralNetwork({
//   inputSize: 2,
//   outputSize: 1,
//   hiddenLayers: [2],
//   activation: "sigmoid",
// });

// let trainingData = [
//   { input: [0, 0], output: [0] },
//   { input: [0, 1], output: [1] },
//   { input: [1, 0], output: [1] },
//   { input: [1, 1], output: [0] },
// ];

// for (let i = 0; i < 10000; i++) {
//   nn.train(trainingData);
// }

// console.log(nn.run([0, 0])); // [0.015020775950500727]
// console.log(nn.run([0, 1])); // [0.9815816381088562]
// console.log(nn.run([1, 0])); // [0.9871823661268116]
// console.log(nn.run([1, 1])); // [0.012950087641929467]

let nn = new NeuralNetwork([2, 8, 8, 8, 1], false);

let trainingData = [
  { input: [0, 0], output: [0] },
  { input: [0, 1], output: [1] },
  { input: [1, 0], output: [1] },
  { input: [1, 1], output: [0] },
];

async function timer(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function train(epochs, lr=.1, log=false) {
  for (let i = 0; i < epochs; i++) {
    let data = trainingData[Math.floor(Math.random() * trainingData.length)];
    nn.train(data.input, data.output, lr, true);
    if(log) console.log("Loss: " + nn.loss)
    await timer(1);
  }
}

async function init() {
  await train(10000, .1, true)
  
  console.log(nn.feedforward([0, 0])); // [0.015020775950500727]
  console.log(nn.feedforward([0, 1])); // [0.9815816381088562]
  console.log(nn.feedforward([1, 0])); // [0.9871823661268116]
  console.log(nn.feedforward([1, 1])); // [0.012950087641929467]
}

init()

