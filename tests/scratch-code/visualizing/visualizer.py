import spacy
from spacy import displacy
nlp = spacy.load("en_core_web_sm")
doc = nlp(u"Autonomous cars.")
html = displacy.render(doc, style="dep")
print html