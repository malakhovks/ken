from __future__ import unicode_literals
import spacy
from spacy.symbols import *

NLP_EN = spacy.load('en_core_web_sm')

doc = NLP_EN('It is widely accepted that ontologies can facilitate text understanding and automatic processing of textual resources.')

# np_labels = set([nsubj, nsubjpass, dobj, iobj, pobj]) # Probably others too
# def iter_nps(doc):
#     for word in doc:
#         if word.dep in np_labels:
#             yield word.subtree

def get_pps(doc):
    "Function to get PPs from a parsed document."
    pps = []
    for token in doc:
        # Try this with other parts of speech for different subtrees.
        if token.pos_ == 'NOUN':
            pp = ' '.join([tok.orth_ for tok in token.subtree])
            pps.append(pp)
    return pps

print(get_pps(doc))