# Конспект для української мови (API для обробки/аналізу текстів у вигляді повідомлень)

### API endpoints

|        |                   Service                    | API endpoint                                                 | HTTP method |
| :----: | :------------------------------------------: | :----------------------------------------------------------- | :---------: |
| **E1** | Черга для обробки повідомлень | `host[:port]/kua/api/task/message/queued`<br>`http://194.44.28.250:45100/kua/api/task/message/queued` |    POST     |
| **E2** |   Статус виконання обробки   | `host[:port]/kua/api/task/status`<br/>`http://194.44.28.250:45100/kua/api/task/status` |    GET     |
| **E3** |  Отримати XML-структуру **allterms**  | `host[:port]/kua/api/task/allterms/result`<br/>`http://194.44.28.250:45100/kua/api/task/allterms/result` |    GET   |
| **E4** |  Отримати XML-структуру **parce**  | `host[:port]/kua/api/task/parce/result`<br/>`http://194.44.28.250:45100/kua/api/task/parce/result` |    GET   |

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

**E2 - Output data**

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

**E3 - Output data**

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

**E3 - Output data**

`Return 204 (no content)`

або

`Return 200` та XML-структура