    # -------------------------------------------------
    def __make_xml_nodedata__(self, allterms_xml, key_words, input_terms_path, output_structure_path, extension_b=0, extension_a=0):
        sentences_for_nodes = []
        terms_from_allterms, sentences = self.__get_allterms_and_sentences(allterms_xml, extension_b, extension_a)
        for term in key_words:
            if term['nodeName'].lower() in terms_from_allterms:
                term["sent_no"] = terms_from_allterms[term['nodeName'].lower()]
            elif term['nodeName'] in terms_from_allterms:
                term["sent_no"] = terms_from_allterms[term['nodeName']]
        for word in key_words:
            if 'sent_no' in word:
                sentences_for_nodes.append({'id': word['id'],
                               'nodeName': word['nodeName'],
                               'sentences': [sentences[sent] for sent in word['sent_no'] if sent < len(sentences)]})

        encoding = chardet.detect(open(input_terms_path, 'rb').read())["encoding"]
        if encoding == "utf-8":
            text = open(input_terms_path, 'r', encoding=encoding).read()
        else:
            text = open(input_terms_path, 'r', encoding='cp1251').read()
        e = ET.fromstring(self.__replace_prohibited_symbols__(text))
        for block in list(e):
            if block.tag.lower() == "nodes":
                for node in block:
                    for item in sentences_for_nodes:
                        if "id" in item and "guid" in node.attrib:
                            if item['id'] == node.attrib["guid"]:
                                if 'sentences' in item and isinstance(item['sentences'], list):
                                    for sent in item['sentences']:
                                        new_element = ET.SubElement(node, 'data', tclass="", type="text", link="")
                                        new_element.text = sent
        outFile = open(output_structure_path, 'w+', encoding='utf-8')
