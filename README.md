# ken (konspekt English)

### Choose your language / Оберіть мову
- **[Українська](#toc-ua)**
- **[English](#toc-en)**

-------

<a name="toc-en"></a>
**ken** (konspekt English) is a natural language processing API service for contextual and semantic analysis with document taxonomy building feature.

### Table of Contents
- **[Features](#features-en)**
- **[Building and running under UNIX (Linux/MacOS) with Docker](#building-running-linux)**
- **[Building and running under Windows](#building-running-windows)**
- **[Essential Docker CLI commands](#docker-cli-commands)**

<a name="features-en"></a>
## Features

**ken** (konspekt English) network toolkit (Web service with API) is designed to distinguish terms from the natural language texts in English using [spaCy](https://spacy.io/) - an open source library for advanced natural language processing.

**ken** (konspekt English) network toolkit (Web service with API) covers all the most important stages of the natural language processing, namely:

- extracting text data from e-documents (`pdf`, `docx`, `txt`);
- text preprocessing (or text normalization) - in our case this means correction of defects resulting from the procedure of extracting text data from e-documents;
- spell checking and automatic correction;
- split text into sentences/words;
- part-of-speech tagging;
- lemmatization of words;
- stemming of words;
- shallow parsing (extraction of `base noun phrases`, `noun chunks`). Check links to learn more about this proccess: [spaCy dependency-parse](https://spacy.io/usage/linguistic-features#dependency-parse) та [Wikipedia Noun phrase](https://en.wikipedia.org/wiki/Noun_phrase);
- generation an xml-structure of the text.

<a name="building-running-linux"></a>
## Building and running under UNIX (Linux/MacOS) with Docker

Clone from git repository:
```bash
git clone https://username:token@github.com/username/repo_name.git
```
Or clone from the specific branch/tag of git repository:

```bash
git clone --depth=1 --branch=<tag_name> <repo_url>
git clone --depth=1 --branch=develop https://malakhovks:ae9c2fa2d73fbbb0bd0a5ffa746f1df59036815c@github.com/malakhovks/ken.git
```

Checkout the branch you want to use:
```bash
git checkout <branch_name>
```

Build an image from a Dockerfile (It creates an image named `ken_image`):
```bash
docker build . -t ken_image
```
You can run the image `ken_image` now with command:
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

<a name="building-running-windows"></a> 
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

<a name="docker-cli-commands"></a>
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
7. [docker rm](https://docs.docker.com/engine/reference/commandline/rm/) — Removes one or more containers: `docker rm my_container`. Remove all containers: `docker rm $(docker ps -a -q)`
8. [docker rmi ](https://docs.docker.com/engine/reference/commandline/rmi/)— Removes one or more images: `docker rmi my_image`. Remove all images: `docker rmi $(docker images -q)`
9. [docker stop](https://docs.docker.com/engine/reference/commandline/stop/) — Stops one or more containers. `docker stop my_container`stops one container, while `docker stop $(docker ps -a -q)` stops all running containers. A more direct way is to use `docker kill my_container`, which does not attempt to shut down the process gracefully first.
10. Use them together, for example to clean up all your docker images and containers:

- kill all running containers with `docker kill $(docker ps -q)`
- delete all stopped containers with `docker rm $(docker ps -a -q)`
- delete all images with `docker rmi $(docker images -q)`

-------

<a name="toc-ua"></a>
**ken** (konspekt English) - мережевий засіб виділення термінів з англомовних природномовних текстів

### Зміст
- **[Призначення та функції](#features-ua)**
- **[Системні вимоги](#system-requirements-ua)**
- **[Компіляція, збірка та розгортання мережевого засобу ken (з приватного репозиторію) в середовищі UNIX-подібних операційних систем Linux](#unix-deployment-ua)**
- **[Компіляція, збірка та розгортання мережевого засобу ken (з приватного репозиторію) в середовищі програми віртуалізації для операційних систем VirtualBox](#virtualbox-deployment-ua)**
- **[Компіляція, збірка та розгортання мережевого засобу ken (з приватного репозиторію) в середовищі операційної системй Windows 7 та вище](#windows-deployment-ua)**
- **[Опис служб (веб-сервісів) мережевого засобу ken (konspekt English) доступних розробнику](#api-ua)**
- **[Опис вхідних даних](#about-input-data-ua)**
- **[Опис вихідних даних](#about-output-data-ua)**
- **[Дистрибуція мережевого засобу (у вигляді веб-сервісу з API) ken (konspekt English)](#deployment-ua)**

-------

<a name="features-ua"></a>
## Призначення та функції

Мережевий засіб (у вигляді веб-сервісу з API) **ken** (konspekt English) призначений для виділення термінів з англомовних природномовних текстів з використанням бібліотеки з відкритим вихідним кодом для передової обробки природних мов - [spaCy](https://spacy.io/).

Мережевий засіб (у вигляді веб-сервісу з API) **ken** (konspekt English) охоплює всі найважливіші етапи обробки природної мови, а саме:

- екстракт тексту з документів форматів `pdf`, `docx`, `txt`;
- базова нормалізація текстів - так званий лінгвістичний препроцесінг (виправлення дефектів отриманих в результаті процедури екстракту тексту з документів `pdf`, `docx`, `txt`);
- перевірка орфографії тексту та автоматичне виправлення помилок;
- базова сегментація тексту на речення;
- розмічування частин мови (англ. part-of-speech tagging) для кожного речення тексту (поверхневий синтаксичний аналіз);
- лематизація слів (приведення до словарної форми слова) на рівні речення;
- стемінг (англ. stemming) слів (процес скорочення слова до основи шляхом відкидання допоміжних частин, таких як закінчення чи суфікс) на рівні речення;
- екстракт термінів (так званих `base noun phrases`, `noun chunks`), більше детально процес екстракту термінів описано за посиланнями: [spaCy dependency-parse](https://spacy.io/usage/linguistic-features#dependency-parse) та [Wikipedia Noun phrase](https://en.wikipedia.org/wiki/Noun_phrase);
- формування спеціалізованої `xml`-структури тексту.


<a name="system-requirements-ua"></a>
## Системні вимоги

- **[Для компіляції, збірки та розгортання мережевого засобу `ken` (з приватного репозиторію) в середовищі `UNIX`-подібних операційних систем `Linux`](#system-requirements-1)**<br>
- **[Для компіляції, збірки та розгортання мережевого засобу `ken` (з приватного репозиторію) в середовищі програми віртуалізації для операційних систем `VirtualBox`](#system-requirements-2)**<br>


<a name="unix-deployment-ua"></a>
## Компіляція, збірка та розгортання мережевого засобу `ken` ([з приватного репозиторію](https://github.com/malakhovks/ken)) в середовищі [UNIX](https://uk.wikipedia.org/wiki/UNIX)-подібних операційних систем `Linux`

<a name="system-requirements-1"></a>
##### Системні вимоги

- мінімальні апаратні ресурси: `x86-64` сумісний процесор з тактовою частотою 1 ГГц; оперативна пам'ять: 512 Мб; Місце на жорсткому диску: 2,5 Гб;
- [UNIX](https://uk.wikipedia.org/wiki/UNIX)-подібна операційна система `Linux`: [Ubuntu Server 18.04 LTS x86-64](https://www.ubuntu.com/download/server) або новіша; [Alpine Linux 3.9.4 x86-64](https://alpinelinux.org/downloads/) або новіша;
- [Git](https://git-scm.com/) розподілена система керування версіями файлів та спільної роботи;
- [Docker CE](https://docs.docker.com) інструментарій для управління ізольованими `Linux`-контейнерами;
- обліковий запис [GitHub](https://github.com) та ключ розгортання [Deploy key](https://developer.github.com/v3/guides/managing-deploy-keys/);
- швидкісне підключення до мережі Інтернет.


##### Компіляція, збірка та розгортання мережевого засобу ken в середовищі [UNIX](https://uk.wikipedia.org/wiki/UNIX)-подібних операційних систем `Linux` складається з наступних етапів:

1. Клонування початкового коду програми `ken` з [приватного `git`-репозиторію](https://github.com/malakhovks/ken) сервісу [GitHub](https://github.com). Цей етап можна виконати використовуючи особистий маркер доступу `token` до [приватного репозиторію](https://github.com/malakhovks/ken) [GitHub](https://github.com) або використовуючи ключ розгортання [Deploy key](https://developer.github.com/v3/guides/managing-deploy-keys/) до [приватного репозиторію](https://github.com/malakhovks/ken) [GitHub](https://github.com).

**Клонування початкового коду програми `ken`  з [приватного  `git`-репозиторію](https://github.com/malakhovks/ken) сервісу [GitHub](https://github.com) використовуючи особистий маркер доступу `token`:**

```bash
git clone https://username1:token@github.com/username/repo_name.git
```
де:

`username1` - Ваше ім'я користувача [GitHub](https://github.com);

`token` - Personal access tokens - особистий маркер доступу до [приватного репозиторію](https://github.com/malakhovks/ken) [GitHub](https://github.com);

`username1` - Ваше ім'я користувача [GitHub](https://github.com);

`github.com/username/repo_name.git` - адреса приватного git-репозиторію сервісу [GitHub](https://github.com), тобто `github.com/malakhovks/ken.git`.

**Приклад:**

```bash
git clone https://Velychko-Vitalii:ae9c2fa2d73fbbb0bd0a5ffa746f1df59036815d@github.com/malakhovks/ken.git
```
**Або** клонувати початковий код програми `ken` з [приватного `git`-репозиторію](https://github.com/malakhovks/ken) сервісу [GitHub](https://github.com) **з конкретної гілки/тега**  використовуючи наступну команду:

```bash
git clone --depth=1 --branch=tag_name repo_url
```
де:

`tag_name` - ім'я гілки/тега;

`repo_url` - https-адреса приватного репозиторія з параметрами авторизації.

**Приклад:**
```bash
git clone --depth=1 --branch=develop https://Velychko-Vitalii:ae9c2fa2d73fbbb0bd0a5ffa746f1df59036815d@github.com/malakhovks/ken.git
```

**Клонування початкового коду програми `ken` з [приватного `git`-репозиторію](https://github.com/malakhovks/ken) сервісу [GitHub](https://github.com) використовуючи ключ розгортання [Deploy key](https://developer.github.com/v3/guides/managing-deploy-keys/):**

*Настанови цього етапу в розробці.*

2. Перехід в діректорію програми `ken`:
```bash
cd ken
```

3. Перехід в гілку, яку потрібно використовувати для компіляції/збірки, командою `git checkout`:
```bash
git checkout branch_name
```
де:

`<branch_name>` - ім'я гілки;

`git`-репозиторій програми ken має дві основні гілки: `develop` та `master`.

Гілка `master` містить стабільний початковий код програми `ken`.

Гілка `develop` містить робочий початковий код програми `ken`.

**Приклад:**
```bash
git checkout master
```

4. Створення ізольованого застосунку [Docker](https://uk.wikipedia.org/wiki/Docker), так званого `docker image` з файлу `Dockerfile`:

```bash
docker build . -t imagename
```
де:

 `imagename` - ім'я ізольованого застосунку `docker image`.

**Приклад:**

```bash
docker build . -t ken_image
```
Створення ізольованого застосунку `ken_image` може зайняти тривалий час в жалежності від потужностей апаратного забезпечення.
Повна документація по командам `Docker` доступна за посиланням [Docker documentation](https://docs.docker.com).

5. Запуск створеного ізольованого застосунку `ken_image` в контейнері `ken`:
```bash
docker run --restart always --name ken -d -p 80:80 ken_image 
```
Команда `docker run` з параметром `--restart always` дозволяє автоматично перезапускати при перезавантаженні операцийноъ системы, що дозволяє досягти безперебійної роботи сервісу.

##### Основні команди керування [Docker](https://docs.docker.com)-контейнером:

- `docker attach ken` - побачити вихід конслолі контейнера `ken`;
- `docker stop ken` - зупинити контейнер `ken`;
- `docker start ken` - відновити роботу (старт) контейнера `ken`;
- `docker rm ken` - видалення контейнера `ken` (перед видаленням контейнера, його потрібно зупинити);

##### Деякі корисні параметри для запуску [Docker](https://docs.docker.com)-контейнера:

- `--name` - дає контейнеру ім'я, яке можна знайти у виводі команди `docker ps`;
- `-p 80:80` - публікує порт 80. Другий номер 80 після двокрапки повідомляє, який порт сервер `nginx` слухає всередині контейнера;
- `-d` - запускає контейнер, від'єднаний від терміналу. Потім журнали можна переглядати за допомогою команди журналів [Docker](https://docs.docker.com) `docker logs`;
- `-t` - щоб бачити консольний вихід [Docker](https://docs.docker.com)-контейнера;
- `--restart on-failure` - автоматичний перезапуск невдалих контейнерів. Перезапускає контейнер, якщо він вийде з ладу через помилку, яка виявляється як ненульовий код виходу;
- `--restart always` - завжди перезапускає контейнер, якщо він зупиняється. Якщо контейнер зупинено вручну, він перезапускається лише тоді, коли служба `Docker` перезапускається або сам контейнер перезапускається вручну.


<a name="virtualbox-deployment-ua"></a>
## Компіляція, збірка та розгортання мережевого засобу `ken` ([з приватного репозиторію](https://github.com/malakhovks/ken)) в середовищі програми віртуалізації для операційних систем [VirtualBox](https://uk.wikipedia.org/wiki/VirtualBox)

<a name="system-requirements-2"></a>
##### Системні вимоги

- мінімальні апаратні ресурси: `x86-64` сумісний процесор з тактовою частотою 2 ГГц; оперативна пам'ять: 4 Гб; Місце на жорсткому диску: 20 Гб;
- x86-64 сумісна [UNIX](https://uk.wikipedia.org/wiki/UNIX)-подібна операційна система `Linux`; x86-64 сумісна операційна система `Microsoft Windows 7 Service Pack 1` або новіша;
- [VirtualBox](https://www.virtualbox.org/) програма віртуалізації для операційних систем версії `VirtualBox 6.0.8` або новіша;
- Віртуальна машина з операійною системою [Alpine Linux 3.9.4 x86-64](https://alpinelinux.org/downloads/) або новіша, яка включає наступне встановлене програмне забезпечення: [Git](https://git-scm.com/) розподілена система керування версіями файлів та спільної роботи; [Docker CE](https://docs.docker.com) інструментарій для управління ізольованими `Linux`-контейнерами;
- обліковий запис [GitHub](https://github.com) та ключ розгортання [Deploy key](https://developer.github.com/v3/guides/managing-deploy-keys/);
- швидкісне підключення до мережі Інтернет;

Віртуальна машина - модель обчислювальної машини, створеної шляхом віртуалізації обчислювальних ресурсів: процесора, оперативної пам'яті, пристроїв зберігання та вводу і виводу інформації.
Віртуальна машина на відміну від програми емуляції конкретного пристрою забезпечує повну емуляцію фізичної машини чи середовища виконання (для програми).

**VirtualBox** - програма для створення віртуальних машин, що належить Oracle Corporation. Ця програма є в вільному доступі та підтримується основними операційними системами *Linux, FreeBSD, Mac OS X, OS/2 Warp, Microsoft Windows*, які підтримують роботу гостьових операційних систем FreeBSD, Linux, OpenBSD, OS/2 Warp, Windows і Solaris.

##### Ключові можливості

- кроссплатформовість;
- модульність;
- жива міграція;
- підтримка USB 2.0, коли пристрої хост-машини стають доступними для гостьових ОС (лише в пропрієтарній версії);
- підтримка 64-бітних гостьових систем[2] (починаючи з версії 2.0), навіть на 32-бітних хост-системах[3] (починаючи з версії 2.1, для цього потрібна підтримка технології віртуалізації процесором);
- підтримка SMP на стороні гостьової системи (починаючи з версії 3.0, для цього потрібна підтримка технології віртуалізації процесором);
- вбудований RDP-сервер, а також підтримка клієнтських USB-пристроїв поверх протоколу RDP (лише в пропрієтарній версії);
- експериментальна підтримка апаратного 3D-прискорення (OpenGL, DirectX 8/9 (з використанням коду wine) (лише в 32-бітних Windows XP и Vista)), для гостьових DOS / Windows 3.x / 95 / 98 / ME підтримка апаратного 3D-прискорення не передбачена;
- підтримка образів жостких дисків VMDK (VMware) и VHD (Microsoft Virtual PC), включаючи snapshots (починаючи з версії 2.1[4]);
- підтримка iSCSI (лише в пропрієтарній версії);
- підтримка віртуалізації аудіопристроїв (емуляція AC97 або SoundBlaster 16 на вибір);
- підтримка різноманітних видів мережевої взаємодії (NAT, Host Networking via Bridged, Internal);
- підтримка ланцюжка збережених станів віртуальної машини (snapshots), до яких можна повернутися з будь-якого стану гостьової системи;
- підтримка Shared Folders для простого обміну файлами між хостовою та гостьовою системами (для гостьових систем Windows 2000 і новіше, Linux та Solaris);
- підтримка інтеграції робочих столів (seamless mode) хостової та гостьової ОС;
- є можливість вибору мови інтерфейса (підтримується і україномовний інтерфейс).

##### Компіляція, збірка та розгортання мережевого засобу `ken` ([з приватного репозиторію](https://github.com/malakhovks/ken)) в середовищі програми віртуалізації для операційних систем [VirtualBox](https://uk.wikipedia.org/wiki/VirtualBox) складається з наступних етапів:

1. Створення віртуальної машини з операійною системою [Alpine Linux 3.9.4 x86-64](https://alpinelinux.org/downloads/) або новішою, згідно настановам користувача наведених на офіційному сайті [`wiki`-документації VirtualBox](https://www.virtualbox.org/wiki/Documentation).
Встановити апаратні ресурси для віртуальної машини згідно прогнозованого навантаження на сервіс `ken`.

2. Встановлення [Git](https://git-scm.com/) та [Docker CE](https://docs.docker.com) в середовиші віртуальної машини з операційною системою [Alpine Linux 3.9.4 x86-64](https://alpinelinux.org/downloads/) згідно настановам користувача наведених на офіційному сайті [`wiki`-документації wiki.alpinelinux.org](https://wiki.alpinelinux.org/wiki/Main_Page).

3. Клонування початкового коду програми `ken` з [приватного `git`-репозиторію](https://github.com/malakhovks/ken) сервісу [GitHub](https://github.com). Цей етап можна виконати використовуючи особистий маркер доступу `token` до [приватного репозиторію](https://github.com/malakhovks/ken) [GitHub](https://github.com) або використовуючи ключ розгортання [Deploy key](https://developer.github.com/v3/guides/managing-deploy-keys/) до [приватного репозиторію](https://github.com/malakhovks/ken) [GitHub](https://github.com). 

**Клонування початкового коду програми `ken`  з [приватного  `git`-репозиторію](https://github.com/malakhovks/ken) сервісу [GitHub](https://github.com) використовуючи особистий маркер доступу `token`:**
```bash
git clone https://username1:token@github.com/username/repo_name.git
```
де:

`username1` - Ваше ім'я користувача [GitHub](https://github.com);

`token` - Personal access tokens - особистий маркер доступу до [приватного репозиторію](https://github.com/malakhovks/ken) [GitHub](https://github.com);

`username1` - Ваше ім'я користувача [GitHub](https://github.com);

`github.com/username/repo_name.git` - адреса приватного git-репозиторію сервісу [GitHub](https://github.com), тобто `github.com/malakhovks/ken.git`.

**Приклад:**

```bash
git clone https://Velychko-Vitalii:ae9c2fa2d73fbbb0bd0a5ffa746f1df59036815d@github.com/malakhovks/ken.git
```
**Або** клонувати початковий код програми `ken` з [приватного `git`-репозиторію](https://github.com/malakhovks/ken) сервісу [GitHub](https://github.com) **з конкретної гілки/тега**  використовуючи наступну команду:

```bash
git clone --depth=1 --branch=tag_name repo_url
```
де:

`tag_name` - ім'я гілки/тега;

`repo_url` - https-адреса приватного репозиторія з параметрами авторизації.

**Приклад:**
```bash
git clone --depth=1 --branch=develop https://Velychko-Vitalii:ae9c2fa2d73fbbb0bd0a5ffa746f1df59036815d@github.com/malakhovks/ken.git
```

**Клонування початкового коду програми `ken` з [приватного `git`-репозиторію](https://github.com/malakhovks/ken) сервісу [GitHub](https://github.com) використовуючи ключ розгортання [Deploy key](https://developer.github.com/v3/guides/managing-deploy-keys/):**

*Настанови цього етапу в розробці.*

4. Перехід в діректорію програми `ken`:
```bash
cd ken
```

5. Перехід в гілку, яку потрібно використовувати для компіляції/збірки, командою `git checkout`:
```bash
git checkout branch_name
```
де:

`<branch_name>` - ім'я гілки;

`git`-репозиторій програми ken має дві основні гілки: `develop` та `master`.

Гілка `master` містить стабільний початковий код програми `ken`.

Гілка `develop` містить робочий початковий код програми `ken`.

**Приклад:**
```bash
git checkout master
```

6. Створення ізольованого застосунку [Docker](https://uk.wikipedia.org/wiki/Docker), так званого `docker image` з файлу `Dockerfile`:

```bash
docker build . -t imagename
```
де:

 `imagename` - ім'я ізольованого застосунку `docker image`.

**Приклад:**

```bash
docker build . -t ken_image
```
Створення ізольованого застосунку `ken_image` може зайняти тривалий час в жалежності від потужностей апаратного забезпечення.
Повна документація по командам `Docker` доступна за посиланням [Docker documentation](https://docs.docker.com).

7. Запуск створеного ізольованого застосунку `ken_image` в контейнері `ken`:
```bash
docker run --restart always --name ken -d -p 80:80 ken_image 
```
Команда `docker run` з параметром `--restart always` дозволяє автоматично перезапускати при перезавантаженні операцийноъ системы, що дозволяє досягти безперебійної роботи сервісу.

##### Основні команди керування [Docker](https://docs.docker.com)-контейнером:

- `docker attach ken` - побачити вихід конслолі контейнера `ken`;
- `docker stop ken` - зупинити контейнер `ken`;
- `docker start ken` - відновити роботу (старт) контейнера `ken`;
- `docker rm ken` - видалення контейнера `ken` (перед видаленням контейнера, його потрібно зупинити);

##### Деякі корисні параметри для запуску [Docker](https://docs.docker.com)-контейнера:

- `--name` - дає контейнеру ім'я, яке можна знайти у виводі команди `docker ps`;
- `-p 80:80` - публікує порт 80. Другий номер 80 після двокрапки повідомляє, який порт сервер `nginx` слухає всередині контейнера;
- `-d` - запускає контейнер, від'єднаний від терміналу. Потім журнали можна переглядати за допомогою команди журналів [Docker](https://docs.docker.com) `docker logs`;
- `-t` - щоб бачити консольний вихід [Docker](https://docs.docker.com)-контейнера;
- `--restart on-failure` - автоматичний перезапуск невдалих контейнерів. Перезапускає контейнер, якщо він вийде з ладу через помилку, яка виявляється як ненульовий код виходу;
- `--restart always` - завжди перезапускає контейнер, якщо він зупиняється. Якщо контейнер зупинено вручну, він перезапускається лише тоді, коли служба `Docker` перезапускається або сам контейнер перезапускається вручну.

<a name="windows-deployment-ua"></a>
## Компіляція, збірка та розгортання мережевого засобу ken ([з приватного репозиторію](https://github.com/malakhovks/ken)) в середовищі операційної системй Windows 7 та вище

*Настанови цього етапу в розробці.*

<a name="system-requirements-3"></a>

##### Системні вимоги


<a name="api-ua"></a>

## Опис служб (веб-сервісів) мережевого засобу `ken` (konspekt English) доступних розробнику

Розробнику доступні наступні служби через кінцеві точки API (API endpoints):
| Позначення |Служба|Кінцева точка API|
| :--------: | :---------------------: | :--------- |
|    **S1**    | формування спеціалізованої `xml`-структури тексту *allterms.xml* |/ken/api/v1.0/en/file/allterms|
| **S2** | формування спеціалізованої `xml`-структури тексту *parce.xml* |/ken/api/v1.0/en/file/parcexml|
| **S3** | візуалізації залежностей термінів |/ken/api/v1.0/en/html/depparse/nounchunk|
| **S4** | візуалізації іменованих сутностей тексту |/ken/api/v1.0/en/html/ner|
| **S4** | візуалізації синтаксичних залежностей речення |/ken/api/v1.0/en/html/depparse/sentence|
| **S5** | графічного інтерфейсу користувача |/|

## Опис вхідних даних
```

```

<a name="about-output-data-ua"></a>

## Опис вихідних даних
```

```

<a name="deployment-ua"></a>

## Дистрибуція мережевого засобу (у вигляді веб-сервісу з API) **ken** (konspekt English)
*Настанови цього етапу в розробці*

<!--<p style="text-align: center;">Настанови цього етапу в розробці.</p>-->

