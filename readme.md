JWT User Authorization Middleware
=========

[![Build Status](https://semaphoreapp.com/api/v1/projects/fd82885d-679d-46b0-9841-15abd67f356e/359593/badge.png)](https://semaphoreapp.com/tdfairbrother/jwt-express-auth)

[![Coverage Status](https://coveralls.io/repos/tdfairbrother/jwt-express-auth/badge.svg?branch=master)](https://coveralls.io/r/tdfairbrother/jwt-express-auth?branch=master)


Add the following to any params that require authorization.
The tokenParam must match the name of the user_id in the jwt, not the route param.
```js
    var auth = require('jwt-express-auth');
    router.param('user_id', auth({secret:'secret', tokenParam:'id'}));
```

To generate a jwt token in Ruby.
```ruby
    require 'jwt'
    JWT.encode({"id" => 1}, "secret")
    => "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCciOjg5fQ.wUlU3JFv-wQYPfa9NRwh06wJWcOtYErRN23iTvMPTIE"
```

Examples using curl

```sh
    curl -X GET -H "Authorization:Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCciOjg5fQ.wUlU3JFv-wQYPfa9NRwh06wJWcOtYErRN23iTvMPTIE" -H "Cache-Control:no-cache" http://localhost:2014/users/1
```

Or
```sh
    curl -X GET http://localhost:2014/users/1&authorization=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCciOjg5fQ.wUlU3JFv-wQYPfa9NRwh06wJWcOtYErRN23iTvMPTIE
```

From jquery
```js
$.ajax({
    url: 'http://localhost:2014/users/1',
    headers: {
        'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCciOjg5fQ.wUlU3JFv-wQYPfa9NRwh06wJWcOtYErRN23iTvMPTIE',
        'Cache-Control': 'no-cache'
    }
}).done(function(res) { console.log(res) })
```

Or
```js
$.get({
    url: 'http://localhost:2014/users/1?authorization=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCciOjg5fQ.wUlU3JFv-wQYPfa9NRwh06wJWcOtYErRN23iTvMPTIE'
}).done(function(res) { console.log(res) })
```