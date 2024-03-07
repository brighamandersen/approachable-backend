# approachable-backend

Project for Brigham Andersen and Taylor English

See [approachable-frontend](https://github.com/janksmap/approachable-frontend) repo

## Installation

```
npm i
touch db.sqlite3
npm run create-tables
npm run dev
```

## API Usage

### Users

Create a user

```
curl -X POST -H "Content-Type: application/json" -d '{"firstName": "New", "lastName": "User"}' http://localhost:3000/users
```

Get all users

```
curl http://localhost:3000/users
```

Get user by id

```
curl http://localhost:3000/users/123
```

Update a user by id

> FIXME: Not done yet

Delete user by id

```
curl -X DELETE http://localhost:3000/users/123
```

### User Locations

Create a user location

```
curl -X POST -H "Content-Type: application/json" -d '{"userId": 123, "latitude": 40.7128, "longitude": -74.006}' http://localhost:3000/user-locations
```

Get all user locations

```
curl http://localhost:3000/user-locations
```

Get user location by user id

```
curl http://localhost:3000/user-locations/123
```

Update a user location by user id

> FIXME: Not done yet

Delete user location by user id

```
curl -X DELETE http://localhost:3000/user-locations/123
```

## TODO

- Finish update endpoints
- Consider using swagger instead of API section above
- Eventually
  - Back up database
