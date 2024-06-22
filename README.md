# approachable-backend

Project for Brigham Andersen and Taylor English

See [approachable-frontend](https://github.com/janksmap/approachable-frontend) repo

## Dev Setup

```bash
npm i
npm run db-init
npm run seed
npm run dev
```

## Production Setup

```bash
npm i
npm run db-init
```

## Deployment -> Production Process

```bash
npm run build
npm run deploy
```

## API Usage

> Want to test the production endpoints? Just replace [http://localhost:3003](http://localhost:3003) with [https://approachable-api.brighamandersen.com](https://approachable-api.brighamandersen.com) in the CURL commands below.

### Register a user

```bash
curl --request POST \
     --header 'content-type: application/json' \
     --data '{
              "age": 25,
              "email": "newuser@gmail.com",
              "firstName": "New",
              "lastName": "User",
              "latitude": 40.5,
              "longitude": 75.0,
              "password": "password"
             }' \
     http://localhost:3003/register
```

### Log in

```bash
curl --request POST \
     --header 'content-type: application/json' \
     --data '{
        "email": "brigham@gmail.com",
        "password": "password"
      }' \
     --cookie-jar cookies.txt \
     http://localhost:3003/login
```

### Log out

```bash
curl --request POST \
     --cookie cookies.txt \
     http://localhost:3003/logout
```

### Get a user's profile picture

```bash
curl --cookie cookies.txt \
     http://localhost:3003/users/1/profile-picture
```

### Add/edit a profile picture for a user

```bash
curl --request POST \
     --cookie cookies.txt \
     --form "profilePicture=@$HOME/Downloads/temp.jpeg" \
     http://localhost:3003/users/1/profile-picture
```

> How to make this request using an HTML form:
>
> ```html
> <form
>   id="uploadForm"
>   action="http://localhost:3003/{userId}/profile-pictures"
>   method="post"
>   enctype="multipart/form-data"
> >
>   <input
>     type="file"
>     name="profilePicture"
>     id="profilePicture"
>     accept="image/*"
>   />
>   <button type="submit">Submit</button>
> </form>
> ```

### Create a user

```bash
curl --request POST \
     --cookie cookies.txt \
     --header "Content-Type: application/json" \
     --data '{
              "age": 25,
              "email": "newuser@gmail.com",
              "firstName": "New",
              "lastName": "User",
              "latitude": 40.5,
              "longitude": 75.0
             }' \
     http://localhost:3003/users
```

### Get all users

```bash
curl --cookie cookies.txt \
     http://localhost:3003/users
```

### Get users nearby a certain user

```bash
curl --cookie cookies.txt \
     'http://localhost:3003/users/nearby?userId=1&radiusInMeters=400'
```

### Get user by id

```bash
curl --cookie cookies.txt \
     http://localhost:3003/users/1
```

### Update a user by id

```bash
curl --request PUT \
     --cookie cookies.txt \
     --header "Content-Type: application/json" \
     --data '{
              "age": 25,
              "bio": "I love coding",
              "email": "editeduser@gmail.com",
              "firstName": "Edited",
              "interestedInBusiness": true,
              "interestedInDating": true,
              "interestedInFriends": true,
              "interestedInHelp": true,
              "lastName": "User",
              "latitude": 40.5,
              "longitude": 75.0,
              "visible": true
             }' \
     http://localhost:3003/users/1
```

### Delete user by id

```bash
curl --request DELETE \
    --cookie cookies.txt \
     http://localhost:3003/users/1
```

## Project Learnings / Decisions

- I was considering using Swagger for API documentation but decided that this project is small-scale enough that it would slow us down more than it would help. Instead I'm just putting API usage examples with curl in comments above each API endpoint.
- I originally figured I would just have a User table and then a UserLocation table. I was thinking that they should be separate, but the more I did research into implementation, I realized that since they have a one-to-one relationship, it would be simpler to store it right in the same table. That makes things much simpler because you don't have to hassle with joins or with having to do separate API calls to get all the data you need. Some cons for this approach I saw were data redundancy, like if two users were at the same location you couldn't reuse one row of a UserLocation table to denote that, but that is highly unlikely and quite frankly we want to keep these relationship one-to-one. Besides, locations for how specific we need them will almost always be unique. Another con of this approach I saw is that apparently it doesn't scale as well? I really want to follow best practices and make sure I'm making scaleable apps. However, I realize this app probably won't get a ton of users. If it does need to scale though, future us can worry about that problem and migrate the database. For now we'll focus on simplicity first.
- I was avoiding using Prisma for such a long time because I wanted to do raw SQL, but after seeing [how much code is required even to just do basic crud operations on a User table (my server file is already 200 lines)](https://github.com/brighambandersen/approachable-backend/blob/12d5e945ab1b015efc96b47ed86a3adf98452704/src/server.ts#L126), it's worth the abstraction. While you could essentially do your own ORM with DAOs, this just means that I don't have to maintain as much code and I can just use the wheel rather than reinvent it.
- I keep looking for a good tool to make testing the API a bit easier and to add documentation as I go. For now I've just been including CURL commands in the README. This is nice because the commands are easy to find and copy/paste, but it's frustrating when you have to edit the command to use the production url or do little tweaks like that. Postman was overkill, but I was really intrigued by the [REST Client VS Code Extension](https://marketplace.visualstudio.com/items?itemName=humao.rest-client). This one is nice because you can fire off a request at the push of a button, so I went down the rabbit hole of switching over to it. I later found out that it doesn't seem to have perfect backward compatibility with CURL and ultimately was just adding complexity to something that could stay simple for now. Down the road if API testing is a real pain point we can adjust things later, but for now this is more than adequate.
- Learned how to make proper REST endpoints (most notably with the `/user` endpoints). Learned of the importance of being intentional about request and response structures that are flexible for the use cases for your API.
- Learned how to upload pictures to an API (via multer with our profile pictures) and also learned how to access uploaded pictures (save a link to the location of the file, then statically host that directory)
- Learned about sessions vs. JWTs. Basically sessions are good enough if you're okay with the server holding a bit extra information and if you don't need to share auth across multiple servers.
- Learned the purpose of middleware. We used the multer middleware for profile picture upload, but then I also had experience firsthand making middleware when we made the custom requireAuth middleware that you can prepend to basically handle checking permissioning before executing services. Middleware is really nice because it's very isolated and easily reusable.
- Learned how to scale out your express API as it grows. Initially keeping everything in app.ts works just fine, but then as you get more and more endpoints and the size of your file grows to hundreds of lines, you really can benefit by breaking logic out to their own files. Basically the app.ts file will remain the API gateway that will have all the endpoint urls and is responsible for sending off the requests to the right service files (think of Django's urls.py). By doing it like this, you avoid cognitive overload of trying to keep too much in your head at once and can have simple files. Testing is also significantly easier when the files are broken out.
- I was having issues getting Google Authentication set up, so I decided that for now I'll just do in-house auth and then get Google Auth going later. Google Auth will be convenient for users so we do want it, but for now we just need some sort of auth up and running. I'll follow [Web Dev Simplified's tutorial](https://www.youtube.com/watch?v=Ud5xKCYQTjM) on getting basic auth working, then use express-session to save session credentials and a separate package for hashing/salting passwords. Later on when I go to add Google Auth as well, try to use `google-auth-library` package as it's Google's officially supported one. Also note that I'll want to set it up as OAuth 2.0.
- I'm realizing I don't like working just on the API side as much, because you don't get to see what the user is actually interacting with. So it's less enjoyable, but it's harder to code in my opinion because you don't exactly know the best way to implement it.
