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

Create a user

```
curl -X POST
-H "Content-Type: application/json"
-d '{"firstName": "New", "lastName": "User", "latitude": 40.5, "longitude": 75.0}'
http://localhost:3000/users
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

```
curl -X PUT
-H "Content-Type: application/json"
-d '{"firstName": "New", "lastName": "User", "latitude": 40.5, "longitude": 75.0}'
http://localhost:3000/users
```

Delete user by id

```
curl -X DELETE http://localhost:3000/users/123
```

## Decisions

- 03/07/24 - I was considering using Swagger for API documentation but decided that this project is small-scale enough that it would slow us down more than it would help. Instead I'm just putting API usage examples with curl in comments above each API endpoint.
- 03/08/24 - I originally figured I would just have a User table and then a UserLocation table. I was thinking that they should be separate, but the more I did research into implementation, I realized that since they have a one-to-one relationship, it would be simpler to store it right in the same table. That makes things much simpler because you don't have to hassle with joins or with having to do separate API calls to get all the data you need. Some cons for this approach I saw were data redundancy, like if two users were at the same location you couldn't reuse one row of a UserLocation table to denote that, but that is highly unlikely and quite frankly we want to keep these relationship one-to-one. Besides, locations for how specific we need them will almost always be unique. Another con of this approach I saw is that apparently it doesn't scale as well? I really want to follow best practices and make sure I'm making scaleable apps. However, I realize this app probably won't get a ton of users. If it does need to scale though, future us can worry about that problem and migrate the database. For now we'll focus on simplicity first.
- 03/09/24 - I was avoiding using Prisma for such a long time because I wanted to do raw SQL, but after seeing [how much code is required even to just do basic crud operations on a User table (my server file is already 200 lines)](https://github.com/brighambandersen/approachable-backend/blob/12d5e945ab1b015efc96b47ed86a3adf98452704/src/server.ts#L126), I'll try out Prisma just so that it's easier to read my business logic and I don't have to reinvent the wheel making my own ORM.
