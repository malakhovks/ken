import time
import traceback
import uwsgi
from uwsgidecorators import spool
import shutil, os, io

@spool
def konspekt_task_ua(args):
    # create/overwrite file that will be analyzed by konspekt
    try:
        # print('Start task execution')

        project_dir = args['project_dir']
        path_to_1txt = os.path.join(project_dir, 'deploy', 'konspekt', '1.txt')
        f = io.open(path_to_1txt, 'w+', encoding='cp1251')
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