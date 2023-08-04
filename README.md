## speech recognition crap.
### -= Dataset =-
> The dataset I will be using is from Mozzila.org's, "Common Voice" project.
The datsets inlcude people from all around the world saying a sentence.

### -= Training =-
> To train this damn thing, I will take random clips from the `training` set and run them through the nerual network using the sentence converted in a specific way for the NN.

### -= Data Preprocessing =-
> In order to train this thing, I will do the following to the data:
- Convert mp3 or whatever sort of audio file to .wav
- Convert .wav to spectogram or whatever
- Convert sentence to list of binary sets.
  - Take sentence like this: "hello world"
  - Assign each word a index
  - Convert index to binary or something
  - Feed that as output

### -= Nerual Network =-
> The nerual network will be a simple CNN with a few layers.
- Input: Spectogram
- Output: Binary list of words
- Loss: Binary Cross Entropy
- Optimizer: Adam
- Activation: ReLU
