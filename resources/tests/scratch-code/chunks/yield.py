from __future__ import unicode_literals
import spacy
from spacy.symbols import *

NLP_EN = spacy.load('en_core_web_sm')

doc = NLP_EN('Python is a high-level programming language for the natural language processing.')

#doc = NLP_EN('After the vision of the Semantic Web was broadcasted at the turn of the millennium, ontology became a synonym for the solution to many problems concerning the fact that computers do not understand human language: if there were an ontology and every document were marked up with it and we had agents that would understand the mark-up, then computers would finally be able to process our queries in a really sophisticated way.')

# doc = NLP_EN('Some years later, the success of Google shows us that the vision has not come true, being hampered by the incredible amount of extra work required for the intellectual encoding of semantic mark-up - as compared to simply uploading an HTML page.')

# print(len(doc))
# for noun_token in doc:
#     if noun_token.pos_ in ["NOUN"]:
#         comps = [j for j in noun_token.children if j.dep_ == "compound"]
#         if comps:
#             print(comps, noun_token)

# print('----------------------------------')

# for i in doc:
#     if i.pos_ in ["NOUN"]:
#         comps = [j for j in i.children if j.pos_ in ["ADJ", "NOUN"]]
#         if comps:
#             print(comps, i)

# print('----------------------------------')

# for token in doc:
#     print('ent ------- >>>>>>> ' + token.text + ' --->> '+ token.ent_type_)


# print('----------------------------------')

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