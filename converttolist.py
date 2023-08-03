# this file will convert the data from a html docuemtn to a list

import urllib.request

url = "https://raw.githubusercontent.com/scott-fleischman/all-english-words/master/all_english_words.txt"


def convertToList(url):
    response = urllib.request.urlopen(url)
    data = response.read()
    text = data.decode("utf-8")
    words = text.split()
    return words

with open("words.js", "w") as f:
  f.write("var words = " + str(convertToList(url)) + ";")
  