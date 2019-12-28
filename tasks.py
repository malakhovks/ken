# load misc utils
import time, logging
import traceback
import uwsgi
from uwsgidecorators import spool
import shutil, os, re, string
"""
without `from io import open` I get:

`TypeError: file() takes at most 3 arguments (4 given)`

To get an encoding parameter in Python 2:
If you only need to support Python 2.6 and 2.7 you can use io.open instead of open. io is the new io subsystem for Python 3, and it exists in Python 2,6 ans 2.7 as well. Please be aware that in Python 2.6 (as well as 3.0) it's implemented purely in python and very slow, so if you need speed in reading files, it's not a good option.

If you need speed, and you need to support Python 2.6 or earlier, you can use codecs.open instead. It also has an encoding parameter, and is quite similar to io.open except it handles line-endings differently.
"""
from io import open
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
        logging.debug('Data size in bytes: ' + str(len(args['body'])))

        if len(args['body']) <= 50000:
            time_for_analyzing = 65
        elif len(args['body']) > 50000 and len(args['body']) <= 100000:
            time_for_analyzing = 125
        elif len(args['body']) > 100000 and len(args['body']) <= 200000:
            time_for_analyzing = 185
        elif len(args['body']) > 200000:
            time_for_analyzing = 300

        project_dir = args['project_dir']
        path_to_1txt = os.path.join(project_dir, 'deploy', 'konspekt', '1.txt')

        # f = io.open(path_to_1txt, 'w+', encoding='cp1251', errors='ignore')
        """
        errors - response when encoding fails. There are six types of error response
        errors='strict' - default response which raises a UnicodeDecodeError exception on failure
        errors='ignore' - ignores the unencodable unicode from the result
        errors='replace' - replaces the unencodable unicode to a question mark ?
        errors='xmlcharrefreplace' - inserts XML character reference instead of unencodable unicode
        errors='backslashreplace' - inserts a \uNNNN espace sequence instead of unencodable unicode
        errors='namereplace' - inserts a \N{...} escape sequence instead of unencodable unicode
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
             return uwsgi.SPOOL_IGNORE

        # time for analyzing 105 sec
        # time.sleep(105)
        time.sleep(time_for_analyzing)

        # http://docs.python.org/2/library/shutil.html
        if not os.path.exists('/var/tmp/tasks/konspekt/' + args['spooler_task_name']):
            try:
                os.makedirs('/var/tmp/tasks/konspekt/' + args['spooler_task_name'], 0755)
            except OSError as e:
                if e.errno != errno.EEXIST:
                    raise

        # copy file with results to unique folder with id
        # allterms.xml
        try:
            shutil.copy2(os.path.join(project_dir, 'deploy', 'konspekt', 'allterms.xml'), '/var/tmp/tasks/konspekt/' + args['spooler_task_name'])
        except Exception as e:
            logging.error(repr(e))
            return uwsgi.SPOOL_IGNORE
        # parce.xml
        try:
            shutil.copy2(os.path.join(project_dir, 'deploy', 'konspekt', 'parce.xml'), '/var/tmp/tasks/konspekt/' + args['spooler_task_name'])
        except Exception as e:
            logging.error(repr(e))
            return uwsgi.SPOOL_IGNORE

        return uwsgi.SPOOL_OK
    except Exception as e:
        # logging.error(traceback.format_exc())
        logging.error(repr(e))
        return uwsgi.SPOOL_IGNORE