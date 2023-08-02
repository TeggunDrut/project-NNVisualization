
class Network {
  constructor(layers, options) {
    for (const option in options) {
      this[option] = options[option];
    }
    this.layers = layers;
    layers.forEach((layer) => {
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
}