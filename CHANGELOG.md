## v1.0.2, 2019-09-__

### 👍 Покращення

- Змінено елемент `<title>` головної сторінки `index.html` (видалено рік):
  ```html
  <title>Конспект - v1.0.2</title>
  ```

## v1.0.1, 2019-08-24

### ⚠️ Зауваження

- При оновленні `KEn` з версії `v1.0.0` (або більш ранньої) до `v.1.0.1` дані проаналізованих раніше документів будуть втрачені.

- Змінено специфікацію `json`-файлу проекту:
<details><summary>Специфікація `json`-файлу проекту:</summary>
<p>

```json
{
  "project": {
    "name": "",
    "content": {
      "documents": [
        {
          "names": {
            "original": "",
            "unique": ""
          },
          "results": {
            "alltermsxmlCompressed": "",
            "parcexmlCompressed": "",
            "alltermsjson": {},
            "parcejson": {},
            "nerhtmlCompressed": ""
          }
        },
        {
          "names": {
            "original": "",
            "unique": ""
          },
          "results": {
            "alltermsxmlCompressed": "",
            "parcexmlCompressed": "",
            "alltermsjson": {},
            "parcejson": {},
            "nerhtmlCompressed": ""
          }
        }
      ]
    }
  }
}
```

</p>
</details>

### 👍 Покращення

- Реалізовано функції зжимання та відновлення строк з використанням програмної бібліотеки [LZ-based compression algorithm for JavaScript](https://github.com/pieroxy/lz-string/), а саме поцедур `compressToBase64`/`decompressFromBase64` (що зберігають `allterms.xml` в `alltermsxmlCompressed`, та `parce.xml` в `parcexmlCompressed` (в `json`-файлі проекту)).

### 🔴 Виправлення помилок

- Виправлено помилку графічного інтерфейсу розташування елементу `#notes` відносно `#displacy`, `#displacy-ner`, `#displacy-label`.

## v1.0.0, 2019-08-20

### ⚠️ Зауваження

- При оновленні `KEn` з версії `v0.7.1` (або більш ранньої) до `v.1.0.0` дані проаналізованих раніше документів будуть втрачені.

### 👍 Покращення

- Збільшено розмір `nginx client_max_body_size` до `500 mb` (що дозволяє проводити обробку файлів розміром до 500 мб).
- Оновлено функції та процедури роботи клієнтської частини програми з використанням [IndexedDB API](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API) та програмної бібліотеки [localForage](https://localforage.github.io/localForage/), що відповідають за збереження та ініціалізацію результатів лінгвістичного аналізу документів та основного файлу проекту:
  - додавання розбору (РІС, allterms, parce) кожного нового документу до головного `JSON`-файл проекту;
  - збереження проекту в локальний `JSON`-файл, що міститеме розбори всіх документів (РІС, allterms, parce) та налаштування;
  - відкриття проекту з локального `JSON`-файлу.

### 🔴 Виправлення помилок

- Виправлено роботу елемента `#termTree`, а саме додано функцію "візуалізації залежностей термінів" з елементу `#termTree` в елементі `#depparse_tab`, а саме в `#displacy`.
- Виправлено помилку `DOMException QuotaExceededError` / `QUOTA_EXCEEDED_ERR: DOM Exception 22` (Перевищено розмір квоти для **localStorage**, що становить 5 Мб. Тобто є **ліміт** на кількість файлів, що можуть бути збережені в проекті). Збереження файлів проекту відтепер здійснюється з використанням [IndexedDB API](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API) та програмної бібліотеки [localForage](https://localforage.github.io/localForage/). _Довідка_:
  - про розмір квот для **localStorage** та скрипт **localStorageDB** (використовує IndexedDB як key-value сховище, квота може перевищувати 5Мб) - [localStorageDB скрипт](https://stackoverflow.com/questions/5663166/is-there-a-way-to-increase-the-size-of-localstorage-in-google-chrome-to-avoid-qu);
  - максимальна квота для **IndexedDB** - [Maximum item size in IndexedDB](https://stackoverflow.com/questions/5692820/maximum-item-size-in-indexeddb);
  - поліпшене керування сховищем в браузері: бібліотека [localForage](https://github.com/localForage/localForage);

### ⚠️ Застаріле

- Функції та процедури роботи клієнтської частини програми на основі `localStorage` (що відповідають за збереження та ініціалізацію результатів лінгвістичного аналізу файлів проекту), окрім таблиці.

## v0.7.1, 2019-08-14

### 👍 Покращення

- Додано функцію "копіювання по кліку" термінів з елементу `#termTree` (дерево термінів) в елемент `#table-body` (таблиця).
- Оновлено меню "Допомога" (елемент `#button-dropdown-help`): додано "Журнал змін" (елемент `#button-changelog`) - Журнал змін проекту `CHANGELOG.md`.

### 🔴 Виправлення помилок

- Виправлено імена, що надаються за замовчуванням при збереженні в файл списків "Терміни" (`#uploadResultList`), РІС (`#uploadUnknownTerms`).

## v0.7.0, 2019-08-10

### ⚠️ Зауваження

- При оновленні `KEn` з версії `v0.6.0` до `v.0.7.0` дані проаналізованих раніше файлів будуть втрачені або працюватимуть некоректно.

### 👍 Покращення
- Оновлено функції та процедури роботи з `localStorage`, що відповідають за збереження та ініціалізацію результатів лінгвістичного аналізу файлів проекту.
- Вимкнено запис логів при доступі до файлів, що знаходяться в папці `static`.

### 🔴 Виправлення помилок

- Виправлено оновлення деяких елементів при перемиканні/вибору файлів в елементі `#projectFileList` ("Файли"). Оновлються елементи:
  - `#displacy-ner` ("Візуалізація")
  - `#uploadUnknownTerms` ("РІС")
відповідно до обраного файлу в елементі `#projectFileList` ("Файли").
- Виправлено очищення відповідних розборів документів (`-parsexml`, `-alltermsxml` та `json`-розборів), що зберігаються в localStorage при видаленні файлів проекту зі списку Файли `#projectFileList`.
- Дрібні виправлення `JavaScript` на клієнті (зокрема, елементів контейнеру `class="col-md-6"`).

## v0.6.0, 2019-08-07

### 🏭 Нові можливості

- Реалізовано можливість локального збереження файлів разбору `allterms.xml` та `parce.xml` через графічний інтерфейс користувача, зокрема, через взаємодію з елементом `#button-save` відповідно:
  - `#button-save-allterms-xml` для збереження `allterms.xml`;
  - `#button-save-parce-xml` для збереження `parce.xml`.

### 🔴 Виправлення помилок

- Дрібні виправлення `JavaScript` на клієнті.

## v0.5.5, 2019-08-03

### 🔴 Виправлення помилок

- Виправлено `id` елементу `#text-content-panel-body`.

## v0.5.4, 2019-07-30

### 🔴 Виправлення помилок

- Виправлено поведінку елементу `#notes` (відключено можливість змінення розміру).

## v0.5.3, 2019-07-28

### 🔴 Виправлення помилок

- Виправлено випадкове виконання функцій `events` при взаємодії з елементами:
  - `#uploadResultList`
  - `#projectFileList`
  - `#uploadUnknownTerms`

## v0.5.2, 2019-07-27

### 🔴 Виправлення помилок

- Виправлено помилку роботи з файлами, що мають однакові імена але різний зміст (Реалізовано генерування унікальних імен файлів для `localStorage`).
- Дрібні виправлення `JavaScript` на клієнті.

## v0.5.1, 2019-07-25

### 🔴 Виправлення помилок

- Виправлено дерево термінів:
  Реалізовано активне дерево термінів, тобто - перехід до вибраного терміну в дереві термінів (відповідне відображення речень з терміном в елементі `#term-tree` та виділення речень з терміном в `sents_from_text`).
- Дрібні виправлення інтерфейсу.
- Видалено невикористовувані `JavaScript`-бібліотеки.

## v0.5.0, 2019-07-25

### 🏭 Нові можливості
- Реалізовано підсвічування речень з вибраним терміном в елементі `#sents_from_text` та вибраних термінів в `#text-content` з використанням бібліотеки [mark.js](https://markjs.io/)

### 🔴 Виправлення помилок
- Дрібні виправлення інтерфейсу.
- Дрібні виправлення серверної частини: 
  змінено роботу нормалізації тексту (відключено `line = re.sub(r'\W', ' ', line, flags=re.I)`).

## v0.4.2, 2019-07-23

### 🔴 Виправлення помилок
- Виправлено номер версії в елементі `title`.

## v0.4.1, 2019-07-23

### 👍 Покращення
- Додано номер поточної версії KEn до елементу `title`.

## v0.4.0, 2019-07-23

### 🏭 Нові можливості
- Реалізовано відображення показників частоти термінів за допомоги спливаючої підказки `title` для кожного терміну елементу `#uploadResultList`.
  Реалізовано можливість сортування термінів в елементі `#uploadResultList` згідно:
   - частоти (за збільшенням);
   - частоти (за зменшенням);
   - за алфавітом;
   - за черговою появою в тексті;
- Реалізовано елемент `#sort-select` для обрання відповідного типу сортування.

### 👍 Покращення
- Рефакторинг програмного коду.

### 🔴 Виправлення помилок
- Дрібні виправлення.

### 📚 Документація
- Оновлено розділи `Системні вимоги` згідно нових мінімальних системних вимог, україномовної частини `README.md`.

## v0.3.0, 2019-07-22

### 🔴 Виправлення помилок
- Виправлено помилку `UnicodeDecodeError: 'utf8' codec can't decode byte`.
  Декодовано файл як `UTF-8`, ігноруючи будь-які символи які закодовані в неправильному кодуванні:

  ```python
  # decode the file as UTF-8 ignoring any errors
  raw_text = file.read().decode('utf-8', errors='replace')
  ```
- Включено збереження макета документа, включаючи пробіли, які є лише візуальними, а не символами.
  Виправлено згідно [python pdfminer converts pdf file into one chunk of string with no spaces between words](https://stackoverflow.com/questions/49457443/python-pdfminer-converts-pdf-file-into-one-chunk-of-string-with-no-spaces-betwee):

  ```python
  # save document layout including spaces that are only visual not a character
  """
  some pdfs mark the entire text as figure and by default PDFMiner doesn't try to perform layout analysis for figure text.
  To override this behavior the all_texts parameter needs to be set to True
  in function def get_text_from_pdf_pdfminer(pdf_path)
  """
  laparams = LAParams()
  setattr(laparams, 'all_texts', True)
  ```
- Виправлено роботу елементу `iziToast` (нотифікації про процес обробки документів).

## v0.2.8, 2019-07-20

### 🔴 Виправлення помилок
- Реалізовано видалення символу `°` на етапі нормалізації тексту.
- Реалізовано видалення всіх не словникових символів (`\W` non-alphanumeric characters) на етапі нормалізації тексту.
- Реалізовано видалення всіх слів, що містять числа при нормалізації тексту.

## v0.2.7, 2019-07-19

### 🔴 Виправлення помилок
- Вимкнено появу стандартного контекстного меню на елементі `#projectFileList` при евенті видалення файлів проекту за кліком правої кнопки миші.
- Збільшено максимально допустимий розмір тіла запиту клієнта до **50 мегабайт**: `client_max_body_size 50M`.

📚 Документація
- Додано файл `CHANGELOG.md`, що містить список версій програми та список відповідних змін програмного коду, виправлень та покращень.

## v0.2.6, 2019-07-18

### 🔴 Виправлення помилок
- Виправлено скролінг в елементах класу `.col-md-6`.

### 👍 Покращення
- Додано вкладку "Блокнот" з елементом textarea до `.col-md-6`.

## v0.2.5, 2019-07-18

### 🔴 Виправлення помилок
- Дрібні виправлення.

### 👍 Покращення
- Видалено тег версій з кінцевих точок API:
  було:
  `host[:port]/ken/api/**v1.0**/en/file/allterms`
  стало:
  `host[:port]/ken/api/en/file/allterms`.
- Додано горизонтальный скролл до елементів `id="uploadResultList"`; `#term-tree`.
- Додано можливість видалення файлів зі списку "Файли" `id="projectFileList"` по кліку правої кнопки миші.
- Оновлено структуру проекту.
- Рефакторинг програмного коду.

### 📚 Документація
- Додана настанова користувача Як зберегти Docker image в файл (резервне копіювання) для подальшого використання на іншому сервері.
- Виправлено **виділення** термінів на **виокремлення** термінів.
- Оновлення україномовної частини `README.md`.

## v0.2.4, 2019-07-08

### 🔴 Bug fixes
- Fix sentence duplication in `id="text-content"`.
- Fix `id="sents_from_text"` area to update for a new text.
- Fix add text from last file to `id="sents_from_text"` area.
- Fix add text to `id="sents_from_text"` area when selecting files from `id="projectFileList"` select list.

### 👍 Improvements
- Update project structure.
- Clean up source code.

### 📚 Tutorial and doc improvements
- Update UA part of `README.md`.

-----

### 🔴 Виправлення помилок
- Виправлено дублювання речення в елементі `id =" text-content "`.
- Виправлено оновлення елементу `id="sents_from_text"` згідно нового тексту.
- Виправлено додавання тексту з останнього опрацьованого файлу в область `id =" sents_from_text ".
- Виправлено додавання тексту в елемент `id="sents_from_text"` при виборі відповідного файлу зі списку елементу `id="projectFileList"`.
- Дрібні виправлення.

### 👍 Покращення
- Оновлено структуру проекту.
- Рефакторинг програмного коду.

### 📚 Документація
- Оновлення україномовної частини `README.md`.

## v0.2.3, 2019-06-25

### 👍 Improvements
- Remove (comment) dependencies for language_check.
- Clean up source code.

### 📚 Tutorial and doc improvements
- Update UA part of README.md.

-----

### 👍 Покращення
- Видалено залежності для ` language_check`.
- Рефакторинг програмного коду.

### 📚 Документація
- Оновлення україномовної частини `README.md`.

## v0.2.2, 2019-06-23

### 👍 Improvements
- Fix Highlighting terms in text area `id="text-content"`.
- Fix `loader` colour.
-----

### 👍 Покращення
- Виправлено підсвічування виокремлених термінів у `id="text-content"`.
- Змінено колір елементу `loader`.

## v0.2.1, 2019-06-23

### 👍 Improvements
- Add save to `csv`.
- Add save of all lists (terms, NER, files).
- Add new notifications.
- Fix titles.

### 🔴 Bug fixes
- Various bug fixes.

### 📚 Tutorial and doc improvements
- Update UA part of `README.md`.

-----

### 👍 Покращення
- Додано збереження в формат `csv`.
- Додано можливість збереження списків (terms, NER, files).
- Додні нотифікації про виконання процесів.
- Виправлені елементи title.

### 🔴 Виправлення помилок
- Дрібні виправлення.

### 📚 Документація
- Оновлення україномовної частини `README.md`.

## v0.2.0, 2019-06-21

### 👍 Improvements
- All new table.
- All new table controls.
- Added saving table in Excel `.xls` format.

### ⚠️ Deprecations
- Removed saving in `.csv`.

### 🔴 Bug fixes
- Various bug fixes.

### 📚 Tutorial and doc improvements
- Update UA part of `README.md`.

-----

### 👍 Покращення
- Нова таблиця.
- Нові елементи управління таблицею.
- Додана можливість збереження таблиці в формат Excel `.xls`.

### ⚠️ Застаріле
- Видалено збереження в формат `.csv`.

### 🔴 Виправлення помилок
- Різні дрібні виправлення.

### 📚 Документація
- Оновлення україномовної частини `README.md`.

## v0.1.1, 2019-06-02

### 🌟 Початковий попередній реліз

-----

### 🌟 Initial pre-release