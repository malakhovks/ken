import spacy
from spacy import displacy

nlp = spacy.load("en_core_web_sm")
# doc = nlp(u"unstructured text")
# doc = nlp(u"ontology engineering")
# doc = nlp(u"it's usage")
doc = nlp(u"the natural language processing pipeline")

# doc = nlp(u"After the vision of the Semantic Web was broadcasted at the turn of the millennium, ontology became a synonym for the solution to many problems concerning the fact that computers do not understand human language: if there were an ontology and every document were marked up with it and we had agents that would understand the mark-up, then computers would finally be able to process our queries in a really sophisticated way.")

html = displacy.render(doc, style="ent", page=True, minify=True)
# displacy.serve(doc, style="dep", page=True, minify=True)

print html