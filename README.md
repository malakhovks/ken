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
$ pip install -r ./deploy/requirements.txt --src /usr/local/src
```
5. Install `textblob` corpora:
```bash
$ python -m textblob.download_corpora
```
6. Copy `nginx` congiguration file:
```bash
$ cp ./deploy/nginx.conf /etc/nginx 
```
7. Remove `cache`:
```bash
$ rm -r /root/.cache
$ apt-get -y clean
$ apt-get -y autoremove
```
7. Run `start.sh`:
```bash
$ chmod +x ./start.sh
$ ./start.sh
```