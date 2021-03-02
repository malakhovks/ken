import spacy
from pyate.term_extraction_pipeline import TermExtractionPipeline

nlp = spacy.load('en_core_web_sm')
nlp.add_pipe(TermExtractionPipeline())
# source: https://www.ncbi.nlm.nih.gov/pmc/articles/PMC1994795/
# string = 'Central to the development of cancer are genetic changes that endow these “cancer cells” with many of the hallmarks of cancer, such as self-sufficient growth and resistance to anti-growth and pro-death signals. However, while the genetic changes that occur within cancer cells themselves, such as activated oncogenes or dysfunctional tumor suppressors, are responsible for many aspects of cancer development, they are not sufficient. Tumor promotion and progression are dependent on ancillary processes provided by cells of the tumor environment but that are not necessarily cancerous themselves. Inflammation has long been associated with the development of cancer. This review will discuss the reflexive relationship between cancer and inflammation with particular focus on how considering the role of inflammation in physiologic processes such as the maintenance of tissue homeostasis and repair may provide a logical framework for understanding the connection between the inflammatory response and cancer.'
string = 'Python is a high-level programming language for the natural language processing pipeline.'

doc = nlp(string)
print(doc._.combo_basic.sort_values(ascending=False))