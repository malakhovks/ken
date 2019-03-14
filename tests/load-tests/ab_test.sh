#!/usr/bin/env bash
# test_data.pdf contains the document you want to post
# -p means to POST it
# -H adds an Auth header (could be Basic or Token)
# -T sets the Content-Type
# -c is concurrent clients
# -n is the number of requests to run in the test

ab -v 2 -c 3 -n 3 -p about-ontology.txt -T 'multipart/form-data; boundary=1234567890' http://192.168.1.120/ken/api/v1.0/en/file/parcexml