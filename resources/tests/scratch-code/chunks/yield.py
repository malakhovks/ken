from __future__ import unicode_literals
import spacy
from spacy.symbols import *

NLP_EN = spacy.load('en_core_web_sm')

doc = NLP_EN('Python is a high-level programming language for the natural language processing.')
print(len(doc))
for noun_token in doc:
    if noun_token.pos_ in ["NOUN"]:
        comps = [j for j in noun_token.children if j.dep_ == "compound"]
        if comps:
            print(comps, noun_token)

print('----------------------------------')

for i in doc:
    if i.pos_ in ["NOUN"]:
        comps = [j for j in i.children if j.pos_ in ["ADJ", "NOUN"]]
        if comps:
            print(comps, i)

print('----------------------------------')

for chunk in doc.noun_chunks:
    print(chunk.text, chunk.root.text, chunk.root.dep_,
            chunk.root.head.text)




# -------------

# np_labels = set([nsubj, nsubjpass, dobj, iobj, pobj]) # Probably others too
# def iter_nps(doc):
#     for word in doc:
#         if word.dep in np_labels:
#             yield word.subtree

# for np in doc.noun_chunks: # use np instead of np.text
#     print(np)


# -------------

# def get_pps(doc):
#     "Function to get PPs from a parsed document."
#     pps = []
#     for token in doc:
#         # Try this with other parts of speech for different subtrees.
#         if token.pos_ == 'NOUN':
#             pp = ' '.join([tok.orth_ for tok in token.subtree])
#             pps.append(pp)
#     return pps

# print(get_pps(doc))

# for s in doc.sents:
#     print s.text
#     for nc in doc.noun_chunks:
#         if nc.start >= s.start and nc.end <= s.end:
#             print "INSIDE: " + nc.text
#         else:
#             print "OUT: " + nc.text
#         print s.start, s.end
#         print nc.start, nc.end
#         print ""

# -------------