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
    this.connections.forEach((connection) => {
      connection.update();
    });
  }
}
