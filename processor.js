const inputs = [];
class WorkletProcessor extends AudioWorkletProcessor {
  process(i, outputs, parameters) {
    // Do something with the data, e.g. convert it to WAV
    console.log(i);
    return true;
  }
  
}

registerProcessor("worklet-processor", WorkletProcessor);
