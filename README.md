## URL Shortener
Written for JINGU Digital. It's a simple REST API

### API
#### 1) POST `/shorten`

Принимает на вход длинную ссылку, а в ответ отдает сгенерированный короткий адрес, по которому можно будет получить доступ к исходной ссылке


__Request__

`Content-type: json`
```js
{
    "urlToShorten": string;
}
```

__Response__

`Content-type: json`
```js
{
    "status": string;
    "shortenedUrl": string;
}
```

#### 2) GET `/:url`

Принимает сокращенный адрес ссылки в качестве query-параметра, а в ответ перенаправляет пользователя на исходную ссылку

__Request__

```js
url: string;
```

__Response__

`Content-type: json`
```js
{
    "redirectTo": string;
}
```

#### 3) GET `/:url/views`

Принимает сокращенный адрес ссылки в качестве query-параметра, а в ответ возвращает количество просмотров заданной сокращенной ссылки

__Request__

```js
url: string;
```

__Response__

`Content-type: json`
```js
{
    "viewCount": string;
}
```