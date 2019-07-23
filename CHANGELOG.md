## v0.4.1, 2019-07-23

👍 Покращення
- Додано номер поточної версії KEn до елементу `title`.

## v0.4.0, 2019-07-23

🏭 Нові можливості
- Реалізовано відображення показників частоти термінів за допомоги спливаючої підказки `title` для кожного терміну елементу `#uploadResultList`.
  Реалізовано можливість сортування термінів в елементі `#uploadResultList` згідно:
   - частоти (за збільшенням);
   - частоти (за зменшенням);
   - за алфавітом;
   - за черговою появою в тексті;
- Реалізовано елемент `#sort-select` для обрання відповідного типу сортування.

👍 Покращення
- Рефакторинг програмного коду.

🔴 Виправлення помилок
- Дрібні виправлення.

📚 Документація
- Оновлено розділи `Системні вимоги` згідно нових мінімальних системних вимог, україномовної частини `README.md`.

## v0.3.0, 2019-07-22

🔴 Виправлення помилок
- Виправлено помилку `UnicodeDecodeError: 'utf8' codec can't decode byte`.
Декодовано файл як `UTF-8`, ігноруючи будь-які символи які закодовані в неправильному кодуванні

```python
# decode the file as UTF-8 ignoring any errors
raw_text = file.read().decode('utf-8', errors='replace')
```
- Включено збереження макета документа, включаючи пробіли, які є лише візуальними, а не символами.
Виправлено згідно: [python pdfminer converts pdf file into one chunk of string with no spaces between words](https://stackoverflow.com/questions/49457443/python-pdfminer-converts-pdf-file-into-one-chunk-of-string-with-no-spaces-betwee)

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

🔴 Виправлення помилок
- Реалізовано видалення символу `°` на етапі нормалізації тексту.
- Реалізовано видалення всіх не словникових символів (`\W` non-alphanumeric characters) на етапі нормалізації тексту.
- Реалізовано видалення всіх слів, що містять числа при нормалізації тексту.

## v0.2.7, 2019-07-19

🔴 Виправлення помилок
- Вимкнено появу стандартного контекстного меню на елементі `#projectFileList` при евенті видалення файлів проекту за кліком правої кнопки миші.
- Збільшено максимально допустимий розмір тіла запиту клієнта до **50 мегабайт**: `client_max_body_size 50M`.

📚 Документація
- Додано файл `CHANGELOG.md`, що містить список версій програми та список відповідних змін програмного коду, виправлень та покращень.

## v0.2.6, 2019-07-18

🔴 Виправлення помилок
- Виправлено скролінг в елементах класу `.col-md-6`.

👍 Покращення
- Додано вкладку "Блокнот" з елементом textarea до `.col-md-6`.

## v0.2.5, 2019-07-18

🔴 Виправлення помилок
- Дрібні виправлення.

👍 Покращення
- Видалено тег версій з кінцевих точок API:
було:
`host[:port]/ken/api/**v1.0**/en/file/allterms`
стало:
`host[:port]/ken/api/en/file/allterms`.
- Додано горизонтальный скролл до елементів `id="uploadResultList"`; `#term-tree`.
- Додано можливість видалення файлів зі списку "Файли" `id="projectFileList"` по кліку правої кнопки миші.
- Оновлено структуру проекту.
- Рефакторинг програмного коду.

📚 Документація
- Додана настанова користувача Як зберегти Docker image в файл (резервне копіювання) для подальшого використання на іншому сервері.
- Виправлено **виділення** термінів на **виокремлення** термінів.
- Оновлення україномовної частини `README.md`.

## v0.2.4, 2019-07-08

🔴 Bug fixes
- Fix sentence duplication in `id="text-content"`.
- Fix `id="sents_from_text"` area to update for a new text.
- Fix add text from last file to `id="sents_from_text"` area.
- Fix add text to `id="sents_from_text"` area when selecting files from `id="projectFileList"` select list.

👍 Improvements
- Update project structure.
- Clean up source code.

📚 Tutorial and doc improvements
- Update UA part of `README.md`.

-----

🔴 Виправлення помилок
- Виправлено дублювання речення в елементі `id =" text-content "`.
- Виправлено оновлення елементу `id="sents_from_text"` згідно нового тексту.
- Виправлено додавання тексту з останнього опрацьованого файлу в область `id =" sents_from_text ".
- Виправлено додавання тексту в елемент `id="sents_from_text"` при виборі відповідного файлу зі списку елементу `id="projectFileList"`.
- Дрібні виправлення.

👍 Покращення
- Оновлено структуру проекту.
- Рефакторинг програмного коду.

📚 Документація
- Оновлення україномовної частини `README.md`.

## v0.2.3, 2019-06-25

👍 Improvements
- Remove (comment) dependencies for language_check.
- Clean up source code.

📚 Tutorial and doc improvements
- Update UA part of README.md.

-----

👍 Покращення
- Видалено залежності для ` language_check`.
- Рефакторинг програмного коду.

📚 Документація
- Оновлення україномовної частини `README.md`.

## v0.2.2, 2019-06-23

👍 Improvements
- Fix Highlighting terms in text area `id="text-content"`.
- Fix `loader` colour.
-----
👍 Покращення
- Виправлено підсвічування виокремлених термінів у `id="text-content"`.
- Змінено колір елементу `loader`.

## v0.2.1, 2019-06-23

👍 Improvements
- Add save to `csv`.
- Add save of all lists (terms, NER, files).
- Add new notifications.
- Fix titles.

🔴 Bug fixes
- Various bug fixes.

📚 Tutorial and doc improvements
- Update UA part of `README.md`.

-----

👍 Покращення
- Додано збереження в формат `csv`.
- Додано можливість збереження списків (terms, NER, files).
- Додні нотифікації про виконання процесів.
- Виправлені елементи title.

🔴 Виправлення помилок
- Дрібні виправлення.

📚 Документація
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

📚 Tutorial and doc improvements
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

📚 Документація
- Оновлення україномовної частини `README.md`.

## v0.1.1, 2019-06-02

🌟 Початковий попередній реліз

-----

🌟 Initial pre-release