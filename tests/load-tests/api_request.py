import requests

files = {'file': open('about-ontology.txt', 'rb')}
url_allterms = 'http://test.ulif.org.ua:51080/ken/api/en/file/allterms'
url_parce = 'http://test.ulif.org.ua:51080/ken/api/en/file/parcexml'

response_allterms = requests.post(url_allterms, files=files)
print(response_allterms.status_code)
print(response_allterms.text)
print('------------------------------------------------------------------------------------')
response_parce = requests.post(url_parce, files=files)
print(response_parce.status_code)
print(response_parce.text)