# ken
ken NLP project
## Building and running
Image build can be done like so:
```
docker build . -t ken_image
```
It creates an image named `ken_image` that can be run with this command:
```
docker run --name flask_container -p 80:80 ken_image
```
Some useful options when running container:

* `--name` gives the container a name that can be found in docker ps output
* `-p` instructs to publish port 80. Second `80` after semicolons tells what port nginx inside the container listens on
* `-d` runs container detached from terminal. Logs then can be viewed by issuing `docker logs` command
* `--restart on-failure` with `docker run` automatic restart of failed containers.