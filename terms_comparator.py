# -*- coding: utf-8 -*-
import copy
from argparse import ArgumentParser
# import chardet
from chardet.universaldetector import UniversalDetector
import xml.etree.ElementTree as ET
# load misc utils
import logging
# logging.basicConfig(format='%(asctime)s : %(levelname)s : %(message)s', level=logging.INFO)
# logging.basicConfig(format='%(asctime)s : %(levelname)s : %(message)s', level=logging.DEBUG)
logging.basicConfig(format='%(asctime)s : %(levelname)s : %(message)s', level=logging.ERROR)

nodes_encoding = "unicode"


class Handler:

    def __init__(self):
        pass

    # -----------------------------------------------------------------------------
    # def get_xml_terms(self, path):
    #     if isinstance(path, str):
    #         if len(path) > 0:
    #             encoding = chardet.detect(open(path, 'rb').read())["encoding"]
    #             if encoding == "utf-8":
    #                 return open(path, 'r', encoding=encoding).read()
    #             else:
    #                 return open(path, 'r', encoding='cp1251').read()
    #     return ""
    def get_xml_terms(self, path):
        if isinstance(path, str):
            if len(path) > 0:
                with open(path,'rb') as t_f:
                    r_text = t_f.read()
                    detector = UniversalDetector()
                    for line in r_text.splitlines(True):
                        detector.feed(line)
                        if detector.done: break
                    detector.close()
                encoding = detector.result['encoding']

                if encoding == "utf-8":
                    # return open(path, 'r', encoding=encoding).read()
                    with open(path, encoding=encoding) as the_file:
                        return the_file.read()

                else:
                    with open(path, encoding='cp1251') as the_file:
                        return the_file.read()
                    # return open(path, 'r', encoding='cp1251').read()
        return ""

    # -----------------------------------------------------------------------------
    def load_key_words(self, path):
        if isinstance(path, str):
            if len(path) > 0:
                if path.split(".")[-1] == "xml":
                    return self.__get_nodes_from_xml__(path)
        return []

    # ------------------------------------------------------------------------------
    def __get_nodes_from_xml__(self, path):
        global nodes_encoding
        nodes = []
        with open(path,'rb') as t_f:
            r_text = t_f.read()
            detector = UniversalDetector()
            for line in r_text.splitlines(True):
                detector.feed(line)
                if detector.done: break
            detector.close()
        encoding = detector.result['encoding']
        nodes_encoding = encoding

        if encoding == "utf-8":
            # text = open(path, 'r', encoding=nodes_encoding).read()
            with open(path, encoding=encoding) as the_file:
                text = the_file.read()
        else:
            # text = open(path, 'r', encoding="cp1251").read()
            with open(path, encoding="cp1251") as the_file:
                text = the_file.read()

        e = ET.fromstring(self.__replace_prohibited_symbols__(text))
        for block in list(e):
            if block.tag.lower() == "nodes":
                for node in block:
                    nodes.append(
                        {'id': node.attrib['guid'], 'nodeName': node.attrib['nodeName']})
        return nodes

    # ---------------------------------------------------------------------------
    def make_comparation(self, input_terms_path='allterms.xml', input_structure_path='structure.xml',
                         extension_b=0, extension_a=0, output_structure_path='nodedata.xml'):
        allterms_xml = self.get_xml_terms(input_terms_path)
        key_words = self.load_key_words(input_structure_path)

        if isinstance(input_terms_path, str) and isinstance(input_structure_path, str):
            if len(input_terms_path) > 0 and len(input_structure_path) > 0:
                if input_structure_path.split(".")[-1] == "xml":
                    return self.__make_xml_nodedata__(allterms_xml, key_words, input_structure_path, output_structure_path,
                                               extension_b=extension_b, extension_a=extension_a)

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
        with open(input_terms_path,'rb') as t_f:
            r_text = t_f.read()
            detector = UniversalDetector()
            for line in r_text.splitlines(True):
                detector.feed(line)
                if detector.done: break
            detector.close()
        encoding = detector.result['encoding']
        if encoding == "utf-8":
            # text = open(input_terms_path, 'r', encoding=encoding).read()
            with open(input_terms_path, encoding=encoding) as the_file:
                text = the_file.read()
        else:
            # text = open(input_terms_path, 'r', encoding='cp1251').read()
            with open(input_terms_path, encoding='cp1251') as the_file:
                text = the_file.read()
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
        # TODO Encoding variations
        try:
            # return ET.tostring(e, encoding='unicode', method="xml", xml_declaration=True)
            return ET.tostring(e, encoding='utf8', method="xml")
        except Exception as e:
            return logging.error(e, exc_info=True)
        # outFile = open(output_structure_path, 'w+', encoding='utf-8')
        # if nodes_encoding == "utf-8":
        #     # outFile.write(ET.tostring(e, encoding='unicode', method="xml", xml_declaration=True))
        #     # outFile.write(ET.tostring(e, encoding='unicode', method="xml"))
        #     outFile.write("<?xml version='1.0' encoding='utf-8'?>\n"+ET.tostring(e,'unicode',method="xml"))
        # else:
        #     outFile.write("<?xml version='1.0' encoding='utf-8'?>\n" + ET.tostring(e,'unicode', method="xml"))
        #     # outFile.write(ET.tostring(e, encoding='cp1251', method="xml").decode(encoding='cp1251'))
        # outFile.close()

    # --------------------------------------------------------------------------------
    def __get_allterms_and_sentences(self, allterms_xml, extension_b, extension_a):
        terms_from_allterms = {}
        sentences = []
        e_allterms = ET.fromstring(self.__replace_prohibited_symbols__(allterms_xml))
        counter = 0
        for block in list(e_allterms):
            if block.tag == 'exporterms':
                for term in block:
                    if term.tag == "term":
                        t_name = ""
                        sent_no = []
                        for property in term:
                            if property.tag == "tname":
                                t_name = property.text
                            if property.tag == 'sentpos':
                                n = int(property.text.split('/')[0])
                                if n not in sent_no:
                                    sent_no.append(n)
                                    copy_n = copy.deepcopy(n)
                                    for expra_n in range(extension_b):
                                        copy_n -= 1
                                        if copy_n >= 0 and copy_n not in sent_no:
                                            sent_no.append(copy_n)
                                    copy_n = copy.deepcopy(n)
                                    for expra_n in range(extension_a):
                                        copy_n += 1
                                        if copy_n >= 0 and copy_n not in sent_no:
                                            sent_no.append(copy_n)

                        if t_name not in terms_from_allterms:
                            terms_from_allterms[t_name] = sent_no
                        else:
                            terms_from_allterms[t_name] += sent_no
                            terms_from_allterms[t_name] = list(set(terms_from_allterms[t_name]))
                        counter += 1
            elif block.tag == 'sentences':
                for sentence in block:
                    sentences.append(sentence.text)
        return terms_from_allterms, sentences

    # ------------------------------------------------------------------------------
    def __replace_prohibited_symbols__(self, xml_text):
        out = "&amp;".join(xml_text.split("&"))
        tmp = [i for i in out]
        n = 0
        for i in tmp:
            if i == "<":
                k = n + 1
                while k < len(tmp) - 1:
                    if tmp[k] == ">":
                        break
                    if tmp[k] == "<":
                        tmp[n] = "&lt;"
                        break
                    k += 1
            if i == ">":
                k = n + 1
                while k < len(tmp) - 1:
                    if tmp[k] == "<":
                        break
                    if tmp[k] == ">":
                        tmp[k] = "&gt;"
                        break
                    k += 1

            n += 1

        out = "".join(tmp)
        return out

# ------------------------------------------------------------------------------
""" 
if __name__ == "__main__":
    parser = ArgumentParser(description='Text Analysis Service')
    parser.add_argument(
        '-t', '--terms', help='Path to an xml file with an terms.', dest='input_terms', default='')
    parser.add_argument(
        '-s', '--structure', help='File with structure graph. Can be xml or csv.', dest='input_structure', default='structure.xml')
    parser.add_argument(
        '-d', '--extension_b',
        help='Context extension before means the number of sentences before each one to be added to the node data file. Default 0.',
        dest='context_extension_before', default='0')
    parser.add_argument('-u', '--extension_a',
        help='Context extension after means the number of sentences after each one to be added to the node data file. Default 0.',
        dest='context_extension_after', default='0')
    parser.add_argument(
        '-o', '--output',
        help='Output graph file with node context.',
        dest='output_structure', default='nodedata.xml') """
