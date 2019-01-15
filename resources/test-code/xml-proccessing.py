#!/usr/bin/env python
# -*- coding: utf-8 -*-

from __future__ import unicode_literals

# libraries for NLP pipeline
from nltk import sent_tokenize
import spacy
from textblob import TextBlob

import codecs
import logging
logging.basicConfig(format='%(asctime)s : %(levelname)s : %(message)s', level=logging.INFO)

# libraries for JSON proccessing
import re, string

# libraries for XML proccessing
# import xml.etree.ElementTree as ET
import xml.etree.cElementTree as ET

# libraries for API proccessing
from flask import Flask, jsonify, request
from flask import abort
app = Flask(__name__)
# ------------------------------------------------------------------------------------------------------
# ------------------------------------------------------------------------------------------------------

# ------------------------------------------------------------------------------------------------------
# XML load service
@app.route('/ken/api/v1.0/en/file/xml/load', methods=['POST'])
def xml_From_File():
    try:
        file = request.files['file']
        xml = file.read().decode('cp1251').encode('utf8')
        file.close()
        print(xml)
    except Exception as e:
        s,r = getattr(e, 'message') or str(e), getattr(e, 'message') or repr(e)
        print 's:', s, 'len(s):', len(s)
        print 'r:', r, 'len(r):', len(r)
        return jsonify({"InternalError": 500})
    root = ET.fromstring(xml)
    print root.tag
    for child in root:
        print child.tag, child.attrib
        for child_2 in child:
            print child_2.tag, child_2.attrib
    return jsonify({"OK": 200})


# ------------------------------------------------------------------------------------------------------
if __name__ == '__main__':
    app.run(host = '127.0.0.1', port = 8000)