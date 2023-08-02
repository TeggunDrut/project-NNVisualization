function transpose(matrix) {
  // Check if input is a 1D array
  if (matrix.length && Array.isArray(matrix[0])) {
    return matrix[0].map((col, i) => matrix.map((row) => row[i]));
  } else {
    // Convert 1D array to 2D array with a single row
    const twoDArray = [matrix];
    return twoDArray[0].map((col, i) => twoDArray.map((row) => row[i]));
  }
}

function matrixSubtract(a, b) {
  return a.map((row, rowIndex) => {
    row.map((val, colIndex) => val - b[rowIndex][colIndex]);
  });
}

function matrixSubtract2(a, b) {
  return a.map(val, (index) => val - b[index]);
}

function matrixSum(matrix, axis) {
  if (axis === 0) {
    return matrix.reduce(
      (acc, row) => row.map((val, colIndex) => val + acc[colIndex]),
      Array(matrix[0].length).fill(0)
    );
  } else if (axis === 1) {
    return matrix.map((row) => row.reduce((acc, val) => val + acc, 0));
  }
}

function matrixAdd(array1, array2) {
  // Check if input arrays are 1D
  if (!Array.isArray(array1[0]) && !Array.isArray(array2[0])) {
    if (array1.length !== array2.length) {
      throw new Error("Arrays must be of the same length");
    }

    return array1.map((val, i) => val + array2[i]);
  }

  // Check if input arrays are 2D
  if (Array.isArray(array1[0]) && Array.isArray(array2[0])) {
    if (
      array1.length !== array2.length ||
      array1[0].length !== array2[0].length
    ) {
      throw new Error("Arrays must have the same dimensions");
    }

    return array1.map((row, i) => row.map((val, j) => val + array2[i][j]));
  }

  throw new Error("Arrays must be either both 1D or both 2D");
}

function matrixMultiplyScalar(matrix, scalar) {
  return matrix.map((row) => row.map((val) => val * scalar));
}

function sumDeltaTimesWeights(layer, neuronIndex) {
  let sum = 0;

  for (let i = 0; i < layer.neurons.length; i++) {
    const neuron = layer.neurons[i];
    sum += neuron.weights[neuronIndex] * neuron.delta;
  }

  return sum;
}

class Neuron {
  constructor(options) {
    for (const option in options) {
      this[option] = options[option];
    }
  }
  create() {
    this.ele = document.createElement("div");
    this.ele.classList.add("neuron");
    let value = document.createElement("div");
    value.classList.add("value");
    value.innerText = this.value;
    // this.ele.appendChild(value);

    return this.ele;
  }
  activation(x) {
    return 1 / (1 + Math.exp(-x)); // sigmoid
  }
  forward(inputs, activate = true) {
    let sum = 0;
    for (let i = 0; i < inputs.length; i++) {
      if (this.weights[i] !== undefined) {
        sum += inputs[i] * this.weights[i];
      } else {
        sum += inputs[i];
      }
    }
    sum += this.bias;
    return activate === true ? this.activation(sum) : sum;
  }
  update() {
    // make only two decimal places
    this.ele.children[0].innerText =
      this.value.toString().split(".")[0] +
      "." +
      this.value.toString().split(".")[1].slice(0, 2);
  }
}

class Layer {
  constructor(options) {
    for (const option in options) {
      this[option] = options[option];
    }
    this.neurons = [];

    this.connections = [];

    this.ele = document.createElement("div");
    this.ele.classList.add("layer");
    document.body.appendChild(this.ele);

    this.update();
  }
  create() {
    for (let i = 0; i < this.size; i++) {
      let neuron = new Neuron({
        value: 0,
        weights: [],
        bias: 0,
      });
      neuron.create();
      if (this.type === "input") {
        neuron.value = 1;
      } else {
        for (
          let j = 0;
          j < this.parent.layers[this.parent.layers.indexOf(this) - 1].size;
          j++
        ) {
          neuron.weights.push(Math.random() * 2 - 1);
        }
        neuron.bias = Math.random() * 2 - 1;
      }
      this.neurons.push(neuron);
    }
    this.update();
  }
  forward(inputs) {
    let outputs = [];
    for (let i = 0; i < this.neurons.length; i++) {
      outputs.push(this.neurons[i].forward(inputs));
    }
    return outputs;
  }
  add(...neurons) {
    for (let i = 0; i < neurons.length; i++) {
      neurons[i].parent = this;
      neurons[i].create();
      this.neurons.push(neurons[i]);
    }
    this.update();
  }
  update() {
    this.ele.innerHTML = "";
    this.neurons.forEach((neuron, i) => {
      if (this.type === "input") neuron.weights = [];
      this.ele.appendChild(neuron.ele);
    });
    this.ele.style.gridTemplateRows = `repeat(${this.neurons.length}, 1fr)`;
    if (this.name) {
      let nameEle = document.createElement("div");
      nameEle.classList.add("name");
      nameEle.innerText = this.name;
      this.ele.appendChild(nameEle);
    }
  }
}
class Connection {
  constructor(options) {
    for (const option in options) {
      this[option] = options[option];
    }
    let from = this.from;
    let to = this.to;

    let fromEle = from.ele;
    let toEle = to.ele;

    let fromRect = fromEle.getBoundingClientRect();
    let toRect = toEle.getBoundingClientRect();

    let fromX = fromRect.x + fromRect.width;
    let fromY = fromRect.y + fromRect.height / 2;
    let toX = toRect.x;
    let toY = toRect.y + toRect.height / 2;

    let distance = Math.sqrt(
      Math.pow(fromX - toX, 2) + Math.pow(fromY - toY, 2)
    );

    let angle = (Math.atan2(toY - fromY, toX - fromX) * 180) / Math.PI;

    this.ele = document.createElement("div");
    this.ele.classList.add("connection");
    this.ele.style.width = `${distance}px`;
    this.ele.style.transform = `translate(${fromRect.x + fromRect.width}px, ${
      fromRect.y + fromRect.height / 2
    }px) rotate(${angle}deg)`;
    this.ele.style.position = "absolute";
    if (this.weight > 0)
      this.ele.style.backgroundColor = `rgba(255, 0, 0, ${Math.abs(
        this.weight / 0.5
      )})`;
    else
      this.ele.style.backgroundColor = `rgba(0, 0, 255, ${Math.abs(
        this.weight / 0.5
      )})`;

    this.ele.innerText = this.weight.toFixed(2);
    document.body.appendChild(this.ele);
  }
  update(draw) {
    if (this.weight > 0)
      this.ele.style.backgroundColor = `rgba(255, 0, 0, ${Math.abs(
        this.weight / 0.5
      )})`;
    else {
      this.ele.style.backgroundColor = `rgba(0, 0, 255, ${Math.abs(
        this.weight / 0.5
      )})`;
    }

    if (draw)
      this.ele.innerText =
        this.weight.toString().split(".")[0] +
        "." +
        this.weight.toString().split(".")[1].slice(0, 2);
    else {
      this.ele.innerText = "";
    }
  }
}

class NeuralNetwork {
  constructor(layerArray, draw = true) {
    this.draw = draw;
    this.layerNodeCounts = layerArray; // no of neurons per layer
    this.layers_count = layerArray.length; //total number of layers

    this.weights = []; //array of weights matrices in order

    const { layerNodeCounts: layerNodeCounts } = this;

    for (let i = 0; i < layerNodeCounts.length - 1; i++) {
      let weights_mat = new Matrix(layerNodeCounts[i + 1], layerNodeCounts[i]);
      weights_mat.randomize();
      this.weights.push(weights_mat);
    }

    this.biases = []; //array of bias matrices in order

    for (let i = 1; i < layerNodeCounts.length; i++) {
      let bias_mat = new Matrix(layerNodeCounts[i], 1);
      bias_mat.randomize();
      this.biases.push(bias_mat);
    }

    NeuralNetwork.SIGMOID = 1;
    NeuralNetwork.ReLU = 2;

    this.activation = null;
    this.activation_derivative = null;
    this.setActivation(NeuralNetwork.SIGMOID);
    this.learningRate = 0.2;
    this.loss = 0;

    this.layers = [];
    this.connections = [];

    for (let i = 0; i < layerArray.length; i++) {
      this.layers.push(
        new Layer({
          type:
            i == 0 ? "input" : i == layerArray.length - 1 ? "output" : "hidden",
          name:
            i == 0 ? "Input" : i == layerArray.length - 1 ? "Output" : "Hidden",
          size: layerArray[i],
        })
      );
    }
    this.layers.forEach((layer) => {
      layer.parent = this;
    });

    this.init();

    for (let i = 0; i < this.layers.length; i++) {
      if (i < this.layers.length - 1) {
        for (let j = 0; j < this.layers[i].neurons.length; j++) {
          for (let k = 0; k < this.layers[i + 1].neurons.length; k++) {
            // log current layer
            let con = new Connection({
              weight: this.layers[i + 1].neurons[k].weights[j],
              from: this.layers[i].neurons[j],
              to: this.layers[i + 1].neurons[k],
            });
            // add connection to layer where the from neuron is located
            this.layers[i].connections.push(con);
          }
        }
      }
    }
  }
  init() {
    this.layers.forEach((layer) => {
      layer.create();
    });
  }
  // draw(ctx, x, y, input_array = undefined, neuron_radius = 20) {
  //   let neuronStates = undefined;
  //   if (input_array)
  //     neuronStates = this.feedforward(input_array, true).map((m) =>
  //       m.toArray()
  //     );
  //   const NR = neuron_radius;
  //   const PADX = 6 * NR; // Padding between neurons in X direction
  //   const PADY = 3 * NR; // Padding between neurons in Y direction
  //   const MAXLS = Math.max(...this.layerNodeCounts); // height of largest layer
  //   const YOFFSETS = this.layerNodeCounts.map(
  //     (c) => (MAXLS - c) * 0.5 * (NR + PADY)
  //   ); // offsets for layers to keep symmetry
  //   const color = function (v, { invert = false, alpha = 1 } = {}) {
  //     let h = v < 0 ? 200 : 0; // hue value: blue'ish for negative, red'ish for positive
  //     if (invert) h = (h + 180) % 360;
  //     return `hsl(${h},100%,${Math.round(Math.abs(v) * 100)}%, ${alpha})`;
  //   };
  //   const linePointOnCircle = function (cx, cy, r, lx1, ly1, lx2, ly2) {
  //     const a = Math.atan2(ly2 - ly1, lx2 - lx1);
  //     return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
  //   };
  //   ctx.save();
  //   for (let layerIdx = 0; layerIdx < this.layerNodeCounts.length; layerIdx++) {
  //     for (
  //       let neuronIdx = 0;
  //       neuronIdx < this.layerNodeCounts[layerIdx];
  //       neuronIdx++
  //     ) {
  //       const cx = x + layerIdx * (NR + PADX) + NR;
  //       const cy = YOFFSETS[layerIdx] + y + neuronIdx * (NR + PADY) + NR;
  //       if (layerIdx < this.layerNodeCounts.length - 1) {
  //         for (
  //           let nextNeuronIdx = 0;
  //           nextNeuronIdx < this.layerNodeCounts[layerIdx + 1];
  //           nextNeuronIdx++
  //         ) {
  //           const ncx = x + (layerIdx + 1) * (NR + PADX) + NR;
  //           const ncy =
  //             YOFFSETS[layerIdx + 1] + y + nextNeuronIdx * (NR + PADY) + NR;
  //           const start = linePointOnCircle(cx, cy, NR, cx, cy, ncx, ncy);
  //           const end = linePointOnCircle(ncx, ncy, NR, ncx, ncy, cx, cy);
  //           ctx.beginPath();
  //           ctx.moveTo(...start);
  //           ctx.lineTo(...end);
  //           ctx.lineWidth = 2;
  //           ctx.strokeStyle = color(
  //             this.weights[layerIdx].data[nextNeuronIdx][neuronIdx],
  //             { alpha: 0.75 }
  //           ); // TODO swap?
  //           ctx.stroke();
  //         }
  //       }
  //       ctx.beginPath();
  //       ctx.arc(cx, cy, NR, 0, 2 * Math.PI, false);
  //       ctx.fillStyle = neuronStates
  //         ? color(neuronStates[layerIdx][neuronIdx], { alpha: 0.5 })
  //         : "#33333377";
  //       ctx.strokeStyle = neuronStates
  //         ? color(neuronStates[layerIdx][neuronIdx], { alpha: 0.75 })
  //         : "#333333C0";
  //       ctx.stroke();
  //       ctx.fill();
  //       ctx.font = `${NR * 0.5}px Monospace`;
  //       if (neuronStates) {
  //         const ns = neuronStates[layerIdx][neuronIdx];
  //         const nsText = Math.round(ns * 1000) / 1000;
  //         ctx.fillStyle = color(ns, { invert: true });
  //         ctx.fillText(
  //           nsText,
  //           cx - ctx.measureText(nsText).width / 2,
  //           cy + NR * 0.25
  //         );
  //       }
  //       if (layerIdx > 0) {
  //         const bias = this.biases[layerIdx - 1].data[neuronIdx];
  //         const biasText = "B " + Math.round(bias * 1000) / 1000;
  //         ctx.fillStyle = color(bias);
  //         ctx.fillText(
  //           biasText,
  //           cx - ctx.measureText(biasText).width / 2,
  //           cy + NR + PADY * 0.25
  //         );
  //       }
  //     }
  //   }
  //   ctx.restore();
  // }

  feedforward(input_array, GET_ALL_LAYERS) {
    const { layers_count } = this;

    if (!this.feedforwardArgsValidator(input_array)) {
      return -1;
    }

    let layers = []; //This will be array of layer arrays

    //input layer
    layers[0] = Matrix.fromArray(input_array);

    for (let i = 1; i < layers_count; i++) {
      layers[i] = Matrix.multiply(this.weights[i - 1], layers[i - 1]);
      layers[i].add(this.biases[i - 1]);
      layers[i].map(this.activation); //activation
    }
    if (GET_ALL_LAYERS == true) {
      return layers; //all layers (array of layer matrices)
    } else {
      return layers[layers.length - 1].toArray(); //output layer array
    }
  }

  // Mutates weights and biases of ANN based on rate given
  mutate(rate) {
    //rate 0 to 1
    function mutator(val) {
      if (Math.random() < rate) {
        return val + Math.random() * 2 - 1;
      } else {
        return val;
      }
    }

    for (let i = 0; i < this.weights.length; i++) {
      this.weights[i].map(mutator);
      this.biases[i].map(mutator);
    }
  }

  // Returns a copy of ANN (instead of reference to original one)
  copy() {
    let new_ann = new NeuralNetwork(this.layerNodeCounts);
    for (let i = 0; i < new_ann.weights.length; i++) {
      new_ann.weights[i] = this.weights[i].copy();
    }
    for (let i = 0; i < new_ann.biases.length; i++) {
      new_ann.biases[i] = this.biases[i].copy();
    }
    return new_ann;
  }

  // Trains with backpropogation
  train(inputs, targets, lr = 0.1, log = false) {
    if (!this.trainArgsValidater(inputs, targets)) {
      return -1;
    }

    let layers = this.feedforward(inputs, true); //layer matrices
    let target_matrix = Matrix.fromArray(targets);

    let prev_error;

    for (let layer_index = layers.length - 1; layer_index >= 1; layer_index--) {
      /* right and left are in respect to the current layer */
      let layer_matrix = layers[layer_index];

      let layer_error;
      //Error calculation
      if (layer_index == layers.length - 1) {
        // Output layer
        layer_error = Matrix.add(
          target_matrix,
          Matrix.multiply(layer_matrix, -1)
        );
      } else {
        //Hidden layer
        const right_weights = this.weights[layer_index];
        const right_weigths_t = Matrix.transpose(right_weights);
        layer_error = Matrix.multiply(right_weigths_t, prev_error);
      }
      prev_error = layer_error.copy(); //will be used for error calculation in hidden layers

      //Calculating layer gradient
      const layer_gradient = Matrix.map(
        layer_matrix,
        this.activation_derivative
      );
      layer_gradient.multiply(layer_error);
      layer_gradient.multiply(lr);

      //Calculating delta weights
      const left_layer_t = Matrix.transpose(layers[layer_index - 1]);
      const left_weights_delta = Matrix.multiply(layer_gradient, left_layer_t);

      //Updating weights and biases
      this.weights[layer_index - 1].add(left_weights_delta);
      this.biases[layer_index - 1].add(layer_gradient);

      // calcuate loss
      let prediction = Matrix.fromArray(this.feedforward(inputs));
      let expected = Matrix.fromArray(targets);
      let difference = Matrix.subtract(prediction, expected);
      this.loss = difference.data[0][0] * difference.data[0][0];

      // update connections
      for (let i = 0; i < this.weights.length; i++) {
        let matrix = this.weights[i];
        for (let j = 0; j < matrix.data.length; j++) {
          // 8
          let weightArr = matrix.data[j]; // array of 2 items
          for (let k = 0; k < weightArr.length; k++) {
            // 2
            let connection = this.layers[i].connections[j * 2 + k];
            connection.weight = weightArr[k];
            connection.update();
          }
        }
      }
    }
  }

  activation(x) {
    return this.activation(x);
  }

  setActivation(TYPE) {
    switch (TYPE) {
      case NeuralNetwork.SIGMOID:
        this.activation = NeuralNetwork.sigmoid;
        this.activation_derivative = NeuralNetwork.sigmoid_derivative;
        break;
      case NeuralNetwork.ReLU:
        this.activation = NeuralNetwork.relu;
        this.activation_derivative = NeuralNetwork.relu_derivative;
        break;
      default:
        console.error("Activation type invalid, setting sigmoid by default");
        this.activation = NeuralNetwork.sigmoid;
        this.activation_derivative = NeuralNetwork.sigmoid_derivative;
    }
  }

  crossover(ann) {
    if (!this.crossoverValidator(ann)) {
      return -1;
    }
    const offspring = new NeuralNetwork(this.layerNodeCounts);
    for (let i = 0; i < this.weights.length; i++) {
      if (Math.random() < 0.5) {
        offspring.weights[i] = this.weights[i];
      } else {
        offspring.weights[i] = ann.weights[i];
      }

      if (Math.random() < 0.5) {
        offspring.biases[i] = this.biases[i];
      } else {
        offspring.biases[i] = ann.biases[i];
      }
    }
    return offspring;
  }

  static sigmoid(x) {
    return 1 / (1 + Math.exp(-1 * x));
  }

  static sigmoid_derivative(y) {
    return y * (1 - y);
  }

  static relu(x) {
    if (x >= 0) {
      return x;
    } else {
      return 0;
    }
  }

  static relu_derivative(y) {
    if (y > 0) {
      return 1;
    } else {
      return 0;
    }
  }

  // Argument validator functions
  feedforwardArgsValidator(input_array) {
    let invalid = false;
    if (input_array.length != this.layerNodeCounts[0]) {
      invalid = true;
      console.error(
        "Feedforward failed : Input array and input layer size doesn't match."
      );
    }
    return invalid ? false : true;
  }

  trainArgsValidater(input_array, target_array) {
    let invalid = false;
    if (input_array.length != this.layerNodeCounts[0]) {
      console.error(
        "Training failed : Input array and input layer size doesn't match."
      );
      invalid = true;
    }
    if (target_array.length != this.layerNodeCounts[this.layers_count - 1]) {
      invalid = true;
      console.error(
        "Training failed : Target array and output layer size doesn't match."
      );
    }
    return invalid ? false : true;
  }

  crossoverValidator(ann) {
    let invalid = false;
    if (ann instanceof NeuralNetwork) {
      if (this.layers_count == ann.layers_count) {
        for (let i = 0; i < this.layers_count; i++) {
          if (this.layerNodeCounts[i] != ann.layerNodeCounts[i]) {
            console.error(
              "Crossover failed : Architecture mismatch (Different number of neurons in one or more layers)."
            );
            invalid = true;
            break;
          }
        }
      } else {
        invalid = true;
        console.error(
          "Crossover failed : Architecture mismatch (Different number of layers)."
        );
      }
    } else {
      invalid = true;
      console.error("Crossover failed : NeuralNetwork object expected.");
    }
    return invalid ? false : true;
  }
}
