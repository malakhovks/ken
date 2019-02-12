# ken NLP project

## Building and running under with Docker

Clone from git repository:
```bash
git clone https://username:password@github.com/username/repo_name.git
```
<!-- ae9c2fa2d73fbbb0bd0a5ffa746f1df59036815c -->
<!-- https://github.com/malakhovks/ken.git -->
<!-- https://malakhovks:ae9c2fa2d73fbbb0bd0a5ffa746f1df59036815c@github.com/malakhovks/ken.git -->

Checkout the branch you want to use:
```bash
git checkout <branch_name>
```

Build an image from a Dockerfile (It creates an image named `ken_image`):
```bash
docker build . -t ken_image
```
It creates an image named `ken_image`. You can run the image now with command:
```bash
docker run --name ken -d -p 80:80 ken_image
```

(to see the console output, attach to the container; to detach press Ctrl-c):
```bash
docker attach ken
```

(to stop the container):
```bash
docker stop ken
```

(to start the container again):
```bash
docker start ken
```

(to remove the container; needs to be stopped):
```bash
docker rm graphdb
```

Some useful options when running container:

* `--name` gives the container a name that can be found in docker ps output

* `-p` instructs to publish port 80. Second `80` after semicolons tells what port nginx inside the container listens on

* `-d` runs container detached from terminal. Logs then can be viewed by issuing `docker logs` command

* `-t` allocate a pseudo TTY, so you see the console output

* `--restart on-failure` with `docker run` automatic restart of failed containers.

-------

## Building and running under Windows

Install latest `Python 2.7.x`:
```http
https://www.python.org/downloads/windows/
```
Update `setuptools`:
```bash
pip install -U setuptools
```
Update `pip`:
```bash
python -m pip install --upgrade pip
```
Install `Visual C++ compiler`:
[Install corresponding visual c++ compiler](https://wiki.python.org/moin/WindowsCompilers) and make sure it match with your python version.

| Visual C++ |         CPython         |
| :--------: | :---------------------: |
|    14.0    |        3.5, 3.6         |
|    10.0    |        3.3, 3.4         |
|    9.0     | 2.6, 2.7, 3.0, 3.1, 3.2 |

If `connection error: [SSL: CERTIFICATE_VERIFY_FAILED] certificate verify failed` then:
```bash
pip install --trusted-host pypi.python.org linkchecker
```
Install `requirements.txt`:
```bash
pip install -r requirements.txt
```