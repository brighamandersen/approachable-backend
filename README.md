# approachable-backend

Project for Brigham Andersen and Taylor English

See [approachable-frontend](https://github.com/janksmap/approachable-frontend) repo

## Dev Setup

```
npm i
npm run db-init
npm run db-seed
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

See [api.rest](./api.rest) file for examples of how to use API.

Make sure to install the [REST Client VS Code Extension](https://marketplace.visualstudio.com/items?itemName=humao.rest-client) to fully utilize that file and send requests on the fly without needing to copy CURL commands to the terminal.

If you want to switch between local and production environments, just use the bottom bar of VS Code to switch environments or go to command palette search (shift+cmd+p) then type 'Rest Client: Switch Environment'. You'll then be able to select whether you want local or production. If you're curious, these environment variables are defined in [.vscode/settings.json](./.vscode/settings.json).

Some endpoints require that you provide your session credentials via cookies. To make a new session if you don't have one already, you log in and pass in `-c cookies.txt` which will save session credentials to a cookies.txt file. Then on your remaining requests, use `-b cookies.txt` to use those session credentials.

## Decisions

- 03/07/24 - I was considering using Swagger for API documentation but decided that this project is small-scale enough that it would slow us down more than it would help. Instead I'm just putting API usage examples with curl in comments above each API endpoint.
- 03/08/24 - I originally figured I would just have a User table and then a UserLocation table. I was thinking that they should be separate, but the more I did research into implementation, I realized that since they have a one-to-one relationship, it would be simpler to store it right in the same table. That makes things much simpler because you don't have to hassle with joins or with having to do separate API calls to get all the data you need. Some cons for this approach I saw were data redundancy, like if two users were at the same location you couldn't reuse one row of a UserLocation table to denote that, but that is highly unlikely and quite frankly we want to keep these relationship one-to-one. Besides, locations for how specific we need them will almost always be unique. Another con of this approach I saw is that apparently it doesn't scale as well? I really want to follow best practices and make sure I'm making scaleable apps. However, I realize this app probably won't get a ton of users. If it does need to scale though, future us can worry about that problem and migrate the database. For now we'll focus on simplicity first.
- 03/09/24 - I was avoiding using Prisma for such a long time because I wanted to do raw SQL, but after seeing [how much code is required even to just do basic crud operations on a User table (my server file is already 200 lines)](https://github.com/brighambandersen/approachable-backend/blob/12d5e945ab1b015efc96b47ed86a3adf98452704/src/server.ts#L126), I'll try out Prisma just so that it's easier to read my business logic and I don't have to reinvent the wheel making my own ORM.
- 4/09/24 - API Usage Documentation was originally CURL commands in the README, which was nice because it was easy to find, but I found it painful always copying the commands manually and making all these adjustments. That said, I didn't want to switch over to something like Postman though because it seems like overkill for the problem. Then I found out about the [REST Client VS Code Extension](https://marketplace.visualstudio.com/items?itemName=humao.rest-client). This is a perfect in-between where the commands can still live in the repo and be accessible easily, but you also get more interactivity. I was about to switch over to it, but then I noticed that it didn't have great reverse compatibility with CURL, and I wanted to stick with curl, so I'm ditching it for now.

## TODO

### By Thu, Apr 11

- Finish authentication (hook in to google auth)
  - Put other routes behind requireAuth
  - authTokens - do we need them if we have session ids

### Eventually

- Mass update everyone's locations (look into sockets and subscriptions)
- Make PDF of Usage

### Done

- ~~Apr 8 - Return back a full user from login~~
