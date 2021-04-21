# Конспект для Української мови (API для обробки/аналізу текстів у вигляді повідомлень та файлів)

### API endpoints

|        |                   Service                    | API endpoint                                                 | HTTP method |
| :----: | :------------------------------------------: | :----------------------------------------------------------- | :---------: |
| **E1** | Черга для обробки повідомлень | `host[:port]/kua/api/task/message/queued`<br>`http://194.44.28.250:45100/kua/api/task/message/queued` |    POST     |
| **E2** |   Статус виконання обробки   | `host[:port]/kua/api/task/status`<br/>`http://194.44.28.250:45100/kua/api/task/status` |    GET     |
| **E3** |  Отримати XML-структуру **allterms.xml**  | `host[:port]/kua/api/task/allterms/result`<br/>`http://194.44.28.250:45100/kua/api/task/allterms/result` |    GET   |
| **E4** |  Отримати XML-структуру **parce.xml**  | `host[:port]/kua/api/task/parce/result`<br/>`http://194.44.28.250:45100/kua/api/task/parce/result` |    GET   |

##### E1 - Input data

```JSON
{
 "message": "Не зважаючи на стрімкий розвиток індустрії інформатики протягом останніх кількох десятків років, процес самовизначення інформатики як науки все ще не можна вважати завершеним."
}
```

##### E1 - Output data

```JSON
{
 "task":
  {
   "id":"uwsgi_spoolfile_on_21fa8f5446fd_66_1_31460570_1597945797_65983",
   "message":"yes",
   "status":"queued"
  }
}
```

##### E2 - Input data

<u>URL params:</u>

**id** = uwsgi_spoolfile_on_21fa8f5446fd_66_1_31460570_1597945797_65983

Приклад з CURL:

```BASH
curl "http://194.44.28.250:45100/kua/api/task/status?id=uwsgi_spoolfile_on_21fa8f5446fd_66_1_31460570_1597945797_65983"
```

##### E2 - Output data

`Return 204 (no content)`

або

`Return 200`

##### E3 - Input data

<u>URL params:</u>

**id** = uwsgi_spoolfile_on_21fa8f5446fd_66_1_31460570_1597945797_65983

Приклад з CURL:

```BASH
curl "http://194.44.28.250:45100/kua/api/task/allterms/result?id=uwsgi_spoolfile_on_21fa8f5446fd_66_1_31460570_1597945797_65983"
```

##### E3 - Output data

`Return 204 (no content)`

або

`Return 200` та XML-структура

##### E4 - Input data

<u>URL params:</u>

**id** = uwsgi_spoolfile_on_21fa8f5446fd_66_1_31460570_1597945797_65983

Приклад з CURL:

```BASH
curl "http://194.44.28.250:45100/kua/api/task/parce/result?id=uwsgi_spoolfile_on_21fa8f5446fd_66_1_31460570_1597945797_65983"
```

##### E3 - Output data

`Return 204 (no content)`

або

`Return 200` та XML-структура

# Конспект для Англійської мови (API для обробки/аналізу текстів у вигляді повідомлень та файлів)

### API endpoints

|        |                   Service                    | API endpoint                                                 | HTTP method |
| :----: | :------------------------------------------: | :----------------------------------------------------------- | :---------: |
| **E1** |  Отримати XML-структуру **allterms.xml** з файлу | `host[:port]/ken/api/en/allterms` |    POST   |
| **E2** |  Отримати XML-структуру **allterms.xml** з повідомлення | `host[:port]/ken/api/en/allterms` |    POST   |
| **E3** |  Отримати XML-структуру **parce.xml** з файлу | `host[:port]/ken/api/en/parcexml` |    POST   |
| **E4** |  Отримати XML-структуру **parce.xml** з повідомлення | `host[:port]/ken/api/en/parcexml` |    POST   |

##### E1 - Input data

Вхідними даними можуть бути файли форматів `.txt`, `.docx`, `.pdf`, які містять текстові дані англійською мовою.

Використовуючи метод `http`-запиту `POST` можна відправити тільки один файл (доступних форматів) для опрацювання службою формування спеціалізованої `XML`-структури тексту.

Приклад `POST` запиту до кінцевої точки служби **S1** на мові програмування `JavaScript` з використанням [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API):

```javascript
# Детальний опис Fetch API за посиланням https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API

# Файли можна завантажувати за допомогою елемента вводу HTML <input type = "file" />, FormData() та fetch().
var formData = new FormData();
var fileField = document.querySelector('input[type="file"]');

# https://developer.mozilla.org/en-US/docs/Web/API/FormData/append
# formData.append(name, value);
formData.append('file', fileField.files[0]);

fetch("file", 'host[:port]/ken/api/en/allterms', {
                method: 'post',
                body: formData
            })
.then(response => response.text())
.catch(error => console.error('Error:', error))
.then(response => console.log('Success:', response));
```

Процес формування спеціалізованої `XML`-структури тексту може зайняти деякий час (в залежності від обсягу тексту), але в загальному випадку вихідні дані формуються миттєво.

##### E2 - Input data

Вхідними даними може бути JSON-структура:

```JSON
{
 "message": "After the vision of the Semantic Web was broadcasted at the turn of the millennium, ontology became a synonym for the solution to many problems concerning the fact that computers do not understand human language: if there were an ontology and every document were marked up with it and we had agents that would understand the mark-up, then computers would finally be able to process our queries in a really sophisticated way."
}
```

##### E3 - Input data

Вхідними даними можуть бути файли форматів `.txt`, `.docx`, `.pdf`.

Використовуючи метод `http`-запиту `POST` можна відправити тільки один файл (доступних форматів) для опрацювання службою формування спеціалізованої `XML`-структури тексту.

Приклад `POST` запиту до кінцевої точки служби **S2** на мові програмування `JavaScript` з використанням [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API):

```javascript
# Детальний опис Fetch API за посиланням https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API

# Файли можна завантажувати за допомогою елемента вводу HTML <input type = "file" />, FormData() та fetch().
var formData = new FormData();
var fileField = document.querySelector('input[type="file"]');

# https://developer.mozilla.org/en-US/docs/Web/API/FormData/append
# formData.append(name, value);
formData.append('file', fileField.files[0]);

fetch("file", 'host[:port]/ken/api/en/parcexml', {
                method: 'post',
                body: formData
            })
.then(response => response.text())
.catch(error => console.error('Error:', error))
.then(response => console.log('Success:', response));
```

Процес формування спеціалізованої `XML`-структури тексту може зайняти деякий час (в залежності від обсягу тексту), але в загальному випадку вихідні дані формуються миттєво.

##### E4 - Input data

Вхідними даними може бути JSON-структура:

```JSON
{
 "message": "After the vision of the Semantic Web was broadcasted at the turn of the millennium, ontology became a synonym for the solution to many problems concerning the fact that computers do not understand human language: if there were an ontology and every document were marked up with it and we had agents that would understand the mark-up, then computers would finally be able to process our queries in a really sophisticated way."
}
```
