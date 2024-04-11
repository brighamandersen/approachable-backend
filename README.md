# approachable-backend

Project for Brigham Andersen and Taylor English

See [approachable-frontend](https://github.com/janksmap/approachable-frontend) repo

## Dev Setup

```
npm i
npm run db-init
npm run seed
npm run dev
```

## Production Setup

```
npm i
npm run db-init
```

## Deployment -> Production Process

```
npm run build
npm run deploy
```

## API Usage

> Want to test the production endpoints? Just replace [http://localhost:3003](http://localhost:3003) with [https://approachable-api.brighamandersen.com](https://approachable-api.brighamandersen.com) in the CURL commands below.

### Log in

```bash
curl --request POST \
     --header 'content-type: application/json' \
     --data '{"userId": 1}' \
     --cookie-jar cookies.txt \
     http://localhost:3003/login
```

### Log out

```bash
curl --request POST \
     --cookie cookies.txt \
     http://localhost:3003/logout
```

### Create a user

```bash
curl --request POST \
     --header "Content-Type: application/json" \
     --data '{ \
              "birthDate": 946684800, \
              "firstName": "New", \
              "lastName": "User", \
              "latitude": 40.5, \
              "longitude": 75.0 \
             }' \
     http://localhost:3003/users
```

### Get all users

```bash
curl http://localhost:3003/users
```

### Get users nearby a certain user

```bash
curl 'http://localhost:3003/users/nearby?userId=1&radiusInMeters=400'
```

### Get user by id

```bash
curl http://localhost:3003/users/1
```

### Add a profile picture to a user

```bash
curl --request POST \
    --form "profilePicture=$HOME/Downloads/temp.jpeg" \
    --form "userId=1" \
    http://localhost:3003/profile-pictures
```

### Update a user by id

```bash
curl --request PUT \
     --header "Content-Type: application/json" \
     --data '{ \
              "bio": "I love coding", \
              "birthDate": 946684800, \
              "firstName": "Edited", \
              "hiddenOnMap": true, \
              "interestedInBusiness": true, \
              "interestedInDating": true, \
              "interestedInFriends": true, \
              "interestedInHelp": true, \
              "lastName": "User", \
              "latitude": 40.5, \
              "longitude": 75.0 \
             }' \
     http://localhost:3003/users/1
```

### Delete user by id

```bash
curl --request DELETE \
     http://localhost:3003/users/1
```

## Decisions

- 03/07/24 - I was considering using Swagger for API documentation but decided that this project is small-scale enough that it would slow us down more than it would help. Instead I'm just putting API usage examples with curl in comments above each API endpoint.
- 03/08/24 - I originally figured I would just have a User table and then a UserLocation table. I was thinking that they should be separate, but the more I did research into implementation, I realized that since they have a one-to-one relationship, it would be simpler to store it right in the same table. That makes things much simpler because you don't have to hassle with joins or with having to do separate API calls to get all the data you need. Some cons for this approach I saw were data redundancy, like if two users were at the same location you couldn't reuse one row of a UserLocation table to denote that, but that is highly unlikely and quite frankly we want to keep these relationship one-to-one. Besides, locations for how specific we need them will almost always be unique. Another con of this approach I saw is that apparently it doesn't scale as well? I really want to follow best practices and make sure I'm making scaleable apps. However, I realize this app probably won't get a ton of users. If it does need to scale though, future us can worry about that problem and migrate the database. For now we'll focus on simplicity first.
- 03/09/24 - I was avoiding using Prisma for such a long time because I wanted to do raw SQL, but after seeing [how much code is required even to just do basic crud operations on a User table (my server file is already 200 lines)](https://github.com/brighambandersen/approachable-backend/blob/12d5e945ab1b015efc96b47ed86a3adf98452704/src/server.ts#L126), I'll try out Prisma just so that it's easier to read my business logic and I don't have to reinvent the wheel making my own ORM.
- 4/09/24 - I keep looking for a good tool to make testing the API a bit easier and to add documentation as I go. For now I've just been including CURL commands in the README. This is nice because the commands are easy to find and copy/paste, but it's frustrating when you have to edit the command to use the production url or do little tweaks like that. Postman was overkill, but I was really intrigued by the [REST Client VS Code Extension](https://marketplace.visualstudio.com/items?itemName=humao.rest-client). This one is nice because you can fire off a request at the push of a button, so I went down the rabbit hole of switching over to it. I later found out that it doesn't seem to have perfect backward compatibility with CURL and ultimately was just adding complexity to something that could stay simple for now. Down the road if API testing is a real pain point we can adjust things later, but for now this is more than adequate.

## TODO

### By Thu, Apr 11

- Finish authentication (hook in to google auth)
  - Put other routes behind requireAuth (for updating a specific user or uploading a picture for them, your id has to match the one you provide.)
  - authTokens - do we need them if we have session ids

### Eventually

- Mass update everyone's locations (look into sockets and subscriptions)
- Make PDF of Usage

### Done

- ~~Apr 8 - Return back a full user from login~~
