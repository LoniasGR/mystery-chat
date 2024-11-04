Message structure:
```json
{
    "_id": "UUID",
    "user": {
        "nickname": string,
        "avatar": string
    },
    "content": "UTF-8",
    "timestamp": "timestamp"
}
```

User structure:
```json
{
    "_id": "nickname",
    "password": "passphrase-with-rhyme",
    "avatar": "link_to_path"
}
```

AUTH FLOW:
1. Prepopulated username/pwd
2. Login endpoint `/login`
3. Login returns JWT as cookie
4. Middleware that verifies cookie exists all endpoints apart from login
5. 

SCROLL UP HISTORY FLOW:
1. Websocket event where we provide the timestamp of the oldest message
2. Return a page of x messages sorted by timestamp desc with the first one being the one before the oldest message

