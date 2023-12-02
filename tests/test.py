import string
import random

def r():
    while True:
        yield ''.join([random.choice(string.ascii_letters) for n in range(10)])

def get_words():
    for i in range(1000):
        yield next(r())

words = get_words()
for word in words:
    print(word)

#