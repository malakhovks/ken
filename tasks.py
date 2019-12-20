import time
import traceback
import uwsgi
from uwsgidecorators import spool
import shutil, os, io
from chardet.universaldetector import UniversalDetector

@spool
def konspekt_task_ua(args):
    # create/overwrite file that will be analyzed by konspekt
    try:
        # print('Start task execution')

        project_dir = args['project_dir']
        path_to_1txt = os.path.join(project_dir, 'deploy', 'konspekt', '1.txt')
        f = io.open(path_to_1txt, 'w+', encoding='cp1251')
        # f.write(args['body'].decode('cp1251'))
        # decode the file as CP1251 ignoring any errors
        # f.write(args['body'].decode('cp1251', errors='ignore'))
        detector = UniversalDetector()
        for line in args['body'].readlines():
            detector.feed(line)
            if detector.done: break
        detector.close()
        if detector.result['encoding'] == 'UTF-8':
            f.write(args['body'].decode('UTF-8').encode('cp1251'))
        else:
            f.write(args['body'].decode('cp1251'))
        f.close()

        # time for analyzing 10 sec
        time.sleep(10)

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
        print(traceback.format_exc())
        return uwsgi.SPOOL_RETRY