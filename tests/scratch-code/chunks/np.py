import spacy
nlp = spacy.load("en_core_web_sm")
doc = nlp("We try to explicitly describe the geometry of the edges of the images.")

for np in doc.noun_chunks: # use np instead of np.text
    print({np.text
  for nc in doc.noun_chunks
  for np in [
    nc, 
    doc[
      nc.root.left_edge.i
      :nc.root.right_edge.i+1]]})