# ken NLP arm32v7 project

## Building and running under Linux arm32v7

Clone from git repository:
```bash
git clone https://username:password@github.com/username/repo_name.git
```
Or clone from the specific branch/tag of git repository:

```bash
git clone --depth=1 --branch=<tag_name> <repo_url>
git clone --depth=1 --branch=arm32v7 https://malakhovks:ae9c2fa2d73fbbb0bd0a5ffa746f1df59036815c@github.com/malakhovks/ken.git
```
> Credentials needed
> https://malakhovks:ae9c2fa2d73fbbb0bd0a5ffa746f1df59036815c@github.com/malakhovks/ken.git

Checkout the branch you want to use:
```bash
git checkout <branch_name>
```

Build an image from a Dockerfile (It creates an image named `ken_image`):
```bash
docker build . -t ken_image
docker build . -t ken_image > dLog.txt 2>&1 < /dev/null &
```
It creates an image named `ken_image`. You can run the image now with command:
```bash
docker run --name ken -d -p 80:80 ken_image
```

(to see the console output, attach to the container; to detach press Ctrl+C):
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
docker rm ken
```

Some useful options when running container:

* `--name` gives the container a name that can be found in docker ps output
* `-p` instructs to publish port 80. Second `80` after semicolons tells what port nginx inside the container listens on
* `-d` runs container detached from terminal. Logs then can be viewed by issuing `docker logs` command
* `-t` allocate a pseudo TTY, so you see the console output
* `--restart on-failure` with `docker run` automatic restart of failed containers. Restart the container if it exits due to an error, which manifests as a non-zero exit code.
* `--restart always` with `docker run` always restart the container if it stops. If it is manually stopped, it is restarted only when Docker daemon restarts or the container itself is manually restarted.
* `--restart unless-stopped` with `docker run` similar to `always`, except that when the container is stopped (manually or otherwise), it is not restarted even after Docker daemon restarts.

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

-------

## Essential Docker CLI commands

[Docker](https://www.docker.com/) is a great tool for building [microservices](https://pivotal.io/microservices), allowing you to create [cloud-based](https://www.docker.com/what-docker) applications and [systems](https://www.docker.com/what-docker). To make the most of it via your terminal, here is a run down of the top 10 Docker commands for your terminal.

> A container is launched by running an image. An **image** is an executable package that includes everything needed to run an application–the code, a runtime, libraries, environment variables, and configuration files.

> A **container** is a runtime instance of an image–what the image becomes in memory when executed (that is, an image with state, or a user process). You can see a list of your running containers with the command, `*docker ps*`, just as you would in Linux. — from [Docker Concepts](https://docs.docker.com/get-started/#docker-concepts)

1. [docker ps](https://docs.docker.com/engine/reference/commandline/ps/) — Lists running containers. Some useful flags include: `-a` / `-all` for all containers (default shows just running) and `—-quiet` /`-q` to list just their ids (useful for when you want to get all the containers).
2. [docker pull](https://docs.docker.com/engine/reference/commandline/pull/) — Most of your images will be created on top of a base image from the [Docker Hub](https://hub.docker.com/) registry. [Docker Hub](https://hub.docker.com/) contains many pre-built images that you can `pull` and try without needing to define and configure your own. To download a particular image, or set of images (i.e., a repository), use `docker pull`.
3. [docker build](https://docs.docker.com/engine/reference/commandline/build/) — The `docker build` command builds Docker images from a Dockerfile and a “context”. A build’s context is the set of files located in the specified `PATH` or `URL`. Use the `-t` flag to label the image, for example `docker build -t my_container .` with the `.` at the end signalling to build using the currently directory.
4. [docker run](https://docs.docker.com/engine/reference/run/) — Run a docker container based on an image, you can follow this on with other commands, such as `-it bash` to then run bash from within the container. *Also see* [*Top 10 options for docker run — a quick reference guide for the CLI command*](https://medium.com/the-code-review/top-10-docker-run-command-options-you-cant-live-without-a-reference-d256834e86c1)*.* `docker run my_image -it bash`
5. [docker logs ](https://docs.docker.com/engine/reference/commandline/logs/)— Use this command to display the logs of a container, you must specify a container and can use flags, such as `--follow` to follow the output in the logs of using the program. `docker logs --follow my_container`
6. [docker volume ls](https://docs.docker.com/engine/reference/commandline/volume_ls/) — This lists the [volumes](https://docs.docker.com/storage/volumes/), which are the preferred mechanism for persisting data generated by and used by Docker containers.
7. [docker rm](https://docs.docker.com/engine/reference/commandline/rm/) — Removes one or more containers. `docker rm my_container`
8. [docker rmi ](https://docs.docker.com/engine/reference/commandline/rmi/)— Removes one or more images. `docker rmi my_image`
9. [docker stop](https://docs.docker.com/engine/reference/commandline/stop/) — Stops one or more containers. `docker stop my_container`stops one container, while `docker stop $(docker ps -a -q)` stops all running containers. A more direct way is to use `docker kill my_container`, which does not attempt to shut down the process gracefully first.
10. Use them together, for example to clean up all your docker images and containers:

- kill all running containers with `docker kill $(docker ps -q)`
- delete all stopped containers with `docker rm $(docker ps -a -q)`
- delete all images with `docker rmi $(docker images -q)`