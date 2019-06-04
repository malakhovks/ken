import spacy
from spacy import displacy
# import re, bs4

nlp = spacy.load("en_core_web_sm")

# doc = nlp(u"Google is leading company in the natural language processing")
doc = nlp(u"After the vision of the Semantic Web was broadcasted at the turn of the millennium, ontology became a synonym for the solution to many problems concerning the fact that computers do not understand human language: if there were an ontology and every document were marked up with it and we had agents that would understand the mark-up, then computers would finally be able to process our queries in a really sophisticated way.")

# html = displacy.render(doc, style="ent", page=True)

# print(re.findall('<body>(.*?)</body>', html, re.DOTALL))
# print ('----------------------------------------------------------------------')
# print(bs4.BeautifulSoup(html).find('body'))
# print ('----------------------------------------------------------------------')
# print(html)
print ('----------------------------------------------------------------------')
colors = {"ORG": "linear-gradient(90deg, #aa9cfc, #fc9ce7)"}
options = {"ents": ["ORG"], "colors": colors}
# svg = displacy.render(doc, style="ent", options=options)
svg = displacy.render(doc, style="ent")
print svg