import spacy
import pytextrank

nlp = spacy.load('en_core_web_sm')

tr = pytextrank.TextRank()
nlp.add_pipe(tr.PipelineComponent, name='textrank', last=True)

text = 'Python is a high-level programming language for the natural language processing pipeline.'
doc = nlp(text)

# examine the top-ranked phrases in the document
for p in doc._.phrases:
    # print('{:.4f} {:5d}  {}'.format(p.rank, p.count, p.text))
    print(p)