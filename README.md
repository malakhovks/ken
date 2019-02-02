# ken
ken NLP project
## Building and running

Clone from git repository:
```bash
git clone https://username:password@github.com/username/repo_name.git
```
<!-- ae9c2fa2d73fbbb0bd0a5ffa746f1df59036815c -->
<!-- https://github.com/malakhovks/ken.git -->

Build an image from a Dockerfile:
```bash
<!-- It creates an image named `ken_image`  -->
docker build . -t ken_image
```
It creates an image named `ken_image` that can be run with this command:
```bash
docker run --name ken_container -p 80:80 ken_image
```
Some useful options when running container:

* `--name` gives the container a name that can be found in docker ps output
* `-p` instructs to publish port 80. Second `80` after semicolons tells what port nginx inside the container listens on
* `-d` runs container detached from terminal. Logs then can be viewed by issuing `docker logs` command
* `--restart on-failure` with `docker run` automatic restart of failed containers.