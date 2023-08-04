import torch
import torch.nn as nn
import numpy as np


# create Neural Network
class NeuralNet(nn.Module):
    def __init__(self, input_size, hidden_size, num_classes):
        super(NeuralNet, self).__init__()
        self.l1 = nn.Linear(input_size, hidden_size)
        self.relu = nn.ReLU()
        self.l2 = nn.Linear(hidden_size, num_classes)

    def forward(self, x):
        out = self.l1(x)
        out = self.relu(out)
        out = self.l2(out)
        return out

    def predict(self, x):
        # apply softmax to output
        pred = torch.softmax(self.forward(x), dim=1)
        ans = []
        for t in pred:
            if t[0] > t[1]:
                ans.append(0)
            else:
                ans.append(1)
        return torch.tensor(ans)

    def backpropagation(self, x, y, optimizer):
        # forward pass
        y_pred = self.forward(x)
        # compute loss
        criterion = nn.CrossEntropyLoss()
        loss = criterion(y_pred, y)
        # backward pass
        optimizer.zero_grad()
        loss.backward()
        optimizer.step()

        return loss.item()

    def train(self, x, y, optimizer, epochs):
        for epoch in range(epochs):
            loss = self.backpropagation(x, y, optimizer)
            print("epoch: ", epoch, " loss: ", loss)


neuralnetwork = NeuralNet(2, 5, 2)

# create data
x = torch.tensor([[0, 0], [0, 1], [1, 0], [1, 1]], dtype=torch.float32)
y = torch.tensor([0, 1, 1, 0], dtype=torch.long)

# train model
optimizer = torch.optim.Adam(neuralnetwork.parameters(), lr=0.01)
neuralnetwork.train(x, y, optimizer, 1000)

# test model
x_test = torch.tensor([[0, 0], [0, 1], [1, 0], [1, 1]], dtype=torch.float32)
print(neuralnetwork.predict(x_test))
