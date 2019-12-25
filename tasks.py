# load misc utils
import time, logging
import traceback
import uwsgi
from uwsgidecorators import spool
import shutil, os, io
from chardet.universaldetector import UniversalDetector

# logging.basicConfig(format='%(asctime)s : %(levelname)s : %(message)s', level=logging.INFO)
# logging.basicConfig(format='%(asctime)s : %(levelname)s : %(message)s', level=logging.DEBUG)
logging.basicConfig(format='%(asctime)s : %(levelname)s : %(message)s', level=logging.ERROR)

# remove XML predefined entities from text
def remove_xml_predefined_entities(raw_text):
    # remove all words which contains number
    raw_text = re.sub(r'&|>|<|_|"|\.\.+|\s\s+', ' ', raw_text)
    raw_text = re.sub(r'\.\.+', ' ', raw_text)
    raw_text = re.sub(r'\s\s+', ' ', raw_text)
    # remove leading and ending spaces
    clean_raw_text_without_xml_predefined_entities = raw_text.strip()
    return clean_raw_text_without_xml_predefined_entities

@spool
def konspekt_task_ua(args):
    # create/overwrite file that will be analyzed by konspekt
    try:
        logging.debug('Start task execution')

        # data size in bytes
        logging.error('Data size in bytes: ' + str(len(args['body'])))

        project_dir = args['project_dir']
        path_to_1txt = os.path.join(project_dir, 'deploy', 'konspekt', '1.txt')

        # f = io.open(path_to_1txt, 'w+', encoding='cp1251', errors='ignore')
        """
        errors - response when encoding fails. There are six types of error response
        strict - default response which raises a UnicodeDecodeError exception on failure
        ignore - ignores the unencodable unicode from the result
        replace - replaces the unencodable unicode to a question mark ?
        xmlcharrefreplace - inserts XML character reference instead of unencodable unicode
        backslashreplace - inserts a \uNNNN espace sequence instead of unencodable unicode
        namereplace - inserts a \N{...} escape sequence instead of unencodable unicode
        """
        # f.write(args['body'].decode('cp1251', errors='ignore'))
        # detector = UniversalDetector()
        # for line in args['body'].splitlines(True):
        #     detector.feed(line)
        #     if detector.done: break
        # detector.close()
        # if detector.result['encoding'] == 'utf-8':
        #     logging.debug(detector.result['encoding'])
        #     f.write(args['body'].decode('UTF-8', errors='ignore'))
        # elif detector.result['encoding'] == 'windows-1251':
        #     logging.debug(detector.result['encoding'])
        #     f.write(args['body'].decode('cp1251', errors='ignore'))
        # else:
        #     logging.debug(detector.result['encoding'])
        #     f.write(args['body'].decode(detector.result['encoding'], errors='ignore'))
        # f.close()

        try:
             with open(path_to_1txt, 'w+', encoding='cp1251', errors='ignore') as f:
                """
                errors - response when encoding fails. There are six types of error response
                strict - default response which raises a UnicodeDecodeError exception on failure
                ignore - ignores the unencodable unicode from the result
                replace - replaces the unencodable unicode to a question mark ?
                xmlcharrefreplace - inserts XML character reference instead of unencodable unicode
                backslashreplace - inserts a \uNNNN espace sequence instead of unencodable unicode
                namereplace - inserts a \N{...} escape sequence instead of unencodable unicode
                """
                detector = UniversalDetector()
                for line in args['body'].splitlines(True):
                    detector.feed(line)
                    if detector.done: break
                detector.close()
                if detector.result['encoding'] == 'utf-8':
                    logging.debug(detector.result['encoding'])
                    raw_text_without_xml_predefined_entities = args['body'].decode('UTF-8', errors='ignore')
                    raw_text_without_xml_predefined_entities = remove_xml_predefined_entities(raw_text_without_xml_predefined_entities)
                    f.write(raw_text_without_xml_predefined_entities)
                elif detector.result['encoding'] == 'windows-1251':
                    logging.debug(detector.result['encoding'])
                    raw_text_without_xml_predefined_entities = args['body'].decode('cp1251', errors='ignore')
                    raw_text_without_xml_predefined_entities = remove_xml_predefined_entities(raw_text_without_xml_predefined_entities)
                    f.write(raw_text_without_xml_predefined_entities)
                else:
                    logging.debug(detector.result['encoding'])
                    raw_text_without_xml_predefined_entities = args['body'].decode(detector.result['encoding'], errors='ignore')
                    raw_text_without_xml_predefined_entities = remove_xml_predefined_entities(raw_text_without_xml_predefined_entities)
                    f.write(raw_text_without_xml_predefined_entities)
        except IOError as e:
             logging.error(repr(e))

        # time for analyzing 180 sec
        time.sleep(120)

        # http://docs.python.org/2/library/shutil.html
        if not os.path.exists('/var/tmp/tasks/konspekt/' + args['spooler_task_name']):
            try:
                os.makedirs('/var/tmp/tasks/konspekt/' + args['spooler_task_name'], 0755)
            except OSError as e:
                if e.errno != errno.EEXIST:
                    raise

        # copy file with results to unique folder with id
        # allterms.xml
        shutil.copy2(os.path.join(project_dir, 'deploy', 'konspekt', 'allterms.xml'), '/var/tmp/tasks/konspekt/' + args['spooler_task_name'])
        # parce.xml
        shutil.copy2(os.path.join(project_dir, 'deploy', 'konspekt', 'parce.xml'), '/var/tmp/tasks/konspekt/' + args['spooler_task_name'])

        return uwsgi.SPOOL_OK
    except Exception as e:
        logging.error(traceback.format_exc())
        logging.error(repr(e))
        return uwsgi.SPOOL_RETRY