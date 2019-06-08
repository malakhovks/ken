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
- **[Інструментарій для управління ізольованими Linux-контейнерами Docker](#docker-ua)**
- **[Архітектура мережевого засобу ken (konspekt English)](#architecture-ua)**
- **[Компіляція, збірка та розгортання мережевого засобу ken (з приватного репозиторію) в середовищі UNIX-подібних операційних систем Linux](#unix-deployment-ua)**
- **[Компіляція, збірка та розгортання мережевого засобу ken (з приватного репозиторію) в середовищі програми віртуалізації для операційних систем VirtualBox](#virtualbox-deployment-ua)**
- **[Компіляція, збірка та розгортання мережевого засобу ken (з приватного репозиторію) в середовищі операційної системй Windows 7 та вище](#windows-deployment-ua)**
- **[Опис служб (веб-сервісів) мережевого засобу ken (konspekt English) доступних розробнику](#api-ua)**
- **[Дистрибуція мережевого засобу (у вигляді веб-сервісу з API) ken (konspekt English)](#deployment-ua)**
- **[Корисні посилання](#references-ua)**

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

-------

<a name="system-requirements-ua"></a>
## Системні вимоги

- **[Для компіляції, збірки та розгортання мережевого засобу `ken` (з приватного репозиторію) в середовищі `UNIX`-подібних операційних систем `Linux`](#system-requirements-1)**<br>
- **[Для компіляції, збірки та розгортання мережевого засобу `ken` (з приватного репозиторію) в середовищі програми віртуалізації для операційних систем `VirtualBox`](#system-requirements-2)**<br>

-------

<a name="docker-ua"></a>

## Інструментарій для управління ізольованими Linux-контейнерами Docker

[Docker](https://www.docker.com/) — інструмент з відкритим сирцевим кодом, який автоматизує розгортання застосунку у середовищах, що підтримують контейнеризацію. Docker допомагає викладати код швидше, швидше тестувати, швидше викладати додатки і зменшити час між написанням і запуском коду. Docker робить це за допомогою легкої платформи контейнерної віртуалізації, використовуючи процеси і утиліти, які допомагають керувати і викладати програми. У своєму ядрі docker дозволяє запускати практично будь-який додаток, безпечно ізольований в контейнері. Безпечна ізоляція дозволяє запускати на одному хості багато контейнерів одночасно.

**Переваги Docker:**

- пришвидшення процесу розробки;
- зручна інкапсуляція застосунку;
- однакова поведінка на локальній машині, а також dev/staging/production серверах;
- простий і чіткий моніторинг;
- зручність масштабування.

#### Термінологія Docker-інструментарію

- Контейнер `(Container)` — запущений екземпляр, що інкапсулює необхідне ПЗ. Контейнери завжди створюються з образу і можуть надавати порти та дисковий простір для взаємодії з іншими контейнерами чи/та зовнішнім ПЗ. Контейнери можна з легкістю знищити/видалити та створити знову. Контейнери не зберігають стан.
- Образ `(Image)` — базовий елемент кожного контейнеру. При створенні образу кожен крок кешується і може бути використаний повторно (копіювання під час запису). Час на збірку залежить від самого образу. З іншого боку: контейнери можна одразу запустити з образу.
- Порт `(Port)` — TCP/UDP порт у своєму звичному розумінні. Для спрощення припустимо, що порти можуть бути відкриті для зовнішнього ПЗ (доступні з хостової ОС) або підключатися до інших контейнерів (тобто доступні лише з цих контейнерів та невидимі для іншого ПЗ).
- `Volume` можна вважати спільною текою. Volume ініціалізується при створенні контейнеру і призначений для збереження даних, незалежно від життєвого циклу контейнера.
- `Registry` (Сховище) — сервер, що зберігає образи Docker. Ми можемо порівняти його з Github: витягуєте образ зі сховища, щоб розгорнути його локально, а потім відправляєте локально зібрані образи до віддаленого сховища.
- [Docker Hub](https://hub.docker.com/explore/) — сховище з веб-інтерфейсом від Docker Inc. Зберігає багато Docker-образів з різним ПЗ. Docker Hub — джерело «офіційних» образів Docker, створених їх командою або у співпраці з іншими компаніями (але це не обов’язково образи від офіційних виробників ПЗ). Якщо ви зареєстровані, можна переглянути перелік потенційних вразливостей таких образів. Доступні платні та безкоштовні облікові записи. Для безкоштовного облікового запису можна створювати один приватний образ та безліч публічних.
- [Docker Store](https://hub.docker.com/search/?q=&type=image) — сервіс дуже подібний на Docker Hub. Це майданчик з рейтингами, відгуками тощо.

#### Архітектура Docker

Docker складається з двох головних компонентів:

- Docker: платформа віртуалізації з відкритим кодом;
- Docker Hub: платформа-як-сервіс для поширення і управління docker
контейнерами.

Docker використовує архітектуру клієнт-сервер. Docker клієнт спілкується з демоном Docker, який бере на себе створення, запуск, розподіл контейнерів. Обидва, клієнт і сервер можуть працювати на одній системі, також можна підключити клієнт до віддаленого демона docker. Клієнт і сервер спілкуються через сокет або через RESTful API.

Користувач не взаємодіє з сервером на пряму, а використовує для цього клієнт. Docker- клієнт - головний інтерфейс до Docker системи. Він отримує команди від користувача і взаємодіє з docker-демоном.

Щоб розуміти, з чого складається docker, потрібно знати про три його компоненти:

- образи (images);
- реєстр (registries) контейнери;

Docker-образ - це read-only шаблон. Наприклад, образ може містити операційну систему Ubuntu з Apache і додатком на ній. Образи використовуються для створення контейнерів. Docker дозволяє легко створювати нові образи, оновлювати існуючі, або можна завантажити образи створені іншими людьми. Образи - це компонента збірки docker-а.
Docker-реєстр зберігає образи. Є публічні і приватні реєстри, з яких можна скачати або завантажити образи. Публічний Docker-реєстр - це Docker Hub. Там зберігається величезна колекція образів. Образи можуть бути створені вами або можна використовувати образи створені іншими користувачами. Реєстри - це компонента поширення.

Контейнери схожі на директорії. У контейнерах міститься все, що потрібно для роботи програми. Кожен контейнер створюється з образу. Контейнери можуть бути створені, запущені, зупинені, перенесені або видалені. Кожен контейнер ізольований і є безпечною платформою для додатка. Контейнери - це компонента роботи. Виходячи з цих трьох компонентів в Docker можна:

- створювати образи, в яких знаходяться додатки;
- створювати контейнери з образів, для запуску додатків;
- розповсюдженню через Docker Hub або інший реєстр образів.

#### Принцип роботи Docker

Отже образ - це read-only шаблон, з якого створюється контейнер. Кожен образ складається з набору рівнів. Docker використовує union file system для поєднання цих рівнів в один образ. Union file system дозволяє файлам і директоріями з різних файлових систем (різних гілок) прозоро накладатися, створюючи когерентну файлову систему.

Одна з причин, по якій docker легкий - це використання таких рівнів. Коли змінюється образ, наприклад, проходить оновлення додатку, створюється новий рівень. Так, без заміни всього образу або його перезібрання, як вам можливо доведеться зробити з віртуальною машиною, тільки рівень додається або оновлюється. І вам не потрібно роздавати весь новий образ, публікується тільки оновлення, що дозволяє поширювати образи простіше і швидше.

В основі кожного образу знаходиться базовий образ. Наприклад, ubuntu, базовий образ [Ubuntu](https://www.ubuntu.com/download/server), або fedora, базовий образ дистрибутива [Fedora](https://getfedora.org/). Так само можна використовувати готові образи як базу для створення нових образів. Наприклад, образ apache можна використовувати як базовий образ для веб- додатків. Docker зазвичай бере образи з реєстру [Docker Hub](https://hub.docker.com).

Docker образи можуть створитися з цих базових образів, кроки опису для створення цих образів називаються інструкціями. Кожна інструкція створює новий образ або рівень. Інструкціями будуть наступні дії:
- запуск команди;
- додавання файлу або директорії;
- створення змінної оточення;
- вказівки що запускати коли запускається контейнер цього способу.

Ці інструкції зберігаються в файлі Dockerfile. Docker зчитує цей Dockerfile, коли збирається образ, виконує ці інструкції, і повертає кінцевий образ.

Реєстр - це сховище docker образів. Після створення образу ви можете опублікувати його на публічному реєстрі Docker Hub або на вашому особистому реєстрі. За допомогою docker клієнта ви можете шукати вже опубліковані образи і завантажувати їх на машину з docker для створення контейнерів.

Docker Hub надає публічні і приватні сховища образів. Пошук і скачування образів з публічних сховищ доступний для всіх. Вміст приватних сховищ не попадає в результат пошуку. І тільки ви і ваші користувачі можуть отримувати ці образи і створювати з них контейнери.

#### Принцип роботи контейнера

Контейнер складається з операційної системи, призначених для користувача файлів і метаданих. Відомо, що кожен контейнер створюється з образу. Цей образ говорить docker-у, що знаходиться в контейнері, який процес запустити, коли запускається контейнер та інші конфігураційні дані. Docker образ доступний тільки для читання. Коли docker запускає контейнер, він створює рівень для читання / запису зверху образу (використовуючи union file system, як було зазначено раніше), в якому може бути запущено додаток.

Або за допомогою програми docker, або за допомогою RESTful API, docker клієнт говорить docker-демону запустити контейнер.

```bash
$ sudo docker run -i -t ubuntu /bin/bash
```
Давайте розберемося з цією командою. Клієнт запускається за допомогою команди docker, з опцією run, яка говорить, що буде запущений новий контейнер. Мінімальними вимогами для запуску контейнера є такі атрибути:
- який образ використовувати для створення контейнера. У нашому випадку ubuntu;
- команду яку ви хочете запустити коли контейнер буде запущений. У нашому випадку /bin/bash.

Після запуску цієї команди Docker, по порядку, робить наступне:
- завантажує образ ubuntu: docker перевіряє наявність образу ubuntu на локальній машині, і якщо його немає - то викачує його з Docker Hub. Якщо ж образ є, то використовує його для створення контейнера;
- створює контейнер: коли образ отриманий, docker використовує його для
створення контейнера;
- ініціалізує файлову систему і монтує read-only рівень: контейнер
створений в файлової системі і read-only рівень доданий образ;
- ініціалізує мережу / міст: створює мережевий інтерфейс, який дозволяє
docker-у спілкуватися хост машиною;
- установка IP адреси: знаходить і задає адресу;
- запускає вказаний процес: запускає програму;
- обробляє та видає вихід додатку: підключається і залоговує стандартний
вхід, вихід і потік помилок додатку, щоб можна було відслідковувати як працює програма.

Тепер у вас є робочий контейнер. Ви можете управляти своїм
контейнером, взаємодіяти з вашим додатком. Коли вирішите зупинити додаток, видаліть контейнер.

#### Технології, використані у Docker

Докер написаний на мові Go і використовує деякі можливості ядра Linux, щоб реалізувати наведений вище функціонал.

Docker використовує технологію namespaces для організації ізольованих робочих просторів, які називаються контейнерами. Коли запускається контейнер, docker створює набір просторів імен для даного контейнера. Це створює ізольований рівень, кожен контейнер запущений в своєму просторі імен, і не має доступ до зовнішньої системи.

Список деяких просторів імен, які використовує docker:

- `pid`: для ізоляції процесу;
- `net`: для управління мережевими інтерфейсами;
- `ipc`: для управління IPC ресурсами. (ICP: InterProccess Communication);
- `mnt`: для управління точками монтування;
- `utc`: для ізолювання ядра і контролю генерації версій (UTC: Unix
timesharing system).

Control groups (контрольні групи). Docker також використовує технологію cgroups або контрольні групи. Ключ до роботи додатка в ізоляції, надання додатку тільки тих ресурсів, які йому потрібно. Це гарантує, що контейнери будуть добре співіснувати. Контрольні групи дозволяють розділяти доступні ресурси заліза і якщо необхідно, встановлювати межі і обмеження. Наприклад, обмежити можливу кількість пам'яті, що використовується контейнером.

Union File Sysem або UnionFS - це файлова система, яка працює створюючи рівні, що робить її дуже легкою і швидкою. Docker використовує UnionFS для створення блоків, з яких будується контейнер. Docker може використовувати кілька варіантів UnionFS включаючи: AUFS, btrfs, vfs і DeviceMapper.

Docker поєднує ці компоненти в обгортку, яку ми називаємо форматом контейнера. Формат, який використовується за умовчанням, називається libcontainer. Так само docker підтримує традиційний формат контейнерів в Linux з допомогою LXC. В майбутньому Docker можливо буде підтримувати інші формати контейнерів. Наприклад, інтегруючись з BSD Jails або Solaris Zones.

-------

<a name="architecture-ua"></a>
## Архітектура мережевого засобу ken (konspekt English)

*Розділ в розробці.*

-------

<a name="unix-deployment-ua"></a>
## Компіляція, збірка та розгортання мережевого засобу `ken` ([з приватного репозиторію](https://github.com/malakhovks/ken)) в середовищі [UNIX](https://uk.wikipedia.org/wiki/UNIX)-подібних операційних систем `Linux`

<a name="system-requirements-1"></a>
#### Системні вимоги

- мінімальні апаратні ресурси: `x86-64` сумісний процесор з тактовою частотою 1 ГГц; оперативна пам'ять: 512 Мб; Місце на жорсткому диску: 2,5 Гб;
- [UNIX](https://uk.wikipedia.org/wiki/UNIX)-подібна операційна система `Linux`: [Ubuntu Server 18.04 LTS x86-64](https://www.ubuntu.com/download/server) або новіша; [Alpine Linux 3.9.4 x86-64](https://alpinelinux.org/downloads/) або новіша;
- [Git](https://git-scm.com/) розподілена система керування версіями файлів та спільної роботи;
- [Docker CE](https://docs.docker.com) інструментарій для управління ізольованими `Linux`-контейнерами;
- обліковий запис [GitHub](https://github.com) та ключ розгортання [Deploy key](https://developer.github.com/v3/guides/managing-deploy-keys/);
- швидкісне підключення до мережі Інтернет.


#### Компіляція, збірка та розгортання мережевого засобу ken в середовищі [UNIX](https://uk.wikipedia.org/wiki/UNIX)-подібних операційних систем `Linux` складається з наступних етапів:

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
<!---
**Клонування початкового коду програми `ken` з [приватного `git`-репозиторію](https://github.com/malakhovks/ken) сервісу [GitHub](https://github.com) використовуючи ключ розгортання [Deploy key](https://developer.github.com/v3/guides/managing-deploy-keys/):**

*Настанови цього етапу в розробці.*
-->

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

#### Основні команди керування [Docker](https://docs.docker.com)-контейнером:

- `docker attach ken` - побачити вихід конслолі контейнера `ken`;
- `docker stop ken` - зупинити контейнер `ken`;
- `docker start ken` - відновити роботу (старт) контейнера `ken`;
- `docker rm ken` - видалення контейнера `ken` (перед видаленням контейнера, його потрібно зупинити);

#### Деякі корисні параметри для запуску [Docker](https://docs.docker.com)-контейнера:

- `--name` - дає контейнеру ім'я, яке можна знайти у виводі команди `docker ps`;
- `-p 80:80` - публікує порт 80. Другий номер 80 після двокрапки повідомляє, який порт сервер `nginx` слухає всередині контейнера;
- `-d` - запускає контейнер, від'єднаний від терміналу. Потім журнали можна переглядати за допомогою команди журналів [Docker](https://docs.docker.com) `docker logs`;
- `-t` - щоб бачити консольний вихід [Docker](https://docs.docker.com)-контейнера;
- `--restart on-failure` - автоматичний перезапуск невдалих контейнерів. Перезапускає контейнер, якщо він вийде з ладу через помилку, яка виявляється як ненульовий код виходу;
- `--restart always` - завжди перезапускає контейнер, якщо він зупиняється. Якщо контейнер зупинено вручну, він перезапускається лише тоді, коли служба `Docker` перезапускається або сам контейнер перезапускається вручну.

-------

<a name="virtualbox-deployment-ua"></a>
## Компіляція, збірка та розгортання мережевого засобу `ken` ([з приватного репозиторію](https://github.com/malakhovks/ken)) в середовищі програми віртуалізації для операційних систем [VirtualBox](https://uk.wikipedia.org/wiki/VirtualBox)

<a name="system-requirements-2"></a>
#### Системні вимоги

- мінімальні апаратні ресурси: `x86-64` сумісний процесор з тактовою частотою 2 ГГц; оперативна пам'ять: 4 Гб; Місце на жорсткому диску: 20 Гб;
- x86-64 сумісна [UNIX](https://uk.wikipedia.org/wiki/UNIX)-подібна операційна система `Linux`; x86-64 сумісна операційна система `Microsoft Windows 7 Service Pack 1` або новіша;
- [VirtualBox](https://www.virtualbox.org/) програма віртуалізації для операційних систем версії `VirtualBox 6.0.8` або новіша;
- Віртуальна машина з операійною системою [Alpine Linux 3.9.4 x86-64](https://alpinelinux.org/downloads/) або новіша, яка включає наступне встановлене програмне забезпечення: [Git](https://git-scm.com/) розподілена система керування версіями файлів та спільної роботи; [Docker CE](https://docs.docker.com) інструментарій для управління ізольованими `Linux`-контейнерами;
- обліковий запис [GitHub](https://github.com) та ключ розгортання [Deploy key](https://developer.github.com/v3/guides/managing-deploy-keys/);
- швидкісне підключення до мережі Інтернет;

Віртуальна машина - модель обчислювальної машини, створеної шляхом віртуалізації обчислювальних ресурсів: процесора, оперативної пам'яті, пристроїв зберігання та вводу і виводу інформації.
Віртуальна машина на відміну від програми емуляції конкретного пристрою забезпечує повну емуляцію фізичної машини чи середовища виконання (для програми).

**VirtualBox** - програма для створення віртуальних машин, що належить Oracle Corporation. Ця програма є в вільному доступі та підтримується основними операційними системами *Linux, FreeBSD, Mac OS X, OS/2 Warp, Microsoft Windows*, які підтримують роботу гостьових операційних систем FreeBSD, Linux, OpenBSD, OS/2 Warp, Windows і Solaris.

#### Ключові можливості

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

#### Компіляція, збірка та розгортання мережевого засобу `ken` ([з приватного репозиторію](https://github.com/malakhovks/ken)) в середовищі програми віртуалізації для операційних систем [VirtualBox](https://uk.wikipedia.org/wiki/VirtualBox) складається з наступних етапів:

1. Створення віртуальної машини з операійною системою [Alpine Linux 3.9.4 x86-64](https://alpinelinux.org/downloads/) або новішою, згідно настановам користувача наведених на офіційному сайті [`wiki`-документації VirtualBox](https://www.virtualbox.org/wiki/Documentation) або використовуючи відео-туторіали: [Download, Install & Configure Alpine linux - Tutorial](https://youtu.be/1G4nmUUk2kI); [Alpine Linux 3.6.2 Installation + XFCE Desktop Environment on Oracle VirtualBox](https://youtu.be/1_bsycXrFcI).
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

#### Основні команди керування [Docker](https://docs.docker.com)-контейнером:

- `docker attach ken` - побачити вихід конслолі контейнера `ken`;
- `docker stop ken` - зупинити контейнер `ken`;
- `docker start ken` - відновити роботу (старт) контейнера `ken`;
- `docker rm ken` - видалення контейнера `ken` (перед видаленням контейнера, його потрібно зупинити);

#### Деякі корисні параметри для запуску [Docker](https://docs.docker.com)-контейнера:

- `--name` - дає контейнеру ім'я, яке можна знайти у виводі команди `docker ps`;
- `-p 80:80` - публікує порт 80. Другий номер 80 після двокрапки повідомляє, який порт сервер `nginx` слухає всередині контейнера;
- `-d` - запускає контейнер, від'єднаний від терміналу. Потім журнали можна переглядати за допомогою команди журналів [Docker](https://docs.docker.com) `docker logs`;
- `-t` - щоб бачити консольний вихід [Docker](https://docs.docker.com)-контейнера;
- `--restart on-failure` - автоматичний перезапуск невдалих контейнерів. Перезапускає контейнер, якщо він вийде з ладу через помилку, яка виявляється як ненульовий код виходу;
- `--restart always` - завжди перезапускає контейнер, якщо він зупиняється. Якщо контейнер зупинено вручну, він перезапускається лише тоді, коли служба `Docker` перезапускається або сам контейнер перезапускається вручну.

-------

<a name="windows-deployment-ua"></a>
## Компіляція, збірка та розгортання мережевого засобу ken ([з приватного репозиторію](https://github.com/malakhovks/ken)) в середовищі операційної системй Windows 7 та вище

*Настанови цього етапу в розробці.*

<a name="system-requirements-3"></a>

#### Системні вимоги

-------

<a name="api-ua"></a>

## Опис служб (веб-сервісів) мережевого засобу `ken` (konspekt English) доступних розробнику

Розробнику доступні наступні служби через кінцеві точки API (API endpoints):

| Позначення |Служба|Кінцева точка API|Метод http-запиту|
| :--------: | :---------------------: | :--------- | :--------: |
|    **S1**    | формування спеціалізованої `xml`-структури тексту *allterms.xml* |`host[:port]/ken/api/v1.0/en/file/allterms`|POST|
| **S2** | формування спеціалізованої `xml`-структури тексту *parce.xml* |`host[:port]/ken/api/v1.0/en/file/parcexml`|POST|
| **S3** | візуалізації залежностей термінів |`host[:port]/ken/api/v1.0/en/html/depparse/nounchunk`|POST|
| **S4** | візуалізації іменованих сутностей тексту |`host[:port]/ken/api/v1.0/en/html/ner`|POST|
| **S5** | візуалізації синтаксичних залежностей речення |`/ken/api/v1.0/en/html/depparse/sentence`|GET|
| **S6** | графічного інтерфейсу користувача |`host[:port]/`|GET|

#### **S1** - служба формування спеціалізованої `xml`-структури тексту *allterms.xml*

##### Опис вхідних даних

Вхідними даними можуть бути файли форматів `.txt`, `.docx`, `.pdf`, які містять текстові дані англійською мовою.

Використовуючи метод `http`-запиту `POST` можна відправити тільки один файл (доступних форматів) для опрацювання службою формування спеціалізованої `xml`-структури тексту.

Приклад `POST` запиту до кінцевої точки служби **S1** на мові програмування `JavaScript` з використанням [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API):

```javascript
# Детальний опис Fetch API за посиланням https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API

# Файли можна завантажувати за допомогою елемента вводу HTML <input type = "file" />, FormData() та fetch().
var formData = new FormData();
var fileField = document.querySelector('input[type="file"]');

# https://developer.mozilla.org/en-US/docs/Web/API/FormData/append
# formData.append(name, value);
formData.append('file', fileField.files[0]);

fetch("file", 'host[:port]/ken/api/v1.0/en/file/allterms', {
                method: 'post',
                body: formData
            })
.then(response => response.text())
.catch(error => console.error('Error:', error))
.then(response => console.log('Success:', response));
```
Процес формування спеціалізованої `xml`-структури тексту може зайняти деякий час (в залежності від обсягу тексту), але в загальному випадку вихідні дані формуються миттєво.

##### Опис вихідних даних

Вихідними даними є спеціалізована `xml`-структура тексту `allterms.xml`.

`xml`-Схема вихідних даних:

```xml
<xs:schema attributeFormDefault="unqualified" elementFormDefault="qualified" xmlns:xs="http://www.w3.org/2001/XMLSchema">
  <xs:element name="termsintext">
    <xs:complexType>
      <xs:sequence>
        <xs:element type="xs:string" name="filepath"/>
        <xs:element name="exporterms">
          <xs:complexType>
            <xs:sequence>
              <xs:element name="term" maxOccurs="unbounded" minOccurs="0">
                <xs:complexType>
                  <xs:sequence>
                    <xs:element type="xs:string" name="ttype"/>
                    <xs:element type="xs:string" name="tname"/>
                    <xs:element type="xs:byte" name="wcount"/>
                    <xs:element type="xs:string" name="osn" maxOccurs="unbounded" minOccurs="0"/>
                    <xs:element type="xs:string" name="sentpos" maxOccurs="unbounded" minOccurs="0"/>
                    <xs:element type="xs:short" name="relup" maxOccurs="unbounded" minOccurs="0"/>
                    <xs:element type="xs:short" name="reldown" maxOccurs="unbounded" minOccurs="0"/>
                  </xs:sequence>
                </xs:complexType>
              </xs:element>
            </xs:sequence>
          </xs:complexType>
        </xs:element>
        <xs:element name="sentences">
          <xs:complexType>
            <xs:sequence>
              <xs:element type="xs:string" name="sent" maxOccurs="unbounded" minOccurs="0"/>
            </xs:sequence>
          </xs:complexType>
        </xs:element>
      </xs:sequence>
    </xs:complexType>
  </xs:element>
</xs:schema>
```
Елемент `exporterms` містить послідовність елементів `term`, що описує терміни та їх параметри з опрацьованого тексту.

Параметри термінів описуються наступними елементами:

- елемент `ttype` - позначення слова в тексті певної частиною мови згідно з [Universal Dependencies scheme](https://spacy.io/api/annotation);
- елемент `tname` - лема терміну (для багатослівних термінів - це правильна форма);
- елемент `wcount` - кількість слів в терміні;
- елемент `osn` - основа для кожного слова з терміну;
- елемент `sentpos` - позиція терміну в тексті, подається у вигляді строки формату `2/10` (в даному випадку означає, що термін знаходиться у 2-му реченні на 10 позиції;
- елементи `relup` та `reldown` - відображають зв'язки до інших термінів;
- елементи `sentences` - містить масив елементів `sent`, який містить речення з тексту. Порядок речень в елементі `sentences` відповідаю порядку речень у вхідному тексті.


#### **S2** - служба формування спеціалізованої `xml`-структури тексту *parce.xml*

##### Опис вхідних даних

Вхідними даними можуть бути файли форматів `.txt`, `.docx`, `.pdf`.

Використовуючи метод `http`-запиту `POST` можна відправити тільки один файл (доступних форматів) для опрацювання службою формування спеціалізованої `xml`-структури тексту.

Приклад `POST` запиту до кінцевої точки служби **S2** на мові програмування `JavaScript` з використанням [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API):

```javascript
# Детальний опис Fetch API за посиланням https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API

# Файли можна завантажувати за допомогою елемента вводу HTML <input type = "file" />, FormData() та fetch().
var formData = new FormData();
var fileField = document.querySelector('input[type="file"]');

# https://developer.mozilla.org/en-US/docs/Web/API/FormData/append
# formData.append(name, value);
formData.append('file', fileField.files[0]);

fetch("file", 'host[:port]/ken/api/v1.0/en/file/parcexml', {
                method: 'post',
                body: formData
            })
.then(response => response.text())
.catch(error => console.error('Error:', error))
.then(response => console.log('Success:', response));
```

Процес формування спеціалізованої `xml`-структури тексту може зайняти деякий час (в залежності від обсягу тексту), але в загальному випадку вихідні дані формуються миттєво.

##### Опис вихідних даних

Вихідними даними є спеціалізована `xml`-структура тексту `parce.xml`.

`xml`-Схема вихідних даних:

```xml
<xs:schema attributeFormDefault="unqualified" elementFormDefault="qualified" xmlns:xs="http://www.w3.org/2001/XMLSchema">
  <xs:element name="text">
    <xs:complexType>
      <xs:sequence>
        <xs:element name="sentence" maxOccurs="unbounded" minOccurs="0">
          <xs:complexType>
            <xs:sequence>
              <xs:element name="item" maxOccurs="unbounded" minOccurs="0">
                <xs:complexType>
                  <xs:sequence>
                    <xs:element type="xs:string" name="word"/>
                    <xs:element type="xs:string" name="osnova"/>
                    <xs:element type="xs:string" name="lemma"/>
                    <xs:element type="xs:string" name="kflex"/>
                    <xs:element type="xs:string" name="flex"/>
                    <xs:element type="xs:byte" name="number"/>
                    <xs:element type="xs:short" name="pos"/>
                    <xs:element type="xs:byte" name="group_n"/>
                    <xs:element type="xs:string" name="speech"/>
                    <xs:element type="xs:byte" name="relate"/>
                    <xs:element type="xs:string" name="rel_type"/>
                  </xs:sequence>
                </xs:complexType>
              </xs:element>
              <xs:element type="xs:byte" name="sentnumber"/>
              <xs:element type="xs:string" name="sent"/>
            </xs:sequence>
          </xs:complexType>
        </xs:element>
      </xs:sequence>
    </xs:complexType>
  </xs:element>
</xs:schema>
```

-------

<a name="deployment-ua"></a>

## Дистрибуція мережевого засобу (у вигляді веб-сервісу з API) **ken** (konspekt English)
*Настанови цього етапу в розробці*

<!--<p style="text-align: center;">Настанови цього етапу в розробці.</p>-->

<a name="references-ua"></a>

-------

## Корисні посилання

#### Платформа Docker для створення, розгортання і запуску додатків на прикладі Python Flask application

- [Що таке Docker і як використовувати його з Python](https://codeguida.com/post/1837)
- [Developing a Flask API in a Docker container with uWSGI and NGINX](https://link.medium.com/tvOhhWV84W)
- [Running Flask in production with Docker](https://link.medium.com/cOVc4h5SiX)
- [Flask application in a production-ready container](https://netdevops.me/2017/flask-application-in-a-production-ready-container/)
- [How To Serve Flask Applications with uWSGI and Nginx on Ubuntu 18.04](https://www.digitalocean.com/community/tutorials/how-to-serve-flask-applications-with-uswgi-and-nginx-on-ubuntu-18-04)
- [Building a slim uWSGI Docker image](https://bradleyzhou.com/posts/building-slim-uwsgi-docker-image)
- [Running Windows app headless in docker](https://link.medium.com/2Wg3XVX15W)
- [Запуск приложения на Flask с помощью uwsgi + nginx в Debian 7](http://debian-help.ru/web-servers/zapusk-prilozheniya-na-flask-s-pomoschyu-uwsgi-nginx/)
- [Ускоряем Nginx за 5 минут](https://habr.com/ru/post/198982/)
- [Top 10 Docker CLI commands you can’t live without](https://link.medium.com/HCI5XwmFRW)
- [NGINX Tuning For Best Performance](https://github.com/denji/nginx-tuning)

#### Система черг для Python Flask application - uWSGI Spooler

- [Background jobs with Flask](https://link.medium.com/DwcCkjzAkX)
- [The uWSGI Spooler](https://habr.com/ru/company/selectel/blog/326956/)
- [Using Celery With Flask](https://blog.miguelgrinberg.com/post/using-celery-with-flask)

*Розділ доповнюється.*