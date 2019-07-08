import spacy
from spacy import displacy

nlp = spacy.load("en_core_web_sm")

doc = nlp(u"Google is leading company in the natural language processing")

print ('----------------------------------------------------------------------')
colors = {"ORG": "linear-gradient(90deg, #b0fb5a, #ffffff)"}
options = {"colors": colors}

svg = displacy.render(doc, style="ent", options=options)

# svg = displacy.render(doc, style="ent")
print svg