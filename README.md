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

Run `start.sh`:
```bash
docker build . -t ken_image
docker build . -t ken_image >dLog.txt 2>&1 < /dev/null &
```