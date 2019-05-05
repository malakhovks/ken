import spacy
from spacy import displacy

nlp = spacy.load("en_core_web_sm")
doc = nlp(u"This is a sentence.")
displacy.render(doc, style="dep", page=True, minify=True)