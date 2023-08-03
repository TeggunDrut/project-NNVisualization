let inputSize = 50000;
let outputSize = 5000;
let nn = new NeuralNetwork(false, [inputSize, 4, outputSize], false);

let trainingData = [
  { input: [0, 0], output: [0] },
  { input: [0, 1], output: [1] },
  { input: [1, 0], output: [1] },
  { input: [1, 1], output: [0] },
];

async function timer(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function train(
  trainingData,
  options = {
    epochs: 100,
    lr: 0.1,
    threshhold: 0.01,
    logFrequency: 10,
    shouldDraw: false,
  }
) {
  this.epochs = options.epochs;
  this.lr = options.lr;
  this.threshhold = options.threshhold;
  this.logFrequency = options.logFrequency;
  this.shouldDraw = options.shouldDraw;
  this.animationSpeed = options.animationSpeed;

  let start = performance.now();
  for (let i = 0; i < this.epochs; i++) {
    let data = trainingData[Math.floor(Math.random() * trainingData.length)];
    nn.train(data.input, data.output, this.lr, this.shouldDraw);
    if (this.threshhold !== 0 && nn.loss < this.threshhold) {
      console.warn("Finished Early");
      break;
    }
    if (i % this.logFrequency === 0) {
      console.info("Epoch: " + i + "/" + this.epochs + " Loss: " + nn.loss);
    }
    if (this.animationSpeed !== 0) {
      await timer(this.animationSpeed);
    }
  }

  console.warn(
    "Finished",
    "loss =",
    nn.loss.toFixed(10),
    "duration =",
    (performance.now() - start).toFixed(2) + "ms"
  );
}

async function init() {
  // let d = flatten(data);

  // console.log(d);

  let trainingData = [];

  for (let i = 0; i < saved.length; i++) {
    if (saved[i].data.length < inputSize) {
      saved[i].data = saved[i].data.concat(
        Array(inputSize - saved[i].data.length).fill(0)
      );
    }
    trainingData.push({
      input: saved[i].data,
      output: getWord(saved[i].name)
    });
  }

  console.log(trainingData);

  await train(trainingData, {
    epochs: 1000000,
    lr: 0.1,
    threshhold: 0.0001,
    logFrequency: 10,
    shouldDraw: true,
    animationSpeed: 0,
  });

  // console.log(nn.feedforward([0, 0])); // [0.015020775950500727]
  // console.log(nn.feedforward([0, 1])); // [0.9815816381088562]
  // console.log(nn.feedforward([1, 0])); // [0.9871823661268116]
  // console.log(nn.feedforward([1, 1])); // [0.012950087641929467]
  // train on voice data

  // for (const clip of clips) {
  //   let inputMax = nn.weights[0].cols;
  //   // check if data is too small
  //   if (clip.data.length < inputMax) {
  //     // pad with zeros
  //     clip.data = clip.data.concat(Array(inputMax - clip.data.length).fill(0));
  //   }
  //   let outputMax = nn.weights[nn.weights.length - 1].rows;
  //   // check ouput data if data is too small
  //   if (clip.sentence.length < outputMax) {
  //     // pad with zeros
  //     while (clip.sentence.length < outputMax)
  //       clip.sentence = clip.sentence += "0";
  //   }
  //   // convert from string to array of ints
  //   clip.sentence = clip.sentence.split("").map((x) => parseInt(x));
  // }
  // let trainingClips = [];
  // for (let i = 0; i < clips.length; i++) {
  //   trainingClips.push({ input: clips[i].data, output: clips[i].sentence });
  // }
  // await train(trainingClips, {
  //   epochs: 1000,
  //   lr: 0.2,
  //   threshhold: 0.005,
  //   logFrequency: 10,
  //   shouldDraw: true,
  //   animationSpeed: 0,
  // });
  // let result1 = nn.feedforward(clips[0].data, false, true).flat().join("");
  // console.log(binaryToString(result1));

  // let result2 = nn.feedforward(clips[1].data, false, true).flat().join("");
  // console.log(binaryToString(result2));

  // for (let i = 0; i < clips.length; i++) {
  //   let result = nn.feedforward(clips[i].data, false, true).flat().join("");
  //   console.log(
  //     binaryToString(result),
  //     binaryToString(clips[i].sentence.join(""))
  //   );
  // }
}
init();

window.onresize = () => {
  nn.layers.forEach((layer) => {
    layer.update();
  });
};
