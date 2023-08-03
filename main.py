import speech_recognition as sr
from pydub import AudioSegment
from torch import nn
import os
import random
import pandas as pd
import wave
from scipy.io import wavfile
import numpy as np
import json
# create RNN
rnn = nn.RNN(10, 20, 2)

# Read TSV file into a DataFrame
df = pd.read_csv("E:\downloads\cv-corpus-12.0-delta-2022-12-07-en\cv-corpus-12.0-delta-2022-12-07\en\\validated.tsv", sep="\t",)
# get all 'sentence' rows
ids = df["path"].tolist()
sentences = df["sentence"].tolist()

clipsDir = "E:\downloads\cv-corpus-12.0-delta-2022-12-07-en\cv-corpus-12.0-delta-2022-12-07\en\clips"

if not os.path.exists("clips"):
    os.mkdir("clips")
# randomClip = random.choice(os.listdir(clipsDir))

    

def audioFunc(filename):
    # Load the MP3 file and convert it to WAV format
    sound = AudioSegment.from_mp3(filename)
    # get data and print it in JSON
    filename = "clips/" + filename.split("\\")[-1].replace(".mp3", ".wav");
    sound.export(filename, format="wav")
    samplerate, data = wavfile.read(filename)
    data = data.astype(np.float32) / np.iinfo(data.dtype).max

    return data
    
clipCount = 100

with open("clips.js", "w") as f:
    f.write("const clips = [")
    for i in ids[:clipCount]:
        output = audioFunc(f"{clipsDir}\\{i}")
        sentence = sentences[ids.index(i)].replace("\"", "\\\"")
        sentence = ''.join(format(i, '08b') for i in bytearray(sentence, encoding ='utf-8'))
        f.write("{")
        f.write(f"\"id\": \"{i}\",")
        f.write(f"\"sentence\": \"{sentence}\",")
        f.write(f"\"data\": {output.tolist()}")
        if ids.index(i) != clipCount - 1:
            f.write("},")
        else:
            f.write("}")
    f.write("]")