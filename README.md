# ken NLP arm32v7 project

## Building and running under arm32v7 architechture Linux

1. Clone from the specific branch `arm32v7` of `ken` git repository:

```bash
$ git clone --depth=1 --branch=arm32v7 https://malakhovks:ae9c2fa2d73fbbb0bd0a5ffa746f1df59036815c@github.com/malakhovks/ken.git
```
> Credentials needed
> https://malakhovks:ae9c2fa2d73fbbb0bd0a5ffa746f1df59036815c@github.com/malakhovks/ken.git

2. Install `python 2.7` environment + `build-essential`.

3. Install `nginx`:

```bash
$ apt-get -y install nginx
```
4. Install dependencies from `requirements.txt`:
```bash
$ pip install -U 3to2
$ pip install -r ./deploy/requirements.txt --src /usr/local/src
```
5. Install `textblob` corpora:
```bash
$ python -m textblob.download_corpora
```
6. Copy `nginx` configuration file:
```bash
$ cp ./deploy/nginx.conf /etc/nginx/ 
```
7. Copy `uwsgi` configuration file
```bash
$ cp ./deploy/uwsgi.conf /etc/init/
```
8. Remove `cache`:
```bash
$ rm -r /root/.cache
$ apt-get -y clean
$ apt-get -y autoremove
```
9. Install OpenJRE and OpenJDK
```bash
$ sudo apt-get install default-jre
$ sudo apt-get install default-jdk
```
or
```bash
$ mkdir -p /usr/share/man/man1
$ apt-get -y install openjdk-8-jdk-headless
```
10. Reboot system.