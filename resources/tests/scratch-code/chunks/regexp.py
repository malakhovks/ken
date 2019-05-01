from __future__ import unicode_literals
import spacy, re
from spacy.symbols import *

NLP_EN = spacy.load('en_core_web_sm')

# doc = NLP_EN('Python is a high-level programming language for the natural language processing pipeline.')

def filtered_chunks(doc, pattern):
  for chunk in doc.noun_chunks:
    signature = ''.join(['<%s>' % w.tag_ for w in chunk])
    if pattern.match(signature) is not None:
      yield chunk
doc = NLP_EN('Python is a high-level programming language for the natural language processing pipeline.')
pattern = re.compile(r'(<JJ>)*(<NN>|<NNS>|<NNP>)+')

print(list(filtered_chunks(doc, pattern)))