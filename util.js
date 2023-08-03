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

// function binaryStringToChar(str) {
//   return String.fromCharCode(parseInt(str));
// }
// function arrToCharArr(arr, length) {
//   if (length) {
//     let newArr = [];
//     for (let i = 0; i < arr.length; i += 8) {
//       newArr.push(arr.slice(i, i + length));
//     }
//     return newArr.map((x) =>
//       binaryStringToChar(x.toString().replaceAll(",", ""))
//     );
//   }
//   arr = arr.split("");
//   return arr.map((x) => binaryStringToChar(x.toString().replaceAll(",", "")));
// }

function binaryToString(binary) {
  let binaryArr = binary.match(/.{1,8}/g); // Split the binary string into groups of 8
  let stringArr = binaryArr.map((bin) => String.fromCharCode(parseInt(bin, 2))); // Convert each group of 8 binary digits to a character
  return stringArr.join(""); // Join the characters together into a string
}
function getWord(word) {
  let index = 0;
  words.forEach((w, i) => {
    if (w.toLowerCase() === word.toLowerCase()) {
      index = i; 
    }
  });
  return index;
}

// Function to convert audio data to a spectrogram
function convertToSpectrogram(audioData, sampleRate, windowSize, hopSize) {
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();
  const offlineAudioContext = new OfflineAudioContext(1, audioData.length, sampleRate);
  const audioBuffer = offlineAudioContext.createBuffer(1, audioData.length, sampleRate);
  const channelData = audioBuffer.getChannelData(0);
  channelData.set(audioData);

  const source = offlineAudioContext.createBufferSource();
  source.buffer = audioBuffer;

  const analyser = offlineAudioContext.createAnalyser();
  analyser.fftSize = windowSize;
  analyser.smoothingTimeConstant = 0;

  source.connect(analyser);
  analyser.connect(offlineAudioContext.destination);

  source.start();

  return new Promise((resolve) => {
    offlineAudioContext.startRendering().then((renderedBuffer) => {
      const bufferLength = renderedBuffer.length;
      const numFrames = Math.floor(bufferLength / hopSize);
      const spectrogram = [];

      for (let i = 0; i < numFrames; i++) {
        const frameData = new Float32Array(windowSize);
        renderedBuffer.copyFromChannel(frameData, 0, i * hopSize);

        const frequencyData = new Float32Array(windowSize / 2);
        analyser.getFloatFrequencyData(frequencyData);

        spectrogram.push(frequencyData);
      }

      resolve(spectrogram);
    });
  });
}

function numToBinary(num) {
  return num.toString(2);
}