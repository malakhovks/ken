# load misc utils
import time, logging
import traceback
import uwsgi
from uwsgidecorators import spool
import shutil, os, re, string
from io import open
# from chardet.universaldetector import UniversalDetector

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
            time_for_analyzing = 25
        elif len(args['body']) > 50000 and len(args['body']) <= 100000:
            time_for_analyzing = 50
        elif len(args['body']) > 100000 and len(args['body']) <= 120000:
            time_for_analyzing = 260
        elif len(args['body']) > 120000 and len(args['body']) <= 200000:
            time_for_analyzing = 280
        elif len(args['body']) > 200000:
            time_for_analyzing = 420

        project_dir = str(args['project_dir'])
        path_to_1txt = os.path.join(project_dir, 'deploy', 'konspekt', '1.txt')
        # write the contents of the uploaded file to a temporary file tmp.txt
        path_to_tmptxt = os.path.join(project_dir, 'deploy', 'konspekt', 'tmp.txt')

        try:
             with open(path_to_tmptxt, 'w+', encoding='cp1251', errors='ignore') as f:
                raw_text_without_xml_predefined_entities = remove_xml_predefined_entities(args['body'])
                f.write(raw_text_without_xml_predefined_entities)
        except IOError as e:
            logging.error(traceback.format_exc())
            # logging.error(repr(e))
            return uwsgi.SPOOL_IGNORE

        try:
            shutil.move(os.path.join(project_dir, 'deploy', 'konspekt', 'tmp.txt'), os.path.join(project_dir, 'deploy', 'konspekt', '1.txt'))
        except Exception as e:
            logging.error(traceback.format_exc())
            # logging.error(repr(e))
            return uwsgi.SPOOL_IGNORE

        time.sleep(time_for_analyzing)

        # http://docs.python.org/2/library/shutil.html
        if not os.path.exists('/var/tmp/tasks/konspekt/' + args['spooler_task_name']):
            try:
                os.makedirs('/var/tmp/tasks/konspekt/' + args['spooler_task_name'], 0o755)
            except OSError as e:
                if e.errno != errno.EEXIST:
                    raise

        # copy file with results to unique folder with id
        # allterms.xml
        try:
            shutil.copy2(os.path.join(project_dir, 'deploy', 'konspekt', 'allterms.xml'), '/var/tmp/tasks/konspekt/' + args['spooler_task_name'])
        except Exception as e:
            logging.error(traceback.format_exc())
            # logging.error(repr(e))
            return uwsgi.SPOOL_IGNORE
        # parce.xml
        try:
            shutil.copy2(os.path.join(project_dir, 'deploy', 'konspekt', 'parce.xml'), '/var/tmp/tasks/konspekt/' + args['spooler_task_name'])
        except Exception as e:
            logging.error(traceback.format_exc())
            # logging.error(repr(e))
            return uwsgi.SPOOL_IGNORE

        return uwsgi.SPOOL_OK
    except Exception as e:
        logging.error(traceback.format_exc())
        # logging.error(repr(e))
        return uwsgi.SPOOL_IGNORE