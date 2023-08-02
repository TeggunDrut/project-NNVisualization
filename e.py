import numpy as np

def sigmoid(x):
    return 1.0/(1+ np.exp(-x))

def sigmoid_derivative(x):
    return x * (1.0 - x)

class NeuralNetwork:
    def __init__(self, x, y, layers):
        self.input      = x
        self.layers     = self.init_layers(layers)
        self.y          = y
        self.output     = np.zeros(self.y.shape)

    def init_layers(self, layers):
        weights = []
        for i in range(len(layers) - 1):
            weight = np.random.rand(layers[i], layers[i+1])
            weights.append(weight)
        return weights

    def feedforward(self):
        self.layer_values = [self.input]
        for i in range(len(self.layers)):
            self.layer_values.append(sigmoid(np.dot(self.layer_values[i], self.layers[i])))

    def backprop(self):
        deltas = [2*(self.y - self.output) * sigmoid_derivative(self.output)]
        for i in range(len(self.layers) - 1, 0, -1):
            deltas.append(np.dot(deltas[-1], self.layers[i].T) * sigmoid_derivative(self.layer_values[i]))
        deltas.reverse()

        for i in range(len(self.layers)):
            self.layers[i] += np.dot(self.layer_values[i].T, deltas[i])

if __name__ == "__main__":
    X = np.array([[0,0],[0,1],[1,0],[1,1]])
    y = np.array([[0],[1],[1],[0]])

    nn = NeuralNetwork(X, y, [2])

    for i in range(1500):
        nn.feedforward()
        nn.backprop()

    print(nn.output)
