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
