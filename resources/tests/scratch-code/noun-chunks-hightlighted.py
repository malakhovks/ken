from __future__ import unicode_literals
import spacy, textacy
import codecs

nlp = spacy.load('en_core_web_sm')
# sentence = 'The author is writing a new book. The dog is barking. Python is a high-level programming language.'
sentence = 'After the vision of the Semantic Web was broadcasted at the turn of the millennium,ontology became a synonym for the solution to many problems concerning the fact that computers do not understand human language: if there were an ontology and every document were marked up with it and we had agents that would understand the mark-up, then computers would finally be able to process our queries in a really sophisticated way. Some years later, the success of Google shows us that the vision has not come true, being hampered by the incredible amount of extra work required for the intellectual encoding of semantic mark-up - as compared to simply uploading an HTML page. To alleviate this acquisition bottleneck, the field of ontology learning has since emerged as an important sub-field of ontology engineering.'
verb_phrases_pattren = r'<VERB>*<ADV>*<PART>*<VERB>+<PART>*'
# verb_phrases_pattren = r'<VERB>?<ADV>*<VERB>+'
# noun_phrases_pattren = r'<DET>? (<NOUN>+ <ADP|CONJ>)* <NOUN>+'
doc = textacy.Doc(sentence, lang='en_core_web_sm')
lists = textacy.extract.pos_regex_matches(doc, verb_phrases_pattren)

# with open("my.html","w") as fp:
#     for list in lists:
#         search_word = (list.text)
#         containing_sentence = [i for i in sentence.split('.') if str(search_word) in str(i)][0]
#         fp.write(containing_sentence.replace(search_word, '<span style="color: red">{}</span>'.format(search_word)))

# mod_sentence = []
# for list in lists:
#     search_word = (list.text)
#     containing_sentence = [i for i in sentence.split('.') if str(search_word) in str(i)][0]+'.'
#     mod_sentence.append(containing_sentence.replace(search_word, '<span style="color: red">{}</span>'.format(search_word)))
# with open("my.html","w") as fp:
#     fp.write(''.join(mod_sentence))

for list in lists:
    print(list.text)