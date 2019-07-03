# -*- coding: utf-8 -*-
'''
Automatically detect common phrases (multiword expressions) from a stream of sentences.
'''
from __future__ import unicode_literals

import sys
reload(sys)
sys.setdefaultencoding('UTF8')

from gensim.models.phrases import Phrases,Phraser

# documents = ["the mayor of new york was there", "machine learning can be useful sometimes","new york mayor was present"]
documents = open('clean-dic-out.txt','r')
sentences_stream = [doc.split(' ') for doc in documents]

# Bigram
bigram = Phrases(sentences_stream, min_count=1, threshold=1, delimiter=b'_')
bigram_phraser = Phraser(bigram)

for sent in sentences_stream:
    bigram_sent = bigram_phraser[sent]
print('\n'.join(bigram_sent))


# Trigram
# trigram = Phrases(bigram_phraser[sentences_stream])
# for sent in sentences_stream:
#     tokens_3 = trigram[bigram_phraser[sent]]
# print('\n'.join(tokens_3))
# ------------------------------
trigram = Phrases(bigram_phraser[sentences_stream], min_count=1, threshold=1, delimiter=b'_')
for sent in sentences_stream:
    tokens_3 = trigram[bigram_phraser[sent]]
print('\n'.join(tokens_3))



# def train_detect(corpora, input_text):
# 
# if __name__ == "__main__":
#     """
#     Just run 'python do-phrase-detection.py corpora.txt input_text.txt'
#     """
#     try:
#         corpora = sys.argv[1]
#         input_text  = sys.argv[2]
#     except:
#         print("Please provice model path and output path")
#     train_detect(corpora, input_text)